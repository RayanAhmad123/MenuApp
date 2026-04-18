"use server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import type { Restaurant, Database } from "@/types/database"

type RestaurantUpdate = Database["public"]["Tables"]["restaurants"]["Update"]

const RestaurantUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().optional(),
  logoUrl: z.string().url().optional().nullable(),
  paymentEnabled: z.boolean().optional(),
  yellowThreshold: z.number().int().positive().optional(),
  redThreshold: z.number().int().positive().optional(),
})

export async function updateRestaurant(restaurantId: string, data: z.infer<typeof RestaurantUpdateSchema>) {
  const parsed = RestaurantUpdateSchema.safeParse(data)
  if (!parsed.success) return { error: "Invalid data" }

  const supabase = await createServerSupabaseClient()
  const update: RestaurantUpdate = {}
  if (parsed.data.name) update.name = parsed.data.name
  if (parsed.data.address !== undefined) update.address = parsed.data.address
  if (parsed.data.logoUrl !== undefined) update.logo_url = parsed.data.logoUrl
  if (parsed.data.paymentEnabled !== undefined) update.payment_enabled = parsed.data.paymentEnabled
  if (parsed.data.yellowThreshold !== undefined) update.yellow_threshold_minutes = parsed.data.yellowThreshold
  if (parsed.data.redThreshold !== undefined) update.red_threshold_minutes = parsed.data.redThreshold

  const { error } = await supabase.from("restaurants").update(update).eq("id", restaurantId)
  revalidatePath("/admin/settings")
  return { error: error?.message ?? null }
}

export async function inviteStaff(
  restaurantId: string,
  email: string,
  role: "admin" | "kitchen" | "waiter",
  firstName: string,
  lastName: string
) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from("staff").insert({
    restaurant_id: restaurantId,
    email,
    role,
    first_name: firstName,
    last_name: lastName,
    is_active: true,
  })

  if (error) return { error: error.message }

  revalidatePath("/admin/staff")
  return { error: null }
}

export async function updateStaffStatus(staffId: string, isActive: boolean) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from("staff").update({ is_active: isActive }).eq("id", staffId)
  revalidatePath("/admin/staff")
  return { error: error?.message ?? null }
}

export async function getCurrentRestaurant(): Promise<{ restaurant: Restaurant; role: string; staffName: string } | null> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return null

  const { data: staff } = await supabase
    .from("staff")
    .select("restaurant_id, role, first_name, last_name")
    .eq("email", user.email)
    .eq("is_active", true)
    .single()

  if (!staff) return null

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", staff.restaurant_id)
    .single()

  return restaurant ? { restaurant, role: staff.role, staffName: `${staff.first_name} ${staff.last_name}` } : null
}
