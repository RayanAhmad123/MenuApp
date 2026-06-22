"use server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { tenantUrl } from "@/lib/tenant"

// Resolve the dashboard URL on the tenant's own subdomain for the currently
// logged-in user. Used by the central login (servera.triadsolutions.se/login):
// after authenticating we send the admin to their restaurant's subdomain.
// Mirrors the row selection in the admin layout — an admin may belong to
// several restaurants, so we take their first active membership.
export async function getMyTenantDashboardUrl(): Promise<string | null> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return null

  const { data: staffRows } = await supabase
    .from("staff")
    .select("restaurants(subdomain)")
    .eq("email", user.email)
    .eq("is_active", true)

  type Row = { restaurants: { subdomain: string } | null }
  const rows = (staffRows ?? []) as unknown as Row[]
  const subdomain = rows.map((r) => r.restaurants?.subdomain).find(Boolean)
  if (!subdomain) return null

  return tenantUrl(subdomain, "/admin/dashboard")
}
