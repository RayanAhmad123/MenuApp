"use client"
import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  TrendingUp, TrendingDown, ShoppingBag, Clock, Users,
  Award, AlertTriangle, Sparkles, Target, ArrowUpRight, Info,
  Lightbulb,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import type { AnalyticsSummary, ItemDeepStat } from "@/lib/actions/analytics"
import { LineChart, BarChart, Heatmap, QuadrantMatrix, Donut, SparklineChart } from "./charts"
import { ItemStatsDrawer } from "./item-stats-drawer"
import { getItemDeepStats } from "@/lib/actions/analytics"

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const WEEKDAYS_ORDERED = [1, 2, 3, 4, 5, 6, 0] // Mon-Sun
const CATEGORY_COLORS = ["#d97706", "#2563eb", "#16a34a", "#dc2626", "#9333ea", "#0891b2", "#ca8a04", "#e11d48"]

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

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl text-stone-800 font-semibold">Analytics</h1>
          <p className="text-stone-500 mt-1">Per-item insights, peak hours, and menu engineering — the smart way to run a menu.</p>
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
              {d === 7 ? "7 days" : d === 30 ? "30 days" : "90 days"}
            </button>
          ))}
        </div>
      </div>

      {/* Insight cards */}
      {insights.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <h3 className="font-semibold text-stone-800 text-sm">Suggested actions</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {insights.map((ins, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="text-lg leading-none mt-0.5">{ins.emoji}</span>
                  <div>
                    <p className="text-stone-800 font-medium">{ins.title}</p>
                    <p className="text-stone-600 text-xs mt-0.5">{ins.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Revenue"
          value={formatPrice(summary.totalRevenueCents)}
          delta={revenueDelta}
          icon={TrendingUp}
          sparkline={revenueSparkline}
          color="#d97706"
        />
        <KPICard
          label="Orders"
          value={String(summary.totalOrders)}
          delta={ordersDelta}
          icon={ShoppingBag}
          sparkline={ordersSparkline}
          color="#2563eb"
        />
        <KPICard
          label="Avg order"
          value={formatPrice(summary.avgOrderCents)}
          icon={Target}
          sub={`${summary.avgItemsPerOrder.toFixed(1)} items / order`}
          color="#16a34a"
        />
        <KPICard
          label="Unique tables"
          value={String(summary.uniqueTables)}
          icon={Users}
          sub={`${(summary.paidRate * 100).toFixed(0)}% paid`}
          color="#9333ea"
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-stone-100 h-auto p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="menu-engineering">Menu Engineering</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="timing">Peak hours</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-6 mt-4">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-stone-200">
              <CardHeader>
                <CardTitle className="text-stone-800 text-lg">Revenue trend</CardTitle>
              </CardHeader>
              <CardContent>
                {summary.totalRevenueCents === 0 ? (
                  <EmptyState message="No paid orders in this range" />
                ) : (
                  <LineChart
                    data={summary.daily.map(d => ({
                      x: 0,
                      y: d.revenueCents,
                      label: new Date(d.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
                      subLabel: formatPrice(d.revenueCents),
                    }))}
                    formatY={n => formatPrice(n)}
                  />
                )}
              </CardContent>
            </Card>

            <Card className="border-stone-200">
              <CardHeader>
                <CardTitle className="text-stone-800 text-lg">Category mix</CardTitle>
              </CardHeader>
              <CardContent>
                {summary.categoryBreakdown.length === 0 || totalCatRevenue === 0 ? (
                  <EmptyState message="No category data yet" />
                ) : (
                  <Donut
                    centerLabel="revenue"
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
                  Top performers
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
                    return <EmptyState message="Add menu items to get started." />
                  }
                  return (
                    <div className="py-6 text-center">
                      <p className="text-stone-500 text-sm">No sales in the last {summary.periodDays} day{summary.periodDays === 1 ? "" : "s"}.</p>
                      <p className="text-stone-400 text-xs mt-1">Top sellers will appear here once guests start ordering.</p>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>

            <Card className="border-stone-200">
              <CardHeader>
                <CardTitle className="text-stone-800 text-lg flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  Needs attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                {summary.bottomItems.length === 0 ? (
                  <EmptyState message="Add menu items to review." />
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
                            {item.quantitySold === 0 ? "No sales" : formatPrice(item.revenueCents)}
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
                  <p className="text-stone-800 font-medium">Using revenue as the profit axis.</p>
                  <p className="text-stone-600 mt-0.5">
                    Set item costs in Menu management to unlock true margin-based menu engineering.
                    Food cost is typically 25–35% of menu price.
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
                    Menu engineering matrix
                  </CardTitle>
                  <p className="text-sm text-stone-500 mt-1">
                    The classic Kasavana–Smith framework: popularity × {summary.hasCostData ? "contribution margin" : "revenue"}.
                  </p>
                </div>
                <div className="text-xs text-stone-500 grid grid-cols-2 gap-x-4 gap-y-1">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-600" /> Star: {quadrantCounts.star ?? 0}</div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-600" /> Plowhorse: {quadrantCounts.plowhorse ?? 0}</div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-600" /> Puzzle: {quadrantCounts.puzzle ?? 0}</div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-600" /> Dog: {quadrantCounts.dog ?? 0}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {summary.matrix.length === 0 ? (
                <EmptyState message="Add menu items and record orders to see the matrix" />
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
                    xAxisLabel="← Slow-sellers          Popularity          Best-sellers →"
                    yAxisLabel={summary.hasCostData ? "Profit →" : "Revenue →"}
                    onPointClick={openItemDrawer}
                  />
                  <div className="grid md:grid-cols-4 gap-3 mt-6 text-sm">
                    <QuadrantGuide
                      color="#16a34a"
                      name="Stars"
                      action="Protect. Feature prominently, keep descriptions sharp, don't discount."
                    />
                    <QuadrantGuide
                      color="#d97706"
                      name="Plowhorses"
                      action="Popular but low profit. Gently raise prices or trim portion sizes."
                    />
                    <QuadrantGuide
                      color="#2563eb"
                      name="Puzzles"
                      action="Profitable but slow. Better photos, reposition higher on menu, bundle."
                    />
                    <QuadrantGuide
                      color="#dc2626"
                      name="Dogs"
                      action="Remove, replace, or reinvent. Low demand and low profit."
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
              <CardTitle className="text-stone-800 text-lg">All items — click any row for deep stats</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-stone-50 text-stone-500 border-y border-stone-100">
                    <tr>
                      <th className="text-left font-medium py-2.5 px-4">Item</th>
                      <th className="text-left font-medium py-2.5 px-4">Category</th>
                      <th className="text-right font-medium py-2.5 px-4">Price</th>
                      <th className="text-right font-medium py-2.5 px-4">Sold</th>
                      <th className="text-right font-medium py-2.5 px-4">Revenue</th>
                      <th className="text-right font-medium py-2.5 px-4">Margin</th>
                      <th className="text-right font-medium py-2.5 px-4">Orders</th>
                      <th className="text-center font-medium py-2.5 px-4">Grade</th>
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
                {summary.items.length === 0 && <EmptyState message="No menu items yet" />}
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
                  Orders by hour
                </CardTitle>
              </CardHeader>
              <CardContent>
                {peakHour && peakHour.orders > 0 && (
                  <div className="mb-3 flex items-center gap-3 flex-wrap text-sm">
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      Peak: {formatHour(peakHour.hour)} — {peakHour.orders} orders
                    </Badge>
                    {quietHour.orders > 0 && quietHour.hour !== peakHour.hour && (
                      <Badge variant="secondary" className="bg-stone-100 text-stone-600">
                        Quietest: {formatHour(quietHour.hour)}
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
                  Weekday × hour heatmap
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
                  Darker = more orders. Use this to schedule staff and push happy-hour offers during quiet cells.
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
              {Math.abs(delta).toFixed(0)}% vs previous
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
  return <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${styles[quadrant]}`}>{quadrant}</span>
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-12 text-center text-stone-400 text-sm">{message}</div>
  )
}

function formatHour(h: number) {
  return `${String(h).padStart(2, "0")}:00`
}

// Lightweight insights engine — data-driven, not ML.
function buildInsights(s: AnalyticsSummary): Array<{ emoji: string; title: string; body: string }> {
  const out: Array<{ emoji: string; title: string; body: string }> = []

  // Unsold items
  const unsold = s.items.filter(i => i.quantitySold === 0)
  if (unsold.length > 0 && s.totalItemsSold > 0) {
    out.push({
      emoji: "🗑️",
      title: `${unsold.length} item${unsold.length > 1 ? "s" : ""} had zero sales`,
      body: `Consider removing or rewriting descriptions for: ${unsold.slice(0, 3).map(i => i.name).join(", ")}${unsold.length > 3 ? "…" : ""}`,
    })
  }

  // Plowhorses → price-raise candidates
  const plowhorses = s.matrix.filter(m => m.quadrant === "plowhorse" && m.quantitySold > 0)
  if (plowhorses.length > 0) {
    const top = plowhorses.sort((a, b) => b.quantitySold - a.quantitySold)[0]
    out.push({
      emoji: "📈",
      title: `Price-raise candidate: ${top.name}`,
      body: `Sells well (${top.quantitySold}× in ${s.periodDays}d) but profit-thin. A 5–8% price nudge rarely dents volume.`,
    })
  }

  // Puzzles → visibility candidates
  const puzzles = s.matrix.filter(m => m.quadrant === "puzzle" && m.quantitySold > 0)
  if (puzzles.length > 0) {
    const top = puzzles.sort((a, b) => b.revenueCents - a.revenueCents)[0]
    out.push({
      emoji: "🧩",
      title: `Hidden gem: ${top.name}`,
      body: `High profit, low demand. Move it up the menu, add a photo, or tag as "Chef's pick".`,
    })
  }

  // Dead hour slot
  const hoursWithAny = s.hourly.filter(h => h.orders > 0)
  if (hoursWithAny.length >= 3) {
    const sorted = [...hoursWithAny].sort((a, b) => b.orders - a.orders)
    const peak = sorted[0]
    const quiet = sorted[sorted.length - 1]
    if (peak.orders >= 3 * quiet.orders) {
      out.push({
        emoji: "⏰",
        title: `Run a happy hour at ${formatHour(quiet.hour)}`,
        body: `${formatHour(peak.hour)} does ${Math.round(peak.orders / quiet.orders)}× more orders. Target the gap with a limited-time offer.`,
      })
    }
  }

  // Cancellation warning
  if (s.cancelRate > 0.1) {
    out.push({
      emoji: "⚠️",
      title: `${(s.cancelRate * 100).toFixed(0)}% of orders cancelled`,
      body: `That's above 10%. Check KDS wait times, payment failures, and out-of-stock items.`,
    })
  }

  // Cost data nudge
  if (!s.hasCostData && s.totalItemsSold > 0) {
    out.push({
      emoji: "💰",
      title: "Unlock true margin analytics",
      body: "Add food cost per item in Menu to see real profit — not just revenue — in the engineering matrix.",
    })
  }

  return out.slice(0, 4)
}
