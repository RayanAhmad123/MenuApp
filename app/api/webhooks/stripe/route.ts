import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createAdminSupabaseClient } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" })

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    const supabase = await createAdminSupabaseClient()

    const { error } = await supabase
      .from("orders")
      .update({ payment_status: "paid", status: "confirmed" })
      .eq("stripe_payment_intent_id", paymentIntent.id)

    if (error) {
      console.error("Stripe webhook: failed to update order", paymentIntent.id, error.message)
      // Return 500 so Stripe retries the webhook
      return NextResponse.json({ error: "Database update failed" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
