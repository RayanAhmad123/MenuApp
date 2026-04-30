import { createServerClient } from "@supabase/ssr"
import { cookies, headers } from "next/headers"
import type { Database } from "@/types/database"
import { cookieDomainForHost } from "@/lib/tenant"

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  const hdrs = await headers()
  const cookieDomain = cookieDomainForHost(hdrs.get("host"))

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, {
                ...options,
                ...(cookieDomain ? { domain: cookieDomain } : {}),
              })
            )
          } catch {
            // Server Component — cookies can only be set in Server Actions / Route Handlers
          }
        },
      },
    }
  )
}

export async function createAdminSupabaseClient() {
  const cookieStore = await cookies()
  const hdrs = await headers()
  const cookieDomain = cookieDomainForHost(hdrs.get("host"))

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, {
                ...options,
                ...(cookieDomain ? { domain: cookieDomain } : {}),
              })
            )
          } catch {
            // intentionally ignored in server components
          }
        },
      },
    }
  )
}
