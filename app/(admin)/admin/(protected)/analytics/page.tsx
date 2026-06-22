import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentRestaurant } from "@/lib/actions/restaurant"
import { getAnalyticsSummary } from "@/lib/actions/analytics"
import { getTableScanStats } from "@/lib/actions/scans"
import { AnalyticsClient } from "@/components/admin/analytics/analytics-client"

export const metadata: Metadata = { title: "Analys" }
export const dynamic = "force-dynamic"

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: { days?: string }
}) {
  const ctx = await getCurrentRestaurant()
  if (!ctx) return redirect("/admin/login")

  const requestedDays = Number(searchParams.days)
  const days = [7, 30, 90].includes(requestedDays) ? requestedDays : 30

  const [summary, scanStats] = await Promise.all([
    getAnalyticsSummary(ctx.restaurant.id, days),
    getTableScanStats(ctx.restaurant.id, days),
  ])

  return (
    <AnalyticsClient
      restaurantId={ctx.restaurant.id}
      summary={summary}
      scanStats={scanStats}
      initialDays={days}
    />
  )
}
