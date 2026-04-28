import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { JsonLd } from "@/components/seo/JsonLd"
import {
  MarketingShell,
  FAQAccordion,
  CTASection,
} from "@/components/seo/MarketingShell"
import {
  SITE_URL,
  faqSchema,
  breadcrumbSchema,
} from "@/lib/seo/structured-data"
import {
  RESTAURANT_TYPES,
  RESTAURANT_TYPE_SLUGS,
} from "@/lib/seo/restaurant-types"

export const dynamicParams = false

export function generateStaticParams() {
  return RESTAURANT_TYPE_SLUGS.map((typ) => ({ typ }))
}

export async function generateMetadata({
  params,
}: {
  params: { typ: string }
}): Promise<Metadata> {
  const t = RESTAURANT_TYPES[params.typ]
  if (!t) return { title: "QR-meny" }
  const url = `${SITE_URL}/qr-meny/${t.slug}`
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "sv_SE",
      url,
      siteName: "Servera",
      title: t.metaTitle,
      description: t.metaDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: t.metaTitle,
      description: t.metaDescription,
    },
  }
}

export default function RestaurantTypePage({
  params,
}: {
  params: { typ: string }
}) {
  const t = RESTAURANT_TYPES[params.typ]
  if (!t) notFound()

  const pageUrl = `${SITE_URL}/qr-meny/${t.slug}`
  const breadcrumb = breadcrumbSchema([
    { name: "Servera", url: SITE_URL },
    { name: "QR-meny", url: `${SITE_URL}/qr-meny` },
    { name: t.pluralName, url: pageUrl },
  ])

  return (
    <MarketingShell>
      <JsonLd id="ld-breadcrumb" data={breadcrumb} />
      <JsonLd id="ld-faq" data={faqSchema(t.faq)} />

      <section className="py-16 sm:py-24 border-b border-stone-200 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-stone-200 rounded-full text-stone-700 text-[10px] font-bold uppercase tracking-widest mb-5 shadow-sm">
            QR-meny
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-950 font-bold tracking-tight leading-[1.05] mb-5">
            QR-meny för {t.pluralName}
          </h1>
          <p className="text-stone-600 text-lg leading-relaxed">
            Digital meny och mobilbeställning byggd för {t.pluralName} — gäster
            scannar, beställer och betalar från sin egen mobil.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <p className="text-stone-700 text-lg leading-[1.7]">{t.intro}</p>
          <p className="text-stone-700 text-base leading-[1.7]">{t.context}</p>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-white border-y border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-bold tracking-tight">
              Varför Servera passar {t.pluralName}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {t.whyServeraFits.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-6"
              >
                <h3 className="font-serif text-lg text-stone-950 font-semibold mb-2">
                  {s.title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-950 font-bold tracking-tight">
              Exempelkategorier för {t.pluralName}
            </h2>
            <p className="text-stone-500 mt-2 text-sm">
              Strukturera menyn så som du jobbar.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {t.exampleSections.map((s) => (
              <span
                key={s}
                className="px-4 py-2 bg-white border border-stone-200 rounded-full text-stone-700 text-sm"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/priser"
              className="text-amber-700 hover:text-amber-800 underline-offset-4 hover:underline text-sm font-medium"
            >
              Se priser i SEK →
            </Link>
          </div>
        </div>
      </section>

      <FAQAccordion
        items={t.faq}
        heading={`Frågor om Servera för ${t.pluralName}`}
      />

      <CTASection
        headline={`Se Servera för din ${t.name} live`}
        sub="20 minuter, helt utan kostnad. Vi visar plattformen, går igenom din meny och hjälper dig komma igång."
      />
    </MarketingShell>
  )
}
