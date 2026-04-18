import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(
  _request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        menu_items ( name, image_url ),
        order_item_modifiers (
          *,
          modifiers ( name )
        )
      )
    `)
    .eq("id", params.orderId)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  return NextResponse.json(data)
}
