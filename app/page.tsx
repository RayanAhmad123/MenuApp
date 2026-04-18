import Link from "next/link"
import { UtensilsCrossed } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-center px-4">
      <div className="mb-6 w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center">
        <UtensilsCrossed className="h-8 w-8 text-stone-900" />
      </div>
      <h1 className="font-serif text-4xl md:text-5xl text-stone-50 font-semibold mb-3">
        MenuApp
      </h1>
      <p className="text-stone-400 text-lg mb-10 max-w-md">
        The premium digital menu platform for modern restaurants. QR ordering made simple.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/admin/login"
          className="px-6 py-3 bg-amber-500 text-stone-900 rounded-xl font-semibold hover:bg-amber-400 transition-colors"
        >
          Admin Login
        </Link>
        <Link
          href="/kitchen"
          className="px-6 py-3 bg-stone-800 text-stone-100 rounded-xl font-semibold hover:bg-stone-700 transition-colors"
        >
          Kitchen Display
        </Link>
        <Link
          href="/waiter"
          className="px-6 py-3 bg-stone-800 text-stone-100 rounded-xl font-semibold hover:bg-stone-700 transition-colors"
        >
          Waiter View
        </Link>
      </div>
    </div>
  )
}
