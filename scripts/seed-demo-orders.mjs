// Seeds the Hirly demo tenant with realistic historical orders so the
// analytics dashboard has interesting data to display.
//
// Usage: node scripts/seed-demo-orders.mjs

import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, "..", "..", "..", "..", ".env.local")
const envText = readFileSync(envPath, "utf8")
const env = Object.fromEntries(
  envText
    .split("\n")
    .filter(l => l.includes("="))
    .map(l => {
      const i = l.indexOf("=")
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error("Missing SUPABASE_URL or SERVICE_ROLE in .env.local")
  process.exit(1)
}

const RESTAURANT_ID = "a0000000-0000-0000-0000-000000000001"

const MENU_ITEMS = [
  { id: "d0000000-0000-0000-0000-000000000001", name: "Burrata & Heirloom Tomato", price: 1650, weight: 22 },
  { id: "d0000000-0000-0000-0000-000000000002", name: "Tiger Prawn Tempura", price: 1450, weight: 14 },
  { id: "d0000000-0000-0000-0000-000000000003", name: "28-Day Aged Ribeye", price: 3800, weight: 25 },
  { id: "d0000000-0000-0000-0000-000000000004", name: "Wild Mushroom Risotto", price: 2200, weight: 18 },
  { id: "d0000000-0000-0000-0000-000000000005", name: "Pan-Seared Salmon", price: 2600, weight: 10 },
  { id: "d0000000-0000-0000-0000-000000000006", name: "Valrhona Chocolate Fondant", price: 1200, weight: 20 },
  { id: "d0000000-0000-0000-0000-000000000007", name: "Seasonal Fruit Sorbet", price: 900, weight: 5 },
]

async function rest(path, init = {}) {
  const url = `${SUPABASE_URL}/rest/v1${path}`
  const res = await fetch(url, {
    ...init,
    headers: {
      apikey: SERVICE_ROLE,
      Authorization: `Bearer ${SERVICE_ROLE}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers || {}),
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${init.method ?? "GET"} ${path} ${res.status}: ${text}`)
  }
  if (res.status === 204) return null
  const text = await res.text()
  if (!text) return null
  return JSON.parse(text)
}

async function deleteExistingSeed() {
  // Wipe any prior seed orders (and cascade to order_items via FK).
  await rest(
    `/orders?restaurant_id=eq.${RESTAURANT_ID}&session_id=like.seed-*`,
    { method: "DELETE", headers: { Prefer: "return=minimal" } }
  )
}

// Seeded RNG so re-runs produce comparable distributions
let seed = 1337
function rand() {
  seed = (seed * 1664525 + 1013904223) % 0x100000000
  return seed / 0x100000000
}
function pickWeighted(items) {
  const total = items.reduce((s, i) => s + i.weight, 0)
  let r = rand() * total
  for (const it of items) {
    r -= it.weight
    if (r <= 0) return it
  }
  return items[items.length - 1]
}
function randInt(min, max) {
  return Math.floor(rand() * (max - min + 1)) + min
}
function randChoice(arr) {
  return arr[Math.floor(rand() * arr.length)]
}

// Hour-of-day weights: lunch peak (12–14), dinner peak (19–22), quiet otherwise
const HOUR_WEIGHTS = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0–9
  1, 2, // 10–11
  10, 14, 8, // 12–14 lunch
  3, 2, 2, // 15–17
  6, 12, 16, 14, 9, // 18–22 dinner
  3, // 23
]
// Weekday weights (Sun=0..Sat=6): weekends heavier
const WEEKDAY_WEIGHTS = [1.0, 0.6, 0.7, 0.8, 0.9, 1.4, 1.6]

function pickHour() {
  const total = HOUR_WEIGHTS.reduce((s, w) => s + w, 0)
  let r = rand() * total
  for (let h = 0; h < 24; h++) {
    r -= HOUR_WEIGHTS[h]
    if (r <= 0) return h
  }
  return 20
}

function buildOrderTimestamps() {
  const now = new Date()
  const timestamps = []
  // Generate 30 days of orders, distributed by weekday weights
  for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
    const day = new Date(now)
    day.setDate(day.getDate() - dayOffset)
    day.setHours(0, 0, 0, 0)
    const weekdayWeight = WEEKDAY_WEIGHTS[day.getDay()]
    // ~18 orders/day baseline, scaled by weekday weight (~10–28/day)
    const orderCount = Math.round(18 * weekdayWeight + (rand() * 6 - 3))
    for (let i = 0; i < orderCount; i++) {
      const h = pickHour()
      const m = randInt(0, 59)
      const s = randInt(0, 59)
      const d = new Date(day)
      d.setHours(h, m, s, 0)
      // Skip orders in the future (today only goes up to "now")
      if (d > now) continue
      timestamps.push(d)
    }
  }
  return timestamps.sort((a, b) => a.getTime() - b.getTime())
}

function buildOrder(createdAt, idx) {
  const itemCount = pickWeighted([
    { v: 1, weight: 15 },
    { v: 2, weight: 35 },
    { v: 3, weight: 30 },
    { v: 4, weight: 15 },
    { v: 5, weight: 5 },
  ]).v
  const lineItems = []
  const usedIds = new Set()
  for (let i = 0; i < itemCount; i++) {
    let pick
    let tries = 0
    do {
      pick = pickWeighted(MENU_ITEMS)
      tries++
    } while (usedIds.has(pick.id) && tries < 5)
    usedIds.add(pick.id)
    const qty = pickWeighted([
      { v: 1, weight: 70 },
      { v: 2, weight: 25 },
      { v: 3, weight: 5 },
    ]).v
    lineItems.push({ menu_item_id: pick.id, quantity: qty, item_price_cents: pick.price })
  }
  const totalCents = lineItems.reduce((s, li) => s + li.item_price_cents * li.quantity, 0)

  // Status: orders older than a day are delivered (or rarely cancelled);
  // recent orders may be in various states.
  const ageHours = (Date.now() - createdAt.getTime()) / 3.6e6
  let status, paymentStatus
  if (ageHours > 24) {
    const r = rand()
    if (r < 0.92) { status = "delivered"; paymentStatus = rand() < 0.95 ? "paid" : "unpaid" }
    else { status = "cancelled"; paymentStatus = "unpaid" }
  } else if (ageHours > 2) {
    const r = rand()
    if (r < 0.7) { status = "delivered"; paymentStatus = "paid" }
    else if (r < 0.85) { status = "ready"; paymentStatus = "paid" }
    else if (r < 0.95) { status = "preparing"; paymentStatus = rand() < 0.5 ? "paid" : "unpaid" }
    else { status = "cancelled"; paymentStatus = "unpaid" }
  } else {
    const r = rand()
    if (r < 0.25) { status = "pending"; paymentStatus = "unpaid" }
    else if (r < 0.5) { status = "confirmed"; paymentStatus = "paid" }
    else if (r < 0.75) { status = "preparing"; paymentStatus = "paid" }
    else { status = "ready"; paymentStatus = "paid" }
  }

  return {
    restaurant_id: RESTAURANT_ID,
    table_number: randInt(1, 5),
    session_id: `seed-${idx}-${createdAt.getTime()}`,
    total_cents: totalCents,
    status,
    payment_status: paymentStatus,
    special_notes: null,
    created_at: createdAt.toISOString(),
    _lineItems: lineItems,
  }
}

async function main() {
  console.log("Clearing prior seed orders...")
  await deleteExistingSeed()

  console.log("Generating order timestamps...")
  const timestamps = buildOrderTimestamps()
  console.log(`Planned ${timestamps.length} orders across 30 days.`)

  const orders = timestamps.map((ts, i) => buildOrder(ts, i))

  // Insert orders in batches of 100
  const ordersForInsert = orders.map(({ _lineItems, ...rest }) => rest)
  const BATCH = 100
  const insertedOrders = []
  for (let i = 0; i < ordersForInsert.length; i += BATCH) {
    const batch = ordersForInsert.slice(i, i + BATCH)
    process.stdout.write(`  inserting orders ${i + 1}–${i + batch.length}... `)
    const rows = await rest("/orders", { method: "POST", body: JSON.stringify(batch) })
    insertedOrders.push(...rows)
    console.log("ok")
  }

  // Build order_items payload using returned order ids (preserve order)
  const allLineItems = []
  for (let i = 0; i < insertedOrders.length; i++) {
    const orderId = insertedOrders[i].id
    const lineItems = orders[i]._lineItems
    for (const li of lineItems) {
      allLineItems.push({
        order_id: orderId,
        menu_item_id: li.menu_item_id,
        quantity: li.quantity,
        item_price_cents: li.item_price_cents,
        item_status: "ready",
      })
    }
  }
  console.log(`Inserting ${allLineItems.length} line items...`)
  for (let i = 0; i < allLineItems.length; i += 200) {
    const batch = allLineItems.slice(i, i + 200)
    process.stdout.write(`  line items ${i + 1}–${i + batch.length}... `)
    await rest("/order_items", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(batch) })
    console.log("ok")
  }

  // Summary
  const totalRev = orders
    .filter(o => o.payment_status === "paid" && o.status !== "cancelled")
    .reduce((s, o) => s + o.total_cents, 0)
  const itemsSold = allLineItems.reduce((s, li) => s + li.quantity, 0)
  console.log("\nDone.")
  console.log(`  Orders:        ${insertedOrders.length}`)
  console.log(`  Line items:    ${allLineItems.length}`)
  console.log(`  Items sold:    ${itemsSold}`)
  console.log(`  Paid revenue:  €${(totalRev / 100).toFixed(2)}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
