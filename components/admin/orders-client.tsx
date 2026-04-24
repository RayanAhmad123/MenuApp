"use client"
import { useState } from "react"
import { formatPrice, formatDate } from "@/lib/utils"
import { updateOrderStatus, markOrdersPaid } from "@/lib/actions/orders"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { OrderWithItems } from "@/types/database"

const STATUS_OPTIONS = ["all", "pending", "confirmed", "preparing", "ready", "delivered", "cancelled"] as const
const STATUS_LABELS: Record<(typeof STATUS_OPTIONS)[number], string> = {
  all: "Alla",
  pending: "Väntar",
  confirmed: "Bekräftad",
  preparing: "Tillagas",
  ready: "Klar",
  delivered: "Levererad",
  cancelled: "Avbruten",
}

export function OrdersClient({
  orders: initialOrders,
  restaurantId,
}: {
  orders: OrderWithItems[]
  restaurantId: string
}) {
  const [filter, setFilter] = useState<string>("all")
  const [orders, setOrders] = useState(initialOrders)
  const [selected, setSelected] = useState<OrderWithItems | null>(null)
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null)
  const { toast } = useToast()

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter)

  async function handleStatusChange(orderId: string, status: OrderWithItems["status"]) {
    const { error } = await updateOrderStatus(orderId, status)
    if (error) {
      toast({ title: "Kunde inte uppdatera status", variant: "destructive" })
    } else {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
      if (selected?.id === orderId) setSelected(prev => prev ? { ...prev, status } : null)
      toast({ title: "Beställningsstatus uppdaterad" })
    }
  }

  async function confirmCancel() {
    if (!confirmCancelId) return
    const id = confirmCancelId
    setConfirmCancelId(null)
    await handleStatusChange(id, "cancelled")
  }

  async function handleMarkPaid(orderId: string) {
    const { error } = await markOrdersPaid([orderId])
    if (error) {
      toast({ title: "Kunde inte markera som betald", variant: "destructive" })
      return
    }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, payment_status: "paid" } : o))
    if (selected?.id === orderId) setSelected(prev => prev ? { ...prev, payment_status: "paid" } : null)
    toast({ title: "Beställning markerad som betald" })
  }

  return (
    <div className="flex gap-6">
      {/* Orders list */}
      <div className="flex-1 min-w-0">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-1 mb-4">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === s
                  ? "bg-amber-500 text-stone-900"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {STATUS_LABELS[s]}
              {s !== "all" && (
                <span className="ml-1 text-stone-400">
                  ({orders.filter(o => o.status === s).length})
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map(order => (
            <button
              key={order.id}
              onClick={() => setSelected(order)}
              className={`w-full text-left bg-white border rounded-xl p-4 transition-all hover:shadow-sm ${
                selected?.id === order.id
                  ? "border-amber-400 shadow-sm"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-stone-800">Bord {order.table_number}</span>
                  <StatusBadge status={order.status} />
                </div>
                <span className="font-semibold text-stone-800">{formatPrice(order.total_cents)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>{order.order_items.length} {order.order_items.length === 1 ? "rätt" : "rätter"}</span>
                <span>{new Date(order.created_at).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-stone-400">Inga beställningar med denna status.</div>
          )}
        </div>
      </div>

      {/* Order detail */}
      {selected && (
        <div className="w-80 flex-shrink-0">
          <Card className="border-stone-200 sticky top-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg text-stone-800">Bord {selected.table_number}</h2>
                <StatusBadge status={selected.status} />
              </div>
              <p className="text-xs text-stone-500 mb-4">{formatDate(selected.created_at)}</p>

              <div className="space-y-2 mb-4">
                {selected.order_items.map(item => (
                  <div key={item.id} className="flex items-start gap-2">
                    <span className="text-amber-600 font-semibold text-sm">{item.quantity}×</span>
                    <div className="flex-1">
                      <p className="text-sm text-stone-700 font-medium">{item.menu_items.name}</p>
                      {item.order_item_modifiers.length > 0 && (
                        <p className="text-xs text-stone-500">
                          {item.order_item_modifiers.map(m => m.modifiers.name).join(", ")}
                        </p>
                      )}
                      {item.special_requests && (
                        <p className="text-xs text-stone-400 italic">"{item.special_requests}"</p>
                      )}
                    </div>
                    <span className="text-xs text-stone-500">{formatPrice(item.item_price_cents * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {selected.special_notes && (
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-4">
                  <p className="text-xs text-amber-700">Notering: {selected.special_notes}</p>
                </div>
              )}

              <div className="flex justify-between items-center border-t border-stone-100 pt-3 mb-5">
                <span className="text-sm text-stone-500">Totalt</span>
                <span className="font-semibold text-stone-800">{formatPrice(selected.total_cents)}</span>
              </div>

              {/* Status actions */}
              <div className="space-y-2">
                {selected.status === "pending" && (
                  <Button
                    variant="amber"
                    size="sm"
                    className="w-full"
                    onClick={() => handleStatusChange(selected.id, "confirmed")}
                  >
                    Bekräfta beställning
                  </Button>
                )}
                {selected.status === "confirmed" && (
                  <Button
                    variant="amber"
                    size="sm"
                    className="w-full"
                    onClick={() => handleStatusChange(selected.id, "preparing")}
                  >
                    Börja tillaga
                  </Button>
                )}
                {selected.status === "preparing" && (
                  <Button
                    variant="amber"
                    size="sm"
                    className="w-full"
                    onClick={() => handleStatusChange(selected.id, "ready")}
                  >
                    Markera klar
                  </Button>
                )}
                {selected.status === "ready" && (
                  <Button
                    variant="amber"
                    size="sm"
                    className="w-full"
                    onClick={() => handleStatusChange(selected.id, "delivered")}
                  >
                    Markera levererad
                  </Button>
                )}
                {selected.payment_status !== "paid" && selected.status !== "cancelled" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                    onClick={() => handleMarkPaid(selected.id)}
                  >
                    Markera som betald
                  </Button>
                )}
                {!["delivered", "cancelled"].includes(selected.status) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => setConfirmCancelId(selected.id)}
                  >
                    Avbryt beställning
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <AlertDialog open={confirmCancelId !== null} onOpenChange={open => { if (!open) setConfirmCancelId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Avbryt beställning?</AlertDialogTitle>
            <AlertDialogDescription>
              Detta markerar beställningen som avbruten. Åtgärden kan inte ångras.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Nej, behåll</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancel}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Ja, avbryt beställning
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-stone-100 text-stone-600",
    confirmed: "bg-blue-100 text-blue-700",
    preparing: "bg-amber-100 text-amber-700",
    ready: "bg-emerald-100 text-emerald-700",
    delivered: "bg-stone-100 text-stone-400",
    cancelled: "bg-red-100 text-red-600",
  }
  const labels: Record<string, string> = {
    pending: "Väntar",
    confirmed: "Bekräftad",
    preparing: "Tillagas",
    ready: "Klar",
    delivered: "Levererad",
    cancelled: "Avbruten",
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status] ?? styles.pending}`}>
      {labels[status] ?? status}
    </span>
  )
}
