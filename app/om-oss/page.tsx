import type { Metadata } from "next"
import Link from "next/link"
import { JsonLd } from "@/components/seo/JsonLd"
import {
  MarketingShell,
  FAQAccordion,
  CTASection,
} from "@/components/seo/MarketingShell"
import {
  SITE_URL,
  PUBLISHER_NAME,
  PUBLISHER_URL,
  faqSchema,
  breadcrumbSchema,
} from "@/lib/seo/structured-data"

const PAGE_URL = `${SITE_URL}/om-oss`

export const metadata: Metadata = {
  title: "Om Servera — svensk QR-meny för restauranger | Triad Solutions",
  description:
    "Servera är en svensk plattform för digital meny och QR-beställning, byggd och driven av Triad Solutions. Här är historien, varför vi finns och hur vi tänker kring restaurangteknik i Sverige.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: PAGE_URL,
    siteName: "Servera",
    title: "Om Servera — svensk QR-meny från Triad Solutions",
    description:
      "Svensk QR-meny och digital meny för restauranger. Byggd av Triad Solutions i Sverige.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Om Servera — svensk QR-meny från Triad Solutions",
    description:
      "Svensk QR-meny och digital meny för restauranger.",
  },
}

const ABOUT_FAQ = [
  {
    question: "Vem står bakom Servera?",
    answer:
      "Servera är en produkt från Triad Solutions, ett svenskt teknikbolag. All utveckling, drift och support sker i Sverige.",
  },
  {
    question: "Var lagras restaurangens data?",
    answer:
      "Servera bygger på molninfrastruktur som lagrar data inom EU. Vi följer GDPR och svensk dataskyddslagstiftning. För restauranger med specifika krav kring datalagring kan vi diskutera setup på Företag-planen.",
  },
  {
    question: "Vilken support kan jag förvänta mig?",
    answer:
      "Start-planen inkluderar e-postsupport på svensk arbetstid. Tillväxt-planen ger prioriterad support. Företag-planen inkluderar dedikerad kontaktperson och SLA.",
  },
  {
    question: "Är Servera ett etablerat alternativ?",
    answer:
      "Servera är en relativt ny produkt på den svenska marknaden — vi byggde plattformen för att fylla gapet mellan dyra breda restaurangsystem och enkla men ofta provisionerade internationella QR-tjänster. Vi växer i takt med att fler svenska restauranger byter från tryckta menyer till digitalt.",
  },
  {
    question: "Hur kommer jag i kontakt?",
    answer:
      "Boka en kostnadsfri demo via vår kontaktsida, eller skicka mail till kontakt@triadsolutions.se. Vi svarar på svenska och engelska.",
  },
]

export default function OmOssPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Servera", url: SITE_URL },
    { name: "Om oss", url: PAGE_URL },
  ])

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${PAGE_URL}#about`,
    url: PAGE_URL,
    name: "Om Servera",
    inLanguage: "sv-SE",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: { "@id": `${SITE_URL}/#organization` },
  }

  return (
    <MarketingShell>
      <JsonLd id="ld-breadcrumb" data={breadcrumb} />
      <JsonLd id="ld-about" data={aboutSchema} />
      <JsonLd id="ld-faq" data={faqSchema(ABOUT_FAQ)} />

      <section className="py-16 sm:py-24 border-b border-stone-200 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-stone-200 rounded-full text-stone-700 text-[10px] font-bold uppercase tracking-widest mb-5 shadow-sm">
            Om Servera
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-950 font-bold tracking-tight leading-[1.05] mb-5">
            Svensk QR-meny — utan provisioner, utan krångel
          </h1>
          <p className="text-stone-600 text-lg leading-relaxed">
            Servera är en svensk plattform för digital meny och QR-beställning,
            byggd och driven av {PUBLISHER_NAME}. Vi finns för att svenska
            restauranger ska få ett ärligt alternativ — fast SEK-pris, lokal
            support och en produkt som löser det den faktiskt ska lösa.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-bold tracking-tight">
            Varför Servera finns
          </h2>
          <p className="text-stone-700 text-lg leading-[1.7]">
            Sveriges restaurangbransch står mellan två val när de vill
            digitalisera bordsbeställningen. På ena sidan finns breda
            restaurangsystem med komplett kassa, schemaläggning och rapportering
            — kraftfulla, men ofta dyra och tunga att implementera om allt du
            ville var en QR-meny. På andra sidan finns internationella
            plattformar som tar provision på varje beställning, vilket äter upp
            marginalen i takt med att verksamheten växer.
          </p>
          <p className="text-stone-700 text-base leading-[1.7]">
            Vi byggde Servera för att fylla gapet däremellan: en fokuserad QR-
            meny och bordsbeställning för svenska restauranger, med fast pris i
            SEK, svensk support och en produkt som du kan börja använda samma
            dag du registrerar dig.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-white border-y border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-bold tracking-tight">
              Hur vi tänker
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
              <h3 className="font-serif text-xl text-stone-950 font-semibold mb-2">
                Fast pris i SEK
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Inga provisioner per beställning, inga dolda transaktionsavgifter.
                Du betalar 549 kr/mån eller 999 kr/mån — och behåller varje krona
                från varje order. Det är inte bara fairare, det är förutsägbart.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
              <h3 className="font-serif text-xl text-stone-950 font-semibold mb-2">
                Smalt scope, gjort bra
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Vi gör QR-meny och bordsbeställning — inte takeaway-marknadsplats,
                inte hemleverans, inte schemaläggning. Det betyder att de
                funktioner vi har är genomarbetade istället för halvfärdiga.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
              <h3 className="font-serif text-xl text-stone-950 font-semibold mb-2">
                Byggt för svenska behov
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                SEK med korrekt formatering, svenska allergenstandarder, Stripe
                med svenska betalmetoder, integrationsstöd för kassasystem som
                används i Sverige. Inte en internationell produkt med svensk
                översättning — utan en svensk produkt.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
              <h3 className="font-serif text-xl text-stone-950 font-semibold mb-2">
                Du behåller kontrollen
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Restaurangägaren ska själv kunna lägga in menyn, byta priser,
                pausa rätter, utan att behöva ringa support eller boka en
                konsulttimme. Det är så vi byggt adminpanelen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-bold tracking-tight">
            Triad Solutions
          </h2>
          <p className="text-stone-700 text-base leading-[1.7]">
            Servera är en produkt från {PUBLISHER_NAME} — ett svenskt
            teknikbolag som bygger fokuserade SaaS-produkter. All utveckling,
            drift och support sker i Sverige. Faktura med svensk moms, avtal
            under svensk lag, datahantering enligt GDPR och svensk
            dataskyddslagstiftning.
          </p>
          <p className="text-stone-700 text-base leading-[1.7]">
            Mer om bolaget finns på{" "}
            <a
              href={PUBLISHER_URL}
              className="text-amber-700 hover:text-amber-800 underline-offset-4 hover:underline"
            >
              {PUBLISHER_URL.replace("https://", "")}
            </a>
            . Frågor om Servera specifikt? Skriv till{" "}
            <a
              href="mailto:kontakt@triadsolutions.se"
              className="text-amber-700 hover:text-amber-800 underline-offset-4 hover:underline"
            >
              kontakt@triadsolutions.se
            </a>{" "}
            eller{" "}
            <Link
              href="/#contact"
              className="text-amber-700 hover:text-amber-800 underline-offset-4 hover:underline"
            >
              boka en demo
            </Link>
            .
          </p>
        </div>
      </section>

      <FAQAccordion items={ABOUT_FAQ} heading="Vanliga frågor om Servera" />

      <CTASection
        headline="Vill du se Servera live?"
        sub="Vi kör igenom plattformen på din egen meny. 20 minuter, helt utan kostnad."
      />
    </MarketingShell>
  )
}
