import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  const { data: staffData } = await supabase
    .from("staff")
    .select("restaurant_id, role, first_name, last_name, restaurants(name, logo_url)")
    .eq("email", user.email!)
    .eq("is_active", true)
    .single()

  if (!staffData) redirect("/admin/login")

  const staffDataAny = staffData as unknown as {
    restaurant_id: string
    role: string
    first_name: string
    last_name: string
    restaurants: { name: string; logo_url: string | null } | null
  }
  const restaurant = staffDataAny.restaurants

  return (
    <div className="flex h-screen bg-stone-50">
      <AdminSidebar
        restaurantName={restaurant?.name ?? "My Restaurant"}
        logoUrl={restaurant?.logo_url ?? null}
        staffName={`${staffDataAny.first_name} ${staffDataAny.last_name}`}
        role={staffDataAny.role}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
