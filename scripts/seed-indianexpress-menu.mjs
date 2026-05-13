// Seeds the Indian Express tenant menu (categories, items, modifier groups).
// Idempotent on re-run (ON CONFLICT DO NOTHING via PostgREST upsert behavior — we use ignore-duplicates).
//
// Usage: node scripts/seed-indianexpress-menu.mjs

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
      Prefer: init.headers?.Prefer ?? "return=representation,resolution=ignore-duplicates",
      ...(init.headers || {}),
    },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} ${res.status}: ${text}`)
  return text ? JSON.parse(text) : null
}

// Generate deterministic UUIDs from a label so reruns are idempotent.
// We just hash into a v5-like UUID using a fixed namespace.
import { createHash } from "node:crypto"
function uuid(label) {
  const h = createHash("sha1").update(`indianexpress:${label}`).digest("hex").slice(0, 32)
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-8${h.slice(17, 20)}-${h.slice(20, 32)}`
}

// ---------- CATEGORIES ----------
const categories = [
  { name: "Kockens Favoriter",     order: 1 },
  { name: "Tandoori Sizlar",       order: 2 },
  { name: "Curries",               order: 3 },
  { name: "Birjani",               order: 4 },
  { name: "King Prawn",            order: 5 },
  { name: "Vegetariskt",           order: 6 },
  { name: "Thali",                 order: 7 },
  { name: "Tillbehör",             order: 8 },
  { name: "Efter maten",           order: 9 },
  { name: "Alkoholfritt",          order: 10 },
  { name: "Alkoholfri öl",         order: 11 },
  { name: "Cider/Öl på fat",       order: 12 },
  { name: "Cider/Öl på flaska",    order: 13 },
  { name: "Rött vin",              order: 14 },
  { name: "Vitt vin",              order: 15 },
  { name: "Rosé",                  order: 16 },
  { name: "Whiskey, Rom & Cognac", order: 17 },
]
const catId = Object.fromEntries(categories.map(c => [c.name, uuid(`cat:${c.name}`)]))

console.log("→ Upserting categories...")
await rest("/categories", {
  method: "POST",
  body: JSON.stringify(categories.map(c => ({
    id: catId[c.name],
    restaurant_id: RESTAURANT_ID,
    name: c.name,
    display_order: c.order,
    is_active: true,
  }))),
})

// ---------- MODIFIER GROUPS ----------
const MG_CURRY_PROTEIN = uuid("mg:curry-protein")
const MG_CHL_180_235   = uuid("mg:chicken-lamb-180-235")
const MG_CHL_185_235   = uuid("mg:chicken-lamb-185-235")

console.log("→ Upserting modifier groups...")
await rest("/modifier_groups", {
  method: "POST",
  body: JSON.stringify([
    { id: MG_CURRY_PROTEIN, restaurant_id: RESTAURANT_ID, name: "Välj protein",  is_required: true, allow_multiple: false },
    { id: MG_CHL_180_235,   restaurant_id: RESTAURANT_ID, name: "Kyckling/Lamm", is_required: true, allow_multiple: false },
    { id: MG_CHL_185_235,   restaurant_id: RESTAURANT_ID, name: "Kyckling/Lamm", is_required: true, allow_multiple: false },
  ]),
})

// Base curry price = 175 SEK (Kycklingfilé/Paneer). Deltas in öre.
console.log("→ Upserting modifiers...")
await rest("/modifiers", {
  method: "POST",
  body: JSON.stringify([
    // Curry protein
    { id: uuid("mod:curry:kyckling"),         modifier_group_id: MG_CURRY_PROTEIN, name: "Kycklingfilé",     price_adjustment_cents: 0 },
    { id: uuid("mod:curry:paneer"),           modifier_group_id: MG_CURRY_PROTEIN, name: "Paneer",           price_adjustment_cents: 0 },
    { id: uuid("mod:curry:tofu"),             modifier_group_id: MG_CURRY_PROTEIN, name: "Tofu",             price_adjustment_cents: -500 },
    { id: uuid("mod:curry:biff"),             modifier_group_id: MG_CURRY_PROTEIN, name: "Biff",             price_adjustment_cents: 1400 },
    { id: uuid("mod:curry:lammstek"),         modifier_group_id: MG_CURRY_PROTEIN, name: "Lammstek",         price_adjustment_cents: 2400 },
    { id: uuid("mod:curry:grillad-lammfile"), modifier_group_id: MG_CURRY_PROTEIN, name: "Grillad lammfilé", price_adjustment_cents: 6000 },
    // Chicken/Lamb 180/235 — base 180, Lamb +55
    { id: uuid("mod:chl180:chicken"), modifier_group_id: MG_CHL_180_235, name: "Kyckling", price_adjustment_cents: 0 },
    { id: uuid("mod:chl180:lamb"),    modifier_group_id: MG_CHL_180_235, name: "Lamm",     price_adjustment_cents: 5500 },
    // Chicken/Lamb 185/235 — base 185, Lamb +50
    { id: uuid("mod:chl185:chicken"), modifier_group_id: MG_CHL_185_235, name: "Kyckling", price_adjustment_cents: 0 },
    { id: uuid("mod:chl185:lamb"),    modifier_group_id: MG_CHL_185_235, name: "Lamm",     price_adjustment_cents: 5000 },
  ]),
})

// ---------- MENU ITEMS ----------
// price is in SEK (we multiply by 100 to get öre).
// veg = vegetarian (paneer/yogurt OK), vgn = strictly vegan, gf = gluten-free
const items = []
const itemModifierLinks = []

let displayCursor = {}
function addItem({ cat, name, description = null, price, veg = false, vgn = false, gf = false, modifierGroups = [] }) {
  const cId = catId[cat]
  if (!cId) throw new Error(`Unknown category: ${cat}`)
  displayCursor[cat] = (displayCursor[cat] ?? 0) + 1
  const id = uuid(`item:${cat}:${name}`)
  items.push({
    id,
    restaurant_id: RESTAURANT_ID,
    category_id: cId,
    name,
    description,
    price_cents: Math.round(price * 100),
    is_available: true,
    is_vegetarian: veg || vgn,
    is_vegan: vgn,
    is_gluten_free: gf,
    display_order: displayCursor[cat],
  })
  for (const mgId of modifierGroups) {
    itemModifierLinks.push({ item_id: id, modifier_group_id: mgId })
  }
  return id
}

// ===== KOCKENS FAVORITER (180/235 base = 180) =====
const KF_180 = [
  ["Tikka Masala",       "Tandoorigrillad kyckling- eller lammfilé | smör | grädde | kokos | mandel | russin. Mild."],
  ["Butter Chicken/Lamb","Tandoorigrillad kyckling- eller lammfilé | smör | tomat | grädde | koriander. Stark."],
  ["Hot Chili Chicken/Lamb","Tandoorigrillad kyckling- eller lammfilé | chili | lök | paprika | koriander | sweet chilisås. Söt-stark."],
  ["Tandoori Chicken/Lamb Masala","Tandoorigrillad kyckling- eller lammfilé | yoghurt | tomat | lök | paprika | koriander. Stark."],
  ["Tikka Jalfrezi",     "Tandoorigrillad kyckling- eller lammfilé | lök | paprika | chili | koriander. Mycket stark."],
  ["Tikka Karai",        "Tandoorigrillad kyckling- eller lammfilé i gryta med färska kryddor | lök | paprika | tomat | ingefära | koriander. Serveras på het gjutjärnspanna. Medium stark."],
]
for (const [name, desc] of KF_180) {
  addItem({ cat: "Kockens Favoriter", name, description: desc, price: 180, modifierGroups: [MG_CHL_180_235] })
}
// Tikka Balti (185/235)
addItem({
  cat: "Kockens Favoriter",
  name: "Tikka Balti",
  description: "Tandoorigrillad kyckling- eller lammfilé med baltipaste | grädde | ingefära | vitlök | tomat | koriander | lök | paprika | potatis. Stark.",
  price: 185,
  modifierGroups: [MG_CHL_185_235],
})
// Chicken-only specials
addItem({
  cat: "Kockens Favoriter",
  name: "Chicken Lasuni Karai",
  description: "Tandoorigrillad kycklingfilé i marinad på vitlök i gryta med färska kryddor | lök | paprika | tomat | ingefära | koriander. Serveras på het gjutjärnspanna. Medium stark.",
  price: 189,
})
addItem({
  cat: "Kockens Favoriter",
  name: "Chicken Lasuni Balti",
  description: "Tandoorigrillad kycklingfilé i marinad på vitlök i krämig gryta med baltipaste | grädde | ingefära | vitlök | tomat | koriander | lök | paprika | potatis. Stark.",
  price: 190,
})

// ===== TANDOORI SIZLAR =====
// Marinerat sedan grillat i lerugn | stekt i smör | lök | paprika. Serveras på het gjutjärnspanna med tomat och sweet chilisås. Medium stark.
const SIZLAR_HEADER = "Marinerat och grillat i lerugn, stekt i smör med lök och paprika. Serveras på het gjutjärnspanna med tomat och sweet chilisås. Medium stark."
addItem({ cat: "Tandoori Sizlar", name: "Tandoori Chicken",        description: `Kycklingfilé. ${SIZLAR_HEADER}`,             price: 185 })
addItem({ cat: "Tandoori Sizlar", name: "Chicken Tikka Sizlar",    description: `Kycklingfilé. ${SIZLAR_HEADER}`,             price: 185 })
addItem({ cat: "Tandoori Sizlar", name: "Chicken Lasuni Sizlar",   description: `Vitlöksmarinerad kycklingfilé. ${SIZLAR_HEADER}`, price: 190 })
addItem({ cat: "Tandoori Sizlar", name: "Lamm Tikka Sizlar",       description: `Lammfilé. ${SIZLAR_HEADER}`,                 price: 249 })
addItem({ cat: "Tandoori Sizlar", name: "King Prawn Sizlar",       description: `Svarta tigerräkor. ${SIZLAR_HEADER}`,        price: 239 })
addItem({ cat: "Tandoori Sizlar", name: "Mix Sizlar",              description: `Kycklingfilé, lammfilé och svarta tigerräkor. ${SIZLAR_HEADER}`, price: 255 })
addItem({ cat: "Tandoori Sizlar", name: "Seekh Kebab",             description: "Nötfärs marinerad i lök, vitlök, ingefära och indiska kryddor. Serveras med mynta- och korianderchutney samt sizlarsås.", price: 190 })

// ===== CURRIES (base 175, modifier picks protein) =====
addItem({ cat: "Curries", name: "Madras",      description: "Sydindisk gryta | soltorkad chili | koriander | citron. Mycket stark.", price: 175, modifierGroups: [MG_CURRY_PROTEIN] })
addItem({ cat: "Curries", name: "Vindaloo",    description: "Husets starkaste gryta | soltorkad chili | Vindaloo-paste | koriander. Extremt stark.", price: 175, modifierGroups: [MG_CURRY_PROTEIN] })
addItem({ cat: "Curries", name: "Balti",       description: "Krämig gryta med baltipaste | grädde | ingefära | vitlök | tomat | koriander | lök | paprika | potatis. Stark.", price: 175, modifierGroups: [MG_CURRY_PROTEIN] })
addItem({ cat: "Curries", name: "Karai",       description: "Gryta med färska kryddor | lök | paprika | tomat | ingefära | koriander. Serveras på het gjutjärnspanna. Medium stark.", price: 175, modifierGroups: [MG_CURRY_PROTEIN] })
addItem({ cat: "Curries", name: "Lime Curry",  description: "Gryta med färska limeblad | citron | lök | paprika | kokosmjölk. Medium stark.", price: 175, modifierGroups: [MG_CURRY_PROTEIN] })
addItem({ cat: "Curries", name: "Rogan Josh",  description: "Gryta med tomat | yoghurt | lök | paprika. Medium stark.", price: 175, modifierGroups: [MG_CURRY_PROTEIN] })
addItem({ cat: "Curries", name: "Curry Mango", description: "Krämig gryta med färsk mango | grädde | smör. Medium stark.", price: 175, modifierGroups: [MG_CURRY_PROTEIN] })

// ===== BIRJANI =====
const BIRJANI_HEADER = "Risrätt med färska kryddor, örter, koriander, lök och paprika. Serveras med chutney på mynta, koriander, chili och yoghurt. Medium stark."
addItem({ cat: "Birjani", name: "Lamb Birjani",         description: `Stekt lammfilé. ${BIRJANI_HEADER}`,           price: 205 })
addItem({ cat: "Birjani", name: "Chicken Tikka Birjani",description: `Grillad kycklingfilé. ${BIRJANI_HEADER}`,    price: 185 })
addItem({ cat: "Birjani", name: "King Prawn Birjani",   description: `Grillade svarta tigerräkor. ${BIRJANI_HEADER}`, price: 239 })

// ===== KING PRAWN =====
addItem({ cat: "King Prawn", name: "King Prawn Karai",                description: "Svarta tigerräkor i gryta med färska kryddor | lök | paprika | tomat | ingefära | koriander. Serveras på het gjutjärnspanna. Medium stark.", price: 210 })
addItem({ cat: "King Prawn", name: "King Prawn Balti",                description: "Svarta tigerräkor i krämig gryta med baltipaste | grädde | ingefära | vitlök | tomat | koriander | lök | paprika | potatis. Stark.", price: 225 })
addItem({ cat: "King Prawn", name: "Tandoori King Prawn Tikka Masala",description: "Tandoorigrillade svarta tigerräkor | smör | grädde | kokos | mandel | russin. Mild.", price: 230 })
addItem({ cat: "King Prawn", name: "King Prawn Madras",               description: "Svarta tigerräkor i sydindisk gryta | soltorkad chili | koriander | citron. Mycket stark.", price: 210 })
addItem({ cat: "King Prawn", name: "King Prawn Butter",               description: "Tandoorigrillade svarta tigerräkor | smör | tomat | grädde | koriander. Stark.", price: 215 })

// ===== VEGETARISKT =====
addItem({ cat: "Vegetariskt", name: "Daal Makhni",   description: "Svarta linser i smör | grädde | tomat | koriander. Medium stark.", price: 165, veg: true })
addItem({ cat: "Vegetariskt", name: "Tarka Daal",    description: "Stekta gula linser | vitlök | koriander. Medium stark.",            price: 159, vgn: true })
addItem({ cat: "Vegetariskt", name: "Aloo Gobi",     description: "Potatis och blomkål med indiska kryddor. Medium stark.",            price: 165, vgn: true })
addItem({ cat: "Vegetariskt", name: "Sag Aloo",      description: "Spenat | potatis | färska kryddor | koriander. Medium stark.",      price: 160, vgn: true })
addItem({ cat: "Vegetariskt", name: "Pakora Karai",  description: "Friterad zucchini & blomkål | lök | paprika | tomat. Serveras på gjutjärnspanna. Medium stark.", price: 165, vgn: true })
addItem({ cat: "Vegetariskt", name: "Mix Veg Karai", description: "Säsongens grönsaker | lök | paprika | curry. Currygryta med potatis | blomkål | lök | paprika | koriander. Medium stark.", price: 169, vgn: true })
addItem({ cat: "Vegetariskt", name: "Palak Paneer",  description: "Spenat | hemgjord paneer | smör | koriander. Veganskt alternativ: tofu. Medium stark.", price: 160, veg: true })
addItem({ cat: "Vegetariskt", name: "Paneer Masala", description: "Hemgjord paneer | smör | grädde | kokos | mandel | russin. Alternativ: tofu. Mild.", price: 165, veg: true })
addItem({ cat: "Vegetariskt", name: "Paneer Butter", description: "Hemgjord paneer | smör | tomat | grädde | koriander. Alternativ: tofu. Stark.", price: 165, veg: true })
addItem({ cat: "Vegetariskt", name: "Paneer Kofta",  description: "Kryddiga hemgjorda spenatbollar fyllda med paneer i currysås. Medium stark.", price: 169, veg: true })

// ===== THALI =====
addItem({ cat: "Thali", name: "Kött Thali",      description: "Traditionell tallrik med tre olika rätter: kockens val av lamm, biff och kyckling. Serveras med naan, papadam, sallad och Gulab Jamun. Välj mild, medium eller stark.", price: 285 })
addItem({ cat: "Thali", name: "Vegetarisk Thali",description: "Traditionell tallrik med tre olika rätter: kockens val av grönsaker och paneer. Serveras med naan, papadam, sallad och Gulab Jamun. Välj mild, medium eller stark.", price: 265, veg: true })

// ===== TILLBEHÖR =====
addItem({ cat: "Tillbehör", name: "Raita",                              description: "Yoghurt med gurka och kryddor.",                    price: 30, veg: true })
addItem({ cat: "Tillbehör", name: "Mango chutney / Tamarind-chili chutney", description: null,                                          price: 20, vgn: true })
addItem({ cat: "Tillbehör", name: "Mynta-yoghurt chutney",              description: null,                                                price: 10, veg: true })
addItem({ cat: "Tillbehör", name: "Mynta-koriander chutney",            description: null,                                                price: 20, vgn: true })
addItem({ cat: "Tillbehör", name: "Chili pickles / Lime pickles",       description: null,                                                price: 20, vgn: true })
addItem({ cat: "Tillbehör", name: "Extra ris",                          description: null,                                                price: 25, vgn: true })
addItem({ cat: "Tillbehör", name: "Side sallad",                        description: "Rödkål | koriander | morot | citron.",              price: 30, vgn: true })
addItem({ cat: "Tillbehör", name: "Extra sås",                          description: "Välj Masala (mild), Curry (medium stark) eller Madras (stark).", price: 40 })

// ===== EFTER MATEN =====
addItem({ cat: "Efter maten", name: "Gulab Jamun",  description: "Friterad degboll i rosensirap | vaniljglass | bär.", price: 65, veg: true })
addItem({ cat: "Efter maten", name: "Malai Kulfi",  description: "Glass med grädde | pistage | kardemumma | kanel.",   price: 75, veg: true })
addItem({ cat: "Efter maten", name: "Chokladkaka",  description: "Med vaniljglass och bär.",                          price: 75, veg: true })
addItem({ cat: "Efter maten", name: "Vaniljglass",  description: "Med Nutella, hallon och mynta.",                    price: 65, veg: true })

// ===== ALKOHOLFRITT =====
addItem({ cat: "Alkoholfritt", name: "Cola / Cola Zero / Fanta / Sprite / Pepsi Max", description: null, price: 40, vgn: true })
addItem({ cat: "Alkoholfritt", name: "Juice (Mango / Passion / Tranbär / Apelsin)",   description: null, price: 40, vgn: true })
addItem({ cat: "Alkoholfritt", name: "Mango Lassi",                                   description: "Yoghurt och mangopuré.",                price: 50, veg: true })
addItem({ cat: "Alkoholfritt", name: "Vegan Mango Lassi",                             description: "Havregurt, mangopuré och mangojuice.",  price: 50, vgn: true })
addItem({ cat: "Alkoholfritt", name: "Red Bull, 25 cl",                               description: null, price: 65, vgn: true })

// ===== ALKOHOLFRI ÖL =====
addItem({ cat: "Alkoholfri öl", name: "Heineken alkoholfri, 33 cl",       description: null, price: 55, vgn: true })
addItem({ cat: "Alkoholfri öl", name: "A Ship Full of IPA alkoholfri, 33 cl", description: null, price: 59, vgn: true })

// ===== CIDER/ÖL PÅ FAT =====
const DRAFT = [
  ["Briska Päroncider 4,5 %",   66, 76],
  ["Norrlands Guld 5,3 %",      66, 76],
  ["Heineken 5,0 %",            72, 82],
  ["Krusovice 5,0 %",           76, 87],
  ["A Ship Full of IPA 5,8 %",  81, 92],
  ["1664 Blanc 5,0 %",          74, 84],
  ["Eriksberg Karaktär 5,4 %",  72, 82],
]
for (const [name, p40, p50] of DRAFT) {
  addItem({ cat: "Cider/Öl på fat", name: `${name} — 40 cl`, description: null, price: p40, vgn: true })
  addItem({ cat: "Cider/Öl på fat", name: `${name} — 50 cl`, description: null, price: p50, vgn: true })
}

// ===== CIDER/ÖL PÅ FLASKA =====
addItem({ cat: "Cider/Öl på flaska", name: "Briska Blåbär & Hallon, 33 cl", description: null, price: 72, vgn: true })
addItem({ cat: "Cider/Öl på flaska", name: "Carlsberg Hof, 33 cl",          description: null, price: 60, vgn: true })
addItem({ cat: "Cider/Öl på flaska", name: "Sol, 33 cl",                    description: null, price: 70, vgn: true })
addItem({ cat: "Cider/Öl på flaska", name: "Sitting Bulldog IPA, 33 cl",    description: null, price: 72, vgn: true })
addItem({ cat: "Cider/Öl på flaska", name: "Ginger Joe, 33 cl",             description: null, price: 79, vgn: true })
addItem({ cat: "Cider/Öl på flaska", name: "Daura Damm (glutenfri), 33 cl", description: null, price: 75, vgn: true, gf: true })
addItem({ cat: "Cider/Öl på flaska", name: "Tuborg Guld, 50 cl",            description: null, price: 80, vgn: true })
addItem({ cat: "Cider/Öl på flaska", name: "Mariestads Export, 50 cl",      description: null, price: 80, vgn: true })
addItem({ cat: "Cider/Öl på flaska", name: "Old Ox, 50 cl",                 description: null, price: 89, vgn: true })
addItem({ cat: "Cider/Öl på flaska", name: "Paulaner, 50 cl",               description: null, price: 85, vgn: true })
addItem({ cat: "Cider/Öl på flaska", name: "Kingfisher (indisk), 33 cl",    description: null, price: 67, vgn: true })
addItem({ cat: "Cider/Öl på flaska", name: "Cobra (indisk), 66 cl",         description: null, price: 109, vgn: true })
addItem({ cat: "Cider/Öl på flaska", name: "Smirnoff Ice, 27,5 cl",         description: null, price: 79, vgn: true })

// ===== RÖTT VIN =====
const RED = [
  { name: "Maximo Tinto | Spanien",      glass: 85,  bottle: 359, desc: "Medelfylligt, ganska mjukt vin med mogna tanniner och toner av mynta, lakrits och röda bär som hallon och jordgubbar." },
  { name: "La Primizia Vino Rosso | Italien", glass: 95,  bottle: 395, desc: "Lätt och bärigt med mjuk strävhet och uppiggande syrlighet. Skogshallon, jordgubbskompott och körsbär i likör samt pinjenöt, ceder, körsbärskärna och kanel i avslutet." },
  { name: "Valpolicella Ripasso | Italien",   glass: null, bottle: 445, desc: "Medelfylligt vin med smak av mörk frukt, choklad och lite mandel. Silkiga tanniner och lång, aningens het eftersmak." },
]
for (const w of RED) {
  if (w.glass != null) addItem({ cat: "Rött vin", name: `${w.name} — glas`,    description: w.desc, price: w.glass,  vgn: true })
                       addItem({ cat: "Rött vin", name: `${w.name} — flaska`,  description: w.desc, price: w.bottle, vgn: true })
}

// ===== VITT VIN =====
const WHITE = [
  { name: "Maximo Blanco | Spanien",         glass: 85, bottle: 359, desc: "Torrt, lätt vin med en aptitretande frisk syra. Fruktig smak med inslag av citrus och lite mineral." },
  { name: "Mehrlein Riesling Dry | Tyskland",glass: 95, bottle: 395, desc: "Klassisk riesling med frisk smak av citrus, gröna äpplen, grapefrukt, persika och mineraler." },
]
for (const w of WHITE) {
  addItem({ cat: "Vitt vin", name: `${w.name} — glas`,   description: w.desc, price: w.glass,  vgn: true })
  addItem({ cat: "Vitt vin", name: `${w.name} — flaska`, description: w.desc, price: w.bottle, vgn: true })
}

// ===== ROSÉ =====
const ROSE = [
  { name: "Barefoot White Zinfandel | USA",            glass: 85, bottle: 359, desc: "Frisk och härlig smak av mosade jordgubbar, hallon, solmogna päron och saftig ananas. Mycket fruktigt med viss sötma och krispigt avslut." },
  { name: "Santiago Assinatura de Familia | Portugal", glass: 95, bottle: 395, desc: "Frisk och sötfruktig med en lätt sprits. Söta jordgubbar, hallon och röda vinbär med behaglig sötma och läskande syra. Passar till lite kryddiga rätter av fisk eller kyckling." },
]
for (const w of ROSE) {
  addItem({ cat: "Rosé", name: `${w.name} — glas`,   description: w.desc, price: w.glass,  vgn: true })
  addItem({ cat: "Rosé", name: `${w.name} — flaska`, description: w.desc, price: w.bottle, vgn: true })
}

// ===== WHISKEY, ROM & COGNAC =====
const SPIRITS = [
  ["Jameson", 26], ["Famous Grouse", 26], ["Jim Beam", 26], ["Jack Daniel's", 28],
  ["Black Label", 30], ["Grönstedts Monopole", 30], ["Laphroaig", 32],
  ["Macallan", 37], ["Zacapa", 37], ["Diplomatico", 37],
]
for (const [name, price] of SPIRITS) {
  addItem({ cat: "Whiskey, Rom & Cognac", name, description: null, price, vgn: true })
}

// ---------- INSERT ALL ITEMS + LINKS ----------
console.log(`→ Upserting ${items.length} menu items...`)
// Chunk to keep payloads manageable
const chunk = (arr, n) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, (i + 1) * n))
for (const batch of chunk(items, 50)) {
  await rest("/menu_items", { method: "POST", body: JSON.stringify(batch) })
}

console.log(`→ Upserting ${itemModifierLinks.length} item↔modifier-group links...`)
for (const batch of chunk(itemModifierLinks, 50)) {
  await rest("/item_modifier_groups", { method: "POST", body: JSON.stringify(batch) })
}

console.log("")
console.log(`✓ Indian Express menu seeded: ${categories.length} categories, ${items.length} items, ${itemModifierLinks.length} modifier links.`)
