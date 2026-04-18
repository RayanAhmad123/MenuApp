"use server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import type { CartItem } from "@/types/database"
import { z } from "zod"

const PlaceOrderSchema = z.object({
  restaurantId: z.string().uuid(),
  tableNumber: z.number().int().positive(),
  sessionId: z.string().min(1),
  items: z.array(z.object({
    cartItemId: z.string(),
    menuItemId: z.string().uuid(),
    name: z.string(),
    priceCents: z.number().int().nonnegative(),
    quantity: z.number().int().positive(),
    imageUrl: z.string().nullable(),
    specialRequests: z.string(),
    selectedModifiers: z.array(z.object({
      modifierId: z.string().uuid(),
      modifierName: z.string(),
      priceAdjustmentCents: z.number().int(),
    })),
  })),
  specialNotes: z.string().optional(),
})

export async function placeOrder(data: z.infer<typeof PlaceOrderSchema>) {
  const parsed = PlaceOrderSchema.safeParse(data)
  if (!parsed.success) {
    return { error: "Invalid order data", orderId: null, clientSecret: null }
  }

  const { restaurantId, tableNumber, sessionId, items, specialNotes } = parsed.data

  const totalCents = items.reduce((sum, item) => {
    const modTotal = item.selectedModifiers.reduce((s, m) => s + m.priceAdjustmentCents, 0)
    return sum + (item.priceCents + modTotal) * item.quantity
  }, 0)

  const supabase = await createServerSupabaseClient()

  // Create Stripe payment intent
  let paymentIntent
  try {
    paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: "gbp",
      automatic_payment_methods: { enabled: true },
      metadata: { restaurantId, tableNumber: String(tableNumber), sessionId },
    })
  } catch {
    return { error: "Payment initialization failed", orderId: null, clientSecret: null }
  }

  // Insert order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      restaurant_id: restaurantId,
      table_number: tableNumber,
      session_id: sessionId,
      total_cents: totalCents,
      status: "pending",
      payment_status: "unpaid",
      stripe_payment_intent_id: paymentIntent.id,
      special_notes: specialNotes ?? null,
    })
    .select("id")
    .single()

  if (orderError || !order) {
    return { error: "Failed to create order", orderId: null, clientSecret: null }
  }

  // Insert order items
  for (const item of items) {
    const { data: orderItem, error: itemError } = await supabase
      .from("order_items")
      .insert({
        order_id: order.id,
        menu_item_id: item.menuItemId,
        quantity: item.quantity,
        item_price_cents: item.priceCents,
        special_requests: item.specialRequests || null,
        item_status: "pending",
      })
      .select("id")
      .single()

    if (itemError || !orderItem) continue

    // Insert modifiers for this item
    if (item.selectedModifiers.length > 0) {
      await supabase.from("order_item_modifiers").insert(
        item.selectedModifiers.map(mod => ({
          order_item_id: orderItem.id,
          modifier_id: mod.modifierId,
          price_adjustment_cents: mod.priceAdjustmentCents,
        }))
      )
    }
  }

  return {
    orderId: order.id,
    clientSecret: paymentIntent.client_secret,
    error: null,
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
  return { error: error?.message ?? null }
}

export async function updateOrderItemStatus(
  orderItemId: string,
  itemStatus: "pending" | "preparing" | "ready"
) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from("order_items")
    .update({ item_status: itemStatus })
    .eq("id", orderItemId)
  return { error: error?.message ?? null }
}

export async function acknowledgePing(pingId: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from("table_pings")
    .update({ status: "acknowledged" })
    .eq("id", pingId)
  return { error: error?.message ?? null }
}

export async function resolvePing(pingId: string) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from("table_pings")
    .update({ status: "resolved" })
    .eq("id", pingId)
  return { error: error?.message ?? null }
}

export async function createTablePing(
  restaurantId: string,
  tableNumber: number,
  pingType: "assistance" | "payment" | "refill",
  orderId?: string
) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from("table_pings")
    .insert({
      restaurant_id: restaurantId,
      table_number: tableNumber,
      ping_type: pingType,
      order_id: orderId ?? null,
      status: "pending",
    })
  return { error: error?.message ?? null }
}
