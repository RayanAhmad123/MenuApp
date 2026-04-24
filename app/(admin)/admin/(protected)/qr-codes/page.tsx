import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentRestaurant } from "@/lib/actions/restaurant"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { QrCodesClient } from "@/components/admin/qr-codes-client"

export const metadata: Metadata = { title: "QR-koder" }
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
    <div className="p-8 print:p-0">
      <div className="mb-8 print:hidden">
        <h1 className="font-serif text-3xl text-stone-800 font-semibold">QR-koder</h1>
        <p className="text-stone-500 mt-1">
          Skapa och ladda ner QR-koder för varje bord. Gästerna skannar dem för att öppna menyn.
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
