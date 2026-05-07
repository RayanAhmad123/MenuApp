"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, LogOut, ShieldCheck } from "lucide-react"
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

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/superadmin/login")
  }

  return (
    <aside className="w-64 bg-stone-900 text-stone-100 flex flex-col border-r border-stone-800">
      {/* Brand */}
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

      {/* User footer */}
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
    </aside>
  )
}
