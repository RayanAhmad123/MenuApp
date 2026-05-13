// Sets cost_cents on every Indian Express menu item using realistic
// food-cost percentages per category and item type.
//
// Usage: node scripts/set-indianexpress-costs.mjs

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

// Food cost % targets per category + per-item-name overrides for proteins.
// Numbers reflect a typical Swedish Indian restaurant: low cost on veg/curry
// (lentils, spinach, paneer), higher on lamb/king prawn, lower margin on
// soft drinks and premium spirits.
function costPctFor(catName, itemName) {
  const n = itemName.toLowerCase()
  const c = catName.toLowerCase()

  // protein cues
  const isLamb   = /\blamm|lamb\b/.test(n)
  const isPrawn  = /\bprawn|tigerräkor\b/.test(n)
  const isMix    = /\bmix\b/.test(n)
  const isBeef   = /\bbiff\b/.test(n)
  const isTofu   = /\btofu\b/.test(n)

  // Drinks
  if (c === "alkoholfritt") {
    if (/red bull/.test(n)) return 0.50
    if (/lassi/.test(n))    return 0.22
    return 0.18 // soft drinks, juice
  }
  if (c === "alkoholfri öl")         return 0.35
  if (c === "cider/öl på fat")       return /50 cl/.test(n) ? 0.27 : 0.25
  if (c === "cider/öl på flaska")    return 0.40
  if (c === "rött vin" || c === "vitt vin" || c === "rosé") {
    return /flaska/.test(n) ? 0.35 : 0.30
  }
  if (c === "whiskey, rom & cognac") {
    // premium pours have thinner margin
    return /macallan|laphroaig|zacapa|diplomatico/.test(n) ? 0.50 : 0.38
  }

  // Food
  if (c === "tillbehör") {
    if (/extra ris/.test(n))   return 0.20
    if (/raita|chutney|pickles|sallad/.test(n)) return 0.25
    if (/extra sås/.test(n))   return 0.20
    return 0.25
  }
  if (c === "efter maten") return 0.25

  if (c === "vegetariskt") {
    if (/daal|tarka/.test(n)) return 0.18 // lentils very cheap
    if (/paneer|palak/.test(n)) return 0.24
    return 0.22
  }
  if (c === "thali") {
    return /kött/.test(n) ? 0.32 : 0.26
  }
  if (c === "birjani") {
    if (isPrawn) return 0.38
    if (isLamb)  return 0.35
    return 0.28
  }
  if (c === "king prawn") return 0.40
  if (c === "tandoori sizlar") {
    if (isMix) return 0.35
    if (isPrawn) return 0.38
    if (isLamb) return 0.33
    if (/seekh/.test(n)) return 0.30
    return 0.28
  }
  if (c === "curries") return 0.30 // base price = kycklingfilé/paneer; modifiers shift but we cost the base
  if (c === "kockens favoriter") {
    if (/lasuni karai|lasuni balti/.test(n)) return 0.30
    return 0.30 // base price = chicken; lamb upcharge handled at item level by upcoming Lamm modifier
  }

  return 0.30
}

const items = await rest(`/menu_items?restaurant_id=eq.${RESTAURANT_ID}&select=id,name,price_cents,category_id,categories(name)`)
console.log(`Found ${items.length} items.`)

let touched = 0
for (const it of items) {
  const catName = it.categories?.name ?? "?"
  const pct = costPctFor(catName, it.name)
  // Round cost to nearest whole krona (1 SEK = 100 cents).
  const costSek = Math.max(1, Math.round((it.price_cents * pct) / 100))
  const cost_cents = costSek * 100
  await rest(`/menu_items?id=eq.${it.id}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ cost_cents }),
  })
  touched++
  if (touched % 20 === 0) process.stdout.write(`  ...${touched}\n`)
}

console.log(`\n✓ Updated cost_cents on ${touched} items.`)
