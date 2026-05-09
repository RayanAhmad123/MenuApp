"use client"

import { Suspense, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

const ENDPOINT = "https://portal.triadsolutions.se/api/analytics/track"
const APP_SLUG = "servera"

function Beacon() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return
    if (typeof window === "undefined") return

    let sid = window.localStorage.getItem("triad_sid")
    if (!sid) {
      sid = (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)).slice(0, 16)
      window.localStorage.setItem("triad_sid", sid)
    }

    const qs = searchParams?.toString()
    const payload = JSON.stringify({
      app_slug: APP_SLUG,
      path: qs ? `${pathname}?${qs}` : pathname,
      referrer: document.referrer || null,
      session_id: sid,
    })

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: "application/json" }))
      } else {
        fetch(ENDPOINT, {
          method: "POST",
          keepalive: true,
          headers: { "Content-Type": "application/json" },
          body: payload,
        }).catch(() => {})
      }
    } catch {}
  }, [pathname, searchParams])

  return null
}

export function TriadAnalytics() {
  return <Suspense fallback={null}><Beacon /></Suspense>
}
