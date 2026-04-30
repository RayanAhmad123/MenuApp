import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"
import { extractSubdomainFromHost, isTenantSubdomain } from "@/lib/tenant"

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host")
  const sub = extractSubdomainFromHost(host)
  const path = request.nextUrl.pathname

  let rewriteUrl: URL | null = null
  if (isTenantSubdomain(sub)) {
    const isAdmin = path.startsWith("/admin")
    const isKitchen = path.startsWith("/kitchen")
    const isWaiter = path.startsWith("/waiter")
    const isApi = path.startsWith("/api")
    const isInternal = path.startsWith("/_next")
    const isFile = /\.[a-z0-9]+$/i.test(path)
    const alreadyPrefixed = path === `/${sub}` || path.startsWith(`/${sub}/`)

    if (!isAdmin && !isKitchen && !isWaiter && !isApi && !isInternal && !isFile && !alreadyPrefixed) {
      rewriteUrl = request.nextUrl.clone()
      rewriteUrl.pathname = `/${sub}${path}`
    }
  }

  return await updateSession(request, rewriteUrl)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
