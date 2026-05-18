"use client"
import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  TrendingUp, TrendingDown, ShoppingBag, Clock, Users,
  Award, AlertTriangle, Sparkles, Target, ArrowUpRight, Info,
  Lightbulb, X,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import type { AnalyticsSummary, ItemDeepStat } from "@/lib/actions/analytics"
import { LineChart, BarChart, Heatmap, QuadrantMatrix, Donut, SparklineChart } from "./charts"
import { ItemStatsDrawer } from "./item-stats-drawer"
import { getItemDeepStats } from "@/lib/actions/analytics"

const WEEKDAYS = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"]
const WEEKDAYS_ORDERED = [1, 2, 3, 4, 5, 6, 0] // Mon-Sun
const CATEGORY_COLORS = ["#d97706", "#2563eb", "#16a34a", "#dc2626", "#9333ea", "#0891b2", "#ca8a04", "#e11d48"]

const QUADRANT_LABELS = {
  star: "Stjärna",
  plowhorse: "Dragdjur",
  puzzle: "Pussel",
  dog: "Flopp",
} as const

interface Props {
  restaurantId: string
  summary: AnalyticsSummary
  initialDays: number
}

export function AnalyticsClient({ restaurantId, summary, initialDays }: Props) {
  const router = useRouter()
  const [days, setDays] = useState(initialDays)
  const [pending, startTransition] = useTransition()
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [itemDetail, setItemDetail] = useState<ItemDeepStat | null>(null)
  const [loadingItem, setLoadingItem] = useState(false)
  const [dismissedInsights, setDismissedInsights] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set()
    try {
      const raw = window.localStorage.getItem(`menuapp:insights-dismissed:${restaurantId}`)
      return new Set(raw ? (JSON.parse(raw) as string[]) : [])
    } catch {
      return new Set()
    }
  })

  function dismissInsight(id: string) {
    setDismissedInsights(prev => {
      const next = new Set(prev)
      next.add(id)
      try {
        window.localStorage.setItem(
          `menuapp:insights-dismissed:${restaurantId}`,
          JSON.stringify(Array.from(next)),
        )
      } catch {
        // localStorage unavailable (private mode) — dismissal stays session-only
      }
      return next
    })
  }

  function changeRange(newDays: number) {
    setDays(newDays)
    startTransition(() => {
      router.push(`/admin/analytics?days=${newDays}`)
    })
  }

  async function openItemDrawer(itemId: string) {
    setSelectedItemId(itemId)
    setLoadingItem(true)
    const detail = await getItemDeepStats(restaurantId, itemId, days)
    setItemDetail(detail)
    setLoadingItem(false)
  }

  // Deltas: compare first half vs second half of range
  const revenueSparkline = summary.daily.map(d => d.revenueCents / 100)
  const ordersSparkline = summary.daily.map(d => d.orders)

  const firstHalfRevenue = summary.daily.slice(0, Math.floor(summary.daily.length / 2)).reduce((s, d) => s + d.revenueCents, 0)
  const secondHalfRevenue = summary.daily.slice(Math.floor(summary.daily.length / 2)).reduce((s, d) => s + d.revenueCents, 0)
  const revenueDelta = firstHalfRevenue > 0 ? ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100 : 0

  const firstHalfOrders = summary.daily.slice(0, Math.floor(summary.daily.length / 2)).reduce((s, d) => s + d.orders, 0)
  const secondHalfOrders = summary.daily.slice(Math.floor(summary.daily.length / 2)).reduce((s, d) => s + d.orders, 0)
  const ordersDelta = firstHalfOrders > 0 ? ((secondHalfOrders - firstHalfOrders) / firstHalfOrders) * 100 : 0

  const peakHour = summary.hourly.reduce((best, h) => h.orders > best.orders ? h : best, summary.hourly[0])
  const quietHour = summary.hourly
    .filter(h => h.orders > 0)
    .reduce((worst, h) => h.orders < worst.orders ? h : worst, summary.hourly.find(h => h.orders > 0) ?? { hour: 0, orders: 0, revenueCents: 0 })

  // Quadrant counts
  const quadrantCounts = summary.matrix.reduce((acc, p) => {
    acc[p.quadrant] = (acc[p.quadrant] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Top category revenue share
  const totalCatRevenue = summary.categoryBreakdown.reduce((s, c) => s + c.revenueCents, 0)

  // Insights engine
  const insights = useMemo(() => buildInsights(summary), [summary])
  const visibleInsights = insights.filter(i => !dismissedInsights.has(i.id))

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl text-stone-800 font-semibold">Analys</h1>
          <p className="text-stone-500 mt-1">Insikter per rätt, topptimmar och menyteknik — det smarta sättet att driva en meny.</p>
        </div>
        <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
          {[7, 30, 90].map(d => (
            <button
              key={d}
              onClick={() => changeRange(d)}
              disabled={pending}
              className={`text-sm px-3 py-1.5 rounded-md font-medium transition-colors ${
                days === d ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"
              }`}
            >
              {d} dagar
            </button>
          ))}
        </div>
      </div>

      {/* Insight cards */}
      {visibleInsights.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <h3 className="font-semibold text-stone-800 text-sm">Föreslagna åtgärder</h3>
              <span className="text-xs text-stone-400">Sorterade efter uppskattad effekt</span>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {visibleInsights.map(ins => {
                const impact = formatImpact(ins.impactCents)
                return (
                  <div
                    key={ins.id}
                    className={`relative flex gap-3 text-sm rounded-lg border p-3 ${INSIGHT_TONE[ins.tone]}`}
                  >
                    <span className="text-lg leading-none mt-0.5">{ins.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-stone-800 font-medium pr-5">{ins.title}</p>
                      <p className="text-stone-600 text-xs mt-0.5">{ins.body}</p>
                      {impact && (
                        <span
                          className={`inline-block mt-1.5 text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                            ins.tone === "warning"
                              ? "bg-red-100 text-red-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {ins.tone === "warning"
                            ? `≈ ${impact}/mån i risk`
                            : `≈ +${impact}/mån`}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => dismissInsight(ins.id)}
                      aria-label="Dölj förslag"
                      className="absolute top-2 right-2 text-stone-300 hover:text-stone-600 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Intäkter"
          value={formatPrice(summary.totalRevenueCents)}
          delta={revenueDelta}
          icon={TrendingUp}
          sparkline={revenueSparkline}
          color="#d97706"
        />
        <KPICard
          label="Beställningar"
          value={String(summary.totalOrders)}
          delta={ordersDelta}
          icon={ShoppingBag}
          sparkline={ordersSparkline}
          color="#2563eb"
        />
        <KPICard
          label="Snitt per beställning"
          value={formatPrice(summary.avgOrderCents)}
          icon={Target}
          sub={`${summary.avgItemsPerOrder.toFixed(1)} rätter / beställning`}
          color="#16a34a"
        />
        <KPICard
          label="Unika bord"
          value={String(summary.uniqueTables)}
          icon={Users}
          sub={`${(summary.paidRate * 100).toFixed(0)} % betalda`}
          color="#9333ea"
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-stone-100 h-auto p-1">
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="menu-engineering">Menyteknik</TabsTrigger>
          <TabsTrigger value="items">Rätter</TabsTrigger>
          <TabsTrigger value="timing">Topptimmar</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-6 mt-4">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-stone-200">
              <CardHeader>
                <CardTitle className="text-stone-800 text-lg">Intäktstrend</CardTitle>
              </CardHeader>
              <CardContent>
                {summary.totalRevenueCents === 0 ? (
                  <EmptyState message="Inga betalda beställningar i valt intervall" />
                ) : (
                  <LineChart
                    data={summary.daily.map(d => ({
                      x: 0,
                      y: d.revenueCents,
                      label: new Date(d.date).toLocaleDateString("sv-SE", { day: "numeric", month: "short" }),
                      subLabel: formatPrice(d.revenueCents),
                    }))}
                    formatY={n => formatPrice(n)}
                  />
                )}
              </CardContent>
            </Card>

            <Card className="border-stone-200">
              <CardHeader>
                <CardTitle className="text-stone-800 text-lg">Kategorifördelning</CardTitle>
              </CardHeader>
              <CardContent>
                {summary.categoryBreakdown.length === 0 || totalCatRevenue === 0 ? (
                  <EmptyState message="Ingen kategoridata än" />
                ) : (
                  <Donut
                    centerLabel="intäkter"
                    centerValue={formatPrice(totalCatRevenue)}
                    slices={summary.categoryBreakdown.slice(0, 6).map((c, i) => ({
                      label: c.name,
                      value: c.revenueCents,
                      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                    }))}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-stone-200">
              <CardHeader>
                <CardTitle className="text-stone-800 text-lg flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-600" />
                  Bästsäljare
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const sold = summary.topItems.filter(i => i.quantitySold > 0).slice(0, 5)
                  if (sold.length > 0) {
                    return (
                      <div className="space-y-1.5">
                        {sold.map((item, i) => (
                          <button
                            key={item.itemId}
                            onClick={() => openItemDrawer(item.itemId)}
                            className="flex items-center gap-3 w-full text-left hover:bg-stone-50 rounded-lg px-2 py-2 transition-colors"
                          >
                            <span className="text-xs font-bold text-stone-400 w-4">{i + 1}</span>
                            {item.imageUrl ? (
                              <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                                <Image src={item.imageUrl} alt={item.name} width={36} height={36} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-stone-100 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                              <p className="text-xs text-stone-500">{item.categoryName ?? "—"}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-stone-800">{item.quantitySold}×</p>
                              <p className="text-xs text-stone-500">{formatPrice(item.revenueCents)}</p>
                            </div>
                            <ArrowUpRight className="h-3.5 w-3.5 text-stone-300" />
                          </button>
                        ))}
                      </div>
                    )
                  }
                  if (summary.items.length === 0) {
                    return <EmptyState message="Lägg till rätter för att komma igång." />
                  }
                  return (
                    <div className="py-6 text-center">
                      <p className="text-stone-500 text-sm">Inga sälj de senaste {summary.periodDays} {summary.periodDays === 1 ? "dagen" : "dagarna"}.</p>
                      <p className="text-stone-400 text-xs mt-1">Bästsäljare visas här när gäster börjar beställa.</p>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>

            <Card className="border-stone-200">
              <CardHeader>
                <CardTitle className="text-stone-800 text-lg flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  Kräver uppmärksamhet
                </CardTitle>
              </CardHeader>
              <CardContent>
                {summary.bottomItems.length === 0 ? (
                  <EmptyState message="Lägg till rätter att granska." />
                ) : (
                  <div className="space-y-1.5">
                    {summary.bottomItems.slice(0, 5).map(item => (
                      <button
                        key={item.itemId}
                        onClick={() => openItemDrawer(item.itemId)}
                        className="flex items-center gap-3 w-full text-left hover:bg-stone-50 rounded-lg px-2 py-2 transition-colors"
                      >
                        {item.imageUrl ? (
                          <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={item.imageUrl} alt={item.name} width={36} height={36} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-stone-100 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                          <p className="text-xs text-stone-500">{item.categoryName ?? "—"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-stone-800">
                            {item.quantitySold === 0 ? (
                              <span className="text-red-600">0×</span>
                            ) : (
                              <>{item.quantitySold}×</>
                            )}
                          </p>
                          <p className="text-xs text-stone-500">
                            {item.quantitySold === 0 ? "Inga sälj" : formatPrice(item.revenueCents)}
                          </p>
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 text-stone-300" />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* MENU ENGINEERING */}
        <TabsContent value="menu-engineering" className="space-y-6 mt-4">
          {!summary.hasCostData && (
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-4 flex items-start gap-3">
                <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-stone-800 font-medium">Använder intäkter som vinstaxel.</p>
                  <p className="text-stone-600 mt-0.5">
                    Ange matkostnad i menyhanteringen för att låsa upp riktig marginalbaserad menyteknik.
                    Matkostnad är typiskt 25–35 % av menypriset.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-stone-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-stone-800 text-lg flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                    Menyteknikmatris
                  </CardTitle>
                  <p className="text-sm text-stone-500 mt-1">
                    Den klassiska Kasavana–Smith-modellen: popularitet × {summary.hasCostData ? "bidragsmarginal" : "intäkter"}.
                  </p>
                </div>
                <div className="text-xs text-stone-500 grid grid-cols-2 gap-x-4 gap-y-1">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-600" /> Stjärna: {quadrantCounts.star ?? 0}</div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-600" /> Dragdjur: {quadrantCounts.plowhorse ?? 0}</div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-600" /> Pussel: {quadrantCounts.puzzle ?? 0}</div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-600" /> Flopp: {quadrantCounts.dog ?? 0}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {summary.matrix.length === 0 ? (
                <EmptyState message="Lägg till rätter och registrera beställningar för att se matrisen" />
              ) : (
                <>
                  <QuadrantMatrix
                    points={summary.matrix.map(p => ({
                      id: p.itemId,
                      label: p.name,
                      x: p.popularityScore,
                      y: p.profitScore,
                      quadrant: p.quadrant,
                    }))}
                    xAxisLabel="← Långsamsäljare          Popularitet          Bästsäljare →"
                    yAxisLabel={summary.hasCostData ? "Vinst →" : "Intäkter →"}
                    onPointClick={openItemDrawer}
                  />
                  <div className="grid md:grid-cols-4 gap-3 mt-6 text-sm">
                    <QuadrantGuide
                      color="#16a34a"
                      name="Stjärnor"
                      action="Skydda. Lyft fram, håll beskrivningar skarpa, rabattera inte."
                    />
                    <QuadrantGuide
                      color="#d97706"
                      name="Dragdjur"
                      action="Populära men låg vinst. Höj priset varsamt eller trimma portionen."
                    />
                    <QuadrantGuide
                      color="#2563eb"
                      name="Pussel"
                      action="Lönsamma men långsamma. Bättre bilder, flytta högre på menyn, paketera."
                    />
                    <QuadrantGuide
                      color="#dc2626"
                      name="Floppar"
                      action="Ta bort, byt ut eller gör om. Låg efterfrågan och låg vinst."
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ITEMS */}
        <TabsContent value="items" className="mt-4">
          <Card className="border-stone-200">
            <CardHeader>
              <CardTitle className="text-stone-800 text-lg">Alla rätter — klicka på en rad för djupstatistik</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-stone-50 text-stone-500 border-y border-stone-100">
                    <tr>
                      <th className="text-left font-medium py-2.5 px-4">Rätt</th>
                      <th className="text-left font-medium py-2.5 px-4">Kategori</th>
                      <th className="text-right font-medium py-2.5 px-4">Pris</th>
                      <th className="text-right font-medium py-2.5 px-4">Sålda</th>
                      <th className="text-right font-medium py-2.5 px-4">Intäkter</th>
                      <th className="text-right font-medium py-2.5 px-4">Marginal</th>
                      <th className="text-right font-medium py-2.5 px-4">Beställningar</th>
                      <th className="text-center font-medium py-2.5 px-4">Betyg</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {[...summary.items].sort((a, b) => b.quantitySold - a.quantitySold).map(item => {
                      const matrixPoint = summary.matrix.find(m => m.itemId === item.itemId)
                      return (
                        <tr
                          key={item.itemId}
                          onClick={() => openItemDrawer(item.itemId)}
                          className="hover:bg-stone-50 cursor-pointer transition-colors"
                        >
                          <td className="py-2.5 px-4 flex items-center gap-2">
                            {item.imageUrl ? (
                              <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                                <Image src={item.imageUrl} alt={item.name} width={32} height={32} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded bg-stone-100 flex-shrink-0" />
                            )}
                            <span className="font-medium text-stone-800">{item.name}</span>
                          </td>
                          <td className="py-2.5 px-4 text-stone-500">{item.categoryName ?? "—"}</td>
                          <td className="py-2.5 px-4 text-right text-stone-700">{formatPrice(item.priceCents)}</td>
                          <td className="py-2.5 px-4 text-right font-medium text-stone-800">{item.quantitySold}</td>
                          <td className="py-2.5 px-4 text-right text-stone-700">{formatPrice(item.revenueCents)}</td>
                          <td className="py-2.5 px-4 text-right text-stone-700">
                            {item.marginCents === null ? <span className="text-stone-300">—</span> : formatPrice(item.marginCents)}
                          </td>
                          <td className="py-2.5 px-4 text-right text-stone-700">{item.ordersContaining}</td>
                          <td className="py-2.5 px-4 text-center">
                            {matrixPoint && <QuadrantBadge quadrant={matrixPoint.quadrant} />}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {summary.items.length === 0 && <EmptyState message="Inga rätter än" />}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PEAK HOURS */}
        <TabsContent value="timing" className="space-y-6 mt-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-stone-200">
              <CardHeader>
                <CardTitle className="text-stone-800 text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  Beställningar per timme
                </CardTitle>
              </CardHeader>
              <CardContent>
                {peakHour && peakHour.orders > 0 && (
                  <div className="mb-3 flex items-center gap-3 flex-wrap text-sm">
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      Topp: {formatHour(peakHour.hour)} — {peakHour.orders} beställningar
                    </Badge>
                    {quietHour.orders > 0 && quietHour.hour !== peakHour.hour && (
                      <Badge variant="secondary" className="bg-stone-100 text-stone-600">
                        Lugnast: {formatHour(quietHour.hour)}
                      </Badge>
                    )}
                  </div>
                )}
                <BarChart
                  data={summary.hourly.map(h => ({
                    label: h.hour % 3 === 0 ? `${h.hour}:00` : "",
                    value: h.orders,
                  }))}
                />
              </CardContent>
            </Card>

            <Card className="border-stone-200">
              <CardHeader>
                <CardTitle className="text-stone-800 text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  Veckodag × timme-värmekarta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Heatmap
                  rows={7}
                  cols={24}
                  rowLabels={WEEKDAYS_ORDERED.map(d => WEEKDAYS[d])}
                  colLabels={Array.from({ length: 24 }, (_, h) => (h % 3 === 0 ? `${h}` : ""))}
                  cells={summary.weekdayHour.map(c => ({
                    row: WEEKDAYS_ORDERED.indexOf(c.weekday),
                    col: c.hour,
                    value: c.orders,
                  }))}
                  cellSize={18}
                />
                <p className="text-xs text-stone-400 mt-3">
                  Mörkare = fler beställningar. Använd för schemaläggning och för att köra happy hour under lugnare tider.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <ItemStatsDrawer
        open={selectedItemId !== null}
        loading={loadingItem}
        detail={itemDetail}
        hasCostData={summary.hasCostData}
        onClose={() => {
          setSelectedItemId(null)
          setItemDetail(null)
        }}
      />
    </div>
  )
}

function KPICard({
  label, value, sub, delta, icon: Icon, sparkline, color,
}: {
  label: string; value: string; sub?: string; delta?: number
  icon: React.ComponentType<{ className?: string }>
  sparkline?: number[]
  color?: string
}) {
  return (
    <Card className="border-stone-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-2">
          <p className="text-sm text-stone-500 font-medium">{label}</p>
          <Icon className="h-4 w-4 text-stone-400" />
        </div>
        <p className="font-serif text-2xl font-semibold text-stone-800">{value}</p>
        <div className="flex items-center justify-between gap-2 mt-2 min-h-[20px]">
          {delta !== undefined ? (
            <span className={`text-xs font-medium flex items-center gap-0.5 ${delta >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {delta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(delta).toFixed(0)}% mot föregående
            </span>
          ) : sub ? (
            <span className="text-xs text-stone-500">{sub}</span>
          ) : <span />}
          {sparkline && sparkline.length > 0 && (
            <div className="w-20">
              <SparklineChart points={sparkline} height={24} color={color} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function QuadrantGuide({ color, name, action }: { color: string; name: string; action: string }) {
  return (
    <div className="border border-stone-200 rounded-lg p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
        <p className="font-semibold text-stone-800">{name}</p>
      </div>
      <p className="text-xs text-stone-600">{action}</p>
    </div>
  )
}

function QuadrantBadge({ quadrant }: { quadrant: "star" | "plowhorse" | "puzzle" | "dog" }) {
  const styles = {
    star: "bg-green-100 text-green-700",
    plowhorse: "bg-amber-100 text-amber-700",
    puzzle: "bg-blue-100 text-blue-700",
    dog: "bg-red-100 text-red-700",
  }
  return <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${styles[quadrant]}`}>{QUADRANT_LABELS[quadrant]}</span>
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-12 text-center text-stone-400 text-sm">{message}</div>
  )
}

function formatHour(h: number) {
  return `${String(h).padStart(2, "0")}:00`
}

type InsightTone = "warning" | "neutral" | "positive"
type Insight = {
  id: string
  emoji: string
  title: string
  body: string
  impactCents: number // estimated monthly kr impact; 0 = not quantified
  tone: InsightTone
}

const INSIGHT_TONE: Record<InsightTone, string> = {
  warning: "border-red-200 bg-red-50/60",
  neutral: "border-stone-200 bg-white",
  positive: "border-emerald-200 bg-emerald-50/60",
}

const WEEKDAYS_FULL = ["söndagar", "måndagar", "tisdagar", "onsdagar", "torsdagar", "fredagar", "lördagar"]

// Round a cents impact to the nearest 100 kr. Returns null below 100 kr so we
// never show a falsely precise figure for a negligible amount.
function formatImpact(cents: number): string | null {
  const rounded = Math.round(cents / 10000) * 10000
  if (rounded < 10000) return null
  return formatPrice(rounded)
}

// Rule-based insights engine — data-driven, not ML. Each rule carries a
// sample-size guard so thin data doesn't produce noise, and an estimated
// monthly kr impact used to rank the cards by what matters most.
function buildInsights(s: AnalyticsSummary): Insight[] {
  const out: Insight[] = []
  const periodDays = Math.max(1, s.periodDays)
  const toMonthly = (cents: number) => Math.round((cents * 30) / periodDays)

  // Revenue trend: compare the daily run-rate of the first vs second half of
  // the range. Needs >= 8 days so each half has real signal.
  const n = s.daily.length
  if (n >= 8) {
    const mid = Math.floor(n / 2)
    const firstDays = mid
    const secondDays = n - mid
    const firstRev = s.daily.slice(0, mid).reduce((a, d) => a + d.revenueCents, 0)
    const secondRev = s.daily.slice(mid).reduce((a, d) => a + d.revenueCents, 0)
    if (firstRev > 0 && firstDays > 0 && secondDays > 0) {
      const firstRate = firstRev / firstDays
      const secondRate = secondRev / secondDays
      const deltaPct = ((secondRate - firstRate) / firstRate) * 100
      if (deltaPct <= -15) {
        out.push({
          id: "trend-down",
          emoji: "📉",
          title: `Intäkterna sjunker — ${Math.abs(Math.round(deltaPct))} % lägre takt`,
          body: "Senare delen av perioden ligger klart under den tidigare. Se över meny, bemanning och öppettider.",
          impactCents: Math.round((firstRate - secondRate) * 30),
          tone: "warning",
        })
      } else if (deltaPct >= 20) {
        out.push({
          id: "trend-up",
          emoji: "🚀",
          title: `Intäkterna ökar — ${Math.round(deltaPct)} % högre takt`,
          body: "Senaste delen av perioden växer. Vad gjorde ni annorlunda? Gör mer av det.",
          impactCents: Math.round((secondRate - firstRate) * 30),
          tone: "positive",
        })
      }
    }
  }

  // Cancellations — guard on order volume so the rate is stable.
  if (s.cancelRate > 0.1 && s.totalOrders >= 20) {
    const cancelledPerPeriod = (s.cancelRate / (1 - s.cancelRate)) * s.totalOrders
    out.push({
      id: "cancel",
      emoji: "⚠️",
      title: `${Math.round(s.cancelRate * 100)} % av beställningarna avbryts`,
      body: "Över 10 %. Kolla väntetider i köket, misslyckade betalningar och slutsålda rätter.",
      impactCents: toMonthly(Math.round(cancelledPerPeriod * s.avgOrderCents)),
      tone: "warning",
    })
  }

  // Plowhorses → price-raise candidates. Needs >= 10 sales to be a safe bet.
  const plowhorses = s.matrix.filter(m => m.quadrant === "plowhorse" && m.quantitySold >= 10)
  if (plowhorses.length > 0) {
    const top = [...plowhorses].sort((a, b) => b.quantitySold - a.quantitySold)[0]
    out.push({
      id: `priceup-${top.itemId}`,
      emoji: "📈",
      title: `Prishöjningskandidat: ${top.name}`,
      body: `Säljer bra (${top.quantitySold}× på ${periodDays} d) men tunn marginal. +6 % i pris påverkar sällan volymen.`,
      impactCents: toMonthly(Math.round(top.priceCents * 0.06 * top.quantitySold)),
      tone: "neutral",
    })
  }

  // Puzzles → visibility candidates. Impact = upside of a ~50 % volume lift.
  const puzzles = s.matrix.filter(m => m.quadrant === "puzzle" && m.quantitySold >= 3)
  if (puzzles.length > 0) {
    const top = [...puzzles].sort((a, b) => b.profitScore - a.profitScore)[0]
    const profitPerPeriod = s.hasCostData ? (top.marginCents ?? 0) : top.revenueCents
    out.push({
      id: `puzzle-${top.itemId}`,
      emoji: "🧩",
      title: `Dold pärla: ${top.name}`,
      body: `Hög ${s.hasCostData ? "marginal" : "intäkt"}, låg efterfrågan. Flytta upp på menyn, lägg till bild eller märk som "Kockens val".`,
      impactCents: toMonthly(Math.round(profitPerPeriod * 0.5)),
      tone: "neutral",
    })
  }

  // Unsold items.
  const unsold = s.items.filter(i => i.quantitySold === 0)
  if (unsold.length > 0 && s.totalItemsSold >= 20) {
    out.push({
      id: "unsold",
      emoji: "🗑️",
      title: `${unsold.length} ${unsold.length === 1 ? "rätt" : "rätter"} utan sälj`,
      body: `Ingen beställde dessa under perioden: ${unsold.slice(0, 3).map(i => i.name).join(", ")}${unsold.length > 3 ? "…" : ""}. Skriv om beskrivningen, byt bild eller ta bort dem.`,
      impactCents: 0,
      tone: "neutral",
    })
  }

  // Dead hour slot → happy hour. Needs a real peak, not just a 1-vs-3 fluke.
  const hoursWithAny = s.hourly.filter(h => h.orders > 0)
  if (hoursWithAny.length >= 4 && s.totalOrders >= 20) {
    const sorted = [...hoursWithAny].sort((a, b) => b.orders - a.orders)
    const peak = sorted[0]
    const quiet = sorted[sorted.length - 1]
    if (peak.orders >= 6 && quiet.orders >= 1 && peak.orders >= 3 * quiet.orders) {
      out.push({
        id: "happy-hour",
        emoji: "⏰",
        title: `Kör happy hour kl. ${formatHour(quiet.hour)}`,
        body: `${formatHour(peak.hour)} har ${Math.round(peak.orders / quiet.orders)}× fler beställningar. Fyll gapet med ett tidsbegränsat erbjudande.`,
        impactCents: 0,
        tone: "neutral",
      })
    }
  }

  // Weakest weekday — only meaningful once each weekday has recurred.
  if (periodDays >= 28) {
    const byWeekday = new Array(7).fill(0)
    for (const c of s.weekdayHour) byWeekday[c.weekday] += c.orders
    const total = byWeekday.reduce((a, b) => a + b, 0)
    if (total >= 20) {
      let busiest = 0
      let weakest = 0
      for (let w = 1; w < 7; w++) {
        if (byWeekday[w] > byWeekday[busiest]) busiest = w
        if (byWeekday[w] < byWeekday[weakest]) weakest = w
      }
      if (busiest !== weakest && byWeekday[busiest] > 0 && byWeekday[weakest] <= 0.4 * byWeekday[busiest]) {
        out.push({
          id: "weekday-gap",
          emoji: "📅",
          title: `${WEEKDAYS_FULL[weakest][0].toUpperCase()}${WEEKDAYS_FULL[weakest].slice(1)} är er svagaste dag`,
          body: `${WEEKDAYS_FULL[weakest]} drar bara ${Math.round((byWeekday[weakest] / byWeekday[busiest]) * 100)} % av ${WEEKDAYS_FULL[busiest]}s beställningar. Testa ett veckodagserbjudande.`,
          impactCents: 0,
          tone: "neutral",
        })
      }
    }
  }

  // Star performer — positive reinforcement, protect what works.
  const stars = s.matrix.filter(m => m.quadrant === "star" && m.quantitySold >= 10)
  if (stars.length > 0) {
    const top = [...stars].sort((a, b) => b.revenueCents - a.revenueCents)[0]
    out.push({
      id: `star-${top.itemId}`,
      emoji: "⭐",
      title: `Stjärnrätt: ${top.name}`,
      body: `Både populär och lönsam (${top.quantitySold}× på ${periodDays} d). Håll kvaliteten jämn och låt den synas — den drar in gäster.`,
      impactCents: 0,
      tone: "positive",
    })
  }

  // Cost data nudge — onboarding hint, lowest priority.
  if (!s.hasCostData && s.totalItemsSold > 0) {
    out.push({
      id: "cost-data",
      emoji: "💰",
      title: "Lås upp riktig marginalanalys",
      body: "Ange matkostnad per rätt i menyn för att se riktig vinst — inte bara intäkter — i teknikmatrisen.",
      impactCents: 0,
      tone: "neutral",
    })
  }

  // Rank by estimated kr impact; quantified actions first, then ties broken so
  // warnings outrank neutral tips, which outrank positive reinforcement.
  const toneOrder: Record<InsightTone, number> = { warning: 0, neutral: 1, positive: 2 }
  return out
    .sort((a, b) => {
      if (b.impactCents !== a.impactCents) return b.impactCents - a.impactCents
      return toneOrder[a.tone] - toneOrder[b.tone]
    })
    .slice(0, 4)
}
