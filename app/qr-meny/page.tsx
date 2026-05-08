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
import {
  RESTAURANT_TYPES,
  RESTAURANT_TYPE_SLUGS,
} from "@/lib/seo/restaurant-types"

const PAGE_URL = `${SITE_URL}/qr-meny`

export const metadata: Metadata = {
  title: "QR-meny för restaurang — så fungerar det 2026 | Servera",
  description:
    "QR-meny för svenska restauranger: hur det fungerar, vad det kostar, för vilka restaurangtyper det passar bäst, och varför Servera är ett ärligt SEK-prisat alternativ utan provisioner.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: PAGE_URL,
    siteName: "Servera",
    title: "QR-meny för restaurang — så fungerar det",
    description:
      "QR-meny för svenska pizzerior, sushiställen, caféer, barer, food trucks och lunchställen. Fast SEK-pris, inga provisioner.",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR-meny för restaurang — så fungerar det",
    description:
      "QR-meny per restaurangtyp. Fast SEK-pris, inga provisioner.",
  },
}

const HUB_FAQ = [
  {
    question: "Vad är en QR-meny?",
    answer:
      "En QR-meny är en restaurangmeny som visas i gästens egen mobil när hen scannar en QR-kod på bordet. Inga appar, inga inloggningar — menyn öppnas direkt i webbläsaren. Servera är en sådan plattform, byggd för svenska restauranger med fast månadskostnad i SEK utan provisioner per order.",
  },
  {
    question: "Hur fungerar en QR-meny från bordet?",
    answer:
      "Du sätter en QR-kod på varje bord, klistermärke eller bordsstand. Gästen scannar koden med sin mobilkamera, menyn öppnas i webbläsaren, gästen lägger sin beställning, och köket ser den i realtid på en skärm. Servitören får pings när bordet behöver hjälp.",
  },
  {
    question: "Behöver jag någon särskild hårdvara för en QR-meny?",
    answer:
      "Nej. Servera körs i webben — gästen använder sin egen mobil, du behöver bara en tablet eller skärm i köket för kockvyn. Ingen betalterminal vid bordet, ingen specialhårdvara. QR-koderna trycker du själv på vanligt papper eller bordsstander.",
  },
  {
    question: "Är QR-meny rätt val för min typ av restaurang?",
    answer:
      "QR-meny fungerar bra för pizzerior, sushiställen, caféer, barer, food trucks och lunchställen — i princip alla restauranger där gästen sitter eller står vid en plats med en synlig QR-kod. På varje restaurangtyp-sida (länkade nedan) går vi igenom konkreta scenarier, kassasystem-flöde och vanliga frågor.",
  },
  {
    question: "Vad kostar en QR-meny i Sverige?",
    answer:
      "Servera börjar på 549 kr/mån (Start, upp till 20 bord) eller 999 kr/mån (Tillväxt, obegränsat antal bord). Inga provisioner per beställning — du behåller hela ordervärdet. För restauranger med högre kuvertvolymer blir fast SEK-pris ofta lägre än internationella plattformar med procentavgift.",
  },
  {
    question: "Hur snabbt kan jag komma igång med en QR-meny?",
    answer:
      "De flesta restauranger är igång på under 30 minuter. Du skapar konto, lägger in kategorier och rätter, väljer en QR-design och skriver ut bordskoderna. Inget kassasystem behöver kopplas in för att starta.",
  },
  {
    question: "Hur är det med allergener på en QR-meny?",
    answer:
      "Allergeninformation måste visas tydligt — Servera har inbyggt stöd för att märka varje rätt med vanliga allergener (gluten, laktos, nötter, ägg, fisk, skaldjur, soja, sesam, sulfiter) samt vegan, vegetariskt och glutenfritt. Informationen visas automatiskt på menyn för gästen.",
  },
]

export default function QrMenuHubPage() {
  const typeItems = RESTAURANT_TYPE_SLUGS.map((slug) => {
    const t = RESTAURANT_TYPES[slug]
    return {
      slug,
      name: t.name,
      pluralName: t.pluralName,
      url: `${SITE_URL}/qr-meny/${slug}`,
      tagline: t.intro.split(".")[0] + ".",
    }
  })

  const breadcrumb = breadcrumbSchema([
    { name: "Servera", url: SITE_URL },
    { name: "QR-meny", url: PAGE_URL },
  ])

  const collection = collectionPageSchema({
    name: "QR-meny per restaurangtyp",
    url: PAGE_URL,
    description:
      "QR-meny och bordsbeställning för svenska restauranger — guider per restaurangtyp.",
    items: typeItems.map((t) => ({
      name: `QR-meny för ${t.pluralName}`,
      url: t.url,
      description: t.tagline,
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
            Guide
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-950 font-bold tracking-tight leading-[1.05] mb-5">
            QR-meny för restauranger — så fungerar det 2026
          </h1>
          <p className="text-stone-600 text-lg leading-relaxed">
            QR-meny är beställning från bordet via gästens egen mobil. Den här
            guiden förklarar hur det fungerar, vad det kostar i Sverige, och
            varför Servera är ett ärligt SEK-prisat alternativ utan
            provisioner.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <p className="text-stone-700 text-lg leading-[1.7]">
            En QR-meny låter gästen scanna en kod på bordet, se din meny i sin
            mobil och beställa direkt — utan app, utan registrering. Köket ser
            beställningen i realtid på en skärm. Servitören kan fokusera på
            service istället för att repetera samma frågor om allergener eller
            storlek hela passet.
          </p>
          <p className="text-stone-700 text-base leading-[1.7]">
            Jämför Servera mot andra plattformar?{" "}
            <Link
              href="/jamfor"
              className="text-amber-700 hover:text-amber-800 underline-offset-4 hover:underline"
            >
              Se våra jämförelsesidor
            </Link>
            . Funderar på pris?{" "}
            <Link
              href="/priser"
              className="text-amber-700 hover:text-amber-800 underline-offset-4 hover:underline"
            >
              Se priser i SEK
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-white border-y border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-bold tracking-tight">
              QR-meny per restaurangtyp
            </h2>
            <p className="text-stone-600 mt-3 text-base max-w-2xl mx-auto">
              Vi har skrivit en guide per restaurangtyp — med konkreta
              scenarier, kassasystem-flöde och vanliga frågor.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {typeItems.map((t) => (
              <Link
                key={t.slug}
                href={`/qr-meny/${t.slug}`}
                className="group rounded-2xl border border-stone-200 bg-stone-50 p-6 hover:bg-white hover:shadow-sm transition-all"
              >
                <h3 className="font-serif text-xl text-stone-950 font-semibold mb-2 capitalize group-hover:underline underline-offset-4">
                  {t.pluralName}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-3">
                  {t.tagline}
                </p>
                <span className="text-amber-700 text-sm font-medium">
                  Läs guiden →
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
              Så fungerar en QR-meny i fyra steg
            </h2>
          </div>
          <ol className="space-y-5 list-none counter-reset-step">
            <li className="rounded-2xl border border-stone-200 bg-white p-6 flex gap-5">
              <div className="text-amber-500 font-serif text-3xl font-bold leading-none shrink-0 w-10">
                1
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-950 font-semibold mb-1">
                  Lägg in din meny
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Skapa kategorier (förrätter, huvudrätter, dryck), lägg till
                  rätter med bilder, priser i SEK och allergeninformation. Det
                  tar i regel under en timme för en standardmeny.
                </p>
              </div>
            </li>
            <li className="rounded-2xl border border-stone-200 bg-white p-6 flex gap-5">
              <div className="text-amber-500 font-serif text-3xl font-bold leading-none shrink-0 w-10">
                2
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-950 font-semibold mb-1">
                  Skriv ut QR-koderna
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Servera genererar en unik QR-kod per bord. Skriv ut, laminera
                  eller använd som klistermärke. Vanligt papper räcker — ingen
                  specialhårdvara.
                </p>
              </div>
            </li>
            <li className="rounded-2xl border border-stone-200 bg-white p-6 flex gap-5">
              <div className="text-amber-500 font-serif text-3xl font-bold leading-none shrink-0 w-10">
                3
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-950 font-semibold mb-1">
                  Gästen scannar och beställer
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Menyn öppnas i webbläsaren. Gästen väljer rätter, lägger till
                  modifiers (extra tillval, halv-halv), bekräftar beställningen.
                  Inga appar, inga inloggningar.
                </p>
              </div>
            </li>
            <li className="rounded-2xl border border-stone-200 bg-white p-6 flex gap-5">
              <div className="text-amber-500 font-serif text-3xl font-bold leading-none shrink-0 w-10">
                4
              </div>
              <div>
                <h3 className="font-serif text-lg text-stone-950 font-semibold mb-1">
                  Köket ser ordern direkt
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Beställningen pushas till kockskärmen i realtid. Servitören
                  får ping när bordet behöver hjälp. Ingen pappersbongning,
                  inga skrivare, inga missförstånd.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <FAQAccordion items={HUB_FAQ} heading="Frågor om QR-meny" />

      <CTASection
        headline="Se Servera live för din restaurang"
        sub="20 minuter, helt utan kostnad. Vi visar plattformen, går igenom din meny och hjälper dig komma igång."
      />
    </MarketingShell>
  )
}
