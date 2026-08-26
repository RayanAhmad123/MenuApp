import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { JsonLd } from "@/components/seo/JsonLd"
import {
  MarketingShell,
  FAQAccordion,
  CTASection,
} from "@/components/seo/MarketingShell"
import { GuideArticle } from "@/components/guides/GuideArticle"
import {
  SITE_URL,
  articleSchema,
  breadcrumbSchema,
  faqSchema,
} from "@/lib/seo/structured-data"
import { GUIDE_SLUGS, getGuide } from "@/lib/guides"

interface Props {
  params: { slug: string }
}

export const dynamicParams = false

export function generateStaticParams() {
  return GUIDE_SLUGS.map((slug) => ({ slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const guide = getGuide(params.slug)
  if (!guide) return {}
  const url = `${SITE_URL}/guider/${guide.slug}`
  return {
    title: guide.metaTitle,
    description: guide.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "sv_SE",
      url,
      siteName: "Servera",
      title: guide.metaTitle,
      description: guide.description,
      publishedTime: guide.datePublished,
      modifiedTime: guide.dateModified,
    },
    twitter: {
      card: "summary_large_image",
      title: guide.metaTitle,
      description: guide.description,
    },
  }
}

export default function GuidePage({ params }: Props) {
  const guide = getGuide(params.slug)
  if (!guide) notFound()

  const url = `${SITE_URL}/guider/${guide.slug}`

  return (
    <MarketingShell>
      <JsonLd
        data={articleSchema({
          url,
          headline: guide.title,
          description: guide.description,
          datePublished: guide.datePublished,
          dateModified: guide.dateModified,
        })}
      />
      <JsonLd data={faqSchema(guide.faq)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Startsida", url: `${SITE_URL}/` },
          { name: "Guider", url: `${SITE_URL}/guider` },
          { name: guide.title, url },
        ])}
      />

      <div className="bg-white">
        <GuideArticle guide={guide} />
      </div>

      <FAQAccordion items={guide.faq} heading="Vanliga frågor" />

      <CTASection
        headline="Se hur det fungerar i praktiken"
        sub="Boka en kostnadsfri demo av Servera — vi sätter upp din meny tillsammans på ett videosamtal."
      />
    </MarketingShell>
  )
}
