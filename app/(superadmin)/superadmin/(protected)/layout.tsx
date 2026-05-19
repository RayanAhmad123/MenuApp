import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { SuperadminSidebar } from "@/components/superadmin/sidebar"

export const dynamic = "force-dynamic"

export default async function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/superadmin/login")

  const { data: superadmin } = await supabase
    .from("superadmins")
    .select("first_name, last_name")
    .eq("email", user.email!)
    .eq("is_active", true)
    .single()

  if (!superadmin) redirect("/superadmin/login")

  return (
    <div className="flex h-screen bg-stone-50">
      <SuperadminSidebar adminName={`${superadmin.first_name} ${superadmin.last_name}`} />
      <main className="flex-1 overflow-auto pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  )
}
