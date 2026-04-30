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

  const { data: staffData } = await supabase
    .from("staff")
    .select("restaurant_id, role, first_name, last_name, restaurants(name, logo_url, subdomain)")
    .eq("email", user.email!)
    .eq("is_active", true)
    .single()

  if (!staffData) redirect("/admin/login")

  const staffDataAny = staffData as unknown as {
    restaurant_id: string
    role: string
    first_name: string
    last_name: string
    restaurants: { name: string; logo_url: string | null; subdomain: string } | null
  }
  const restaurant = staffDataAny.restaurants
  if (!restaurant) redirect("/admin/login")

  // Per-tenant admin: bounce to the user's own subdomain when on the wrong host.
  // Skipped on local/preview hosts (anything not under triadsolutions.se).
  const host = (await headers()).get("host")
  const hostname = host?.split(":")[0].toLowerCase() ?? ""
  const onTriadHost = hostname === ROOT_DOMAIN || hostname.endsWith(`.${ROOT_DOMAIN}`)
  if (onTriadHost) {
    const hostSub = extractSubdomainFromHost(host)
    const onCorrectTenant = isTenantSubdomain(hostSub) && hostSub === restaurant.subdomain
    if (!onCorrectTenant) {
      redirect(tenantUrl(restaurant.subdomain, "/admin/dashboard"))
    }
  }

  return (
    <div className="flex h-screen bg-stone-50">
      <AdminSidebar
        restaurantName={restaurant.name}
        logoUrl={restaurant.logo_url}
        staffName={`${staffDataAny.first_name} ${staffDataAny.last_name}`}
        role={staffDataAny.role}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
