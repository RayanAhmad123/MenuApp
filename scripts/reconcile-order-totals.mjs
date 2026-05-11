// Reconciles each order's total_cents to the actual sum of its order_items.
// Run after seed/backfill to ensure top-level revenue == item-level revenue.
//
// Usage: node scripts/reconcile-order-totals.mjs

import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, "..", "..", "..", "..", ".env.local")
const envText = readFileSync(envPath, "utf8")
const env = Object.fromEntries(envText.split("\n").filter(l => l.includes("=")).map(l => {
  const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
}))
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = env.SUPABASE_SERVICE_ROLE_KEY
const RESTAURANT_ID = "a0000000-0000-0000-0000-000000000001"

async function pagedFetch(path) {
  const out = []
  let from = 0
  while (true) {
    const to = from + 999
    const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
      headers: { apikey: SERVICE_ROLE, Authorization: `Bearer ${SERVICE_ROLE}`, Range: `${from}-${to}` },
    })
    const batch = await res.json()
    out.push(...batch)
    if (batch.length < 1000) break
    from += 1000
  }
  return out
}

async function main() {
  console.log("Fetching orders...")
  const orders = await pagedFetch(`/orders?restaurant_id=eq.${RESTAURANT_ID}&select=id,total_cents`)
  console.log(`  ${orders.length} orders`)

  console.log("Fetching order_items...")
  // Get all items for those orders. We'll page through the order_items table.
  // Since this restaurant is the only one using these UUIDs, fetch all and filter.
  const items = await pagedFetch(`/order_items?select=order_id,quantity,item_price_cents`)
  console.log(`  ${items.length} order_items`)

  const sumByOrder = new Map()
  for (const i of items) {
    sumByOrder.set(i.order_id, (sumByOrder.get(i.order_id) ?? 0) + i.quantity * i.item_price_cents)
  }

  const mismatched = orders.filter(o => (sumByOrder.get(o.id) ?? 0) !== o.total_cents)
  console.log(`  Mismatched: ${mismatched.length}`)

  // PATCH each mismatched order. Sequential to avoid rate-limit / contention.
  let i = 0
  for (const o of mismatched) {
    const actual = sumByOrder.get(o.id) ?? 0
    if (actual === 0) continue // orphan order with no items — skip
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?id=eq.${o.id}`,
      {
        method: "PATCH",
        headers: {
          apikey: SERVICE_ROLE,
          Authorization: `Bearer ${SERVICE_ROLE}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ total_cents: actual }),
      }
    )
    if (!res.ok) {
      console.error(`  failed ${o.id}: ${res.status} ${await res.text()}`)
      continue
    }
    i++
    if (i % 50 === 0) process.stdout.write(`  ${i}/${mismatched.length}\n`)
  }
  console.log(`\nReconciled ${i} orders.`)
}

main().catch(e => { console.error(e); process.exit(1) })
