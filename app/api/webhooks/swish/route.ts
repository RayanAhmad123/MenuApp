import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase/server"
import type { SwishPaymentRequestCallback } from "@/lib/swish"

/**
 * POST /api/webhooks/swish
 *
 * Callback endpoint called by the Swish API after a payment is completed,
 * declined, or encounters an error.
 *
 * Note: In production, Swish requires this endpoint to be reachable over HTTPS
 * and recommends verifying the request origin via IP allowlisting:
 *   - Production: 213.132.115.91 / 85.197.255.10
 *   - Test: 213.132.115.91
 */
export async function POST(req: NextRequest) {
  let body: SwishPaymentRequestCallback

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { status, payeePaymentReference: orderId } = body

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 })
  }

  const supabase = await createAdminSupabaseClient()

  if (status === "PAID") {
    await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        status: "confirmed",
      })
      .eq("id", orderId)
  } else if (status === "ERROR" || status === "DECLINED" || status === "CANCELLED") {
    // "failed" is not a DB enum value — keep as "unpaid" so the order
    // remains visible, but mark status as cancelled so staff can see it.
    await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId)
  }
  // CREATED status — no action needed

  // Swish expects a 200 OK response
  return NextResponse.json({ received: true }, { status: 200 })
}
