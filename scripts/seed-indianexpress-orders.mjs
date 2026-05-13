// Seeds 90 days of historical orders for the Indian Express tenant.
// Reruns safely: deletes any orders tagged with our seed session prefix first.
//
// Usage: node scripts/seed-indianexpress-orders.mjs

import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = (() => {
  for (const p of [join(__dirname, "..", ".env.local"), join(__dirname, "..", "..", "..", "..", ".env.local")]) {
    try { readFileSync(p, "utf8"); return p } catch {}
  }
  throw new Error("Could not find .env.local")
})()
const env = Object.fromEntries(
  readFileSync(envPath, "utf8").split("\n").filter(l => l.includes("=")).map(l => {
    const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
  })
)
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = env.SUPABASE_SERVICE_ROLE_KEY
const RESTAURANT_ID = "027b7764-7dc0-4ab3-a7d2-f95eb5767735"
const SESSION_PREFIX = "seed-ie-v1-"
const DAYS = 90

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
  const text = await res.text()
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} ${res.status}: ${text}`)
  return text ? JSON.parse(text) : null
}

// Seeded RNG so reruns are deterministic.
let _seed = 7777
function rand() { _seed = (_seed * 1664525 + 1013904223) % 0x100000000; return _seed / 0x100000000 }
function randInt(min, max) { return Math.floor(rand() * (max - min + 1)) + min }
function pickWeighted(items) {
  const total = items.reduce((s, i) => s + i.weight, 0)
  let r = rand() * total
  for (const it of items) { r -= it.weight; if (r <= 0) return it }
  return items[items.length - 1]
}

// ---------- LOAD MENU ----------
console.log("→ Loading menu...")
const itemsRaw = await rest(`/menu_items?restaurant_id=eq.${RESTAURANT_ID}&select=id,name,price_cents,is_vegetarian,is_vegan,categories(name)&limit=300`)
const mgs = await rest(`/modifier_groups?restaurant_id=eq.${RESTAURANT_ID}&select=id,name,is_required`)
const mods = await rest(`/modifiers?select=id,modifier_group_id,name,price_adjustment_cents&modifier_group_id=in.(${mgs.map(g=>g.id).join(",")})`)
const imgs = await rest(`/item_modifier_groups?select=item_id,modifier_group_id&item_id=in.(${itemsRaw.map(i=>i.id).join(",")})`)

// Build per-item lookup: { item, requiredGroups: [{ groupId, modifiers: [{id,name,adj,weight}] }] }
const modsByGroup = new Map()
for (const m of mods) {
  if (!modsByGroup.has(m.modifier_group_id)) modsByGroup.set(m.modifier_group_id, [])
  modsByGroup.get(m.modifier_group_id).push(m)
}
const groupsByItem = new Map()
for (const link of imgs) {
  if (!groupsByItem.has(link.item_id)) groupsByItem.set(link.item_id, [])
  groupsByItem.get(link.item_id).push(link.modifier_group_id)
}
const requiredGroupIds = new Set(mgs.filter(g => g.is_required).map(g => g.id))

// Protein selection weights (used for any required group; matches modifier names).
function modifierWeight(name) {
  const n = name.toLowerCase()
  if (n.includes("kyckling")) return 60
  if (n === "paneer")          return 18
  if (n.includes("lamm"))      return 14
  if (n === "biff")            return 6
  if (n === "tofu")            return 2
  if (n.includes("lammfilé"))  return 4 // "Grillad lammfilé"
  if (n.includes("lammstek"))  return 8
  return 5
}

// Pre-compute weighted modifier list per required group.
const weightedModsByGroup = new Map()
for (const g of mgs.filter(g => g.is_required)) {
  const list = modsByGroup.get(g.id) ?? []
  weightedModsByGroup.set(g.id, list.map(m => ({ ...m, weight: modifierWeight(m.name) })))
}

// Per-item popularity weight (long-tail). Highlight bestsellers by name.
function itemPopularityWeight(name, catName) {
  const n = name.toLowerCase()
  const bestsellers = [
    /tikka masala/, /butter chicken/, /chicken tikka birjani/, /lamb birjani/,
    /tandoori chicken$/, /chicken tikka sizlar/, /palak paneer/, /paneer butter/,
    /daal makhni/, /naan/, /mango lassi/, /kingfisher/, /cobra/, /madras$/, /balti$/,
    /karai$/, /vegetarisk thali/, /kött thali/, /gulab jamun/, /extra ris/, /raita/,
  ]
  if (bestsellers.some(re => re.test(n))) return 40
  // wine flaska is rarer
  if (/flaska/.test(n)) return 4
  if (/macallan|laphroaig|zacapa|diplomatico/.test(n)) return 3
  return 12
}

// Bucket items by what role they play in a basket.
const buckets = {
  mains: [], veg_mains: [], starters: [], sides: [], desserts: [],
  soft: [], beer: [], wine: [], spirit: [],
}
for (const it of itemsRaw) {
  const cat = it.categories?.name ?? "?"
  const w = itemPopularityWeight(it.name, cat)
  const entry = { id: it.id, name: it.name, price_cents: it.price_cents, weight: w, cat }
  if (cat === "Vegetariskt") buckets.veg_mains.push(entry)
  else if (["Kockens Favoriter", "Curries", "Birjani", "King Prawn", "Thali"].includes(cat)) buckets.mains.push(entry)
  else if (cat === "Tandoori Sizlar") buckets.starters.push(entry)
  else if (cat === "Tillbehör") buckets.sides.push(entry)
  else if (cat === "Efter maten") buckets.desserts.push(entry)
  else if (cat === "Alkoholfritt") buckets.soft.push(entry)
  else if (["Alkoholfri öl", "Cider/Öl på fat", "Cider/Öl på flaska"].includes(cat)) buckets.beer.push(entry)
  else if (["Rött vin", "Vitt vin", "Rosé"].includes(cat)) buckets.wine.push(entry)
  else if (cat === "Whiskey, Rom & Cognac") buckets.spirit.push(entry)
}
console.log(`  mains=${buckets.mains.length} veg=${buckets.veg_mains.length} starters=${buckets.starters.length} sides=${buckets.sides.length} desserts=${buckets.desserts.length} soft=${buckets.soft.length} beer=${buckets.beer.length} wine=${buckets.wine.length} spirit=${buckets.spirit.length}`)

// ---------- TIMESTAMPS ----------
// Indian restaurant: light lunch, heavy dinner. Index 0–23 = hour.
const HOUR_WEIGHTS = [
  0,0,0,0,0,0,0,0,0,0, 1,3, 8,10,5, 1,1,2, 6,15,18,16,10,4,
]
// Sun(0), Mon, Tue, Wed, Thu, Fri, Sat
const WEEKDAY_WEIGHTS = [1.2, 0.7, 0.8, 0.9, 1.0, 1.5, 1.7]

function pickHour() {
  const total = HOUR_WEIGHTS.reduce((s, w) => s + w, 0)
  let r = rand() * total
  for (let h = 0; h < 24; h++) { r -= HOUR_WEIGHTS[h]; if (r <= 0) return h }
  return 20
}

function buildOrderTimestamps() {
  const now = new Date()
  const out = []
  for (let dayOffset = DAYS - 1; dayOffset >= 0; dayOffset--) {
    const day = new Date(now); day.setDate(day.getDate() - dayOffset); day.setHours(0, 0, 0, 0)
    // base ~22 orders/day, weekend boost
    const baseCount = 22 * WEEKDAY_WEIGHTS[day.getDay()]
    const orderCount = Math.max(6, Math.round(baseCount + (rand() * 10 - 5)))
    for (let i = 0; i < orderCount; i++) {
      const h = pickHour()
      const m = randInt(0, 59); const s = randInt(0, 59)
      const d = new Date(day); d.setHours(h, m, s, 0)
      if (d > now) continue
      out.push(d)
    }
  }
  return out.sort((a, b) => a.getTime() - b.getTime())
}

// ---------- BASKET ----------
function pickItem(bucket) { return pickWeighted(bucket) }

function buildBasket(isVegLeaning) {
  const partySize = pickWeighted([
    { v: 1, weight: 20 }, { v: 2, weight: 50 }, { v: 3, weight: 20 }, { v: 4, weight: 10 },
  ]).v

  // line: { menu_item_id, name, qty, base_cents, modifiers: [{id, adj}] }
  const lines = []

  for (let p = 0; p < partySize; p++) {
    // Main (95%): blend of mains/veg_mains
    if (rand() < 0.95) {
      const useVeg = isVegLeaning ? rand() < 0.7 : rand() < 0.18
      const item = useVeg ? pickItem(buckets.veg_mains) : pickItem(buckets.mains)
      lines.push(buildLine(item))
    }
    // Drink (88%): one drink per diner, weighted across categories
    if (rand() < 0.88) {
      const r = rand()
      let item
      if (r < 0.40)      item = pickItem(buckets.soft)
      else if (r < 0.75) item = pickItem(buckets.beer)
      else if (r < 0.92) item = pickItem(buckets.wine)
      else               item = pickItem(buckets.spirit)
      lines.push(buildLine(item))
    }
  }

  // Shared starter (25% per party)
  if (rand() < 0.25 && buckets.starters.length) lines.push(buildLine(pickItem(buckets.starters)))
  // Shared sides (60% per party — Indian meals usually have extras)
  if (rand() < 0.60 && buckets.sides.length)    lines.push(buildLine(pickItem(buckets.sides)))
  // Sometimes a second side
  if (rand() < 0.25 && buckets.sides.length)    lines.push(buildLine(pickItem(buckets.sides)))
  // Dessert (18%)
  if (rand() < 0.18 && buckets.desserts.length) lines.push(buildLine(pickItem(buckets.desserts)))

  // Collapse duplicate (same item + same modifier set) into qty>1
  const merged = new Map()
  for (const l of lines) {
    const k = `${l.menu_item_id}::${l.modifiers.map(m => m.id).sort().join(",")}`
    const existing = merged.get(k)
    if (existing) existing.qty += 1
    else merged.set(k, l)
  }
  return Array.from(merged.values())
}

function buildLine(item) {
  const groups = groupsByItem.get(item.id) ?? []
  const chosenMods = []
  for (const gid of groups) {
    if (requiredGroupIds.has(gid)) {
      const list = weightedModsByGroup.get(gid)
      if (list && list.length) {
        const m = pickWeighted(list)
        chosenMods.push({ id: m.id, adj: m.price_adjustment_cents })
      }
    }
  }
  const modAdj = chosenMods.reduce((s, m) => s + m.adj, 0)
  return {
    menu_item_id: item.id,
    name: item.name,
    qty: 1,
    base_cents: item.price_cents,
    item_price_cents: item.price_cents + modAdj,
    modifiers: chosenMods,
  }
}

function statusFor(createdAt) {
  const ageH = (Date.now() - createdAt.getTime()) / 3.6e6
  if (ageH > 24) {
    return rand() < 0.94
      ? { status: "delivered", payment_status: rand() < 0.97 ? "paid" : "unpaid" }
      : { status: "cancelled", payment_status: "unpaid" }
  }
  if (ageH > 2) {
    const r = rand()
    if (r < 0.7)  return { status: "delivered", payment_status: "paid" }
    if (r < 0.85) return { status: "ready", payment_status: "paid" }
    if (r < 0.95) return { status: "preparing", payment_status: rand() < 0.5 ? "paid" : "unpaid" }
    return { status: "cancelled", payment_status: "unpaid" }
  }
  const r = rand()
  if (r < 0.25) return { status: "pending",   payment_status: "unpaid" }
  if (r < 0.5)  return { status: "confirmed", payment_status: "paid" }
  if (r < 0.75) return { status: "preparing", payment_status: "paid" }
  return            { status: "ready",     payment_status: "paid" }
}

// ---------- WIPE PRIOR SEED ORDERS ----------
console.log(`→ Removing prior seed orders (session_id like ${SESSION_PREFIX}%)...`)
// orders cascade to order_items via FK; order_items cascade to order_item_modifiers via FK.
await rest(`/orders?restaurant_id=eq.${RESTAURANT_ID}&session_id=like.${encodeURIComponent(SESSION_PREFIX + "%")}`, {
  method: "DELETE",
  headers: { Prefer: "return=minimal" },
})

// ---------- GENERATE ----------
console.log(`→ Building ${DAYS}-day order plan...`)
const timestamps = buildOrderTimestamps()
console.log(`  ${timestamps.length} orders planned.`)

const orders = []
for (let i = 0; i < timestamps.length; i++) {
  const t = timestamps[i]
  // ~25% of orders are veg-leaning baskets
  const isVeg = rand() < 0.25
  const basket = buildBasket(isVeg)
  const total_cents = basket.reduce((s, l) => s + l.item_price_cents * l.qty, 0)
  const { status, payment_status } = statusFor(t)
  orders.push({
    order: {
      restaurant_id: RESTAURANT_ID,
      table_number: randInt(1, 12),
      session_id: `${SESSION_PREFIX}${i}-${t.getTime()}`,
      total_cents,
      status,
      payment_status,
      special_notes: null,
      created_at: t.toISOString(),
    },
    basket,
  })
}

// ---------- INSERT ----------
console.log("→ Inserting orders + items + modifiers...")
const BATCH = 80
let nItems = 0, nMods = 0
for (let i = 0; i < orders.length; i += BATCH) {
  const slice = orders.slice(i, i + BATCH)
  process.stdout.write(`  orders ${i + 1}–${i + slice.length}... `)
  const rows = await rest("/orders", {
    method: "POST",
    body: JSON.stringify(slice.map(s => s.order)),
  })
  // Order items: insert and capture IDs for modifier rows
  const itemPayload = []
  const sliceIndexForLine = []
  for (let k = 0; k < rows.length; k++) {
    const orderId = rows[k].id
    for (const line of slice[k].basket) {
      itemPayload.push({
        order_id: orderId,
        menu_item_id: line.menu_item_id,
        quantity: line.qty,
        item_price_cents: line.item_price_cents,
        item_status: "ready",
      })
      sliceIndexForLine.push({ k, line })
    }
  }
  // Need the inserted order_items IDs to attach modifiers.
  const insertedItems = []
  for (let j = 0; j < itemPayload.length; j += 200) {
    const got = await rest("/order_items", {
      method: "POST",
      body: JSON.stringify(itemPayload.slice(j, j + 200)),
    })
    insertedItems.push(...got)
  }
  nItems += insertedItems.length

  const modPayload = []
  for (let j = 0; j < insertedItems.length; j++) {
    const orderItemId = insertedItems[j].id
    const line = sliceIndexForLine[j].line
    for (const m of line.modifiers) {
      modPayload.push({ order_item_id: orderItemId, modifier_id: m.id, price_adjustment_cents: m.adj })
    }
  }
  for (let j = 0; j < modPayload.length; j += 200) {
    await rest("/order_item_modifiers", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(modPayload.slice(j, j + 200)),
    })
  }
  nMods += modPayload.length
  console.log(`ok (+${insertedItems.length} items, +${modPayload.length} mods)`)
}

const totalRev = orders.filter(o => o.order.status !== "cancelled").reduce((s, o) => s + o.order.total_cents, 0)
console.log("")
console.log(`✓ Seeded ${orders.length} orders, ${nItems} line items, ${nMods} modifier rows.`)
console.log(`  Revenue (non-cancelled): ${(totalRev / 100).toLocaleString("sv-SE")} kr`)
console.log(`  Avg ticket: ${Math.round(totalRev / 100 / orders.filter(o=>o.order.status!=="cancelled").length).toLocaleString("sv-SE")} kr`)
