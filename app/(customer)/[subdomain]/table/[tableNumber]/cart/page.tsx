"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Trash2, ShoppingBag, CreditCard, Smartphone } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { placeOrder } from "@/lib/actions/orders"
import { formatPrice } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const TIP_OPTIONS = [
  { label: "Ingen", value: 0 },
  { label: "10%", value: 0.1 },
  { label: "15%", value: 0.15 },
  { label: "Annat", value: -1 },
]

export default function CartPage() {
  const params = useParams()
  const { items, removeItem, updateQuantity, totalCents, itemCount, sessionId, clearCart } = useCart()
  const [specialNotes, setSpecialNotes] = useState("")
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  // Tip state
  const [selectedTipOption, setSelectedTipOption] = useState<number>(0) // index
  const [customTipAmount, setCustomTipAmount] = useState<string>("")

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<"card" | "swish">("card")
  const [swishPhone, setSwishPhone] = useState("")

  const { toast } = useToast()
  const router = useRouter()

  const subdomain = params.subdomain as string
  const tableNumber = parseInt(params.tableNumber as string, 10)

  // Tip calculation
  const tipCents = (() => {
    const opt = TIP_OPTIONS[selectedTipOption]
    if (opt.value === 0) return 0
    if (opt.value === -1) {
      const parsed = parseFloat(customTipAmount)
      return isNaN(parsed) ? 0 : Math.round(parsed * 100)
    }
    return Math.round(totalCents * opt.value)
  })()

  const grandTotalCents = totalCents + tipCents

  async function handlePlaceOrder() {
    if (items.length === 0) return
    setIsPlacingOrder(true)
    try {
      const res = await fetch(`/api/restaurants/${subdomain}/menu`)
      const { restaurant } = await res.json()
      if (!restaurant) {
        toast({ title: "Restaurangen hittades inte", variant: "destructive" })
        return
      }
      const result = await placeOrder({
        restaurantId: restaurant.id,
        tableNumber,
        sessionId,
        paymentEnabled: restaurant.payment_enabled,
        items,
        specialNotes,
        tipCents,
      })
      if (result.error) {
        toast({ title: result.error ?? "Något gick fel", variant: "destructive" })
        return
      }
      if (result.orderId) {
        try {
          localStorage.setItem(
            `menuapp-active-order-${subdomain}-${tableNumber}`,
            result.orderId
          )
        } catch {
          // Private mode / quota — non-critical
        }
      }
      if (!restaurant.payment_enabled) {
        setRedirecting(true)
        clearCart()
        router.push(`/${subdomain}/table/${tableNumber}/order/${result.orderId}`)
        return
      }
      setClientSecret(result.clientSecret)
      setOrderId(result.orderId)
    } catch {
      toast({ title: "Något gick fel", variant: "destructive" })
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (redirecting) {
    return (
      <div className="menu-page min-h-screen flex items-center justify-center">
        <div className="text-stone-400 text-center">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Skickar din beställning...</p>
        </div>
      </div>
    )
  }

  if (itemCount === 0 && !clientSecret) {
    return (
      <div className="menu-page min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <ShoppingBag className="h-16 w-16 text-stone-600 mb-4" />
        <h2 className="font-serif text-2xl text-stone-300 mb-2">Din varukorg är tom</h2>
        <p className="text-stone-500 mb-6">Lägg till rätter från menyn för att börja.</p>
        <Link href={`/${subdomain}/table/${tableNumber}`}>
          <Button variant="amber">Bläddra i menyn</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="menu-page min-h-screen">
      <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href={`/${subdomain}/table/${tableNumber}`}>
            <Button variant="ghost" size="icon" className="text-stone-400 hover:text-stone-200">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="font-serif text-xl text-stone-50">Din beställning</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {!clientSecret ? (
          <>
            {/* Cart items */}
            <div className="space-y-3">
              {items.map(item => (
                <div
                  key={item.cartItemId}
                  className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex gap-3"
                >
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-serif text-stone-100 font-medium">{item.name}</h3>
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        className="text-stone-600 hover:text-red-400 transition-colors ml-2 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {item.selectedModifiers.length > 0 && (
                      <p className="text-xs text-stone-500 mt-0.5">
                        {item.selectedModifiers.map(m => m.modifierName).join(", ")}
                      </p>
                    )}
                    {item.specialRequests && (
                      <p className="text-xs text-stone-500 italic mt-0.5">"{item.specialRequests}"</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-stone-200 text-sm"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-stone-200 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-stone-200 text-sm"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-amber-400 font-medium">
                        {formatPrice((item.priceCents + item.selectedModifiers.reduce((s, m) => s + m.priceAdjustmentCents, 0)) * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Upsell prompt — shown when fewer than 4 items */}
            {itemCount < 4 && (
              <UpsellPrompt />
            )}

            {/* Special notes */}
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
              <label className="text-sm text-stone-400 block mb-2">Anteckningar till köket</label>
              <textarea
                value={specialNotes}
                onChange={e => setSpecialNotes(e.target.value)}
                placeholder="Önskemål för hela beställningen..."
                rows={2}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
              />
            </div>

            {/* Tip selection */}
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-3">
              <h3 className="font-serif text-stone-100 text-base">Lägg till dricks?</h3>
              <div className="flex gap-2">
                {TIP_OPTIONS.map((opt, idx) => (
                  <button
                    key={opt.label}
                    onClick={() => setSelectedTipOption(idx)}
                    className={`flex-1 py-2 px-2 rounded-full text-sm font-medium border transition-all ${
                      selectedTipOption === idx
                        ? "bg-amber-500 border-amber-500 text-stone-900"
                        : "bg-stone-800 border-stone-700 text-stone-300 hover:border-amber-600"
                    }`}
                  >
                    {opt.label}
                    {opt.value > 0 && selectedTipOption === idx && (
                      <span className="block text-xs mt-0.5 font-normal">
                        {formatPrice(Math.round(totalCents * opt.value))}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {selectedTipOption === 3 && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={customTipAmount}
                    onChange={e => setCustomTipAmount(e.target.value)}
                    placeholder="0"
                    className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <span className="text-stone-400 text-sm">kr</span>
                </div>
              )}
              {tipCents > 0 && (
                <p className="text-xs text-amber-400">Dricks: {formatPrice(tipCents)}</p>
              )}
            </div>

            {/* Total */}
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-stone-400 text-sm">
                <span>Delsumma</span>
                <span>{formatPrice(totalCents)}</span>
              </div>
              {tipCents > 0 && (
                <div className="flex justify-between text-stone-400 text-sm">
                  <span>Dricks</span>
                  <span>{formatPrice(tipCents)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-200 font-semibold border-t border-stone-700 pt-2">
                <span>Totalt</span>
                <span className="text-amber-400 text-lg">{formatPrice(grandTotalCents)}</span>
              </div>
            </div>

            <Button
              variant="amber"
              size="xl"
              className="w-full"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? "Bearbetar..." : `Beställ · ${formatPrice(grandTotalCents)}`}
            </Button>

            <Link
              href={`/${subdomain}/table/${tableNumber}`}
              className="block text-center text-sm text-stone-400 hover:text-amber-400 transition-colors py-2"
            >
              ← Fortsätt handla
            </Link>
          </>
        ) : (
          <>
            {/* Payment method toggle */}
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-1 flex gap-1">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  paymentMethod === "card"
                    ? "bg-amber-500 text-stone-900"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                <CreditCard className="h-4 w-4" />
                Kortbetalning
              </button>
              <button
                onClick={() => setPaymentMethod("swish")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  paymentMethod === "swish"
                    ? "bg-amber-500 text-stone-900"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                <Smartphone className="h-4 w-4" />
                Swish
              </button>
            </div>

            {paymentMethod === "card" ? (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "night" } }}>
                <CheckoutForm
                  orderId={orderId!}
                  subdomain={subdomain}
                  tableNumber={tableNumber}
                />
              </Elements>
            ) : (
              <SwishPaymentForm
                orderId={orderId!}
                swishPhone={swishPhone}
                setSwishPhone={setSwishPhone}
                grandTotalCents={grandTotalCents}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}

function UpsellPrompt() {
  const { toast } = useToast()

  const suggestions = [
    { label: "Lemonad", price: "35 kr" },
    { label: "Kaffe", price: "29 kr" },
    { label: "Dagens dessert", price: "59 kr" },
  ]

  function handleSuggestionClick(name: string) {
    toast({ title: `Kontakta servitören för att lägga till ${name}.` })
  }

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-3">
      <h3 className="font-serif text-stone-100 text-base">Du kanske också vill ha? 🍹</h3>
      <div className="flex flex-wrap gap-2">
        {suggestions.map(s => (
          <button
            key={s.label}
            onClick={() => handleSuggestionClick(s.label)}
            className="flex items-center gap-1.5 bg-stone-800 border border-stone-700 hover:border-amber-600 rounded-full px-3 py-1.5 text-sm text-stone-300 transition-all"
          >
            <span className="text-amber-400 font-bold">+</span>
            {s.label} <span className="text-stone-500">{s.price}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-stone-500">Klicka för att fråga servitören om tillägget.</p>
    </div>
  )
}

function SwishPaymentForm({
  orderId,
  swishPhone,
  setSwishPhone,
  grandTotalCents,
}: {
  orderId: string
  swishPhone: string
  setSwishPhone: (v: string) => void
  grandTotalCents: number
}) {
  const { toast } = useToast()
  function handleSwishSubmit(e: React.FormEvent) {
    e.preventDefault()
    toast({
      title: "Swish inte aktiverat",
      description: "Kontakta restaurangen för att aktivera Swish-betalning.",
      variant: "destructive",
    })
  }

  return (
    <form onSubmit={handleSwishSubmit} className="space-y-4">
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 text-center space-y-4">
        {/* Swish logo placeholder */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#4B2EA2]/20 border border-[#4B2EA2]/40 mx-auto">
          <span className="text-2xl font-bold text-[#7B4FD4]">S</span>
        </div>
        <div>
          <h2 className="font-serif text-stone-100 text-lg">Betala med Swish</h2>
          <p className="text-stone-400 text-sm mt-1">
            Swish-betalning kräver att restaurangen har aktiverat Swish i inställningarna.
          </p>
        </div>
        <div className="bg-amber-950/40 border border-amber-800/40 rounded-lg px-4 py-3">
          <p className="text-amber-400 text-sm">
            Swish är för närvarande inte tillgängligt. Välj kortbetalning eller kontakta restaurangen.
          </p>
        </div>
        <div className="text-left space-y-1">
          <label className="text-sm text-stone-400 block">Ditt Swish-nummer (valfritt)</label>
          <input
            type="tel"
            value={swishPhone}
            onChange={e => setSwishPhone(e.target.value)}
            placeholder="07X XXX XX XX"
            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <p className="text-xs text-stone-500">Belopp: {formatPrice(grandTotalCents)}</p>
      </div>
      <Button
        type="submit"
        variant="amber"
        size="xl"
        className="w-full opacity-60 cursor-not-allowed"
        disabled
      >
        Swish inte tillgängligt
      </Button>
    </form>
  )
}

function CheckoutForm({
  orderId,
  subdomain,
  tableNumber,
}: {
  orderId: string
  subdomain: string
  tableNumber: number
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { clearCart } = useCart()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setIsSubmitting(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/${subdomain}/table/${tableNumber}/order/${orderId}`,
      },
    })

    if (error) {
      toast({ title: error.message ?? "Payment failed", variant: "destructive" })
      setIsSubmitting(false)
    } else {
      clearCart()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
        <h2 className="font-serif text-stone-100 text-lg mb-4">Betalning</h2>
        <PaymentElement />
      </div>
      <Button
        type="submit"
        variant="amber"
        size="xl"
        className="w-full"
        disabled={!stripe || isSubmitting}
      >
        {isSubmitting ? "Bearbetar betalning..." : "Betala nu"}
      </Button>
    </form>
  )
}
