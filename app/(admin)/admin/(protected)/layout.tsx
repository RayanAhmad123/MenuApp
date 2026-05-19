import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/sidebar"
import {
  ROOT_DOMAIN,
  extractSubdomainFromHost,
  isTenantSubdomain,
  tenantUrl,
} from "@/lib/tenant"

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  // Fetch every staff row this user belongs to. An admin can be a member of
  // multiple restaurants, so we never use .single() here.
  const { data: staffRows } = await supabase
    .from("staff")
    .select(
      "restaurant_id, role, first_name, last_name, restaurants(name, logo_url, subdomain)"
    )
    .eq("email", user.email!)
    .eq("is_active", true)

  type StaffRow = {
    restaurant_id: string
    role: string
    first_name: string
    last_name: string
    restaurants: { name: string; logo_url: string | null; subdomain: string } | null
  }

  const rows = (staffRows ?? []) as unknown as StaffRow[]
  if (rows.length === 0) redirect("/admin/login")

  // Pick the staff row that matches the host the user is currently on.
  // If they aren't on a tenant host, or aren't a member of the tenant they
  // are visiting, fall back to their first restaurant (we redirect there
  // a few lines down).
  const host = (await headers()).get("host")
  const hostname = host?.split(":")[0].toLowerCase() ?? ""
  const onTriadHost = hostname === ROOT_DOMAIN || hostname.endsWith(`.${ROOT_DOMAIN}`)
  const hostSub = extractSubdomainFromHost(host)
  const onTenant = onTriadHost && isTenantSubdomain(hostSub)

  const matchingRow = onTenant
    ? rows.find((r) => r.restaurants?.subdomain === hostSub)
    : undefined
  const staffDataAny = matchingRow ?? rows[0]
  const restaurant = staffDataAny.restaurants
  if (!restaurant) redirect("/admin/login")

  // On the triadsolutions.se host: if the user isn't a member of the tenant
  // they are visiting, bounce them to a restaurant they DO have access to.
  // Local/preview hosts are left alone so dev still works.
  if (onTriadHost && !matchingRow) {
    redirect(tenantUrl(restaurant.subdomain, "/admin/dashboard"))
  }

  return (
    <div className="flex h-screen bg-stone-50">
      <AdminSidebar
        restaurantName={restaurant.name}
        logoUrl={restaurant.logo_url}
        staffName={`${staffDataAny.first_name} ${staffDataAny.last_name}`}
        role={staffDataAny.role}
      />
      <main className="flex-1 overflow-auto pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  )
}
