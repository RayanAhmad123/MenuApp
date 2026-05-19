"use client"
import { useState, useTransition } from "react"
import { Building2, Globe, Plus, ToggleLeft, ToggleRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  createRestaurant,
  toggleRestaurantActive,
  updateRestaurantTier,
} from "@/lib/actions/superadmin"
import { cn } from "@/lib/utils"

type Tier = "free" | "pro" | "enterprise"

interface Restaurant {
  id: string
  name: string
  subdomain: string
  subscription_tier: Tier
  is_active: boolean
  created_at: string
  staff_count: number
}

interface Props {
  restaurants: Restaurant[]
}

const tierColors: Record<Tier, string> = {
  free: "bg-stone-100 text-stone-700",
  pro: "bg-amber-100 text-amber-800",
  enterprise: "bg-violet-100 text-violet-800",
}

export function RestaurantsClient({ restaurants: initial }: Props) {
  const [restaurants, setRestaurants] = useState(initial)
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState("")
  const [subdomain, setSubdomain] = useState("")
  const [tier, setTier] = useState<Tier>("free")
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  function handleNameChange(val: string) {
    setName(val)
    if (!subdomain || subdomain === name.toLowerCase().replace(/\s+/g, "-")) {
      setSubdomain(val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))
    }
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const { error } = await createRestaurant(name, subdomain, tier)
      if (error) {
        toast({ title: "Fel", description: error, variant: "destructive" })
      } else {
        toast({ title: "Restaurang skapad" })
        setShowCreate(false)
        setName("")
        setSubdomain("")
        setTier("free")
      }
    })
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      const { error } = await toggleRestaurantActive(id, !current)
      if (error) {
        toast({ title: "Fel", description: error, variant: "destructive" })
      } else {
        setRestaurants(rs => rs.map(r => r.id === id ? { ...r, is_active: !current } : r))
      }
    })
  }

  function handleTierChange(id: string, newTier: Tier) {
    startTransition(async () => {
      const { error } = await updateRestaurantTier(id, newTier)
      if (error) {
        toast({ title: "Fel", description: error, variant: "destructive" })
      } else {
        setRestaurants(rs => rs.map(r => r.id === id ? { ...r, subscription_tier: newTier } : r))
      }
    })
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8 flex-wrap">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-stone-900">Restauranger</h1>
          <p className="text-stone-500 text-sm mt-1">{restaurants.length} restauranger totalt</p>
        </div>
        <Button
          onClick={() => setShowCreate(v => !v)}
          className="bg-violet-600 hover:bg-violet-500 text-white gap-2"
        >
          <Plus className="h-4 w-4" />
          Ny restaurang
        </Button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-stone-900 mb-4">Skapa restaurang</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label>Namn</Label>
              <Input
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="Bobs Burgers"
                required
              />
            </div>
            <div className="space-y-1">
              <Label>Subdomän</Label>
              <Input
                value={subdomain}
                onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="bobs-burgers"
                required
              />
            </div>
            <div className="space-y-1">
              <Label>Abonnemang</Label>
              <select
                value={tier}
                onChange={e => setTier(e.target.value as Tier)}
                className="w-full border border-stone-200 rounded-md px-3 py-2 text-sm"
              >
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div className="sm:col-span-3 flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>
                Avbryt
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-violet-600 hover:bg-violet-500 text-white"
              >
                {isPending ? "Skapar…" : "Skapa"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-stone-100 text-stone-500 text-xs uppercase tracking-wide">
              <th className="text-left px-6 py-3 font-medium">Restaurang</th>
              <th className="text-left px-6 py-3 font-medium">Subdomän</th>
              <th className="text-left px-6 py-3 font-medium">Personal</th>
              <th className="text-left px-6 py-3 font-medium">Abonnemang</th>
              <th className="text-left px-6 py-3 font-medium">Status</th>
              <th className="text-left px-6 py-3 font-medium">Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-stone-400">
                  Inga restauranger ännu
                </td>
              </tr>
            )}
            {restaurants.map(r => (
              <tr key={r.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-4 w-4 text-stone-500" />
                    </div>
                    <span className="font-medium text-stone-900">{r.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1 text-stone-500">
                    <Globe className="h-3 w-3" />
                    {r.subdomain}
                  </span>
                </td>
                <td className="px-6 py-4 text-stone-600">{r.staff_count}</td>
                <td className="px-6 py-4">
                  <div className="relative inline-block">
                    <select
                      value={r.subscription_tier}
                      onChange={e => handleTierChange(r.id, e.target.value as Tier)}
                      disabled={isPending}
                      className={cn(
                        "appearance-none text-xs font-medium px-2 py-1 pr-6 rounded-full border-0 cursor-pointer",
                        tierColors[r.subscription_tier]
                      )}
                    >
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                    <ChevronDown className="h-3 w-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    r.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}>
                    {r.is_active ? "Aktiv" : "Inaktiv"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggle(r.id, r.is_active)}
                    disabled={isPending}
                    className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 transition-colors disabled:opacity-50"
                  >
                    {r.is_active
                      ? <><ToggleRight className="h-4 w-4 text-green-600" /> Inaktivera</>
                      : <><ToggleLeft className="h-4 w-4" /> Aktivera</>
                    }
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}
