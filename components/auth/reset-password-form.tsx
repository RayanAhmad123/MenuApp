"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { getMyTenantDashboardUrl } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface ResetPasswordFormProps {
  /** Where to send the user once the password is updated. */
  dashboardPath: string
  forgotPath: string
  accent: "amber" | "violet"
  /** Central flow: after updating, resolve the user's tenant and redirect to
   *  their subdomain dashboard (falls back to dashboardPath if none found). */
  redirectToTenant?: boolean
}

export function ResetPasswordForm({ dashboardPath, forgotPath, accent, redirectToTenant }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"checking" | "ready" | "invalid">("checking")
  const { toast } = useToast()
  const supabase = createClient()

  const focusClass = accent === "violet" ? "focus:border-violet-500" : "focus:border-amber-500"

  useEffect(() => {
    async function init() {
      // Recovery flow: Supabase puts the tokens in the URL fragment
      // (#access_token=…&refresh_token=…). Establish the session from them,
      // then strip the fragment from the address bar.
      if (typeof window !== "undefined" && window.location.hash.includes("access_token")) {
        const params = new URLSearchParams(window.location.hash.slice(1))
        const access_token = params.get("access_token")
        const refresh_token = params.get("refresh_token")
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token })
          window.history.replaceState(null, "", window.location.pathname + window.location.search)
          if (!error) {
            setStatus("ready")
            return
          }
        }
      }
      // No recovery token in the URL — fall back to any existing session
      // (e.g. the page was reopened after the session was already set).
      const { data } = await supabase.auth.getUser()
      setStatus(data.user ? "ready" : "invalid")
    }
    init()
  }, [supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      toast({ title: "Lösenorden matchar inte", variant: "destructive" })
      return
    }
    if (password.length < 8) {
      toast({ title: "Lösenordet måste vara minst 8 tecken", variant: "destructive" })
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      toast({ title: "Kunde inte uppdatera lösenordet", description: error.message, variant: "destructive" })
      return
    }
    toast({ title: "Lösenordet har uppdaterats" })
    const dest = redirectToTenant ? (await getMyTenantDashboardUrl()) ?? dashboardPath : dashboardPath
    window.location.href = dest
  }

  if (status === "checking") {
    return <p className="text-stone-400 text-sm text-center">Verifierar länk…</p>
  }

  if (status === "invalid") {
    return (
      <div className="text-center space-y-3">
        <p className="text-stone-200">Länken är ogiltig eller har gått ut</p>
        <p className="text-stone-400 text-sm">
          Be om en ny återställningslänk och försök igen.
        </p>
        <a href={forgotPath} className="inline-block text-amber-500 text-sm hover:text-amber-400">
          Begär ny länk
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="password" className="text-stone-300">Nytt lösenord</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={8}
          placeholder="••••••••"
          className={`bg-stone-800 border-stone-700 text-stone-100 placeholder-stone-500 ${focusClass}`}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm" className="text-stone-300">Bekräfta lösenord</Label>
        <Input
          id="confirm"
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
          minLength={8}
          placeholder="••••••••"
          className={`bg-stone-800 border-stone-700 text-stone-100 placeholder-stone-500 ${focusClass}`}
        />
      </div>
      <Button
        type="submit"
        size="lg"
        variant={accent === "amber" ? "amber" : "default"}
        className={accent === "violet" ? "w-full bg-violet-600 hover:bg-violet-500 text-white" : "w-full"}
        disabled={loading}
      >
        {loading ? "Sparar…" : "Spara nytt lösenord"}
      </Button>
    </form>
  )
}
