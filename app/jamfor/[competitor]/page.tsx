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
import { COMPARISONS, COMPARISON_SLUGS } from "@/lib/seo/comparisons"

export const dynamicParams = false

export function generateStaticParams() {
  return COMPARISON_SLUGS.map((competitor) => ({ competitor }))
}

export async function generateMetadata({
  params,
}: {
  params: { competitor: string }
}): Promise<Metadata> {
  const c = COMPARISONS[params.competitor]
  if (!c) return { title: "Jämförelse" }
  const url = `${SITE_URL}/jamfor/${c.slug}`
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

export default function ComparisonPage({
  params,
}: {
  params: { competitor: string }
}) {
  const c = COMPARISONS[params.competitor]
  if (!c) notFound()

  const pageUrl = `${SITE_URL}/jamfor/${c.slug}`
  const breadcrumb = breadcrumbSchema([
    { name: "Servera", url: SITE_URL },
    { name: "Jämför", url: `${SITE_URL}/jamfor` },
    { name: `Servera vs ${c.competitorName}`, url: pageUrl },
  ])

  return (
    <MarketingShell>
      <JsonLd id="ld-breadcrumb" data={breadcrumb} />
      <JsonLd id="ld-faq" data={faqSchema(c.faq)} />

      <section className="py-16 sm:py-24 border-b border-stone-200 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-stone-200 rounded-full text-stone-700 text-[10px] font-bold uppercase tracking-widest mb-5 shadow-sm">
            {c.hero.eyebrow}
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-950 font-bold tracking-tight leading-[1.05] mb-5">
            {c.hero.h1}
          </h1>
          <p className="text-stone-600 text-lg leading-relaxed">{c.hero.sub}</p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-stone-700 text-lg leading-[1.7]">{c.intro}</p>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-white border-y border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-50 border border-stone-200 rounded-full text-stone-700 text-[10px] font-bold uppercase tracking-widest mb-5">
              Det här gör Servera bra
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-bold tracking-tight">
              Serveras styrkor
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {c.serveraStrengths.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-6"
              >
                <h3 className="font-serif text-xl text-stone-950 font-semibold mb-2">
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
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-50 border border-stone-200 rounded-full text-stone-700 text-[10px] font-bold uppercase tracking-widest mb-5">
              Köpguide
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-bold tracking-tight">
              Vad du bör jämföra när du väljer
            </h2>
          </div>
          <div className="space-y-6">
            {c.decisionGuide.map((d) => (
              <div
                key={d.heading}
                className="rounded-2xl border border-stone-200 bg-white p-6"
              >
                <h3 className="font-serif text-lg text-stone-950 font-semibold mb-2">
                  {d.heading}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {d.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/priser"
              className="text-amber-700 hover:text-amber-800 underline-offset-4 hover:underline text-sm font-medium"
            >
              Se Serveras priser →
            </Link>
          </div>
        </div>
      </section>

      <FAQAccordion
        items={c.faq}
        heading={`Frågor om Servera vs ${c.competitorName}`}
      />

      <CTASection
        headline={`Vill du jämföra Servera med ${c.competitorName} live?`}
        sub="Boka 20 minuter med oss. Vi visar plattformen, går igenom din meny och svarar på de tekniska frågorna."
      />
    </MarketingShell>
  )
}
