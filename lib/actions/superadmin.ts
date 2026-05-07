"use server"
import { createServerSupabaseClient, createAdminSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function requireSuperadmin() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/superadmin/login")

  const { data } = await supabase
    .from("superadmins")
    .select("id")
    .eq("email", user.email!)
    .eq("is_active", true)
    .single()

  if (!data) redirect("/superadmin/login")
  return { supabase, adminSupabase: await createAdminSupabaseClient(), user }
}

// =============================================
// RESTAURANT ACTIONS
// =============================================

export async function createRestaurant(
  name: string,
  subdomain: string,
  subscriptionTier: "free" | "pro" | "enterprise" = "free"
) {
  const { adminSupabase } = await requireSuperadmin()

  subdomain = subdomain.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-")

  const { error } = await adminSupabase.from("restaurants").insert({
    name,
    subdomain,
    subscription_tier: subscriptionTier,
    is_active: true,
  })

  revalidatePath("/superadmin/dashboard")
  return { error: error?.message ?? null }
}

export async function toggleRestaurantActive(restaurantId: string, isActive: boolean) {
  const { adminSupabase } = await requireSuperadmin()

  const { error } = await adminSupabase
    .from("restaurants")
    .update({ is_active: isActive })
    .eq("id", restaurantId)

  revalidatePath("/superadmin/dashboard")
  return { error: error?.message ?? null }
}

export async function updateRestaurantTier(
  restaurantId: string,
  tier: "free" | "pro" | "enterprise"
) {
  const { adminSupabase } = await requireSuperadmin()

  const { error } = await adminSupabase
    .from("restaurants")
    .update({ subscription_tier: tier })
    .eq("id", restaurantId)

  revalidatePath("/superadmin/dashboard")
  return { error: error?.message ?? null }
}

// =============================================
// SUPERADMIN MANAGEMENT
// =============================================

export async function addSuperadmin(
  email: string,
  firstName: string,
  lastName: string
) {
  const { adminSupabase } = await requireSuperadmin()

  const { error } = await adminSupabase.from("superadmins").insert({
    email,
    first_name: firstName,
    last_name: lastName,
    is_active: true,
  })

  revalidatePath("/superadmin/admins")
  return { error: error?.message ?? null }
}

export async function toggleSuperadminActive(superadminId: string, isActive: boolean) {
  const { adminSupabase, user } = await requireSuperadmin()

  // Prevent deactivating yourself
  const { data: self } = await adminSupabase
    .from("superadmins")
    .select("email")
    .eq("id", superadminId)
    .single()

  if (self?.email === user.email) {
    return { error: "Du kan inte inaktivera ditt eget konto" }
  }

  const { error } = await adminSupabase
    .from("superadmins")
    .update({ is_active: isActive })
    .eq("id", superadminId)

  revalidatePath("/superadmin/admins")
  return { error: error?.message ?? null }
}
