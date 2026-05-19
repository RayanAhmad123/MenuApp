"use client"
import { useState, useTransition } from "react"
import { Plus, ShieldCheck, ShieldOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { addSuperadmin, toggleSuperadminActive } from "@/lib/actions/superadmin"
import { cn } from "@/lib/utils"

interface Superadmin {
  id: string
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  created_at: string
}

interface Props {
  admins: Superadmin[]
  currentEmail: string
}

export function AdminsClient({ admins: initial, currentEmail }: Props) {
  const [admins, setAdmins] = useState(initial)
  const [showAdd, setShowAdd] = useState(false)
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const { error } = await addSuperadmin(email, firstName, lastName)
      if (error) {
        toast({ title: "Fel", description: error, variant: "destructive" })
      } else {
        toast({ title: "Superadmin tillagd" })
        setShowAdd(false)
        setEmail("")
        setFirstName("")
        setLastName("")
      }
    })
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      const { error } = await toggleSuperadminActive(id, !current)
      if (error) {
        toast({ title: "Fel", description: error, variant: "destructive" })
      } else {
        setAdmins(as => as.map(a => a.id === id ? { ...a, is_active: !current } : a))
      }
    })
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8 flex-wrap">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-stone-900">Superadmins</h1>
          <p className="text-stone-500 text-sm mt-1">{admins.filter(a => a.is_active).length} aktiva</p>
        </div>
        <Button
          onClick={() => setShowAdd(v => !v)}
          className="bg-violet-600 hover:bg-violet-500 text-white gap-2"
        >
          <Plus className="h-4 w-4" />
          Lägg till
        </Button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-stone-900 mb-4">Lägg till superadmin</h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label>Förnamn</Label>
              <Input
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="Anna"
                required
              />
            </div>
            <div className="space-y-1">
              <Label>Efternamn</Label>
              <Input
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Svensson"
                required
              />
            </div>
            <div className="space-y-1">
              <Label>E-post</Label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="anna@triadsolutions.se"
                required
              />
            </div>
            <div className="sm:col-span-3 flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>
                Avbryt
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-violet-600 hover:bg-violet-500 text-white"
              >
                {isPending ? "Lägger till…" : "Lägg till"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-stone-100 text-stone-500 text-xs uppercase tracking-wide">
              <th className="text-left px-6 py-3 font-medium">Namn</th>
              <th className="text-left px-6 py-3 font-medium">E-post</th>
              <th className="text-left px-6 py-3 font-medium">Status</th>
              <th className="text-left px-6 py-3 font-medium">Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(a => (
              <tr key={a.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-violet-700">
                        {`${a.first_name[0]}${a.last_name[0]}`.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-stone-900">{a.first_name} {a.last_name}</p>
                      {a.email === currentEmail && (
                        <p className="text-xs text-violet-500">Du</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-stone-500">{a.email}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    a.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}>
                    {a.is_active ? "Aktiv" : "Inaktiv"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {a.email !== currentEmail && (
                    <button
                      onClick={() => handleToggle(a.id, a.is_active)}
                      disabled={isPending}
                      className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 transition-colors disabled:opacity-50"
                    >
                      {a.is_active
                        ? <><ShieldOff className="h-4 w-4 text-red-500" /> Inaktivera</>
                        : <><ShieldCheck className="h-4 w-4 text-green-600" /> Aktivera</>
                      }
                    </button>
                  )}
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
