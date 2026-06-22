"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface ForgotPasswordFormProps {
  /** Page the email link should ultimately land on (after the /auth/callback exchange). */
  resetPath: string
  accent: "amber" | "violet"
}

export function ForgotPasswordForm({ resetPath, accent }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const focusClass = accent === "violet" ? "focus:border-violet-500" : "focus:border-amber-500"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // The email link comes straight back to the set-new-password page. Supabase
    // appends the recovery token as a URL fragment, which the reset page reads
    // client-side to establish the recovery session.
    const redirectTo = `${window.location.origin}${resetPath}`
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    setLoading(false)
    if (error) {
      toast({ title: "Kunde inte skicka återställning", description: error.message, variant: "destructive" })
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center space-y-3">
        <p className="text-stone-200">Kolla din inkorg</p>
        <p className="text-stone-400 text-sm">
          Om <span className="text-stone-200">{email}</span> har ett konto har vi skickat en länk för att
          återställa lösenordet. Länken är giltig en begränsad tid.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-stone-400 text-sm">
        Ange din e-postadress så skickar vi en länk för att återställa lösenordet.
      </p>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-stone-300">E-post</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="namn@exempel.se"
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
        {loading ? "Skickar…" : "Skicka återställningslänk"}
      </Button>
    </form>
  )
}
