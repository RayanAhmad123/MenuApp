// Backfills order_items for any seed orders that are missing them.
// Generates line items whose sum exactly equals each order's total_cents
// by decomposing the total over the menu price set.
//
// Usage: node scripts/backfill-order-items.mjs

import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, "..", "..", "..", "..", ".env.local")
const envText = readFileSync(envPath, "utf8")
const env = Object.fromEntries(
  envText.split("\n").filter(l => l.includes("=")).map(l => {
    const i = l.indexOf("=")
    return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
  })
)
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = env.SUPABASE_SERVICE_ROLE_KEY
const RESTAURANT_ID = "a0000000-0000-0000-0000-000000000001"

const MENU_ITEMS = [
  { id: "d0000000-0000-0000-0000-000000000001", price: 1650, weight: 22 }, // Burrata
  { id: "d0000000-0000-0000-0000-000000000002", price: 1450, weight: 14 }, // Tempura
  { id: "d0000000-0000-0000-0000-000000000003", price: 3800, weight: 25 }, // Ribeye
  { id: "d0000000-0000-0000-0000-000000000004", price: 2200, weight: 18 }, // Risotto
  { id: "d0000000-0000-0000-0000-000000000005", price: 2600, weight: 10 }, // Salmon
  { id: "d0000000-0000-0000-0000-000000000006", price: 1200, weight: 20 }, // Fondant
  { id: "d0000000-0000-0000-0000-000000000007", price: 900,  weight: 5  }, // Sorbet
]

async function rest(path, init = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_ROLE,
      Authorization: `Bearer ${SERVICE_ROLE}`,
      "Content-Type": "application/json",
      Prefer: init.headers?.Prefer ?? "return=representation",
      ...(init.headers || {}),
    },
  })
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} ${res.status}: ${await res.text()}`)
  if (res.status === 204) return null
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

let seed = 991
function rand() {
  seed = (seed * 1664525 + 1013904223) % 0x100000000
  return seed / 0x100000000
}

// Greedy decomposition: pick items (weighted by popularity) whose price <= remaining,
// quantity 1–3, until remaining is 0. Falls back to single-item if no exact match.
function decompose(total) {
  let remaining = total
  const lines = new Map() // menu_item_id -> { qty, price }
  let guard = 50
  while (remaining > 0 && guard-- > 0) {
    const eligible = MENU_ITEMS.filter(m => m.price <= remaining)
    if (eligible.length === 0) break
    const totalW = eligible.reduce((s, m) => s + m.weight, 0)
    let r = rand() * totalW
    let pick = eligible[0]
    for (const m of eligible) { r -= m.weight; if (r <= 0) { pick = m; break } }
    const maxQty = Math.min(3, Math.floor(remaining / pick.price))
    const qty = maxQty === 1 ? 1 : Math.max(1, Math.min(maxQty, 1 + Math.floor(rand() * maxQty)))
    const existing = lines.get(pick.id)
    if (existing) existing.qty += qty
    else lines.set(pick.id, { qty, price: pick.price })
    remaining -= pick.price * qty
  }
  // If we couldn't hit exact total, top up with the smallest item count adjustments.
  // (For randomized totals built from these prices this is rarely needed.)
  if (remaining > 0) {
    const smallest = [...MENU_ITEMS].sort((a, b) => a.price - b.price)
    for (const m of smallest) {
      if (m.price === remaining) {
        const e = lines.get(m.id)
        if (e) e.qty += 1
        else lines.set(m.id, { qty: 1, price: m.price })
        remaining = 0
        break
      }
    }
  }
  return Array.from(lines.entries()).map(([id, v]) => ({
    menu_item_id: id,
    quantity: v.qty,
    item_price_cents: v.price,
  }))
}

async function main() {
  // Fetch all orders for the restaurant (paginate)
  console.log("Fetching all orders for Hirly...")
  const allOrders = []
  let from = 0
  while (true) {
    const to = from + 999
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?restaurant_id=eq.${RESTAURANT_ID}&select=id,total_cents,created_at&order=created_at.asc`,
      { headers: { apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}`, Range: `${from}-${to}` } }
    )
    const batch = await res.json()
    allOrders.push(...batch)
    if (batch.length < 1000) break
    from += 1000
  }
  console.log(`Found ${allOrders.length} orders.`)

  // Fetch order_items in chunks, collect which order_ids have items
  console.log("Checking which orders already have line items...")
  const haveItems = new Set()
  // Pull all order_items.order_id (paginated)
  let oFrom = 0
  while (true) {
    const oTo = oFrom + 999
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/order_items?select=order_id`,
      { headers: { apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}`, Range: `${oFrom}-${oTo}` } }
    )
    const batch = await res.json()
    for (const r of batch) haveItems.add(r.order_id)
    if (batch.length < 1000) break
    oFrom += 1000
  }
  console.log(`Orders already with items: ${haveItems.size}`)

  const missing = allOrders.filter(o => !haveItems.has(o.id))
  console.log(`Orders missing line items: ${missing.length}`)

  // Build line-item rows for missing orders
  const toInsert = []
  let mismatchCount = 0
  for (const o of missing) {
    const lines = decompose(o.total_cents)
    const sum = lines.reduce((s, l) => s + l.quantity * l.item_price_cents, 0)
    if (sum !== o.total_cents) mismatchCount++
    for (const l of lines) {
      toInsert.push({
        order_id: o.id,
        menu_item_id: l.menu_item_id,
        quantity: l.quantity,
        item_price_cents: l.item_price_cents,
        item_status: "ready",
      })
    }
  }
  console.log(`Generating ${toInsert.length} line items (${mismatchCount} orders had imperfect decomposition).`)

  // Insert in batches of 200
  for (let i = 0; i < toInsert.length; i += 200) {
    const batch = toInsert.slice(i, i + 200)
    process.stdout.write(`  inserting ${i + 1}–${i + batch.length}... `)
    await rest("/order_items", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(batch) })
    console.log("ok")
  }
  console.log("Done.")
}

main().catch(err => { console.error(err); process.exit(1) })
