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
} from "@/lib/seo/structured-data"

const PAGE_URL = `${SITE_URL}/funktioner`

export const metadata: Metadata = {
  title: "Funktioner – QR-meny, kockvy och betalning",
  description:
    "QR-meny utan app, kockvy i realtid, allergener och kostmärkning, flerspråkig meny, statistik och Stripe-betalning. Alla funktioner förklarade.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: PAGE_URL,
    siteName: "Servera",
    title: "Funktioner — digital meny och QR-beställning",
    description:
      "QR-meny, kockvy, servitörsvy, allergener, flerspråkig meny, statistik och Stripe-betalning — för svenska restauranger.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Funktioner — digital meny och QR-beställning",
    description:
      "Alla funktioner i Servera för svenska restauranger.",
  },
}

const FEATURES = [
  {
    title: "QR-beställning från bordet",
    body: "Gästen scannar en QR-kod på bordet, menyn öppnas direkt i webbläsaren och gästen lägger sin beställning. Inga appar att ladda ner, ingen registrering, ingen inloggning. Beställningen pushas omedelbart till köket.",
    bullets: [
      "Unik QR-kod per bord",
      "Öppnas direkt i mobilens webbläsare",
      "Modifiers och tillval per rätt",
      "Spara order under måltidens gång",
    ],
  },
  {
    title: "Kockvy i realtid",
    body: "En tablet eller skärm i köket räcker. Beställningar dyker upp i realtid med tydlig prioritering, modifiers och anteckningar från gästen. Markera som klar med ett tryck — servitören ser direkt att rätten är redo att serveras.",
    bullets: [
      "Pushas i realtid utan skrivare",
      "Färgkodade statusar (ny, pågående, klar)",
      "Modifiers och kostmärkningar tydligt synliga",
      "Fungerar på vanlig iPad eller Android-tablet",
    ],
  },
  {
    title: "Servitörsvy med bordspings",
    body: "Servitörsvyn visar alla bord, deras status och eventuella pings från gäster (ropa servitör, fråga om räkningen). Personalen ser direkt var de behövs — inget ropande, inget letande.",
    bullets: [
      "Översikt över alla bord och status",
      "Pings från gäster i realtid",
      "Markera bord som färdigserverat",
      "Frigör personal till service och uppselling",
    ],
  },
  {
    title: "Allergener och kostmärkning byggt in",
    body: "Märk varje rätt med vanliga allergener (gluten, laktos, nötter, ägg, fisk, skaldjur, soja, sesam, sulfiter) och kostpreferenser (vegan, vegetariskt, glutenfritt). Informationen visas automatiskt i menyn — viktigt både för svensk lag och för gäster som annars måste fråga om varje val.",
    bullets: [
      "Alla vanliga svenska allergener",
      "Vegan, vegetariskt, glutenfritt",
      "Filterfunktion för gästen",
      "Visas tydligt på varje rätt",
    ],
  },
  {
    title: "Flerspråkig meny",
    body: "Visa menyn på flera språk — särskilt användbart för restauranger i Stockholm, Göteborg och Malmö med internationell publik, eller på turistorter med säsongstoppar.",
    bullets: [
      "Flera språk per restaurang",
      "Gästen väljer språk i menyn",
      "Beskrivningar och kategorier översätts",
      "Allergener visas i alla språk",
    ],
  },
  {
    title: "Realtidsuppdatering",
    body: "Slut på en rätt? Markera som ej tillgänglig och den försvinner direkt från menyn. Höjda priser? Uppdatera och se det live för nästa gäst. Inga tryck, ingen omladdning, ingen koordinering med personalen.",
    bullets: [
      "Tillgänglighet per rätt",
      "Priser i realtid",
      "Lägg till säsongsrätter på sekunder",
      "Inga tryckta menyer som blir inaktuella",
    ],
  },
  {
    title: "Försäljningsstatistik",
    body: "Se vad som säljer bäst, när topparna är och vilken kategori som drar mest. På Tillväxt-planen får du djupare insikter — topplista per kategori och tid, snittordervärde och utveckling över tid.",
    bullets: [
      "Topplista per kategori",
      "Försäljning per tid på dagen",
      "Snittordervärde",
      "Utveckling över tid",
    ],
  },
  {
    title: "Onlinebetalning via Stripe",
    body: "Aktivera Stripe-betalning så betalar gästen direkt vid beställning. Pengarna landar på ditt vanliga konto, inga provisioner till Servera — endast Stripes egna kortavgifter. Du kan också välja att låta gästen betala till servitör som vanligt.",
    bullets: [
      "Betalning vid beställning eller traditionellt",
      "Inga provisioner till Servera",
      "Standard svenska betalmetoder",
      "PCI DSS Level 1-säkerhet via Stripe",
    ],
  },
]

const FUNK_FAQ = [
  {
    question: "Vilka funktioner är inkluderade i Start-planen?",
    answer:
      "Start-planen (549 kr/mån) inkluderar QR-beställning, kockvy, servitörsvy, allergener och kostmärkning, realtidsuppdateringar och e-postsupport. Den passar restauranger med upp till 20 bord och en restaurang.",
  },
  {
    question: "Vad får jag på Tillväxt-planen jämfört med Start?",
    answer:
      "Tillväxt-planen (999 kr/mån) ger obegränsat antal bord, avancerad försäljningsstatistik, topplista per kategori och tid, samt prioriterad support. Bra för växande restauranger med fler platser eller högre kuvertvolym.",
  },
  {
    question: "Behöver jag någon särskild hårdvara för funktionerna?",
    answer:
      "Nej. Gästen använder sin egen mobil. Köket behöver en tablet eller skärm för kockvyn. Servitörsvyn fungerar på samma typ av enhet. Inga betalterminaler vid bordet, ingen specialhårdvara — du printar QR-koderna själv på vanligt papper eller bordsstand.",
  },
  {
    question: "Kan jag integrera Servera med mitt kassasystem?",
    answer:
      "På Företag-planen kan vi bygga skräddarsydda integrationer mot kassasystem som Caspeco, Trivec eller Onslip. Standardflödet kräver ingen integration — Servera fungerar parallellt med ditt befintliga kassasystem.",
  },
  {
    question: "Stöder Servera takeaway och hemleverans?",
    answer:
      "Servera är fokuserad på QR-beställning från bordet (in-house). För takeaway-marknadsplats eller hemleverans med egen flotta behövs en bredare plattform. Vill du jämföra alternativen? Se vår jämförelsesida.",
  },
  {
    question: "Hur ofta uppdateras Servera med nya funktioner?",
    answer:
      "Vi släpper kontinuerligt förbättringar och nya funktioner. Eftersom Servera är webbaserat behöver du inte göra något — uppdateringarna är direkt tillgängliga för dig och dina gäster.",
  },
]

export default function FunktionerPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Servera", url: SITE_URL },
    { name: "Funktioner", url: PAGE_URL },
  ])

  return (
    <MarketingShell>
      <JsonLd id="ld-breadcrumb" data={breadcrumb} />
      <JsonLd id="ld-faq" data={faqSchema(FUNK_FAQ)} />

      <section className="py-16 sm:py-24 border-b border-stone-200 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-stone-200 rounded-full text-stone-700 text-[10px] font-bold uppercase tracking-widest mb-5 shadow-sm">
            Funktioner
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-950 font-bold tracking-tight leading-[1.05] mb-5">
            Allt du behöver för digital meny och QR-beställning
          </h1>
          <p className="text-stone-600 text-lg leading-relaxed">
            Servera samlar QR-meny, kockvy, servitörsvy, allergener,
            flerspråkig meny och statistik i en plattform — byggd specifikt
            för svenska restauranger.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="space-y-6">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className="rounded-2xl border border-stone-200 bg-white p-7"
              >
                <h2 className="font-serif text-2xl sm:text-3xl text-stone-950 font-bold tracking-tight mb-3">
                  {f.title}
                </h2>
                <p className="text-stone-700 text-base leading-[1.7] mb-4">
                  {f.body}
                </p>
                <ul className="grid sm:grid-cols-2 gap-2.5">
                  {f.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2.5 text-sm text-stone-600"
                    >
                      <span className="text-amber-500 font-bold mt-0.5">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-stone-600 mb-3 text-sm">
              Vill du jämföra Servera mot andra QR-menyplattformar?
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/jamfor"
                className="text-amber-700 hover:text-amber-800 underline-offset-4 hover:underline text-sm font-medium"
              >
                Se jämförelser →
              </Link>
              <span className="text-stone-300">·</span>
              <Link
                href="/priser"
                className="text-amber-700 hover:text-amber-800 underline-offset-4 hover:underline text-sm font-medium"
              >
                Se priser →
              </Link>
              <span className="text-stone-300">·</span>
              <Link
                href="/sa-fungerar-det"
                className="text-amber-700 hover:text-amber-800 underline-offset-4 hover:underline text-sm font-medium"
              >
                Så fungerar det →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FAQAccordion items={FUNK_FAQ} heading="Vanliga frågor om funktionerna" />

      <CTASection
        headline="Se funktionerna live"
        sub="20 minuter, helt utan kostnad. Vi visar plattformen, går igenom din meny och svarar på de tekniska frågorna."
      />
    </MarketingShell>
  )
}
