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
  faqSchema,
  breadcrumbSchema,
  collectionPageSchema,
} from "@/lib/seo/structured-data"
import { COMPARISONS, COMPARISON_SLUGS } from "@/lib/seo/comparisons"

const PAGE_URL = `${SITE_URL}/jamfor`

export const metadata: Metadata = {
  title: "Jämför QR-meny i Sverige – Servera mot 6 alternativ",
  description:
    "Ärlig jämförelse av svenska QR-meny- och beställningssystem: pris, provision, kockvy, hårdvara och kassaintegration – sida vid sida i en tabell.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: PAGE_URL,
    siteName: "Servera",
    title: "Jämför Servera mot andra QR-menyplattformar",
    description:
      "Jämför Servera mot Meny-QR, Qopla och WEIQ. Pris, funktioner och hårdvara — sida vid sida.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jämför Servera mot andra QR-menyplattformar",
    description:
      "Jämför pris, provisioner och funktioner mellan Servera och övriga svenska QR-menyer.",
  },
}

const HUB_FAQ = [
  {
    question: "Vad ska jag jämföra när jag väljer QR-meny för restaurang?",
    answer:
      "Räkna på totalkostnaden — månadsavgift plus eventuell provision per beställning. Testa hela gästflödet i din egen mobil. Verifiera att kockvy och allergener ingår. Kontrollera support och svarstider, samt hur integrationen mot ditt befintliga kassasystem (t.ex. Caspeco, Trivec, Onslip) fungerar i praktiken.",
  },
  {
    question: "Tar Servera provision per beställning?",
    answer:
      "Nej. Servera har fast månadskostnad — 549 kr/mån (Start) eller 999 kr/mån (Tillväxt). Inga provisioner, inga dolda transaktionsavgifter. På restauranger med högre kuvertvolym blir totalkostnaden ofta lägre än på plattformar som tar 1–5 % per order.",
  },
  {
    question: "Vilka är Serveras främsta konkurrenter i Sverige?",
    answer:
      "På den svenska marknaden för QR-meny är de största alternativen Meny-QR, Qopla och WEIQ. Internationellt finns även Flipdish, Mr Yum och Yumzi. Vi har skrivit detaljerade jämförelsesidor mot de svenska aktörerna — länkarna finns ovan.",
  },
  {
    question: "Hur lång tid tar det att byta QR-menyplattform?",
    answer:
      "De flesta restauranger är igång på Servera under 30 minuter. Vi hjälper till att importera din befintliga meny och dina kategorier. Du behöver inte byta kassasystem för att komma igång — Servera fungerar parallellt med ditt nuvarande flöde.",
  },
  {
    question: "Kan jag testa Servera innan jag beslutar mig?",
    answer:
      "Ja. Boka en kostnadsfri 20-minuters demo så går vi igenom plattformen live, tittar på din meny och svarar på de tekniska frågorna kring integration och uppsättning.",
  },
]

export default function ComparisonHubPage() {
  const items = COMPARISON_SLUGS.map((slug) => {
    const c = COMPARISONS[slug]
    return {
      slug,
      name: `Servera vs ${c.competitorName}`,
      url: `${SITE_URL}/jamfor/${slug}`,
      competitorName: c.competitorName,
      tagline: c.hero.sub,
    }
  })

  const breadcrumb = breadcrumbSchema([
    { name: "Servera", url: SITE_URL },
    { name: "Jämför", url: PAGE_URL },
  ])

  const collection = collectionPageSchema({
    name: "Jämför QR-menyplattformar",
    url: PAGE_URL,
    description:
      "Sida-vid-sida-jämförelser mellan Servera och andra QR-meny- och beställningsplattformar för svenska restauranger.",
    items: items.map((it) => ({
      name: it.name,
      url: it.url,
      description: it.tagline,
    })),
  })

  return (
    <MarketingShell>
      <JsonLd id="ld-breadcrumb" data={breadcrumb} />
      <JsonLd id="ld-collection" data={collection} />
      <JsonLd id="ld-faq" data={faqSchema(HUB_FAQ)} />

      <section className="py-16 sm:py-24 border-b border-stone-200 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-stone-200 rounded-full text-stone-700 text-[10px] font-bold uppercase tracking-widest mb-5 shadow-sm">
            Jämförelser
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-950 font-bold tracking-tight leading-[1.05] mb-5">
            Servera mot andra QR-menyplattformar
          </h1>
          <p className="text-stone-600 text-lg leading-relaxed">
            Ärliga jämförelser av pris, funktioner och hårdvara mellan Servera
            och de största svenska QR-meny- och beställningsplattformarna.
            Skrivna för restaurangägare som faktiskt jämför.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <p className="text-stone-700 text-lg leading-[1.7]">
            QR-meny för restauranger har snabbt blivit standard i Sverige. Men
            valet mellan plattformar är inte trivialt — pris, provisioner,
            hårdvarukrav, kassasystem-integration och support skiljer sig
            markant. Den här sidan samlar våra jämförelser så att du kan
            utvärdera Servera mot ditt aktuella alternativ utan
            marknadsföringsfluff.
          </p>
          <p className="text-stone-700 text-base leading-[1.7]">
            Vi har försökt skriva varje jämförelse hederligt — med konkreta
            siffror, vad Servera är bra på, och var en konkurrent kan vara ett
            bättre val för just din verksamhet. Är du osäker?{" "}
            <Link
              href="/#contact"
              className="text-amber-700 hover:text-amber-800 underline-offset-4 hover:underline"
            >
              Boka en kostnadsfri demo
            </Link>{" "}
            så går vi igenom valen tillsammans.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-white border-y border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-bold tracking-tight">
              Alla jämförelser
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((it) => (
              <Link
                key={it.slug}
                href={`/jamfor/${it.slug}`}
                className="group rounded-2xl border border-stone-200 bg-stone-50 p-6 hover:bg-white hover:shadow-sm transition-all"
              >
                <div className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-3">
                  {it.competitorName}
                </div>
                <h3 className="font-serif text-xl text-stone-950 font-semibold mb-2 group-hover:underline underline-offset-4">
                  {it.name}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">
                  {it.tagline}
                </p>
                <span className="text-amber-700 text-sm font-medium">
                  Läs jämförelsen →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-bold tracking-tight">
              Vad du bör jämföra
            </h2>
          </div>
          <div className="space-y-5">
            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <h3 className="font-serif text-lg text-stone-950 font-semibold mb-2">
                Totalkostnad, inte bara skyltpris
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Räkna in månadsavgift, eventuell provision per order,
                hårdvarukostnad, transaktionsavgifter och
                onboarding/utbildning. På en restaurang med 500 000 kr i
                månadsomsättning blir 2 % provision 10 000 kr/mån utöver
                abonnemanget.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <h3 className="font-serif text-lg text-stone-950 font-semibold mb-2">
                Gästupplevelsen i mobilen
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Skanna QR-koden själv. Är menyn snabb på 4G? Tydlig på liten
                skärm? Lätt att lägga till modifiers? Visas allergener
                automatiskt? Det är det enda dina gäster märker.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <h3 className="font-serif text-lg text-stone-950 font-semibold mb-2">
                Köks- och servitörsflödet
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Hur ser kockvyn ut? Behövs en skrivare? Får servitören pings
                från bordet? Viktiga frågor som ofta glöms när man fokuserar på
                gästsidan.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <h3 className="font-serif text-lg text-stone-950 font-semibold mb-2">
                Kassasystem-integration
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Om du redan kör Caspeco, Trivec, Onslip eller ett annat
                kassasystem — fråga konkret vilka fält som synkas, hur
                lagerbalans hanteras och om det finns en standardkoppling eller
                om det krävs maskinskräddarsöm.
              </p>
            </div>
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

      <FAQAccordion items={HUB_FAQ} heading="Vanliga frågor om QR-menyval" />

      <CTASection
        headline="Inte säker på vilken plattform som passar dig?"
        sub="Vi går igenom ditt nuvarande setup, jämför ärligt mot Servera och säger till om vi inte är rätt val. 20 minuter, helt utan kostnad."
      />
    </MarketingShell>
  )
}
