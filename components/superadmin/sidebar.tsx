"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, LogOut, ShieldCheck, Menu, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/superadmin/dashboard", label: "Restauranger", icon: LayoutDashboard },
  { href: "/superadmin/admins", label: "Superadmins", icon: Users },
]

interface Props {
  adminName: string
}

export function SuperadminSidebar({ adminName }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = original }
  }, [mobileOpen])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/superadmin/login")
  }

  const brand = (
    <div className="p-6 border-b border-stone-800">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="font-serif font-semibold text-stone-50 truncate">Servera</p>
          <p className="text-xs text-violet-400">Superadmin</p>
        </div>
      </div>
    </div>
  )

  const nav = (
    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
                ? "bg-violet-600 text-white"
                : "text-stone-400 hover:text-stone-100 hover:bg-stone-800"
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  const footer = (
    <div className="p-4 border-t border-stone-800">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-semibold text-stone-300">
            {adminName.split(" ").map(n => n[0]).join("").toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-stone-300 truncate">{adminName}</p>
      </div>
      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-300 transition-colors w-full"
      >
        <LogOut className="h-4 w-4" />
        Logga ut
      </button>
    </div>
  )

  return (
    <>
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-30 h-14 bg-stone-900 border-b border-stone-800 flex items-center gap-3 px-3">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Öppna meny"
          className="w-11 h-11 -ml-1 flex items-center justify-center rounded-lg text-stone-300 hover:bg-stone-800 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="h-4 w-4 text-white" />
        </div>
        <p className="font-serif font-semibold text-stone-50 truncate">Servera Superadmin</p>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-stone-900 text-stone-100 flex-col border-r border-stone-800">
        {brand}
        {nav}
        {footer}
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 transition-opacity duration-200",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-stone-900 text-stone-100 flex flex-col border-r border-stone-800 transition-transform duration-200",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="relative">
            {brand}
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Stäng meny"
              className="absolute top-3 right-2 w-11 h-11 flex items-center justify-center rounded-lg text-stone-400 hover:bg-stone-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {nav}
          {footer}
        </aside>
      </div>
    </>
  )
}
