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

const PAGE_URL = `${SITE_URL}/sa-fungerar-det`

export const metadata: Metadata = {
  title: "Så fungerar Servera – från meny till order på 30 min",
  description:
    "Steg för steg: skapa konto, lägg in menyn, skriv ut QR-koderna. Gästen beställer i mobilen och köket ser ordern direkt. Igång på en halvtimme.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: PAGE_URL,
    siteName: "Servera",
    title: "Så fungerar Servera — steg för steg",
    description:
      "Från konto till första QR-beställning på 30 minuter. Här är hela flödet.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Så fungerar Servera — steg för steg",
    description:
      "Från konto till första QR-beställning på 30 minuter.",
  },
}

const STEPS = [
  {
    n: "1",
    title: "Skapa konto och lägg in din meny",
    body: "Du börjar med att skapa ett konto för din restaurang. I adminpanelen lägger du in dina kategorier (förrätter, huvudrätter, dryck, dessert), rätter med bilder och pris, samt allergeninformation och kostmärkningar (vegan, vegetariskt, glutenfritt). En standardmeny tar oftast under en timme att lägga in.",
    extra:
      "Du behöver inget kassasystem för att starta. Servera fungerar parallellt med ditt befintliga flöde — bordsbeställning sker via Servera, kassan hanterar betalning och bokföring som vanligt.",
  },
  {
    n: "2",
    title: "Generera och skriv ut QR-koderna",
    body: "Servera genererar en unik QR-kod per bord. Du laddar ner dem som PDF, väljer designtema och skriver ut på vanligt papper, lamerinerar eller använder bordsstander — det viktiga är bara att gästen ser koden tydligt vid sin plats.",
    extra:
      "Du kan när som helst regenerera koder, lägga till nya bord eller ta bort gamla. Det finns ingen begränsning på Tillväxt-planen, och Start-planen rymmer upp till 20 bord.",
  },
  {
    n: "3",
    title: "Gästen scannar och beställer",
    body: "När gästen sätter sig vid ett bord scannar hen QR-koden med sin mobilkamera. Menyn öppnas direkt i webbläsaren — ingen app, ingen registrering, ingen inloggning. Gästen bläddrar bland kategorierna, läser beskrivningar och allergener, lägger till modifiers (extra topping, halv-halv på pizzan) och bekräftar beställningen.",
    extra:
      "Beställningen kan göras flera gånger under måltidens gång. Gästen kan också ringa servitör, fråga efter räkningen eller be om hjälp direkt från menyn.",
  },
  {
    n: "4",
    title: "Köket ser ordern i realtid",
    body: "I samma sekund pushas beställningen till kockskärmen. Modifiers, allergener och anteckningar visas tydligt. Köket markerar order som påbörjad och som klar — inga skrivare, inga papperssedlar, inga missförstånd.",
    extra:
      "Servitörsvyn visar samtidigt vilka bord som väntar på mat, vilka som behöver hjälp och vilka som har bett om räkningen. Personalen vet alltid var de behövs.",
  },
  {
    n: "5",
    title: "Betalning vid bordet eller vid kassan",
    body: "Du väljer själv hur betalningen ska ske. Aktiverar du Stripe-integrationen kan gästen betala direkt vid beställning i sin egen mobil. Annars betalar gästen som vanligt vid kassan eller till servitör — Servera tar inte provision på dina beställningar oavsett.",
    extra:
      "Stripe är PCI DSS Level 1-certifierat och stöder svenska betalmetoder. Pengarna landar på ditt vanliga konto med Stripes vanliga kortavgifter — Servera tar inget extra utöver den fasta månadskostnaden.",
  },
  {
    n: "6",
    title: "Statistik och uppföljning",
    body: "På Tillväxt-planen ser du vilka rätter som säljer bäst, när topparna är, vilka kategorier som drar mest och hur snittordervärdet utvecklas över tid. Använd insikterna för att justera menyn, sätta dagens lunch eller planera kampanjer.",
    extra:
      "Du kan när som helst pausa, lägga till eller justera rätter direkt i adminpanelen — och förändringarna syns omedelbart för nästa gäst som scannar.",
  },
]

const FLOW_FAQ = [
  {
    question: "Hur lång tid tar det att komma igång med Servera?",
    answer:
      "De flesta restauranger är igång på under 30 minuter. Du skapar konto, lägger in kategorier och rätter, väljer en QR-design och skriver ut bordskoderna. Inget kassasystem behöver kopplas in för att starta.",
  },
  {
    question: "Behöver gästen en app eller registrering?",
    answer:
      "Nej. Servera-menyn öppnas direkt i mobilens webbläsare när gästen scannar QR-koden. Inget app-krav, ingen registrering, inga inloggningar.",
  },
  {
    question: "Vad händer om gästens internet är dåligt?",
    answer:
      "Servera är optimerad för 4G och 5G. Vid kortvariga avbrott cachas menyn så gästen fortfarande ser den. För att lägga själva beställningen behövs en stabil uppkoppling — på de flesta svenska restauranger är detta inget problem.",
  },
  {
    question: "Kan vi köra både QR-beställning och traditionell servering parallellt?",
    answer:
      "Ja. Servera ersätter inte servitörens roll — gäster kan beställa via QR, ringa servitör eller blanda fritt. Många restauranger använder QR för dryck och första beställningen, och servitör för uppselling och rådgivning.",
  },
  {
    question: "Kan jag uppdatera menyn när som helst?",
    answer:
      "Ja. Alla ändringar — nya rätter, höjda priser, slut på en rätt, säsongsmeny — slår igenom omedelbart för nästa gäst som scannar. Inga tryckta menyer som blir inaktuella.",
  },
  {
    question: "Vad krävs av köket för att kunna ta emot beställningar?",
    answer:
      "En tablet eller skärm med internet — det räcker. Beställningar pushas i realtid via Servera-appen i webbläsaren. Inga skrivare, inga särskilda kassakopplingar.",
  },
  {
    question: "Vad händer när vi byter meny för dagens lunch?",
    answer:
      "Du kan ha schemalagda menyer som växlar automatiskt vid en viss tid (t.ex. lunchmeny 11–14, kvällsmeny resten av dagen) eller manuellt växla i adminpanelen.",
  },
]

export default function HurFungerarPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Servera", url: SITE_URL },
    { name: "Så fungerar det", url: PAGE_URL },
  ])

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Så fungerar Servera — kom igång med digital meny och QR-beställning",
    description:
      "Steg-för-steg-guide till hur du kommer igång med Servera för din restaurang.",
    totalTime: "PT30M",
    inLanguage: "sv-SE",
    step: STEPS.map((s, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: s.title,
      text: s.body,
    })),
  }

  return (
    <MarketingShell>
      <JsonLd id="ld-breadcrumb" data={breadcrumb} />
      <JsonLd id="ld-howto" data={howToSchema} />
      <JsonLd id="ld-faq" data={faqSchema(FLOW_FAQ)} />

      <section className="py-16 sm:py-24 border-b border-stone-200 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-stone-200 rounded-full text-stone-700 text-[10px] font-bold uppercase tracking-widest mb-5 shadow-sm">
            Steg-för-steg
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-950 font-bold tracking-tight leading-[1.05] mb-5">
            Så fungerar Servera
          </h1>
          <p className="text-stone-600 text-lg leading-relaxed">
            Från första kontoregistreringen till att första gästen scannar och
            beställer. Hela flödet, steg för steg — på under 30 minuter för en
            standardmeny.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="space-y-8">
            {STEPS.map((s) => (
              <article
                key={s.n}
                className="rounded-2xl border border-stone-200 bg-white p-7 flex gap-6"
              >
                <div className="text-amber-500 font-serif text-5xl font-bold leading-none shrink-0 w-14">
                  {s.n}
                </div>
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl text-stone-950 font-bold tracking-tight mb-2">
                    {s.title}
                  </h2>
                  <p className="text-stone-700 text-base leading-[1.7] mb-3">
                    {s.body}
                  </p>
                  <p className="text-stone-500 text-sm leading-[1.7] italic">
                    {s.extra}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-stone-100 border border-stone-200 p-6 text-center">
            <p className="text-stone-700 text-base leading-relaxed mb-3">
              Vill du se hela flödet i praktiken?
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-stone-950 text-white font-semibold rounded-full hover:bg-stone-800 transition-colors text-sm"
            >
              Boka en kostnadsfri demo
            </Link>
          </div>

          <div className="mt-10 text-center">
            <p className="text-stone-600 mb-3 text-sm">
              Vill du veta mer först?
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/funktioner"
                className="text-amber-700 hover:text-amber-800 underline-offset-4 hover:underline text-sm font-medium"
              >
                Se alla funktioner →
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
                href="/jamfor"
                className="text-amber-700 hover:text-amber-800 underline-offset-4 hover:underline text-sm font-medium"
              >
                Jämför plattformar →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FAQAccordion items={FLOW_FAQ} heading="Frågor om hur Servera fungerar" />

      <CTASection
        headline="Se Servera live för din restaurang"
        sub="Vi kör igenom hela flödet på din egen meny. 20 minuter, helt utan kostnad."
      />
    </MarketingShell>
  )
}
