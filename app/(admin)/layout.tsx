import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  // Auth check happens in middleware, but double-check here for non-login routes
  return <>{children}</>
}
