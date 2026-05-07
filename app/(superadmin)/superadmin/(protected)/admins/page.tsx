import { redirect } from "next/navigation"
import { createServerSupabaseClient, createAdminSupabaseClient } from "@/lib/supabase/server"
import { AdminsClient } from "@/components/superadmin/admins-client"

export const dynamic = "force-dynamic"
export const metadata = { title: "Superadmin – Administratörer" }

export default async function SuperadminAdminsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/superadmin/login")

  const adminSupabase = await createAdminSupabaseClient()
  const { data: admins } = await adminSupabase
    .from("superadmins")
    .select("id, email, first_name, last_name, is_active, created_at")
    .order("created_at", { ascending: true })

  return <AdminsClient admins={admins ?? []} currentEmail={user.email!} />
}
