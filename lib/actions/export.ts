"use server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function exportOrdersCSV(
  restaurantId: string,
  fromDate?: string,
  toDate?: string
): Promise<{ csv: string | null; error: string | null }> {
  const supabase = await createServerSupabaseClient()

  let query = supabase
    .from("orders")
    .select(`
      id,
      created_at,
      table_number,
      status,
      payment_status,
      total_cents,
      order_items (
        quantity,
        menu_items ( name )
      )
    `)
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false })

  if (fromDate) {
    query = query.gte("created_at", `${fromDate}T00:00:00`)
  }
  if (toDate) {
    query = query.lte("created_at", `${toDate}T23:59:59.999`)
  }

  const { data: orders, error } = await query

  if (error) {
    return { csv: null, error: error.message }
  }

  const PAYMENT_LABELS: Record<string, string> = {
    paid: "Betald",
    unpaid: "Obetald",
    pending: "Väntar",
    refunded: "Återbetald",
  }

  const STATUS_LABELS: Record<string, string> = {
    pending: "Väntar",
    confirmed: "Bekräftad",
    preparing: "Tillagas",
    ready: "Klar",
    delivered: "Levererad",
    cancelled: "Avbruten",
  }

  const header = ["Datum", "Bord", "Status", "Betalning", "Artiklar", "Totalt (SEK)"]

  const rows = (orders ?? []).map(order => {
    const date = new Date(order.created_at).toLocaleString("sv-SE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })

    const items = (order.order_items ?? [])
      .map((oi: { quantity: number; menu_items: { name: string } | null }) =>
        `${oi.quantity}x ${oi.menu_items?.name ?? "?"}`
      )
      .join("; ")

    const totalSEK = (order.total_cents / 100).toFixed(2).replace(".", ",")

    return [
      date,
      String(order.table_number),
      STATUS_LABELS[order.status] ?? order.status,
      PAYMENT_LABELS[order.payment_status] ?? order.payment_status,
      items,
      totalSEK,
    ]
  })

  const escape = (val: string) => `"${val.replace(/"/g, '""')}"`
  const lines = [header, ...rows].map(row => row.map(escape).join(","))
  const csv = "﻿" + lines.join("\r\n") // BOM for Excel compatibility

  return { csv, error: null }
}
