import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-playfair",
})

const SITE_URL = "https://servera.triadsolutions.se"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Servera",
    default: "Servera — Digital meny & QR-beställning för restauranger",
  },
  description:
    "Servera är en svensk plattform för digital meny, QR-beställning och kontaktlös betalning. Skapa en QR-meny på minuter, uppdatera priser i realtid och öka ordervärdet med smartare gästupplevelse.",
  applicationName: "Servera",
  keywords: [
    "digital meny",
    "QR meny",
    "QR-meny restaurang",
    "digital meny restaurang",
    "QR kod meny",
    "restaurangsystem",
    "beställning via mobil",
    "kontaktlös beställning",
    "digital menytavla",
    "menyhantering restaurang",
    "Servera",
    "Triad Solutions",
  ],
  authors: [{ name: "Triad Solutions", url: "https://triadsolutions.se" }],
  creator: "Triad Solutions",
  publisher: "Triad Solutions",
  category: "Business Software",
  alternates: {
    canonical: "/",
    languages: {
      "sv-SE": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: SITE_URL,
    siteName: "Servera",
    title: "Servera — Digital meny & QR-beställning för restauranger",
    description:
      "Premium digital meny- och beställningsplattform för moderna restauranger. QR-meny, mobilbeställning och realtidsuppdateringar — på minuter.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Servera — Digital meny & QR-beställning för restauranger",
    description:
      "Premium digital meny- och beställningsplattform för moderna restauranger.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/logo.svg",
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="sv"
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
