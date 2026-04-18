"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Trash2, ShoppingBag } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { placeOrder } from "@/lib/actions/orders"
import { formatPrice } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CartPage() {
  const params = useParams()
  const { items, removeItem, updateQuantity, totalCents, itemCount, sessionId, clearCart } = useCart()
  const [specialNotes, setSpecialNotes] = useState("")
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const subdomain = params.subdomain as string
  const tableNumber = parseInt(params.tableNumber as string, 10)

  async function handlePlaceOrder() {
    if (items.length === 0) return
    setIsPlacingOrder(true)
    try {
      const res = await fetch(`/api/restaurants/${subdomain}/menu`)
      const { restaurant } = await res.json()
      if (!restaurant) {
        toast({ title: "Restaurant not found", variant: "destructive" })
        return
      }
      const result = await placeOrder({
        restaurantId: restaurant.id,
        tableNumber,
        sessionId,
        paymentEnabled: restaurant.payment_enabled,
        items,
        specialNotes,
      })
      if (result.error) {
        toast({ title: result.error, variant: "destructive" })
        return
      }
      if (!restaurant.payment_enabled) {
        // No payment needed — go straight to order confirmation
        clearCart()
        router.push(`/${subdomain}/table/${tableNumber}/order/${result.orderId}`)
        return
      }
      setClientSecret(result.clientSecret)
      setOrderId(result.orderId)
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" })
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (itemCount === 0 && !clientSecret) {
    return (
      <div className="menu-page min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <ShoppingBag className="h-16 w-16 text-stone-600 mb-4" />
        <h2 className="font-serif text-2xl text-stone-300 mb-2">Your cart is empty</h2>
        <p className="text-stone-500 mb-6">Add some items from the menu to get started.</p>
        <Link href={`/${subdomain}/table/${tableNumber}`}>
          <Button variant="amber">Browse Menu</Button>
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
          <h1 className="font-serif text-xl text-stone-50">Your Order</h1>
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

            {/* Special notes */}
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
              <label className="text-sm text-stone-400 block mb-2">Notes for the kitchen</label>
              <textarea
                value={specialNotes}
                onChange={e => setSpecialNotes(e.target.value)}
                placeholder="Any special requests for the whole order..."
                rows={2}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
              />
            </div>

            {/* Total */}
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-stone-400 text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(totalCents)}</span>
              </div>
              <div className="flex justify-between text-stone-200 font-semibold border-t border-stone-700 pt-2">
                <span>Total</span>
                <span className="text-amber-400 text-lg">{formatPrice(totalCents)}</span>
              </div>
            </div>

            <Button
              variant="amber"
              size="xl"
              className="w-full"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? "Processing..." : `Place Order · ${formatPrice(totalCents)}`}
            </Button>
          </>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "night" } }}>
            <CheckoutForm
              orderId={orderId!}
              subdomain={subdomain}
              tableNumber={tableNumber}
            />
          </Elements>
        )}
      </main>
    </div>
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
        <h2 className="font-serif text-stone-100 text-lg mb-4">Payment</h2>
        <PaymentElement />
      </div>
      <Button
        type="submit"
        variant="amber"
        size="xl"
        className="w-full"
        disabled={!stripe || isSubmitting}
      >
        {isSubmitting ? "Processing Payment..." : "Pay Now"}
      </Button>
    </form>
  )
}
