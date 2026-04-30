import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/database"
import { cookieDomainForHost } from "@/lib/tenant"

interface CookieOptions {
  maxAge?: number
  expires?: Date
  path?: string
  sameSite?: "lax" | "strict" | "none"
  secure?: boolean
  domain?: string
}

function parseDocumentCookies(): { name: string; value: string }[] {
  if (typeof document === "undefined" || !document.cookie) return []
  return document.cookie.split("; ").map((c) => {
    const idx = c.indexOf("=")
    if (idx === -1) return { name: c, value: "" }
    return { name: c.slice(0, idx), value: decodeURIComponent(c.slice(idx + 1)) }
  })
}

function serializeCookie(name: string, value: string, options: CookieOptions = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`]
  parts.push(`Path=${options.path ?? "/"}`)
  if (options.domain) parts.push(`Domain=${options.domain}`)
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`)
  if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`)
  if (options.sameSite) {
    const s = options.sameSite
    parts.push(`SameSite=${s[0].toUpperCase()}${s.slice(1)}`)
  }
  if (options.secure) parts.push("Secure")
  return parts.join("; ")
}

export function createClient() {
  const cookieDomain =
    typeof window !== "undefined"
      ? cookieDomainForHost(window.location.host)
      : undefined

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: parseDocumentCookies,
        setAll(cookiesToSet) {
          if (typeof document === "undefined") return
          for (const { name, value, options } of cookiesToSet) {
            document.cookie = serializeCookie(name, value, {
              ...(options as CookieOptions),
              ...(cookieDomain ? { domain: cookieDomain, secure: true } : {}),
            })
          }
        },
      },
    }
  )
}
