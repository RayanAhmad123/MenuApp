import type { Guide } from "./types"

export const guide: Guide = {
  slug: "byta-fran-excel-pdf-meny",
  title: "Byta från Excel- eller PDF-meny till digital meny",
  metaTitle: "Byta från Excel/PDF-meny till digital meny — så gör du",
  description:
    "Kör du menyn i Excel, Word eller som PDF bakom en QR-kod? Så flyttar du till en riktig digital meny utan att tappa något på vägen — steg för steg med städlista.",
  datePublished: "2026-08-26",
  dateModified: "2026-08-26",
  readingMinutes: 7,
  category: "Migrering",
  intro: [
    "Många restaurangers \"menysystem\" är i praktiken en Excel-fil eller ett Word-dokument som exporteras till PDF, trycks — och ibland läggs bakom en QR-kod. Det fungerar, tills det inte gör det: versionerna spretar, allergeninformationen bor i någons huvud, och PDF:en på mobilen kräver zoomande och nypande som gästerna tröttnat på.",
    "Det goda beskedet: just för att allt redan finns i ett dokument är flytten till en riktig digital meny ett litet projekt. Innehållet är gjort — det ska bara struktureras och flyttas in. Så här gör du, inklusive städlistan som gör att du inte tar med dig gamla fel."
  ],
  tldr: [
    "En PDF bakom en QR-kod är inte en digital meny — den saknar mobilanpassning, allergenfilter och beställning, och varje ändring kräver ny exportkedja.",
    "Flytten är ett städtillfälle: rensa dubbletter, döda rätter som aldrig beställs och verifiera allergener per rätt innan du flyttar in något.",
    "Själva migreringen tar en eftermiddag — innehållet finns ju redan, det ska bara in i strukturerad form.",
    "Efter flytten: en enda källa till sanning. Prisändringen görs en gång i adminpanelen i stället för i Excel → PDF → tryckeri → bordsbyte.",
    "Behåll PDF-exporten som reservrutin om du vill — men låt den genereras ur den digitala menyn, inte tvärtom."
  ],
  blocks: [
    { t: "h2", id: "problemet", text: "Vad är egentligen problemet med Excel/PDF-menyn?" },
    { t: "ul", items: [
      "**Versionskaos.** \"meny_v7_NY_slutgiltig2.xlsx\" — när priser ändras uppstår osäkerhet om vilken fil som gäller, och gamla PDF:er lever kvar i utskrifter och länkar.",
      "**Mobilupplevelsen.** En A4-PDF på en mobilskärm kräver zoom och skroll i två led. Gäster ger upp, personalen får frågor som menyn skulle besvarat.",
      "**Allergenerna.** I ett fridokument finns ingen struktur som tvingar fram allergenmärkning per rätt — informationen hamnar i fotnoter eller ingenstans, trots att den enligt EU-förordning 1169/2011 alltid ska kunna lämnas.",
      "**Ingen data.** Dokumentet berättar aldrig vilka rätter som visas mest, vad som beställs och vad som ignoreras.",
      "**Varje ändring är en kedja.** Excel → PDF → ev. tryckeri → utbyte på borden. Kedjan gör att småändringar skjuts upp — och menyn glider ifrån verkligheten."
    ]},
    { t: "h2", id: "forberedelse", text: "Steg 1: Städa innehållet innan flytten" },
    { t: "p", text: "Flytta aldrig in menyn rakt av — det här är ditt bästa tillfälle på länge att städa. Gå igenom dokumentet med köket och stryk, slå ihop och korrigera:" },
    { t: "ol", items: [
      "Stryk rätter som i praktiken aldrig beställs eller aldrig kan levereras.",
      "Enhetliga namn och beskrivningar — samma stil på alla rätter, gästens språk, inte kökets.",
      "Verifiera priserna mot kassan — det är förvånansvärt vanligt att dokument och kassa hunnit glida isär.",
      "Gå igenom allergener rätt för rätt mot de 14 i EU-förordningen, med köket, och skriv in dem i dokumentet nu.",
      "Bestäm kategoristruktur: max ~8 kategorier i den ordning gästen ska möta dem."
    ]},
    { t: "h2", id: "flytten", text: "Steg 2: Flytta in — rakt av eller via import" },
    { t: "p", text: "Med städat innehåll är inflytten ren inmatning: kategorier först, sedan rätter med pris, beskrivning och allergenmärkning. Räkna med 1–2 minuter per rätt; en 50-rätters meny är inne på en dryg timme. Har du menyn som strukturerad Excel går det ofta ännu fortare — hör med leverantören om importmöjligheter innan du matar in för hand." },
    { t: "p", text: "Resten av uppsättningen — bilder, QR-koder per bord, testrutin — är samma som vid nystart och finns i [steg-för-steg-guiden](/guider/hur-skapar-man-digital-meny)." },
    { t: "h2", id: "efterat", text: "Steg 3: Klipp de gamla kanalerna" },
    { t: "p", text: "Den viktigaste punkten efter bytet är att göra den digitala menyn till **enda källa till sanning**. Konkret:" },
    { t: "ul", items: [
      "Ta bort eller uppdatera gamla QR-koder som pekar på PDF:en — döda länkar och fel meny är värre än ingen kod alls.",
      "Arkivera Excel-filen (skrivskyddad) så ingen \"bara snabbfixar\" i den gamla världen.",
      "Uppdatera menyn där den syns externt: Google Business-profilen, webbplatsen, sociala medier — länka till den digitala menyn i stället för en PDF.",
      "Bestäm rutinen: vem ändrar priser, vem markerar slut i kök, vem lägger in nya rätter."
    ]},
    { t: "h2", id: "behall-pdf", text: "Kan jag behålla en PDF också?" },
    { t: "p", text: "Ja — men vänd på flödet. Låt den digitala menyn vara källan och exportera/trycck ett litet antal exemplar ur den när det behövs (reserv för gäster utan mobil, stora sällskap, uteservering med dålig täckning). Det som inte fungerar i längden är att underhålla två parallella sanningar. Hur den avvägningen brukar landa kan du läsa i [digital vs tryckt meny](/guider/digital-meny-vs-tryckt)." },
    { t: "h2", id: "tidsplan", text: "Realistisk tidsplan" },
    { t: "table", head: ["Moment", "Tid"], rows: [
      ["Städa innehållet med köket", "2–3 timmar"],
      ["Mata in i plattformen", "1–2 timmar"],
      ["QR-koder, test, utplacering", "1 timme"],
      ["Klippa gamla kanaler (Google, webb, gamla koder)", "30 minuter"]
    ]},
    { t: "p", text: "En eftermiddag plus en städrunda — och versionskaoset är borta. Vill du se hur inmatningen ser ut i praktiken innan du bestämmer dig: [boka en demo](/#contact) eller börja i [kompletta guiden](/guider/digital-meny-kompletta-guiden)." }
  ],
  faq: [
    { question: "Är inte en PDF bakom QR-kod redan en digital meny?", answer: "Tekniskt sett visas den digitalt, men den saknar det som definierar en modern digital meny: mobilanpassad visning, allergenmärkning per rätt, direkta uppdateringar och möjlighet till beställning. En A4-PDF på mobilskärm kräver dessutom zoomande som ger en dålig gästupplevelse." },
    { question: "Hur lång tid tar det att byta från Excel/PDF till digital meny?", answer: "Ungefär en eftermiddag plus en städrunda med köket: 2–3 timmar för att rensa och verifiera innehållet, 1–2 timmar inmatning och en timme för QR-koder och test. Innehållet finns ju redan — det ska bara struktureras." },
    { question: "Kan jag importera min Excel-meny direkt?", answer: "Ofta, åtminstone delvis — hör med leverantören om importmöjligheter för strukturerade filer innan du matar in för hand. Men gör alltid städrundan först, annars importerar du gamla fel." },
    { question: "Vad gör jag med den gamla PDF-menyn?", answer: "Arkivera källfilen skrivskyddad, ta bort eller peka om gamla QR-koder och länkar (Google Business-profil, webbplats), och låt framtida PDF-utskrifter genereras ur den digitala menyn så att det bara finns en källa till sanning." },
    { question: "Måste jag lägga in allergener när jag ändå flyttar?", answer: "Ja, gör det direkt vid flytten. Allergeninformation för de 14 allergenerna i EU-förordning 1169/2011 ska alltid kunna lämnas för mat som serveras på restaurang, och en strukturerad digital meny är enklaste sättet att hålla den korrekt." }
  ],
  sources: [
    { label: "Europaparlamentets och rådets förordning (EU) nr 1169/2011 om livsmedelsinformation", href: "https://eur-lex.europa.eu/legal-content/SV/TXT/?uri=CELEX%3A02011R1169-20180101" },
    { label: "Livsmedelsverkets föreskrifter om livsmedelsinformation, LIVSFS 2014:4", href: "https://www.livsmedelsverket.se/om-oss/lagstiftning1/gallande-lagstiftning/livsfs-20144" }
  ],
}
