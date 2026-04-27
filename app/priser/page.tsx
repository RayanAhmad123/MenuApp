import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { JsonLd } from "@/components/seo/JsonLd"
import {
  SITE_URL,
  productSchema,
  faqSchema,
  breadcrumbSchema,
} from "@/lib/seo/structured-data"

const PAGE_URL = `${SITE_URL}/priser`

export const metadata: Metadata = {
  title: "Priser för digital meny — Servera",
  description:
    "Se priser för Servera: digital meny och QR-beställning för restauranger. Från 549 kr/mån. Inga dolda avgifter, inga provisioner per beställning. Fast månadskostnad i SEK.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: PAGE_URL,
    siteName: "Servera",
    title: "Priser för digital meny — Servera",
    description:
      "Se priser för Servera: QR-meny och mobilbeställning för svenska restauranger. Från 549 kr/mån. Inga provisioner.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Priser för digital meny — Servera",
    description:
      "Från 549 kr/mån. Inga dolda avgifter, inga provisioner per beställning.",
  },
}

interface Tier {
  name: string
  slug: string
  priceSEK: number | null
  priceLabel: string
  period: string
  desc: string
  longDesc: string
  features: string[]
  highlight: boolean
  cta: string
}

const TIERS: Tier[] = [
  {
    name: "Start",
    slug: "start",
    priceSEK: 549,
    priceLabel: "549",
    period: "kr/mån",
    desc: "Perfekt för restauranger med ett ställe.",
    longDesc:
      "Ingångsplanen för dig som vill komma igång med digital meny och QR-beställning utan stora investeringar. Allt du behöver för att ersätta tryckta menyer och börja ta emot mobilbeställningar redan idag.",
    features: [
      "1 restaurang",
      "Upp till 20 bord",
      "QR-beställning från bordet",
      "Kökets skärm i realtid",
      "Allergeninformation och kostmärkning",
      "E-postsupport",
    ],
    highlight: false,
    cta: "Kom igång",
  },
  {
    name: "Tillväxt",
    slug: "tillvaxt",
    priceSEK: 999,
    priceLabel: "999",
    period: "kr/mån",
    desc: "För växande restauranger med fler platser.",
    longDesc:
      "För restauranger som har mer än 20 bord eller behöver djupare insikter. Allt i Start plus avancerad försäljningsstatistik och prioriterad support — utan att du behöver byta plattform när verksamheten växer.",
    features: [
      "1 restaurang",
      "Obegränsat antal bord",
      "Allt i Start",
      "Avancerad försäljningsstatistik",
      "Topplista per kategori och tid",
      "Prioriterad support",
    ],
    highlight: true,
    cta: "Boka demo",
  },
  {
    name: "Företag",
    slug: "foretag",
    priceSEK: null,
    priceLabel: "Offert",
    period: "",
    desc: "För kedjor och grupper som behöver mer.",
    longDesc:
      "För restauranggrupper, franchisekedjor och hotell som behöver flera enheter under samma konto, white-label-lösning eller skräddarsydd integration mot kassasystem som Caspeco, Trivec eller Onslip.",
    features: [
      "Obegränsat antal restauranger",
      "White-label (egen domän och varumärke)",
      "Anpassade integrationer",
      "Dedikerad kontaktperson",
      "SLA-garanti",
      "Onboarding och utbildning",
    ],
    highlight: false,
    cta: "Kontakta säljteamet",
  },
]

const PRICING_FAQ = [
  {
    question: "Vad kostar Servera?",
    answer:
      "Servera börjar på 549 kr/mån för Start-planen, 999 kr/mån för Tillväxt-planen, och offert för Företag. Alla priser är i svenska kronor (SEK), inga dolda avgifter och inga provisioner per beställning.",
  },
  {
    question: "Tar ni provision per beställning?",
    answer:
      "Nej. Servera tar en fast månadskostnad. Du behåller hela beloppet från varje beställning gästen lägger via QR-menyn. Detta skiljer Servera från många internationella plattformar som tar 2–5 % per order.",
  },
  {
    question: "Finns det en gratisversion eller provperiod?",
    answer:
      "Vi erbjuder en kostnadsfri demo där vi går igenom hur Servera passar din restaurang. Boka via vår kontaktsida.",
  },
  {
    question: "Kan jag byta plan senare?",
    answer:
      "Ja. Du kan uppgradera eller nedgradera när som helst. Vid uppgradering debiteras endast mellanskillnaden för innevarande månad.",
  },
  {
    question: "Vad ingår i Företag-planen?",
    answer:
      "Företag-planen är för restauranggrupper med flera enheter, kedjor som vill köra Servera under sin egen domän (white-label), och verksamheter som behöver integration mot befintliga kassasystem som Caspeco, Trivec eller Onslip. Kontakta säljteamet för en skräddarsydd offert.",
  },
  {
    question: "Behöver jag binda upp mig?",
    answer:
      "Nej. Servera har ingen bindningstid på Start- och Tillväxt-planerna — du kan säga upp när som helst med 30 dagars uppsägning.",
  },
]

export default function PriserPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Servera", url: SITE_URL },
    { name: "Priser", url: PAGE_URL },
  ])

  return (
    <main className="min-h-screen bg-stone-50 font-sans antialiased">
      <JsonLd id="ld-breadcrumb" data={breadcrumb} />
      <JsonLd id="ld-faq" data={faqSchema(PRICING_FAQ)} />
      {TIERS.map((t) => (
        <JsonLd
          key={t.slug}
          id={`ld-product-${t.slug}`}
          data={productSchema({
            name: t.name,
            description: t.longDesc,
            priceSEK: t.priceSEK,
            url: `${PAGE_URL}#${t.slug}`,
            features: t.features,
          })}
        />
      ))}

      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Servera" className="h-9 w-auto" />
            <span className="font-serif text-xl text-stone-950 font-bold tracking-tight">
              Servera
            </span>
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-950 text-white text-sm font-semibold rounded-full hover:bg-stone-800 transition-colors"
          >
            Boka demo
          </Link>
        </div>
      </header>

      <section className="py-20 sm:py-28 border-b border-stone-200 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-stone-200 rounded-full text-stone-700 text-[10px] font-bold uppercase tracking-widest mb-5 shadow-sm">
            Priser
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-950 font-bold tracking-tight leading-[1.05] mb-5">
            Enkla, ärliga priser i svenska kronor.
          </h1>
          <p className="text-stone-600 text-lg leading-relaxed">
            Inga dolda avgifter. Inga provisioner per beställning. En fast
            månadskostnad — behåll varje krona du tjänar. Servera är digital meny
            och QR-beställning för svenska restauranger, byggt i Sverige av Triad
            Solutions.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {TIERS.map((t) => (
              <div
                key={t.slug}
                id={t.slug}
                className={`relative rounded-3xl p-7 flex flex-col ${
                  t.highlight
                    ? "bg-stone-950 text-white lg:scale-[1.04] shadow-2xl shadow-stone-950/20"
                    : "bg-white border border-stone-200"
                }`}
              >
                {t.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-stone-950 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Mest populär
                  </div>
                )}
                <div className="mb-6">
                  <div
                    className={`text-xs font-bold uppercase tracking-widest mb-3 ${
                      t.highlight ? "text-amber-400" : "text-stone-500"
                    }`}
                  >
                    {t.name}
                  </div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span
                      className={`font-serif text-5xl font-bold ${
                        t.highlight ? "text-white" : "text-stone-950"
                      }`}
                    >
                      {t.priceLabel}
                    </span>
                    {t.period && (
                      <span
                        className={`text-sm ${
                          t.highlight ? "text-stone-400" : "text-stone-500"
                        }`}
                      >
                        {t.period}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      t.highlight ? "text-stone-300" : "text-stone-600"
                    }`}
                  >
                    {t.desc}
                  </p>
                </div>

                <ul className="space-y-2.5 mb-7 flex-1">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle2
                        className={`h-4 w-4 shrink-0 mt-0.5 ${
                          t.highlight ? "text-amber-400" : "text-amber-500"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          t.highlight ? "text-stone-200" : "text-stone-700"
                        }`}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/#contact"
                  className={`text-center px-5 py-3 rounded-full font-semibold text-sm transition-colors ${
                    t.highlight
                      ? "bg-amber-500 text-stone-950 hover:bg-amber-400"
                      : "bg-stone-950 text-white hover:bg-stone-800"
                  }`}
                >
                  {t.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white border-t border-stone-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-50 border border-stone-200 rounded-full text-stone-700 text-[10px] font-bold uppercase tracking-widest mb-5">
              Vanliga frågor
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-bold tracking-tight">
              Frågor om priser
            </h2>
          </div>

          <div className="space-y-4">
            {PRICING_FAQ.map((q) => (
              <details
                key={q.question}
                className="group rounded-2xl border border-stone-200 bg-stone-50 p-5 open:bg-white open:shadow-sm transition-all"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="font-serif text-lg text-stone-950 font-semibold pr-4">
                    {q.question}
                  </h3>
                  <span className="text-stone-400 group-open:rotate-45 transition-transform text-2xl leading-none">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-stone-600 leading-relaxed text-sm">
                  {q.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Boka en kostnadsfri demo
          </h2>
          <p className="text-stone-400 text-lg mb-8 leading-relaxed">
            Vi visar Servera live, går igenom din meny och svarar på frågor om
            pris och setup. 20 minuter, helt utan kostnad.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-500 text-stone-950 font-semibold rounded-full hover:bg-amber-400 transition-colors text-sm"
          >
            Boka demo
          </Link>
        </div>
      </section>

      <footer className="border-t border-stone-800 bg-stone-950 text-stone-500 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>© {new Date().getFullYear()} Servera — en del av Triad Solutions.</div>
          <Link href="/" className="hover:text-stone-300 transition-colors">
            ← Tillbaka till startsidan
          </Link>
        </div>
      </footer>
    </main>
  )
}
