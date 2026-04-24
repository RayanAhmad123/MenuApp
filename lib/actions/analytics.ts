"use server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export type ItemStat = {
  itemId: string
  name: string
  categoryId: string | null
  categoryName: string | null
  imageUrl: string | null
  priceCents: number
  costCents: number | null
  quantitySold: number
  revenueCents: number
  marginCents: number | null // null if cost not set
  ordersContaining: number
  lastOrderedAt: string | null
}

export type HourlyBucket = { hour: number; orders: number; revenueCents: number }
export type DailyBucket = { date: string; orders: number; revenueCents: number }
export type WeekdayHourCell = { weekday: number; hour: number; orders: number }
export type CategoryStat = { categoryId: string; name: string; quantitySold: number; revenueCents: number }
export type AttachPair = { itemId: string; name: string; coOccurrences: number; attachRate: number }
export type MatrixQuadrant = "star" | "plowhorse" | "puzzle" | "dog"

export type ItemMatrixPoint = ItemStat & {
  popularityScore: number // 0-1, qty sold vs max
  profitScore: number // 0-1, margin (or revenue fallback) vs max
  quadrant: MatrixQuadrant
}

export type AnalyticsSummary = {
  periodDays: number
  totalOrders: number
  paidOrders: number
  totalRevenueCents: number
  totalItemsSold: number
  avgOrderCents: number
  avgItemsPerOrder: number
  uniqueTables: number
  completionRate: number // delivered / (delivered + cancelled)
  cancelRate: number
  paidRate: number
  daily: DailyBucket[]
  hourly: HourlyBucket[]
  weekdayHour: WeekdayHourCell[]
  categoryBreakdown: CategoryStat[]
  items: ItemStat[]
  matrix: ItemMatrixPoint[]
  topItems: ItemStat[]
  bottomItems: ItemStat[]
  hasCostData: boolean
}

export type ItemDeepStat = ItemStat & {
  daily: DailyBucket[]
  hourly: HourlyBucket[]
  attachPairs: AttachPair[]
  shareOfOrders: number // fraction of orders in range containing this item
  shareOfRevenue: number
  rank: number // 1-based popularity rank
  totalItems: number
}

type OrderRow = {
  id: string
  created_at: string
  table_number: number
  status: string
  payment_status: string
  total_cents: number
}

type OrderItemRow = {
  order_id: string
  menu_item_id: string
  quantity: number
  item_price_cents: number
  menu_items: {
    id: string
    name: string
    category_id: string | null
    image_url: string | null
    price_cents: number
    cost_cents: number | null
    categories: { id: string; name: string } | null
  } | null
}

function sinceISO(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

function toLocalDateKey(iso: string) {
  const d = new Date(iso)
  return d.toISOString().slice(0, 10)
}

function classify(popularity: number, profit: number): MatrixQuadrant {
  const popHigh = popularity >= 0.5
  const profHigh = profit >= 0.5
  if (popHigh && profHigh) return "star"
  if (popHigh && !profHigh) return "plowhorse"
  if (!popHigh && profHigh) return "puzzle"
  return "dog"
}

async function fetchOrdersAndItems(restaurantId: string, days: number) {
  const supabase = await createServerSupabaseClient()
  const since = sinceISO(days)

  const { data: ordersData } = await supabase
    .from("orders")
    .select("id, created_at, table_number, status, payment_status, total_cents")
    .eq("restaurant_id", restaurantId)
    .gte("created_at", since)
    .neq("status", "cancelled")

  const orders = (ordersData ?? []) as OrderRow[]
  const orderIds = orders.map(o => o.id)

  let items: OrderItemRow[] = []
  if (orderIds.length > 0) {
    const { data: itemsData } = await supabase
      .from("order_items")
      .select(`
        order_id, menu_item_id, quantity, item_price_cents,
        menu_items (
          id, name, category_id, image_url, price_cents, cost_cents,
          categories ( id, name )
        )
      `)
      .in("order_id", orderIds)
    items = (itemsData ?? []) as unknown as OrderItemRow[]
  }

  return { orders, items, since }
}

export async function getAnalyticsSummary(
  restaurantId: string,
  days: number = 30
): Promise<AnalyticsSummary> {
  const { orders, items } = await fetchOrdersAndItems(restaurantId, days)

  // Also fetch cancelled orders for cancel-rate
  const supabase = await createServerSupabaseClient()
  const { count: cancelledCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurantId)
    .eq("status", "cancelled")
    .gte("created_at", sinceISO(days))

  const totalOrders = orders.length
  const paidOrders = orders.filter(o => o.payment_status === "paid").length
  const totalRevenueCents = orders
    .filter(o => o.payment_status === "paid")
    .reduce((s, o) => s + o.total_cents, 0)
  const totalItemsSold = items.reduce((s, i) => s + i.quantity, 0)
  const avgOrderCents = totalOrders > 0
    ? Math.round(orders.reduce((s, o) => s + o.total_cents, 0) / totalOrders)
    : 0
  const avgItemsPerOrder = totalOrders > 0 ? totalItemsSold / totalOrders : 0
  const uniqueTables = new Set(orders.map(o => o.table_number)).size
  const deliveredCount = orders.filter(o => o.status === "delivered").length
  const cancelTotal = cancelledCount ?? 0
  const completionBase = deliveredCount + cancelTotal
  const completionRate = completionBase > 0 ? deliveredCount / completionBase : 1
  const cancelRate = totalOrders + cancelTotal > 0 ? cancelTotal / (totalOrders + cancelTotal) : 0
  const paidRate = totalOrders > 0 ? paidOrders / totalOrders : 0

  // Daily buckets
  const dailyMap = new Map<string, DailyBucket>()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    dailyMap.set(key, { date: key, orders: 0, revenueCents: 0 })
  }
  for (const o of orders) {
    const key = toLocalDateKey(o.created_at)
    const bucket = dailyMap.get(key)
    if (bucket) {
      bucket.orders++
      if (o.payment_status === "paid") bucket.revenueCents += o.total_cents
    }
  }
  const daily = Array.from(dailyMap.values())

  // Hourly buckets (aggregate across all days)
  const hourly: HourlyBucket[] = Array.from({ length: 24 }, (_, h) => ({ hour: h, orders: 0, revenueCents: 0 }))
  for (const o of orders) {
    const h = new Date(o.created_at).getHours()
    hourly[h].orders++
    if (o.payment_status === "paid") hourly[h].revenueCents += o.total_cents
  }

  // Weekday × hour heatmap cells
  const weekdayHour: WeekdayHourCell[] = []
  for (let w = 0; w < 7; w++) for (let h = 0; h < 24; h++) weekdayHour.push({ weekday: w, hour: h, orders: 0 })
  for (const o of orders) {
    const d = new Date(o.created_at)
    const cell = weekdayHour.find(c => c.weekday === d.getDay() && c.hour === d.getHours())
    if (cell) cell.orders++
  }

  // Item stats
  const itemMap = new Map<string, ItemStat & { ordersSet: Set<string> }>()
  for (const row of items) {
    if (!row.menu_items) continue
    const mi = row.menu_items
    const existing = itemMap.get(mi.id)
    if (existing) {
      existing.quantitySold += row.quantity
      existing.revenueCents += row.item_price_cents * row.quantity
      if (mi.cost_cents !== null) {
        existing.marginCents = (existing.marginCents ?? 0) + (row.item_price_cents - mi.cost_cents) * row.quantity
      }
      existing.ordersSet.add(row.order_id)
      const order = orders.find(o => o.id === row.order_id)
      if (order && (!existing.lastOrderedAt || order.created_at > existing.lastOrderedAt)) {
        existing.lastOrderedAt = order.created_at
      }
    } else {
      const order = orders.find(o => o.id === row.order_id)
      itemMap.set(mi.id, {
        itemId: mi.id,
        name: mi.name,
        categoryId: mi.category_id,
        categoryName: mi.categories?.name ?? null,
        imageUrl: mi.image_url,
        priceCents: mi.price_cents,
        costCents: mi.cost_cents,
        quantitySold: row.quantity,
        revenueCents: row.item_price_cents * row.quantity,
        marginCents: mi.cost_cents !== null ? (row.item_price_cents - mi.cost_cents) * row.quantity : null,
        ordersContaining: 0,
        ordersSet: new Set([row.order_id]),
        lastOrderedAt: order?.created_at ?? null,
      })
    }
  }

  const itemStats: ItemStat[] = Array.from(itemMap.values()).map(({ ordersSet, ...s }) => ({
    ...s,
    ordersContaining: ordersSet.size,
  }))

  // Include items with zero sales too — fetch all menu items
  const { data: allMenuItems } = await supabase
    .from("menu_items")
    .select("id, name, category_id, image_url, price_cents, cost_cents, categories ( id, name )")
    .eq("restaurant_id", restaurantId)

  const seen = new Set(itemStats.map(s => s.itemId))
  for (const mi of (allMenuItems ?? []) as unknown as Array<{
    id: string; name: string; category_id: string | null; image_url: string | null;
    price_cents: number; cost_cents: number | null;
    categories: { id: string; name: string } | null;
  }>) {
    if (!seen.has(mi.id)) {
      itemStats.push({
        itemId: mi.id,
        name: mi.name,
        categoryId: mi.category_id,
        categoryName: mi.categories?.name ?? null,
        imageUrl: mi.image_url,
        priceCents: mi.price_cents,
        costCents: mi.cost_cents,
        quantitySold: 0,
        revenueCents: 0,
        marginCents: mi.cost_cents !== null ? 0 : null,
        ordersContaining: 0,
        lastOrderedAt: null,
      })
    }
  }

  // Category breakdown
  const catMap = new Map<string, CategoryStat>()
  for (const s of itemStats) {
    if (!s.categoryId) continue
    const k = s.categoryId
    const existing = catMap.get(k)
    if (existing) {
      existing.quantitySold += s.quantitySold
      existing.revenueCents += s.revenueCents
    } else {
      catMap.set(k, {
        categoryId: s.categoryId,
        name: s.categoryName ?? "Uncategorized",
        quantitySold: s.quantitySold,
        revenueCents: s.revenueCents,
      })
    }
  }
  const categoryBreakdown = Array.from(catMap.values()).sort((a, b) => b.revenueCents - a.revenueCents)

  // Menu engineering matrix
  const hasCostData = itemStats.some(s => s.costCents !== null)
  const maxQty = Math.max(1, ...itemStats.map(s => s.quantitySold))
  const maxProfit = hasCostData
    ? Math.max(1, ...itemStats.map(s => (s.marginCents !== null ? s.marginCents : 0)))
    : Math.max(1, ...itemStats.map(s => s.revenueCents))

  const matrix: ItemMatrixPoint[] = itemStats
    .filter(s => s.quantitySold > 0 || true) // include zeros for visibility
    .map(s => {
      const popularityScore = s.quantitySold / maxQty
      const profitValue = hasCostData ? (s.marginCents ?? 0) : s.revenueCents
      const profitScore = profitValue / maxProfit
      return {
        ...s,
        popularityScore,
        profitScore,
        quadrant: classify(popularityScore, profitScore),
      }
    })

  const topItems = [...itemStats].sort((a, b) => b.quantitySold - a.quantitySold).slice(0, 10)
  // "Needs attention": zero-sold items come first (they're the most actionable),
  // then the slowest-selling items. This surfaces real problem items even on
  // restaurants with little or no sales activity yet.
  const bottomItems = [...itemStats]
    .sort((a, b) => {
      if (a.quantitySold === 0 && b.quantitySold !== 0) return -1
      if (b.quantitySold === 0 && a.quantitySold !== 0) return 1
      return a.quantitySold - b.quantitySold
    })
    .slice(0, 5)

  return {
    periodDays: days,
    totalOrders,
    paidOrders,
    totalRevenueCents,
    totalItemsSold,
    avgOrderCents,
    avgItemsPerOrder,
    uniqueTables,
    completionRate,
    cancelRate,
    paidRate,
    daily,
    hourly,
    weekdayHour,
    categoryBreakdown,
    items: itemStats,
    matrix,
    topItems,
    bottomItems,
    hasCostData,
  }
}

export async function getItemDeepStats(
  restaurantId: string,
  menuItemId: string,
  days: number = 30
): Promise<ItemDeepStat | null> {
  const { orders, items } = await fetchOrdersAndItems(restaurantId, days)
  const rows = items.filter(i => i.menu_item_id === menuItemId)
  const mi = rows[0]?.menu_items
  const supabase = await createServerSupabaseClient()

  // Fallback: fetch menu item metadata directly if no sales in range.
  // Use maybeSingle so zero-row results don't log an error; split the category
  // lookup into a separate query to avoid nested-relation edge cases.
  let menuItemMeta: OrderItemRow["menu_items"] | null = mi ?? null
  if (!menuItemMeta) {
    const { data: miData } = await supabase
      .from("menu_items")
      .select("id, name, category_id, image_url, price_cents, cost_cents")
      .eq("id", menuItemId)
      .maybeSingle()
    if (miData) {
      let category: { id: string; name: string } | null = null
      if (miData.category_id) {
        const { data: catData } = await supabase
          .from("categories")
          .select("id, name")
          .eq("id", miData.category_id)
          .maybeSingle()
        if (catData) category = catData
      }
      menuItemMeta = {
        id: miData.id,
        name: miData.name,
        category_id: miData.category_id,
        image_url: miData.image_url,
        price_cents: miData.price_cents,
        cost_cents: miData.cost_cents,
        categories: category,
      }
    }
  }
  if (!menuItemMeta) return null

  const quantitySold = rows.reduce((s, r) => s + r.quantity, 0)
  const revenueCents = rows.reduce((s, r) => s + r.item_price_cents * r.quantity, 0)
  const marginCents = menuItemMeta.cost_cents !== null
    ? rows.reduce((s, r) => s + (r.item_price_cents - (menuItemMeta!.cost_cents ?? 0)) * r.quantity, 0)
    : null

  // Daily & hourly for this item
  const dailyMap = new Map<string, DailyBucket>()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    dailyMap.set(key, { date: key, orders: 0, revenueCents: 0 })
  }
  const hourly: HourlyBucket[] = Array.from({ length: 24 }, (_, h) => ({ hour: h, orders: 0, revenueCents: 0 }))
  const ordersContaining = new Set<string>()
  let lastOrderedAt: string | null = null

  for (const r of rows) {
    const order = orders.find(o => o.id === r.order_id)
    if (!order) continue
    ordersContaining.add(r.order_id)
    if (!lastOrderedAt || order.created_at > lastOrderedAt) lastOrderedAt = order.created_at
    const key = toLocalDateKey(order.created_at)
    const bucket = dailyMap.get(key)
    if (bucket) {
      bucket.orders += r.quantity
      bucket.revenueCents += r.item_price_cents * r.quantity
    }
    const h = new Date(order.created_at).getHours()
    hourly[h].orders += r.quantity
    hourly[h].revenueCents += r.item_price_cents * r.quantity
  }

  // Attach pairs: other items in same orders
  const attachMap = new Map<string, { name: string; count: number }>()
  Array.from(ordersContaining).forEach(orderId => {
    const others = items.filter(i => i.order_id === orderId && i.menu_item_id !== menuItemId)
    for (const other of others) {
      if (!other.menu_items) continue
      const existing = attachMap.get(other.menu_items.id)
      if (existing) existing.count += other.quantity
      else attachMap.set(other.menu_items.id, { name: other.menu_items.name, count: other.quantity })
    }
  })
  const attachPairs: AttachPair[] = Array.from(attachMap.entries())
    .map(([itemId, v]) => ({
      itemId,
      name: v.name,
      coOccurrences: v.count,
      attachRate: ordersContaining.size > 0 ? v.count / ordersContaining.size : 0,
    }))
    .sort((a, b) => b.coOccurrences - a.coOccurrences)
    .slice(0, 5)

  // Rank
  const allItemQuantities = new Map<string, number>()
  for (const r of items) {
    if (!r.menu_items) continue
    allItemQuantities.set(r.menu_items.id, (allItemQuantities.get(r.menu_items.id) ?? 0) + r.quantity)
  }
  const sortedByQty = Array.from(allItemQuantities.entries()).sort((a, b) => b[1] - a[1])
  const rank = sortedByQty.findIndex(([id]) => id === menuItemId) + 1

  const totalOrdersInRange = orders.length
  const totalRevenueInRange = orders
    .filter(o => o.payment_status === "paid")
    .reduce((s, o) => s + o.total_cents, 0)

  return {
    itemId: menuItemMeta.id,
    name: menuItemMeta.name,
    categoryId: menuItemMeta.category_id,
    categoryName: menuItemMeta.categories?.name ?? null,
    imageUrl: menuItemMeta.image_url,
    priceCents: menuItemMeta.price_cents,
    costCents: menuItemMeta.cost_cents,
    quantitySold,
    revenueCents,
    marginCents,
    ordersContaining: ordersContaining.size,
    lastOrderedAt,
    daily: Array.from(dailyMap.values()),
    hourly,
    attachPairs,
    shareOfOrders: totalOrdersInRange > 0 ? ordersContaining.size / totalOrdersInRange : 0,
    shareOfRevenue: totalRevenueInRange > 0 ? revenueCents / totalRevenueInRange : 0,
    rank: rank || sortedByQty.length + 1,
    totalItems: allItemQuantities.size,
  }
}

export async function getItemStatsMap(
  restaurantId: string,
  days: number = 30
): Promise<Record<string, { quantitySold: number; revenueCents: number; ordersContaining: number }>> {
  const { items } = await fetchOrdersAndItems(restaurantId, days)
  const map: Record<string, { quantitySold: number; revenueCents: number; ordersContaining: Set<string> }> = {}
  for (const r of items) {
    if (!r.menu_items) continue
    const k = r.menu_items.id
    if (!map[k]) map[k] = { quantitySold: 0, revenueCents: 0, ordersContaining: new Set() }
    map[k].quantitySold += r.quantity
    map[k].revenueCents += r.item_price_cents * r.quantity
    map[k].ordersContaining.add(r.order_id)
  }
  const result: Record<string, { quantitySold: number; revenueCents: number; ordersContaining: number }> = {}
  for (const [k, v] of Object.entries(map)) {
    result[k] = { quantitySold: v.quantitySold, revenueCents: v.revenueCents, ordersContaining: v.ordersContaining.size }
  }
  return result
}

export async function updateItemCost(itemId: string, costCents: number | null) {
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from("menu_items")
    .update({ cost_cents: costCents })
    .eq("id", itemId)
  return { error: error?.message ?? null }
}
