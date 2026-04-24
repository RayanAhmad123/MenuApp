"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Bell, Leaf, Heart, UtensilsCrossed, ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import { createTablePing } from "@/lib/actions/orders"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { Category, MenuItem } from "@/types/database"

interface MenuItemWithDetails extends MenuItem {
  item_allergens: Array<{ allergen_id: string; allergens: { id: string; name: string } | null }>
  item_modifier_groups: Array<{
    modifier_group_id: string
    modifier_groups: {
      id: string; name: string; is_required: boolean; allow_multiple: boolean
      modifiers: Array<{ id: string; name: string; price_adjustment_cents: number }>
    } | null
  }>
}

interface Props {
  restaurant: { id: string; name: string; logo_url: string | null; address: string | null }
  subdomain: string
  categories: Category[]
  menuItems: MenuItemWithDetails[]
  tableNumber: number
}

export function CustomerMenuClient({ restaurant, subdomain, categories, menuItems, tableNumber }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id ?? "")
  const [selectedItem, setSelectedItem] = useState<MenuItemWithDetails | null>(null)
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null)
  const { items, addItem, itemCount } = useCart()
  const { toast } = useToast()

  const filteredItems = menuItems.filter(item => item.category_id === activeCategory)
  const storageKey = `menuapp-active-order-${subdomain}-${tableNumber}`

  // Restore the active order link if the guest re-enters the menu.
  useEffect(() => {
    const stored = (() => {
      try { return localStorage.getItem(storageKey) } catch { return null }
    })()
    if (!stored) return

    const supabase = createClient()
    supabase
      .from("orders")
      .select("id, status")
      .eq("id", stored)
      .maybeSingle()
      .then(({ data }) => {
        if (!data || data.status === "delivered" || data.status === "cancelled") {
          try { localStorage.removeItem(storageKey) } catch { /* ignore */ }
          return
        }
        setActiveOrderId(data.id)
      })
  }, [storageKey])

  function dismissActiveOrder() {
    setActiveOrderId(null)
    try { localStorage.removeItem(storageKey) } catch { /* ignore */ }
  }

  async function handlePingWaiter() {
    const { error } = await createTablePing(restaurant.id, tableNumber, "assistance")
    if (error) {
      toast({ title: "Kunde inte tillkalla servitör", variant: "destructive" })
    } else {
      toast({ title: "Servitör tillkallad", description: "Någon kommer strax." })
    }
  }

  return (
    <div className="menu-page min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {restaurant.logo_url && (
              <Image
                src={restaurant.logo_url}
                alt={restaurant.name}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            )}
            <div>
              <h1 className="font-serif text-xl text-stone-50 font-semibold">{restaurant.name}</h1>
              <p className="text-xs text-stone-400">Bord {tableNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePingWaiter}
              className="text-amber-400 hover:text-amber-300 hover:bg-stone-800"
            >
              <Bell className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Servitör</span>
            </Button>
            <Link href={`/${subdomain}/table/${tableNumber}/cart`}>
              <Button
                variant="amber"
                size="sm"
                className="relative"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Varukorg
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-stone-900 text-amber-400 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold border border-amber-500">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Category tabs */}
      <div className="sticky top-[73px] z-30 bg-stone-950/90 backdrop-blur-md border-b border-stone-800">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat.id
                    ? "bg-amber-500 text-stone-900"
                    : "text-stone-400 hover:text-stone-200 hover:bg-stone-800"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active order banner */}
      {activeOrderId && (
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <div className="flex items-center gap-3 bg-amber-950/60 border border-amber-800 rounded-xl px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-amber-200">Du har en aktiv beställning</p>
              <p className="text-xs text-amber-400/70">Följ status i realtid.</p>
            </div>
            <Link
              href={`/${subdomain}/table/${tableNumber}/order/${activeOrderId}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 text-stone-900 text-sm font-semibold hover:bg-amber-400 transition-colors"
            >
              Visa
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={dismissActiveOrder}
              aria-label="Dölj"
              className="text-amber-400/60 hover:text-amber-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Menu items grid */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-3">
          {filteredItems.map(item => (
            <MenuItemCard
              key={item.id}
              item={item}
              onSelect={() => setSelectedItem(item)}
            />
          ))}
        </div>
        {filteredItems.length === 0 && (
          <p className="text-center text-stone-500 py-12 font-serif italic">
            Inga rätter tillgängliga i denna kategori.
          </p>
        )}
      </main>

      {/* Item detail modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={(cartItem) => {
            addItem(cartItem)
            setSelectedItem(null)
            toast({ title: `${selectedItem.name} lagd i varukorgen` })
          }}
        />
      )}

      {/* Floating cart bar */}
      {itemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <Link href={`/${subdomain}/table/${tableNumber}/cart`}>
            <Button variant="amber" size="xl" className="shadow-2xl shadow-amber-900/50 px-8">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Visa varukorg · {itemCount} {itemCount === 1 ? "rätt" : "rätter"}
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

function MenuItemCard({ item, onSelect }: { item: MenuItemWithDetails; onSelect: () => void }) {
  const hasDietary = item.is_vegan || (item.is_vegetarian && !item.is_vegan) || item.is_gluten_free
  return (
    <button
      onClick={onSelect}
      className="w-full text-left bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden hover:border-amber-700/50 transition-all duration-200 hover:shadow-lg hover:shadow-amber-900/20 group flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-stone-800">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UtensilsCrossed className="h-8 w-8 text-stone-700" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-stone-50 font-medium text-sm leading-tight group-hover:text-amber-300 transition-colors line-clamp-2 flex-1">
            {item.name}
          </h3>
          <span className="flex-shrink-0 font-semibold text-amber-400 text-sm">
            {formatPrice(item.price_cents)}
          </span>
        </div>
        {item.description && (
          <p className="text-xs text-stone-400 leading-snug line-clamp-2">
            {item.description}
          </p>
        )}
        {hasDietary && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {item.is_vegan && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                <Leaf className="h-2.5 w-2.5" />
                Vegansk
              </span>
            )}
            {item.is_vegetarian && !item.is_vegan && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-green-950 text-green-400 border border-green-800">
                <Heart className="h-2.5 w-2.5" />
                Vegetarisk
              </span>
            )}
            {item.is_gluten_free && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 leading-none">
                Glutenfritt
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  )
}

function ItemDetailModal({
  item,
  onClose,
  onAddToCart,
}: {
  item: MenuItemWithDetails
  onClose: () => void
  onAddToCart: (cartItem: Parameters<ReturnType<typeof useCart>["addItem"]>[0]) => void
}) {
  const [quantity, setQuantity] = useState(1)
  const [selectedModifiers, setSelectedModifiers] = useState<
    Array<{ modifierId: string; modifierName: string; priceAdjustmentCents: number }>
  >([])
  const [specialRequests, setSpecialRequests] = useState("")

  const modifierGroups = item.item_modifier_groups
    .map(img => img.modifier_groups)
    .filter(Boolean)

  const selectedModTotal = selectedModifiers.reduce((s, m) => s + m.priceAdjustmentCents, 0)
  const totalPerItem = item.price_cents + selectedModTotal

  function toggleModifier(
    groupId: string,
    allowMultiple: boolean,
    mod: { id: string; name: string; price_adjustment_cents: number }
  ) {
    if (allowMultiple) {
      const exists = selectedModifiers.find(m => m.modifierId === mod.id)
      if (exists) {
        setSelectedModifiers(prev => prev.filter(m => m.modifierId !== mod.id))
      } else {
        setSelectedModifiers(prev => [
          ...prev,
          { modifierId: mod.id, modifierName: mod.name, priceAdjustmentCents: mod.price_adjustment_cents },
        ])
      }
    } else {
      // Single select — remove others from same group
      const groupModIds = modifierGroups
        .find(g => g?.id === groupId)
        ?.modifiers.map(m => m.id) ?? []
      const exists = selectedModifiers.find(m => m.modifierId === mod.id)
      if (exists) {
        setSelectedModifiers(prev => prev.filter(m => m.modifierId !== mod.id))
      } else {
        setSelectedModifiers(prev => [
          ...prev.filter(m => !groupModIds.includes(m.modifierId)),
          { modifierId: mod.id, modifierName: mod.name, priceAdjustmentCents: mod.price_adjustment_cents },
        ])
      }
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-stone-900 border-stone-700 text-stone-50 max-h-[90vh] overflow-y-auto p-0" onOpenAutoFocus={e => e.preventDefault()}>
        {item.image_url && (
          <div className="w-full h-48 relative">
            <Image src={item.image_url} alt={item.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent" />
          </div>
        )}
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-stone-50 text-2xl">{item.name}</DialogTitle>
            <p className="text-amber-400 font-semibold text-lg">{formatPrice(item.price_cents)}</p>
          </DialogHeader>

          {item.description && (
            <p className="text-stone-400 mt-3 text-sm leading-relaxed">{item.description}</p>
          )}

          {/* Dietary badges */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {item.is_vegan && <Badge className="bg-emerald-950 text-emerald-400 border-emerald-800">Vegansk</Badge>}
            {item.is_vegetarian && !item.is_vegan && <Badge className="bg-green-950 text-green-400 border-green-800">Vegetarisk</Badge>}
            {item.is_gluten_free && <Badge className="bg-amber-950 text-amber-400 border-amber-800">Glutenfritt</Badge>}
          </div>

          {/* Allergens */}
          {item.item_allergens.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-stone-500 uppercase tracking-wider mb-2">Innehåller</p>
              <div className="flex flex-wrap gap-1">
                {item.item_allergens.map(ia =>
                  ia.allergens ? (
                    <span key={ia.allergen_id} className="text-xs px-2 py-1 rounded bg-stone-800 text-stone-300">
                      {ia.allergens.name}
                    </span>
                  ) : null
                )}
              </div>
            </div>
          )}

          {/* Modifier groups */}
          {modifierGroups.map(group => group && (
            <div key={group.id} className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-stone-200">{group.name}</p>
                {group.is_required && (
                  <span className="text-xs text-amber-500 bg-amber-950 px-2 py-0.5 rounded-full">Obligatorisk</span>
                )}
              </div>
              <div className="space-y-2">
                {group.modifiers.map(mod => {
                  const isSelected = selectedModifiers.some(m => m.modifierId === mod.id)
                  return (
                    <button
                      key={mod.id}
                      onClick={() => toggleModifier(group.id, group.allow_multiple, mod)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                        isSelected
                          ? "border-amber-500 bg-amber-950/30 text-amber-300"
                          : "border-stone-700 hover:border-stone-600 text-stone-300"
                      }`}
                    >
                      <span className="text-sm">{mod.name}</span>
                      {mod.price_adjustment_cents > 0 && (
                        <span className="text-sm text-stone-400">+{formatPrice(mod.price_adjustment_cents)}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Special requests */}
          <div className="mt-5">
            <p className="text-xs text-stone-500 uppercase tracking-wider mb-2">Önskemål</p>
            <textarea
              value={specialRequests}
              onChange={e => setSpecialRequests(e.target.value)}
              placeholder="Allergier, preferenser..."
              rows={2}
              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Quantity + Add to cart */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center border border-stone-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
              >
                −
              </button>
              <span className="w-10 text-center text-stone-200 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
              >
                +
              </button>
            </div>
            <Button
              variant="amber"
              className="flex-1 h-10"
              onClick={() =>
                onAddToCart({
                  menuItemId: item.id,
                  name: item.name,
                  priceCents: item.price_cents,
                  quantity,
                  imageUrl: item.image_url,
                  specialRequests,
                  selectedModifiers,
                })
              }
            >
              Lägg i varukorg · {formatPrice(totalPerItem * quantity)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
