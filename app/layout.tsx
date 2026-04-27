import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  metadataBase: new URL("https://servera.triadsolutions.se"),
  title: {
    template: "%s | Servera",
    default: "Servera — Restaurang-plattform för QR-beställning",
  },
  description: "Servera — premium digital menu- och beställningsplattform för moderna restauranger.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
