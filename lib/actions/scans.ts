"use server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { z } from "zod"

const RecordScanSchema = z.object({
  restaurantId: z.string().uuid(),
  tableNumber: z.number().int().positive(),
  sessionId: z.string().min(1).optional(),
})

/**
 * Records a single QR scan for a table. Callers (the customer menu client)
 * dedupe to once per browsing session per table, so each row ≈ one session
 * that opened the table's menu. Best-effort: failures never block the guest.
 */
export async function recordTableScan(data: z.infer<typeof RecordScanSchema>) {
  const parsed = RecordScanSchema.safeParse(data)
  if (!parsed.success) return { error: "Invalid scan data" }

  const { restaurantId, tableNumber, sessionId } = parsed.data
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from("qr_scans").insert({
    restaurant_id: restaurantId,
    table_number: tableNumber,
    session_id: sessionId ?? null,
  })
  return { error: error?.message ?? null }
}

export type TableScanStat = { tableNumber: number; scans: number }
export type ScanStats = { totalScans: number; perTable: TableScanStat[] }

/**
 * Scan counts per table for a restaurant. Pass `days` to limit to a recent
 * window; omit for all-time. Returns a map sorted by table number.
 */
export async function getTableScanStats(restaurantId: string, days?: number): Promise<ScanStats> {
  const supabase = await createServerSupabaseClient()
  let query = supabase
    .from("qr_scans")
    .select("table_number")
    .eq("restaurant_id", restaurantId)

  if (days && days > 0) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
    query = query.gte("scanned_at", since)
  }

  const { data, error } = await query
  if (error || !data) return { totalScans: 0, perTable: [] }

  const counts = new Map<number, number>()
  for (const row of data) {
    counts.set(row.table_number, (counts.get(row.table_number) ?? 0) + 1)
  }

  const perTable = Array.from(counts, ([tableNumber, scans]) => ({ tableNumber, scans }))
    .sort((a, b) => a.tableNumber - b.tableNumber)

  return { totalScans: data.length, perTable }
}
