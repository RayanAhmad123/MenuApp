// Creates a new restaurant tenant: restaurants row + Supabase Auth user + staff row.
//
// Usage: node scripts/create-tenant.mjs <subdomain> <name> <adminEmail> [adminPassword] [firstName] [lastName] [address]
// Example: node scripts/create-tenant.mjs indianexpress "Indian Express" admin@indianexpress.triadsolutions.se
//
// If adminPassword is omitted, a random one is generated and printed at the end.

import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { randomBytes, randomUUID } from "node:crypto"

const __dirname = dirname(fileURLToPath(import.meta.url))
const envCandidates = [
  join(__dirname, "..", ".env.local"),
  join(__dirname, "..", "..", "..", "..", ".env.local"),
]
let envPath = null
for (const p of envCandidates) {
  try { readFileSync(p, "utf8"); envPath = p; break } catch {}
}
if (!envPath) { console.error("Could not find .env.local"); process.exit(1) }
const env = Object.fromEntries(
  readFileSync(envPath, "utf8").split("\n").filter(l => l.includes("=")).map(l => {
    const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
  })
)
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_ROLE) { console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"); process.exit(1) }

const [, , subdomain, name, adminEmail, adminPasswordArg, firstNameArg, lastNameArg, addressArg] = process.argv
if (!subdomain || !name || !adminEmail) {
  console.error("Usage: node scripts/create-tenant.mjs <subdomain> <name> <adminEmail> [adminPassword] [firstName] [lastName] [address]")
  process.exit(1)
}
if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(subdomain)) {
  console.error(`Invalid subdomain "${subdomain}" — must be lowercase letters/digits/hyphens.`); process.exit(1)
}

const adminPassword = adminPasswordArg || randomBytes(12).toString("base64url")
const firstName = firstNameArg || "Admin"
const lastName = lastNameArg || name
const address = addressArg || ""

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

async function auth(path, init = {}) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_ROLE,
      Authorization: `Bearer ${SERVICE_ROLE}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} ${res.status}: ${text}`)
  return text ? JSON.parse(text) : null
}

console.log(`→ Checking subdomain "${subdomain}" availability...`)
const existing = await rest(`/restaurants?subdomain=eq.${encodeURIComponent(subdomain)}&select=id,name,subdomain`)
if (existing && existing.length > 0) {
  console.error(`✗ Subdomain "${subdomain}" is already taken by "${existing[0].name}" (${existing[0].id}).`)
  process.exit(1)
}

const restaurantId = randomUUID()
console.log(`→ Creating restaurant ${restaurantId} (${name})...`)
await rest("/restaurants", {
  method: "POST",
  body: JSON.stringify({
    id: restaurantId,
    name,
    subdomain,
    address: address || null,
    subscription_tier: "pro",
    is_active: true,
  }),
})

console.log(`→ Checking auth user ${adminEmail}...`)
const usersRes = await auth(`/admin/users?email=${encodeURIComponent(adminEmail)}`)
const userList = Array.isArray(usersRes?.users) ? usersRes.users : []
let authUser = userList.find(u => u.email?.toLowerCase() === adminEmail.toLowerCase())
if (authUser) {
  console.log(`  Existing auth user ${authUser.id} — leaving password unchanged.`)
} else {
  console.log(`→ Creating auth user ${adminEmail}...`)
  authUser = await auth("/admin/users", {
    method: "POST",
    body: JSON.stringify({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    }),
  })
  console.log(`  Created auth user ${authUser.id}.`)
}

console.log(`→ Inserting staff row (admin) for ${adminEmail}...`)
await rest("/staff", {
  method: "POST",
  body: JSON.stringify({
    restaurant_id: restaurantId,
    email: adminEmail,
    role: "admin",
    first_name: firstName,
    last_name: lastName,
    is_active: true,
  }),
  headers: { Prefer: "return=representation,resolution=ignore-duplicates" },
})

console.log("")
console.log("✓ Tenant created.")
console.log("")
console.log(`  Restaurant ID : ${restaurantId}`)
console.log(`  Subdomain     : ${subdomain}`)
console.log(`  URL           : https://${subdomain}.triadsolutions.se`)
console.log(`  Admin email   : ${adminEmail}`)
if (!adminPasswordArg && !userList.find(u => u.email?.toLowerCase() === adminEmail.toLowerCase())) {
  console.log(`  Admin password: ${adminPassword}`)
  console.log("  (Save this — it will not be shown again. Change it after first login.)")
}
