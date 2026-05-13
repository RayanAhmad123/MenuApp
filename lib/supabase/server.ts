import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
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

// IMPORTANT: do NOT use createServerClient here. @supabase/ssr forwards the
// caller's auth cookie, which makes PostgREST run queries under the user's
// `authenticated` role (with RLS enforced) — even when we pass a service-role
// key. We want admin work (e.g. customer-side placeOrder) to bypass RLS
// regardless of whether the visitor happens to be logged in. Using the plain
// @supabase/supabase-js client with no session keeps the service-role JWT
// as the actual Authorization header.
export async function createAdminSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  )
}
