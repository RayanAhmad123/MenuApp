"use client"
import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, X, CheckCircle2, ChevronRight, Leaf, UtensilsCrossed } from "lucide-react"

/* ── Demo data ─────────────────────────────────────────── */

interface DemoCategory {
  id: string
  name: string
}

interface DemoItem {
  id: string
  name: string
  description: string
  price_cents: number
  category_id: string
  is_vegetarian?: boolean
  is_vegan?: boolean
  is_gluten_free?: boolean
  emoji: string
}

const DEMO_RESTAURANT = {
  name: "Restaurang Björken",
  address: "Storgatan 12, Stockholm",
}

const CATEGORIES: DemoCategory[] = [
  { id: "starters", name: "Förrätter" },
  { id: "mains", name: "Huvudrätter" },
  { id: "desserts", name: "Desserter" },
  { id: "drinks", name: "Drycker" },
]

const MENU_ITEMS: DemoItem[] = [
  {
    id: "1",
    name: "Gravlax med hovmästarsås",
    description: "Klassisk svensk gravlax med dillstänkt hovmästarsås och rågsurbrödsskivor.",
    price_cents: 13900,
    category_id: "starters",
    emoji: "🐟",
  },
  {
    id: "2",
    name: "Löksoppa",
    description: "Varm löksoppa med Gruyère-krutonger.",
    price_cents: 10900,
    category_id: "starters",
    is_vegetarian: true,
    emoji: "🍲",
  },
  {
    id: "3",
    name: "Laxsallad",
    description: "Ugnsbakad lax med blandade grönsaker, avokado och citrondressing.",
    price_cents: 15900,
    category_id: "mains",
    is_gluten_free: true,
    emoji: "🥗",
  },
  {
    id: "4",
    name: "Margherita Pizza",
    description: "Nybakad pizza med tomatsås, buffalo mozzarella och färsk basilika.",
    price_cents: 12900,
    category_id: "mains",
    is_vegetarian: true,
    emoji: "🍕",
  },
  {
    id: "5",
    name: "Köttbullar med lingon",
    description: "Husmanskost i toppklass — handgjorda köttbullar med gräddsås, potatismos och lingonsylt.",
    price_cents: 14900,
    category_id: "mains",
    emoji: "🍖",
  },
  {
    id: "6",
    name: "Vegetarisk lasagne",
    description: "Lager av rostad zucchini, aubergine och ricotta i en rik tomatsås.",
    price_cents: 13500,
    category_id: "mains",
    is_vegetarian: true,
    emoji: "🥘",
  },
  {
    id: "7",
    name: "Tiramisu",
    description: "Klassisk italiensk tiramisu med mascarpone och espresso.",
    price_cents: 7900,
    category_id: "desserts",
    emoji: "🍰",
  },
  {
    id: "8",
    name: "Chokladfondant",
    description: "Varm chokladkaka med flytande kärna, serveras med vaniljglass.",
    price_cents: 8900,
    category_id: "desserts",
    is_vegetarian: true,
    emoji: "🍫",
  },
  {
    id: "9",
    name: "Lemonad",
    description: "Hembryggd lemonad med citron, mynta och lätt sötma.",
    price_cents: 3500,
    category_id: "drinks",
    is_vegan: true,
    is_vegetarian: true,
    is_gluten_free: true,
    emoji: "🍋",
  },
  {
    id: "10",
    name: "Kolsyrat vatten",
    description: "Naturligt kolsyrat källvatten.",
    price_cents: 2500,
    category_id: "drinks",
    is_vegan: true,
    is_vegetarian: true,
    is_gluten_free: true,
    emoji: "💧",
  },
  {
    id: "11",
    name: "Kaffe",
    description: "Bryggkaffe på single origin-bönor.",
    price_cents: 3900,
    category_id: "drinks",
    is_vegan: true,
    emoji: "☕",
  },
]

function formatPrice(cents: number): string {
  return `${Math.round(cents / 100)} kr`
}

/* ── Cart types ─────────────────────────────────────────── */

interface CartEntry {
  item: DemoItem
  qty: number
}

/* ── Item detail sheet ──────────────────────────────────── */

function ItemSheet({
  item,
  onClose,
  onAdd,
}: {
  item: DemoItem
  onClose: () => void
  onAdd: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-t-3xl p-6 pb-10 max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 text-stone-500"
          aria-label="Stäng"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-5xl mb-4 text-center">{item.emoji}</div>
        <h2 className="font-serif text-2xl font-bold text-stone-950 mb-1">{item.name}</h2>
        <p className="text-stone-600 text-sm leading-relaxed mb-4">{item.description}</p>

        <div className="flex gap-2 mb-6 flex-wrap">
          {item.is_vegan && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              <Leaf className="h-3 w-3" /> Vegan
            </span>
          )}
          {item.is_vegetarian && !item.is_vegan && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
              <Leaf className="h-3 w-3" /> Vegetarisk
            </span>
          )}
          {item.is_gluten_free && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
              <UtensilsCrossed className="h-3 w-3" /> Glutenfri
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="font-serif text-2xl font-bold text-stone-950">
            {formatPrice(item.price_cents)}
          </span>
          <button
            onClick={() => { onAdd(); onClose() }}
            className="px-6 py-3 bg-stone-950 text-white font-semibold rounded-full text-sm hover:bg-stone-800 transition-colors"
          >
            Lägg till i varukorg
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Cart drawer ─────────────────────────────────────────── */

function CartDrawer({
  cart,
  onClose,
  onOrder,
  onRemove,
}: {
  cart: CartEntry[]
  onClose: () => void
  onOrder: () => void
  onRemove: (id: string) => void
}) {
  const total = cart.reduce((sum, e) => sum + e.item.price_cents * e.qty, 0)

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-t-3xl p-6 pb-10 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl font-bold text-stone-950">Din varukorg</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-100 text-stone-500"
            aria-label="Stäng"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="text-stone-500 text-sm text-center py-8">Varukorgen är tom.</p>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto space-y-3 mb-5">
              {cart.map((entry) => (
                <li
                  key={entry.item.id}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-2xl">{entry.item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-stone-900 truncate">
                      {entry.item.name}
                    </p>
                    <p className="text-xs text-stone-500">
                      {entry.qty} × {formatPrice(entry.item.price_cents)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-stone-900">
                      {formatPrice(entry.item.price_cents * entry.qty)}
                    </span>
                    <button
                      onClick={() => onRemove(entry.item.id)}
                      className="p-1 rounded-full hover:bg-stone-100 text-stone-400"
                      aria-label="Ta bort"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-stone-100 pt-4 mb-5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-700">Totalt</span>
                <span className="font-serif text-xl font-bold text-stone-950">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <button
              onClick={onOrder}
              className="w-full py-4 bg-stone-950 text-white font-semibold rounded-2xl text-base hover:bg-stone-800 transition-colors"
            >
              Beställ →
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/* ── Success modal ──────────────────────────────────────── */

function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-950 mb-3">
          Order lagd!
        </h2>
        <p className="text-stone-600 text-sm leading-relaxed mb-6">
          Perfekt! I den riktiga appen skulle din order nu gå direkt till köket och personalen ser den i realtid på kökets skärm.
        </p>
        <Link
          href="/priser"
          className="block w-full py-3.5 bg-stone-950 text-white font-semibold rounded-full text-sm hover:bg-stone-800 transition-colors mb-3"
        >
          Starta gratis provperiod →
        </Link>
        <button
          onClick={onClose}
          className="text-stone-500 text-sm hover:text-stone-700 transition-colors"
        >
          Fortsätt utforska demon
        </button>
      </div>
    </div>
  )
}

/* ── Main demo client ────────────────────────────────────── */

export function DemoMenuClient() {
  const [activeCategory, setActiveCategory] = useState("mains")
  const [selectedItem, setSelectedItem] = useState<DemoItem | null>(null)
  const [cart, setCart] = useState<CartEntry[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)

  const filteredItems = MENU_ITEMS.filter((i) => i.category_id === activeCategory)
  const itemCount = cart.reduce((sum, e) => sum + e.qty, 0)

  function addToCart(item: DemoItem) {
    setCart((prev) => {
      const existing = prev.find((e) => e.item.id === item.id)
      if (existing) {
        return prev.map((e) =>
          e.item.id === item.id ? { ...e, qty: e.qty + 1 } : e
        )
      }
      return [...prev, { item, qty: 1 }]
    })
  }

  function removeFromCart(id: string) {
    setCart((prev) => {
      const existing = prev.find((e) => e.item.id === id)
      if (!existing) return prev
      if (existing.qty === 1) return prev.filter((e) => e.item.id !== id)
      return prev.map((e) =>
        e.item.id === id ? { ...e, qty: e.qty - 1 } : e
      )
    })
  }

  function handleOrder() {
    setCartOpen(false)
    setSuccessOpen(true)
    setCart([])
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-28 font-sans antialiased">
      {/* Demo banner */}
      <div className="bg-amber-500 text-stone-950 px-4 py-3 text-center text-sm font-medium flex flex-col sm:flex-row items-center justify-center gap-2">
        <span>Detta är en demo — upplev hur gästerna ser din meny</span>
        <Link
          href="/priser"
          className="inline-flex items-center gap-1 bg-stone-950 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-stone-800 transition-colors"
        >
          Starta din gratis provperiod <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-100 shadow-sm">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <p className="font-serif text-lg font-bold text-stone-950">
              {DEMO_RESTAURANT.name}
            </p>
            <p className="text-xs text-stone-500">Bord 4 · Demomeny</p>
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-3 bg-stone-950 text-white rounded-full hover:bg-stone-800 transition-colors"
            aria-label="Öppna varukorg"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-stone-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Category tabs */}
      <div className="sticky top-16 z-20 bg-white border-b border-stone-100">
        <div className="max-w-xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeCategory === cat.id
                    ? "bg-stone-950 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu items */}
      <main className="max-w-xl mx-auto px-4 pt-6">
        <h2 className="font-serif text-xl font-bold text-stone-950 mb-4">
          {CATEGORIES.find((c) => c.id === activeCategory)?.name}
        </h2>

        <div className="space-y-3">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 border border-stone-100 hover:border-stone-300 hover:shadow-sm transition-all text-left"
            >
              <div className="w-14 h-14 bg-stone-50 rounded-xl flex items-center justify-center text-3xl shrink-0">
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-stone-900 text-sm">{item.name}</p>
                <p className="text-stone-500 text-xs leading-relaxed line-clamp-2 mt-0.5">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {item.is_vegan && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-green-700 font-medium">
                      <Leaf className="h-2.5 w-2.5" /> Vegan
                    </span>
                  )}
                  {item.is_vegetarian && !item.is_vegan && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-green-700 font-medium">
                      <Leaf className="h-2.5 w-2.5" /> Vegetarisk
                    </span>
                  )}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-serif font-bold text-stone-950 text-sm">
                  {formatPrice(item.price_cents)}
                </p>
                <span className="text-[10px] text-stone-400 mt-1 block">Tryck för info</span>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-stone-100 to-transparent pointer-events-none">
        <div className="max-w-xl mx-auto pointer-events-auto">
          <Link
            href="/priser"
            className="flex items-center justify-center gap-2 w-full py-4 bg-amber-500 text-stone-950 font-bold rounded-2xl text-sm shadow-lg hover:bg-amber-400 transition-colors"
          >
            Prova gratis i 30 dagar <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Overlays */}
      {selectedItem && (
        <ItemSheet
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAdd={() => addToCart(selectedItem)}
        />
      )}

      {cartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setCartOpen(false)}
          onOrder={handleOrder}
          onRemove={removeFromCart}
        />
      )}

      {successOpen && (
        <SuccessModal onClose={() => setSuccessOpen(false)} />
      )}
    </div>
  )
}
