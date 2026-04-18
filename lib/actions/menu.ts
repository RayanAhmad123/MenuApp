"use server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Database } from "@/types/database"
import { z } from "zod"
import { revalidatePath } from "next/cache"

type MenuItemUpdate = Database["public"]["Tables"]["menu_items"]["Update"]
type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"]

const MenuItemSchema = z.object({
  restaurantId: z.string().uuid(),
  categoryId: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  priceCents: z.number().int().nonnegative(),
  imageUrl: z.string().url().optional().nullable(),
  isAvailable: z.boolean().default(true),
  isVegetarian: z.boolean().default(false),
  isVegan: z.boolean().default(false),
  isGlutenFree: z.boolean().default(false),
  allergenIds: z.array(z.string().uuid()).default([]),
})

export async function createMenuItem(data: z.infer<typeof MenuItemSchema>) {
  const parsed = MenuItemSchema.safeParse(data)
  if (!parsed.success) return { error: "Invalid item data", id: null }

  const { allergenIds, ...itemData } = parsed.data
  const supabase = await createServerSupabaseClient()

  const { data: item, error } = await supabase
    .from("menu_items")
    .insert({
      restaurant_id: itemData.restaurantId,
      category_id: itemData.categoryId,
      name: itemData.name,
      description: itemData.description ?? null,
      price_cents: itemData.priceCents,
      image_url: itemData.imageUrl ?? null,
      is_available: itemData.isAvailable,
      is_vegetarian: itemData.isVegetarian,
      is_vegan: itemData.isVegan,
      is_gluten_free: itemData.isGlutenFree,
      display_order: 0,
    })
    .select("id")
    .single()

  if (error || !item) return { error: error?.message ?? "Failed to create item", id: null }

  if (allergenIds.length > 0) {
    await supabase.from("item_allergens").insert(
      allergenIds.map(allergen_id => ({ item_id: item.id, allergen_id }))
    )
  }

  revalidatePath("/admin/menu")
  return { error: null, id: item.id }
}

export async function updateMenuItem(
  itemId: string,
  data: Partial<z.infer<typeof MenuItemSchema>>
) {
  const supabase = await createServerSupabaseClient()

  const update: MenuItemUpdate = {}
  if (data.name !== undefined) update.name = data.name
  if (data.description !== undefined) update.description = data.description
  if (data.priceCents !== undefined) update.price_cents = data.priceCents
  if (data.imageUrl !== undefined) update.image_url = data.imageUrl
  if (data.isAvailable !== undefined) update.is_available = data.isAvailable
  if (data.isVegetarian !== undefined) update.is_vegetarian = data.isVegetarian
  if (data.isVegan !== undefined) update.is_vegan = data.isVegan
  if (data.isGlutenFree !== undefined) update.is_gluten_free = data.isGlutenFree
  if (data.categoryId !== undefined) update.category_id = data.categoryId

  const { error } = await supabase.from("menu_items").update(update).eq("id", itemId)

  if (data.allergenIds !== undefined) {
    await supabase.from("item_allergens").delete().eq("item_id", itemId)
    if (data.allergenIds.length > 0) {
      await supabase.from("item_allergens").insert(
        data.allergenIds.map(allergen_id => ({ item_id: itemId, allergen_id }))
      )
    }
  }

  revalidatePath("/admin/menu")
  return { error: error?.message ?? null }
}

export async function deleteMenuItem(itemId: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from("menu_items").delete().eq("id", itemId)
  revalidatePath("/admin/menu")
  return { error: error?.message ?? null }
}

export async function createCategory(restaurantId: string, name: string, displayOrder: number) {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("categories")
    .insert({ restaurant_id: restaurantId, name, display_order: displayOrder })
    .select("id")
    .single()
  revalidatePath("/admin/menu")
  return { error: error?.message ?? null, id: data?.id ?? null }
}

export async function updateCategory(categoryId: string, data: { name?: string; displayOrder?: number; isActive?: boolean }) {
  const supabase = await createServerSupabaseClient()
  const update: CategoryUpdate = {}
  if (data.name !== undefined) update.name = data.name
  if (data.displayOrder !== undefined) update.display_order = data.displayOrder
  if (data.isActive !== undefined) update.is_active = data.isActive
  const { error } = await supabase.from("categories").update(update).eq("id", categoryId)
  revalidatePath("/admin/menu")
  return { error: error?.message ?? null }
}

export async function uploadMenuImage(restaurantId: string, file: FormData): Promise<{ url: string | null; error: string | null }> {
  const supabase = await createServerSupabaseClient()
  const image = file.get("file") as File
  if (!image) return { url: null, error: "No file provided" }

  const ext = image.name.split(".").pop()
  const path = `${restaurantId}/${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from("menu-images")
    .upload(path, image, { contentType: image.type, upsert: false })

  if (error) return { url: null, error: error.message }

  const { data } = supabase.storage.from("menu-images").getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}
