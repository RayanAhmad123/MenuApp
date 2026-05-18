"use client"

import { Analytics } from "@vercel/analytics/next"
import { TriadAnalytics } from "@/components/triad-analytics"
import { useCookieConsent } from "@/components/cookie-consent"

export function ConsentedAnalytics() {
  const { consent } = useCookieConsent()

  if (!consent?.analytics) return null

  return (
    <>
      <Analytics />
      <TriadAnalytics />
    </>
  )
}
