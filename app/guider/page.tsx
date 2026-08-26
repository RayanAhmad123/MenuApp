import type { Metadata } from "next"
import Link from "next/link"
import { JsonLd } from "@/components/seo/JsonLd"
import { MarketingShell, CTASection } from "@/components/seo/MarketingShell"
import {
  SITE_URL,
  breadcrumbSchema,
  collectionPageSchema,
} from "@/lib/seo/structured-data"
import { GUIDES } from "@/lib/guides"

const PAGE_URL = `${SITE_URL}/guider`

export const metadata: Metadata = {
  title: "Guider för digital meny & restaurangdrift",
  description:
    "Praktiska guider för svenska restauranger: digital meny från grunden, kostnader, lagkrav om allergener, flerspråkiga menyer och bytet från papper och PDF.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: PAGE_URL,
    siteName: "Servera",
    title: "Guider för digital meny & restaurangdrift",
    description:
      "Praktiska, källbelagda guider om digital meny för svenska restauranger, caféer och barer.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guider för digital meny & restaurangdrift",
    description:
      "Praktiska, källbelagda guider om digital meny för svenska restauranger, caféer och barer.",
  },
}

export default function GuidesIndexPage() {
  const [pillar, ...rest] = GUIDES

  return (
    <MarketingShell>
      <JsonLd
        data={collectionPageSchema({
          name: "Guider för digital meny & restaurangdrift",
          url: PAGE_URL,
          description:
            "Praktiska guider om digital meny för svenska restauranger: kostnader, lagkrav, flerspråkighet och migrering från papper och PDF.",
          items: GUIDES.map((g) => ({
            name: g.title,
            url: `${SITE_URL}/guider/${g.slug}`,
            description: g.description,
          })),
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Startsida", url: `${SITE_URL}/` },
          { name: "Guider", url: PAGE_URL },
        ])}
      />

      <section className="py-14 sm:py-20 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-50 border border-stone-200 rounded-full text-stone-700 text-[10px] font-bold uppercase tracking-widest mb-5">
            Guider
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-stone-950 font-bold tracking-tight mb-4">
            Guider för digital meny
          </h1>
          <p className="text-stone-600 text-lg leading-relaxed max-w-2xl">
            Praktiska, källbelagda guider för dig som driver restaurang, café
            eller bar i Sverige — utan säljfluff, med riktiga siffror och
            lagkraven på plats.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Link
            href={`/guider/${pillar.slug}`}
            className="block rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 mb-8 hover:shadow-md transition-shadow"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-700 mb-3">
              {pillar.category} · {pillar.readingMinutes} min
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-950 font-bold tracking-tight mb-3">
              {pillar.title}
            </h2>
            <p className="text-stone-600 leading-relaxed max-w-3xl">{pillar.description}</p>
          </Link>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((g) => (
              <Link
                key={g.slug}
                href={`/guider/${g.slug}`}
                className="block rounded-2xl border border-stone-200 bg-white p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-3">
                  {g.category} · {g.readingMinutes} min
                </div>
                <h3 className="font-serif text-lg text-stone-950 font-semibold leading-snug mb-2">
                  {g.title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">{g.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        headline="Redo att testa digital meny på riktigt?"
        sub="Boka en kostnadsfri demo så sätter vi upp din meny tillsammans — eller utforska priserna först."
      />
    </MarketingShell>
  )
}
