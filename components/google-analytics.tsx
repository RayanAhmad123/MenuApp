"use client"

import Script from "next/script"

// Public by design — the Measurement ID ships in client HTML anyway.
// Overridable via NEXT_PUBLIC_GA_MEASUREMENT_ID for staging/other streams.
const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-52TFVVKWT5"

export function GoogleAnalytics() {
  // Never load in local dev — keeps test traffic out of the live property.
  if (process.env.NODE_ENV !== "production") return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  )
}
