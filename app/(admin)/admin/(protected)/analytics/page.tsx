import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentRestaurant } from "@/lib/actions/restaurant"
import { getAnalyticsSummary } from "@/lib/actions/analytics"
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

  const summary = await getAnalyticsSummary(ctx.restaurant.id, days)

  return (
    <AnalyticsClient
      restaurantId={ctx.restaurant.id}
      summary={summary}
      initialDays={days}
    />
  )
}
