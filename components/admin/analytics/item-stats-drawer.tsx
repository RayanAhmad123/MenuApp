"use client"
import Image from "next/image"
import { X, TrendingUp, ShoppingBag, Award, Link2, Receipt, Percent, Inbox } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { formatPrice } from "@/lib/utils"
import type { ItemDeepStat } from "@/lib/actions/analytics"
import { LineChart, BarChart } from "./charts"

interface Props {
  open: boolean
  loading: boolean
  detail: ItemDeepStat | null
  hasCostData: boolean
  onClose: () => void
}

export function ItemStatsDrawer({ open, loading, detail, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {loading && (
          <div className="p-16 text-center text-stone-400">Loading item insights…</div>
        )}

        {!loading && !detail && (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3">
              <Inbox className="h-5 w-5 text-stone-400" />
            </div>
            <h3 className="font-semibold text-stone-800 text-base">No stats available yet</h3>
            <p className="text-stone-500 text-sm mt-1">
              Once this item is ordered, you'll see units sold, revenue, margin, peak hours and attach rates here.
            </p>
          </div>
        )}

        {!loading && detail && (
          <>
            {/* Header */}
            <div className="p-6 border-b border-stone-100 flex items-start gap-4">
              {detail.imageUrl ? (
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={detail.imageUrl} alt={detail.name} width={80} height={80} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-stone-100 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-stone-500 uppercase tracking-wide">{detail.categoryName ?? "Uncategorized"}</p>
                <h2 className="font-serif text-2xl font-semibold text-stone-800 mt-0.5">{detail.name}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
                  <span>{formatPrice(detail.priceCents)}</span>
                  {detail.costCents !== null && (
                    <span>Food cost: {formatPrice(detail.costCents)}</span>
                  )}
                  {detail.rank > 0 && (
                    <span className="flex items-center gap-1">
                      <Award className="h-3.5 w-3.5" />
                      Rank {detail.rank} of {detail.totalItems || "—"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* KPIs */}
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatBox
                label="Units sold"
                value={String(detail.quantitySold)}
                icon={ShoppingBag}
              />
              <StatBox
                label="Revenue"
                value={formatPrice(detail.revenueCents)}
                icon={Receipt}
                sub={`${(detail.shareOfRevenue * 100).toFixed(1)}% of total`}
              />
              <StatBox
                label="Margin"
                value={detail.marginCents === null ? "—" : formatPrice(detail.marginCents)}
                icon={TrendingUp}
                sub={
                  detail.marginCents !== null && detail.revenueCents > 0
                    ? `${((detail.marginCents / detail.revenueCents) * 100).toFixed(0)}% GP`
                    : "Set cost to see margin"
                }
              />
              <StatBox
                label="Order attach"
                value={`${(detail.shareOfOrders * 100).toFixed(0)}%`}
                icon={Percent}
                sub={`In ${detail.ordersContaining} orders`}
              />
            </div>

            {/* Daily trend */}
            <div className="px-6 pb-6">
              <h3 className="font-semibold text-stone-800 text-sm mb-3">Units sold per day</h3>
              {detail.quantitySold === 0 ? (
                <div className="py-8 text-center text-stone-400 text-sm">No sales in this period yet.</div>
              ) : (
                <LineChart
                  height={180}
                  color="#d97706"
                  data={detail.daily.map(d => ({
                    x: 0,
                    y: d.orders,
                    label: new Date(d.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
                    subLabel: `${d.orders} sold`,
                  }))}
                />
              )}
            </div>

            {/* Hourly pattern */}
            {detail.quantitySold > 0 && (
              <div className="px-6 pb-6">
                <h3 className="font-semibold text-stone-800 text-sm mb-3">When customers order this</h3>
                <BarChart
                  height={160}
                  data={detail.hourly.map(h => ({
                    label: h.hour % 3 === 0 ? `${h.hour}` : "",
                    value: h.orders,
                  }))}
                />
              </div>
            )}

            {/* Attach pairs */}
            {detail.attachPairs.length > 0 && (
              <div className="px-6 pb-6">
                <h3 className="font-semibold text-stone-800 text-sm mb-3 flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-amber-600" />
                  Frequently bought with
                </h3>
                <div className="space-y-1.5">
                  {detail.attachPairs.map(pair => (
                    <div key={pair.itemId} className="flex items-center justify-between bg-stone-50 rounded-lg px-3 py-2">
                      <span className="text-sm text-stone-800">{pair.name}</span>
                      <div className="flex items-center gap-3 text-xs text-stone-500">
                        <span>{pair.coOccurrences}× together</span>
                        <span className="font-semibold text-amber-700">
                          {(pair.attachRate * 100).toFixed(0)}% attach
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-stone-400 mt-2">
                  Use this to craft combos or upsell prompts: "Customers who ordered {detail.name} often also ordered these."
                </p>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function StatBox({
  label, value, icon: Icon, sub,
}: {
  label: string; value: string; sub?: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="border border-stone-200 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-stone-500 font-medium">{label}</p>
        <Icon className="h-3.5 w-3.5 text-stone-400" />
      </div>
      <p className="text-xl font-semibold text-stone-800">{value}</p>
      {sub && <p className="text-xs text-stone-500 mt-0.5">{sub}</p>}
    </div>
  )
}
