// Seeds The Demo Kitchen tenant with historical orders so its analytics
// dashboard has interesting data to display. Designed for a casual
// restaurant menu (drinks, starters, mains, desserts).
//
// Usage: node scripts/seed-demo-kitchen.mjs

import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, "..", "..", "..", "..", ".env.local")
const env = Object.fromEntries(
  readFileSync(envPath, "utf8").split("\n").filter(l => l.includes("=")).map(l => {
    const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
  })
)
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = env.SUPABASE_SERVICE_ROLE_KEY

const RESTAURANT_ID = "a1b2c3d4-0000-0000-0000-000000000001"

// Menu split by category so we can model realistic basket composition
// (every diner gets ~1 drink, most pick a main, etc.). Weights drive
// the popularity ranking inside each category.
const DRINKS = [
  { id: "b8161579-6410-46f8-b4e8-e5868c2a281f", name: "Still Water",     price: 295,  weight: 30 },
  { id: "2ad344ab-82f6-417a-9220-825947eebed4", name: "Sparkling Water", price: 295,  weight: 15 },
  { id: "fed06787-c635-4dce-ac29-d7c0c39621ef", name: "Soft Drink",      price: 295,  weight: 35 },
  { id: "78628084-6a4f-4c2a-85ce-d54d0e411ce5", name: "Fresh Juice",     price: 395,  weight: 20 },
]
const STARTERS = [
  { id: "001e465a-3212-43dc-9160-d3be7f0b667c", name: "Garlic Bread",     price: 5995, weight: 40 },
  { id: "b1edb70a-cfe5-43ad-b1f8-8d3a6ec6741b", name: "Chicken Wings",    price: 8995, weight: 35 },
  { id: "4a3de590-1acf-4610-a559-e9f1008cde73", name: "Soup of the Day",  price: 6995, weight: 25 },
]
const MAINS = [
  { id: "941688d5-fabb-4ebf-b819-8ada058ab08b", name: "Classic Burger",    price: 13995, weight: 40 },
  { id: "541845c5-b222-4441-945b-e1305dc658c0", name: "Margherita Pizza",  price: 12995, weight: 30 },
  { id: "15d8be04-e30a-4a20-b584-2719e4cc5485", name: "Grilled Salmon",    price: 17995, weight: 12 },
  { id: "936383ed-efde-46fb-8aa5-869007f118f7", name: "Mushroom Risotto",  price: 12995, weight: 18 },
]
const DESSERTS = [
  { id: "c900f796-5d8b-46eb-b3c8-0e73ee1a2bad", name: "Chocolate Brownie", price: 7995, weight: 60 },
  { id: "53a84f8f-3630-4d41-8d4b-5c9dc2f50305", name: "Cheesecake",        price: 7995, weight: 40 },
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

// Seeded RNG
let seed = 4242
function rand() { seed = (seed * 1664525 + 1013904223) % 0x100000000; return seed / 0x100000000 }
function randInt(min, max) { return Math.floor(rand() * (max - min + 1)) + min }
function pickWeighted(items) {
  const total = items.reduce((s, i) => s + i.weight, 0)
  let r = rand() * total
  for (const it of items) { r -= it.weight; if (r <= 0) return it }
  return items[items.length - 1]
}

// Lunch peak 12–14, dinner peak 19–22
const HOUR_WEIGHTS = [
  0,0,0,0,0,0,0,0,0,0, 1,2, 10,14,8, 3,2,2, 6,12,16,14,9, 3,
]
// Weekends busier
const WEEKDAY_WEIGHTS = [1.1, 0.6, 0.7, 0.8, 0.9, 1.4, 1.6]

function pickHour() {
  const total = HOUR_WEIGHTS.reduce((s, w) => s + w, 0)
  let r = rand() * total
  for (let h = 0; h < 24; h++) { r -= HOUR_WEIGHTS[h]; if (r <= 0) return h }
  return 20
}

function buildOrderTimestamps() {
  const now = new Date()
  const timestamps = []
  for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
    const day = new Date(now)
    day.setDate(day.getDate() - dayOffset)
    day.setHours(0, 0, 0, 0)
    const baseCount = 16 * WEEKDAY_WEIGHTS[day.getDay()]
    const orderCount = Math.max(4, Math.round(baseCount + (rand() * 8 - 4)))
    for (let i = 0; i < orderCount; i++) {
      const h = pickHour()
      const m = randInt(0, 59)
      const s = randInt(0, 59)
      const d = new Date(day)
      d.setHours(h, m, s, 0)
      if (d > now) continue
      timestamps.push(d)
    }
  }
  return timestamps.sort((a, b) => a.getTime() - b.getTime())
}

// Build a realistic basket: 1–4 diners worth of items, each with main +
// optional starter + drink + sometimes dessert.
function buildBasket() {
  const partySize = pickWeighted([
    { v: 1, weight: 25 }, { v: 2, weight: 45 }, { v: 3, weight: 20 }, { v: 4, weight: 10 },
  ]).v

  const lines = new Map() // id -> { id, name, price, qty }
  function add(item, qty = 1) {
    const e = lines.get(item.id)
    if (e) e.qty += qty
    else lines.set(item.id, { id: item.id, name: item.name, price: item.price, qty })
  }

  for (let p = 0; p < partySize; p++) {
    // Drink: 90% of diners get one
    if (rand() < 0.9) add(pickWeighted(DRINKS))
    // Starter: 35%
    if (rand() < 0.35) add(pickWeighted(STARTERS))
    // Main: 85% (the others might be just-drinks/dessert customers)
    if (rand() < 0.85) add(pickWeighted(MAINS))
    // Dessert: 30%
    if (rand() < 0.3) add(pickWeighted(DESSERTS))
  }

  // Ensure at least one item
  if (lines.size === 0) add(pickWeighted(MAINS))

  return Array.from(lines.values())
}

function buildOrder(createdAt, idx) {
  const basket = buildBasket()
  const totalCents = basket.reduce((s, l) => s + l.price * l.qty, 0)

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
    order: {
      restaurant_id: RESTAURANT_ID,
      table_number: randInt(1, 8),
      session_id: `seed-dk-${idx}-${createdAt.getTime()}`,
      total_cents: totalCents,
      status,
      payment_status: paymentStatus,
      special_notes: null,
      created_at: createdAt.toISOString(),
    },
    basket,
  }
}

async function main() {
  console.log("Generating orders for The Demo Kitchen...")
  const timestamps = buildOrderTimestamps()
  console.log(`Planned ${timestamps.length} orders.`)

  const built = timestamps.map((ts, i) => buildOrder(ts, i))

  // Insert orders in batches, then matching order_items per inserted batch
  const BATCH = 80
  let totalItemsInserted = 0
  for (let i = 0; i < built.length; i += BATCH) {
    const slice = built.slice(i, i + BATCH)
    process.stdout.write(`  orders ${i + 1}–${i + slice.length}... `)
    const rows = await rest("/orders", {
      method: "POST",
      body: JSON.stringify(slice.map(s => s.order)),
    })
    // Build line items now that we know the order ids
    const lineItems = []
    for (let k = 0; k < rows.length; k++) {
      const orderId = rows[k].id
      for (const line of slice[k].basket) {
        lineItems.push({
          order_id: orderId,
          menu_item_id: line.id,
          quantity: line.qty,
          item_price_cents: line.price,
          item_status: "ready",
        })
      }
    }
    // Insert this batch's line items immediately so we never leave
    // dangling orders without items.
    for (let j = 0; j < lineItems.length; j += 200) {
      await rest("/order_items", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify(lineItems.slice(j, j + 200)),
      })
    }
    totalItemsInserted += lineItems.length
    console.log(`ok (+${lineItems.length} items)`)
  }

  console.log("\nDone.")
  console.log(`  Orders:     ${built.length}`)
  console.log(`  Line items: ${totalItemsInserted}`)
  const totalRev = built.filter(b => b.order.status !== "cancelled").reduce((s, b) => s + b.order.total_cents, 0)
  console.log(`  Revenue (non-cancelled): €${(totalRev / 100).toFixed(2)} (payment_enabled=false so all non-cancelled count)`)
}

main().catch(e => { console.error(e); process.exit(1) })
