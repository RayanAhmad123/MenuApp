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
import { CITIES, CITY_SLUGS } from "@/lib/seo/cities"
import { RESTAURANT_TYPES, RESTAURANT_TYPE_SLUGS } from "@/lib/seo/restaurant-types"

const PAGE_URL = `${SITE_URL}/digital-meny`

export const metadata: Metadata = {
  title: "Digital meny för restaurang — kompletta guiden 2026 | Servera",
  description:
    "Allt om digital meny för svenska restauranger: hur det fungerar, vad det kostar, vilka funktioner du behöver, och var Servera passar bäst. Stadssidor, restaurangtyper och prisjämförelse.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: PAGE_URL,
    siteName: "Servera",
    title: "Digital meny för restaurang — kompletta guiden 2026",
    description:
      "Hur digital meny fungerar i Sverige, vad det kostar, vad du bör jämföra och var Servera passar bäst.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital meny för restaurang — kompletta guiden 2026",
    description:
      "Allt om digital meny för svenska restauranger — funktioner, pris, val av plattform.",
  },
}

const HUB_FAQ = [
  {
    question: "Vad är en digital meny?",
    answer:
      "En digital meny är en restaurangmeny som visas på en skärm — oftast i gästens egen mobil via en QR-kod på bordet. Gästen skannar koden, ser menyn med bilder, allergener och pris, och kan i vissa system även beställa direkt utan att vänta in en servitör. Servera är en sådan plattform, byggd specifikt för svenska restauranger.",
  },
  {
    question: "Hur fungerar en digital meny i praktiken?",
    answer:
      "Du lägger in dina kategorier och rätter i adminpanelen. Servera genererar en QR-kod per bord. Gästen skannar koden med sin mobilkamera, menyn öppnas i webbläsaren utan app, gästen lägger sin beställning, och köket ser den på en skärm. Servitören får en notis när ett bord behöver hjälp.",
  },
  {
    question: "Vad kostar en digital meny i Sverige?",
    answer:
      "Servera börjar på 549 kr/mån (Start-planen, upp till 20 bord) eller 999 kr/mån (Tillväxt-planen, obegränsat antal bord). Alla priser är i svenska kronor utan provisioner per beställning. Internationella plattformar tar ofta 1–5 % per order — på högre kuvertvolymer blir det dyrare än ett fast SEK-pris.",
  },
  {
    question: "Behöver jag byta kassasystem för att använda digital meny?",
    answer:
      "Nej. Servera fungerar parallellt med ditt befintliga kassasystem (Caspeco, Trivec, Onslip eller andra). Du behöver ingen integration för att komma igång. På Företag-planen kan vi bygga skräddarsydda kopplingar mot specifika kassasystem.",
  },
  {
    question: "Är digital meny lagligt i Sverige? Hur är det med allergener?",
    answer:
      "Ja. En digital meny ska visa allergeninformation tydligt — Servera har inbyggt stöd för att märka varje rätt med vanliga allergener (gluten, laktos, nötter, ägg, fisk, skaldjur, soja, sesam, sulfiter) samt vegan, vegetariskt och glutenfritt. Informationen visas automatiskt för gästen.",
  },
  {
    question: "Behöver gästen ladda ned en app?",
    answer:
      "Nej. Servera-menyn öppnas direkt i mobilens webbläsare när gästen skannar QR-koden. Inget app-krav, ingen registrering, inga inloggningar — det är standard för moderna QR-menyer i Sverige.",
  },
  {
    question: "Fungerar digital meny utan internet?",
    answer:
      "Gästens mobil behöver internet (Wi-Fi eller 4G/5G) för att ladda menyn. Köksvyn på din restaurang behöver också internet. Vid kortvariga avbrott cachar Servera den senast laddade menyn så gästen fortfarande ser den.",
  },
  {
    question: "Kan jag visa menyn på flera språk?",
    answer:
      "Ja. Servera stödjer flerspråkig meny — särskilt användbart för restauranger i Stockholm, Göteborg och Malmö där en stor del av gästkretsen kan vara internationella besökare.",
  },
]

export default function DigitalMenuHubPage() {
  const cityItems = CITY_SLUGS.map((slug) => {
    const c = CITIES[slug]
    return {
      slug,
      name: c.name,
      url: `${SITE_URL}/digital-meny/${slug}`,
      region: c.region,
      restaurantCount: c.restaurantCountApprox,
    }
  })

  const typeItems = RESTAURANT_TYPE_SLUGS.map((slug) => {
    const t = RESTAURANT_TYPES[slug]
    return {
      slug,
      name: t.name,
      pluralName: t.pluralName,
      url: `${SITE_URL}/qr-meny/${slug}`,
    }
  })

  const breadcrumb = breadcrumbSchema([
    { name: "Servera", url: SITE_URL },
    { name: "Digital meny", url: PAGE_URL },
  ])

  const collection = collectionPageSchema({
    name: "Digital meny för restaurang — guide och stadssidor",
    url: PAGE_URL,
    description:
      "Komplett guide till digital meny för svenska restauranger, med stadssidor och länkar till varje restaurangtyp.",
    items: cityItems.map((c) => ({
      name: `Digital meny i ${c.name}`,
      url: c.url,
      description: `${c.region} — ungefär ${c.restaurantCount} restauranger.`,
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
            Digital meny för restaurang — kompletta guiden 2026
          </h1>
          <p className="text-stone-600 text-lg leading-relaxed">
            Allt du behöver veta om digital meny i Sverige: hur det fungerar,
            vad det kostar, vilka funktioner som faktiskt spelar roll, och var
            Servera passar bäst för din restaurang.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <p className="text-stone-700 text-lg leading-[1.7]">
            En digital meny är en restaurangmeny som visas i gästens egen mobil
            — gästen skannar en QR-kod på bordet, ser menyn med bilder och
            allergener, och kan beställa direkt. För svenska restauranger har
            digital meny gått från experiment till standard sedan 2020. Den här
            guiden hjälper dig välja rätt plattform och komma igång.
          </p>
          <p className="text-stone-700 text-base leading-[1.7]">
            Vill du jämföra Servera mot andra svenska QR-menyplattformar? Se{" "}
            <Link
              href="/jamfor"
              className="text-amber-700 hover:text-amber-800 underline-offset-4 hover:underline"
            >
              våra jämförelsesidor
            </Link>
            . Vill du veta vad det kostar? Se{" "}
            <Link
              href="/priser"
              className="text-amber-700 hover:text-amber-800 underline-offset-4 hover:underline"
            >
              priser i SEK
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-white border-y border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-bold tracking-tight">
              Digital meny per stad
            </h2>
            <p className="text-stone-600 mt-3 text-base max-w-2xl mx-auto">
              Lokal guide till digital meny för restauranger i Sveriges största
              städer.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cityItems.map((c) => (
              <Link
                key={c.slug}
                href={`/digital-meny/${c.slug}`}
                className="group rounded-2xl border border-stone-200 bg-stone-50 p-5 hover:bg-white hover:shadow-sm transition-all"
              >
                <div className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">
                  {c.region}
                </div>
                <h3 className="font-serif text-lg text-stone-950 font-semibold mb-1 group-hover:underline underline-offset-4">
                  {c.name}
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed">
                  {c.restaurantCount} restauranger
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-bold tracking-tight">
              Digital meny per restaurangtyp
            </h2>
            <p className="text-stone-600 mt-3 text-base max-w-2xl mx-auto">
              Olika restauranger har olika behov. Se hur Servera fungerar för
              just din typ av verksamhet.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {typeItems.map((t) => (
              <Link
                key={t.slug}
                href={`/qr-meny/${t.slug}`}
                className="group rounded-2xl border border-stone-200 bg-white p-5 hover:bg-stone-50 hover:shadow-sm transition-all"
              >
                <h3 className="font-serif text-lg text-stone-950 font-semibold mb-1 capitalize group-hover:underline underline-offset-4">
                  {t.pluralName}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Hur Servera passar för {t.pluralName} →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-white border-y border-stone-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-bold tracking-tight">
              Vad ska en digital meny ha?
            </h2>
          </div>
          <div className="space-y-5">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
              <h3 className="font-serif text-lg text-stone-950 font-semibold mb-2">
                QR-kod per bord — utan app
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Gästen ska kunna skanna och se menyn direkt i webbläsaren. Inga
                appar, inga inloggningar, ingen registrering. Allt detta är
                standard i Servera.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
              <h3 className="font-serif text-lg text-stone-950 font-semibold mb-2">
                Allergener och kostmärkning byggt in
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Vegan, vegetariskt, glutenfritt och alla vanliga allergener
                måste markeras per rätt — viktigt både för svensk lag och för
                gäster som annars måste fråga servitören om varje val.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
              <h3 className="font-serif text-lg text-stone-950 font-semibold mb-2">
                Realtidsuppdatering av priser och tillgänglighet
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Slut på en rätt? Markera som ej tillgänglig — den försvinner
                direkt. Höjda priser? Uppdatera och se det live för nästa gäst.
                Inga tryck, ingen omstart.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
              <h3 className="font-serif text-lg text-stone-950 font-semibold mb-2">
                Kockvy och servitörsvy ingår
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                En surfplatta i köket räcker. Beställningar skickas direkt utan
                att skrivas ut, och servitören får en notis från bordet med en
                gång — utan extra hårdvarukostnad.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
              <h3 className="font-serif text-lg text-stone-950 font-semibold mb-2">
                Fast SEK-pris — inga provisioner per beställning
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Behåll varje krona du tjänar. Serveras priser är 549 kr/mån
                eller 999 kr/mån — utan dolda transaktionsavgifter, utan
                procentavdrag per order.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FAQAccordion items={HUB_FAQ} heading="Frågor om digital meny" />

      <CTASection
        headline="Se Servera live för din restaurang"
        sub="20 minuter, helt utan kostnad. Vi visar plattformen, går igenom din meny och hjälper dig komma igång."
      />
    </MarketingShell>
  )
}
