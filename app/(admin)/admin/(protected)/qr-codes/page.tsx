import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentRestaurant } from "@/lib/actions/restaurant"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { QrCodesClient } from "@/components/admin/qr-codes-client"

export const metadata: Metadata = { title: "QR Codes" }
export const dynamic = 'force-dynamic'

export default async function QrCodesPage() {
  const ctx = await getCurrentRestaurant()
  if (!ctx) return redirect("/admin/login")

  const supabase = await createServerSupabaseClient()

  const { data: qrCodes } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("restaurant_id", ctx.restaurant.id)
    .order("table_number")

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-stone-800 font-semibold">QR Codes</h1>
        <p className="text-stone-500 mt-1">
          Generate and download QR codes for each table. Customers scan these to access your menu.
        </p>
      </div>
      <QrCodesClient
        restaurantId={ctx.restaurant.id}
        restaurantSubdomain={ctx.restaurant.subdomain}
        initialQrCodes={qrCodes ?? []}
      />
    </div>
  )
}
