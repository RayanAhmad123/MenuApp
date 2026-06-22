"use client"
import { useEffect } from "react"

// Fallback for password-recovery links. Supabase appends the recovery token as
// a URL fragment (#access_token=…&type=recovery). When its redirect target
// isn't allow-listed it falls back to the Site URL ("/"), so the token can land
// on any page. This catches that case anywhere and forwards to the reset page,
// fragment intact. The reset pages handle the token themselves, so we skip them
// to avoid a redirect loop.
const RESET_PATHS = ["/reset-password", "/admin/reset-password", "/superadmin/reset-password"]

export function RecoveryRedirect() {
  useEffect(() => {
    const hash = window.location.hash
    if (!hash.includes("type=recovery") || !hash.includes("access_token")) return
    if (RESET_PATHS.includes(window.location.pathname)) return
    window.location.replace(`/reset-password${hash}`)
  }, [])

  return null
}
