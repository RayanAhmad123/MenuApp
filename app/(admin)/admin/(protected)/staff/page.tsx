import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getCurrentRestaurant } from "@/lib/actions/restaurant"
import { StaffClient } from "@/components/admin/staff-client"

export const metadata: Metadata = { title: "Personal" }
export const dynamic = 'force-dynamic'

export default async function StaffPage() {
  const ctx = await getCurrentRestaurant()
  if (!ctx) return redirect("/admin/login")

  const supabase = await createServerSupabaseClient()
  const { data: staff } = await supabase
    .from("staff")
    .select("*")
    .eq("restaurant_id", ctx.restaurant.id)
    .order("created_at")

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl text-stone-800 font-semibold mb-6">Personal</h1>
      <StaffClient staff={staff ?? []} restaurantId={ctx.restaurant.id} />
    </div>
  )
}
