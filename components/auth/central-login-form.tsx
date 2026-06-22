"use client"
import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { getMyTenantDashboardUrl } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function CentralLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast({ title: "Inloggning misslyckades", description: error.message, variant: "destructive" })
      setLoading(false)
      return
    }
    // The session cookie is now set on .triadsolutions.se (shared across every
    // subdomain). Resolve which restaurant this admin belongs to and forward
    // them to that subdomain's dashboard.
    const dest = await getMyTenantDashboardUrl()
    if (!dest) {
      toast({
        title: "Inget konto kopplat till en restaurang",
        description: "Kontakta support om detta inte stämmer.",
        variant: "destructive",
      })
      await supabase.auth.signOut()
      setLoading(false)
      return
    }
    window.location.href = dest
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-stone-300">E-post</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="admin@dinrestaurang.se"
          className="bg-stone-800 border-stone-700 text-stone-100 placeholder-stone-500 focus:border-amber-500"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-stone-300">Lösenord</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          className="bg-stone-800 border-stone-700 text-stone-100 placeholder-stone-500 focus:border-amber-500"
        />
      </div>
      <Button type="submit" variant="amber" size="lg" className="w-full" disabled={loading}>
        {loading ? "Loggar in…" : "Logga in"}
      </Button>
      <div className="text-center">
        <Link href="/forgot-password" className="text-stone-400 text-sm hover:text-amber-500">
          Glömt lösenordet?
        </Link>
      </div>
    </form>
  )
}
