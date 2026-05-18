import type { Metadata } from "next"
import Link from "next/link"
import { JsonLd } from "@/components/seo/JsonLd"
import { MarketingShell } from "@/components/seo/MarketingShell"
import { CookieSettingsLink } from "@/components/cookie-consent"
import { SITE_URL, breadcrumbSchema } from "@/lib/seo/structured-data"

const PAGE_URL = `${SITE_URL}/cookies`

export const metadata: Metadata = {
  title: "Cookiepolicy — så använder Servera cookies",
  description:
    "Information om hur Servera använder cookies och liknande tekniker, vilka cookies som är nödvändiga, vilka som kräver samtycke och hur du ändrar dina val.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: PAGE_URL,
    siteName: "Servera",
    title: "Cookiepolicy — Servera",
    description:
      "Så använder Servera cookies och liknande tekniker. Hantera dina samtyckesval.",
  },
  robots: { index: true, follow: true },
}

const COOKIE_TABLE = [
  {
    category: "Nödvändiga",
    purpose:
      "Inloggning, sessionshantering, säkerhet och grundläggande funktioner.",
    examples: "Supabase-autentisering, säkerhetstoken",
    consent: "Krävs inget samtycke",
  },
  {
    category: "Analys & statistik",
    purpose:
      "Anonym besöksstatistik om hur webbplatsen används, för att vi ska kunna förbättra den.",
    examples: "Vercel Analytics, Triad Analytics (anonymt sessions-ID)",
    consent: "Kräver samtycke",
  },
]

export default function CookiePolicyPage() {
  return (
    <MarketingShell>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Start", url: SITE_URL },
          { name: "Cookiepolicy", url: PAGE_URL },
        ])}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-stone-700">
          Integritet
        </div>
        <h1 className="font-serif text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
          Cookiepolicy
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          Den här sidan förklarar hur Servera använder cookies och liknande
          tekniker, och hur du själv styr vilka som får användas.
        </p>

        <div className="prose prose-stone mt-10 max-w-none">
          <h2 className="font-serif text-2xl font-bold text-stone-950">
            Vad är cookies?
          </h2>
          <p className="mt-3 leading-relaxed text-stone-600">
            Cookies är små textfiler som lagras i din webbläsare när du
            besöker en webbplats. De används för att webbplatsen ska fungera,
            för att komma ihåg dina val och för att samla in statistik. Servera
            använder även liknande tekniker, till exempel lagring i
            webbläsaren (localStorage), som vi i den här policyn samlat kallar
            ”cookies”.
          </p>

          <h2 className="mt-10 font-serif text-2xl font-bold text-stone-950">
            Cookies vi använder
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-stone-300 text-left">
                  <th className="py-2 pr-4 font-semibold text-stone-950">
                    Kategori
                  </th>
                  <th className="py-2 pr-4 font-semibold text-stone-950">
                    Syfte
                  </th>
                  <th className="py-2 pr-4 font-semibold text-stone-950">
                    Exempel
                  </th>
                  <th className="py-2 font-semibold text-stone-950">
                    Samtycke
                  </th>
                </tr>
              </thead>
              <tbody>
                {COOKIE_TABLE.map((row) => (
                  <tr
                    key={row.category}
                    className="border-b border-stone-200 align-top"
                  >
                    <td className="py-3 pr-4 font-medium text-stone-950">
                      {row.category}
                    </td>
                    <td className="py-3 pr-4 text-stone-600">{row.purpose}</td>
                    <td className="py-3 pr-4 text-stone-600">
                      {row.examples}
                    </td>
                    <td className="py-3 text-stone-600">{row.consent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mt-10 font-serif text-2xl font-bold text-stone-950">
            Nödvändiga cookies
          </h2>
          <p className="mt-3 leading-relaxed text-stone-600">
            Dessa cookies krävs för att webbplatsen ska fungera, till exempel
            för att hålla dig inloggad och skydda mot säkerhetshot. De kan inte
            stängas av eftersom tjänsten inte fungerar utan dem. De sätts utan
            att samtycke krävs.
          </p>

          <h2 className="mt-10 font-serif text-2xl font-bold text-stone-950">
            Analys & statistik
          </h2>
          <p className="mt-3 leading-relaxed text-stone-600">
            Med ditt samtycke använder vi cookies för anonym besöksstatistik.
            Den hjälper oss att förstå hur webbplatsen används så att vi kan
            förbättra den. Vi sätter inga sådana cookies eller identifierare
            innan du har gett ditt samtycke, och statistiken kopplas inte till
            din identitet.
          </p>

          <h2 className="mt-10 font-serif text-2xl font-bold text-stone-950">
            Ändra dina val
          </h2>
          <p className="mt-3 leading-relaxed text-stone-600">
            Du kan när som helst ändra eller återkalla ditt samtycke. Ditt val
            sparas i din webbläsare och gäller tills du ändrar det eller
            rensar webbläsardata.
          </p>
          <p className="mt-4">
            <CookieSettingsLink className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800">
              Hantera cookie-inställningar
            </CookieSettingsLink>
          </p>

          <h2 className="mt-10 font-serif text-2xl font-bold text-stone-950">
            Kontakt
          </h2>
          <p className="mt-3 leading-relaxed text-stone-600">
            Servera drivs av Triad Solutions. Har du frågor om cookies eller
            hur vi behandlar personuppgifter är du välkommen att{" "}
            <Link
              href="/#contact"
              className="font-medium text-stone-950 underline underline-offset-2 hover:text-amber-600"
            >
              kontakta oss
            </Link>
            .
          </p>
        </div>
      </article>
    </MarketingShell>
  )
}
