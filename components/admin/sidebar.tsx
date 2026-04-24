"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, UtensilsCrossed, ClipboardList,
  Users, Settings, QrCode, ChefHat, LogOut, BarChart3,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/admin/dashboard", label: "Översikt", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analys", icon: BarChart3 },
  { href: "/admin/menu", label: "Meny", icon: UtensilsCrossed },
  { href: "/admin/orders", label: "Beställningar", icon: ClipboardList },
  { href: "/admin/staff", label: "Personal", icon: Users },
  { href: "/admin/qr-codes", label: "QR-koder", icon: QrCode },
  { href: "/admin/settings", label: "Inställningar", icon: Settings },
]

interface Props {
  restaurantName: string
  logoUrl: string | null
  staffName: string
  role: string
}

export function AdminSidebar({ restaurantName, logoUrl, staffName, role }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  return (
    <aside className="w-64 bg-stone-900 text-stone-100 flex flex-col border-r border-stone-800">
      {/* Brand */}
      <div className="p-6 border-b border-stone-800">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt={restaurantName} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
              <span className="font-serif text-stone-900 font-bold text-lg">
                {restaurantName[0]}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <p className="font-serif font-semibold text-stone-50 truncate">{restaurantName}</p>
            <p className="text-xs text-stone-500 truncate capitalize">{role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-amber-500 text-stone-900"
                  : "text-stone-400 hover:text-stone-100 hover:bg-stone-800"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}

        <div className="border-t border-stone-800 pt-2 mt-2">
          <Link
            href="/kitchen"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-all"
          >
            <ChefHat className="h-4 w-4" />
            Köksvy
          </Link>
        </div>
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-stone-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-stone-300">
              {staffName.split(" ").map(n => n[0]).join("").toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-stone-300 truncate">{staffName}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-300 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Logga ut
        </button>
      </div>
    </aside>
  )
}
