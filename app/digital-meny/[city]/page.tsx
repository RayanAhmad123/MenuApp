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
import { CITIES, CITY_SLUGS } from "@/lib/seo/cities"

export const dynamicParams = false

export function generateStaticParams() {
  return CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({
  params,
}: {
  params: { city: string }
}): Promise<Metadata> {
  const c = CITIES[params.city]
  if (!c) return { title: "Digital meny" }
  const url = `${SITE_URL}/digital-meny/${c.slug}`
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "sv_SE",
      url,
      siteName: "Servera",
      title: c.metaTitle,
      description: c.metaDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: c.metaTitle,
      description: c.metaDescription,
    },
  }
}

export default function CityPage({
  params,
}: {
  params: { city: string }
}) {
  const c = CITIES[params.city]
  if (!c) notFound()

  const pageUrl = `${SITE_URL}/digital-meny/${c.slug}`
  const breadcrumb = breadcrumbSchema([
    { name: "Servera", url: SITE_URL },
    { name: "Digital meny", url: `${SITE_URL}/digital-meny` },
    { name: c.name, url: pageUrl },
  ])

  return (
    <MarketingShell>
      <JsonLd id="ld-breadcrumb" data={breadcrumb} />
      <JsonLd id="ld-faq" data={faqSchema(c.faq)} />

      <section className="py-16 sm:py-24 border-b border-stone-200 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-stone-200 rounded-full text-stone-700 text-[10px] font-bold uppercase tracking-widest mb-5 shadow-sm">
            {c.region}
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-950 font-bold tracking-tight leading-[1.05] mb-5">
            Digital meny för restauranger i {c.name}
          </h1>
          <p className="text-stone-600 text-lg leading-relaxed">
            QR-beställning, mobilbetalning och realtidsmeny för {c.name}s
            restauranger, caféer och barer.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <p className="text-stone-700 text-lg leading-[1.7]">{c.intro}</p>
          <p className="text-stone-700 text-base leading-[1.7]">
            {c.localContext}
          </p>
          <div className="rounded-2xl bg-stone-100 p-5 border border-stone-200 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">
                Befolkning
              </div>
              <div className="text-stone-950 font-semibold">{c.population}</div>
            </div>
            <div>
              <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">
                Restauranger
              </div>
              <div className="text-stone-950 font-semibold">
                {c.restaurantCountApprox}
              </div>
            </div>
            <div>
              <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">
                Region
              </div>
              <div className="text-stone-950 font-semibold">{c.region}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-white border-y border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-bold tracking-tight">
              Varför Servera passar restauranger i {c.name}
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {c.whyServeraHere.map((s) => (
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
              Köksstilar i {c.name} där Servera fungerar
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {c.cuisineHighlights.map((cuisine) => (
              <span
                key={cuisine}
                className="px-4 py-2 bg-white border border-stone-200 rounded-full text-stone-700 text-sm"
              >
                {cuisine}
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

      <FAQAccordion items={c.faq} heading={`Vanliga frågor — ${c.name}`} />

      <CTASection
        headline={`Se Servera live för din restaurang i ${c.name}`}
        sub="20 minuter, helt utan kostnad. Vi visar plattformen, går igenom din meny och hjälper dig komma igång."
      />
    </MarketingShell>
  )
}
