export interface ComparisonContent {
  slug: string
  competitorName: string
  hero: {
    eyebrow: string
    h1: string
    sub: string
  }
  intro: string
  serveraStrengths: Array<{ title: string; body: string }>
  decisionGuide: Array<{ heading: string; body: string }>
  faq: Array<{ question: string; answer: string }>
  metaTitle: string
  metaDescription: string
}

export const COMPARISONS: Record<string, ComparisonContent> = {
  "servera-vs-meny-qr": {
    slug: "servera-vs-meny-qr",
    competitorName: "Meny-QR",
    hero: {
      eyebrow: "Jämförelse",
      h1: "Servera vs Meny-QR — så väljer du rätt QR-meny för din restaurang",
      sub: "Båda är svenska QR-menyplattformar. Här är en ärlig guide till hur du avgör vilken som passar din verksamhet bäst.",
    },
    intro:
      "Står du och väljer mellan Servera och Meny-QR för din restaurang? Båda är svenska QR-menyplattformar som låter dina gäster skanna en kod på bordet och beställa från sin egen mobil. Den här sidan hjälper dig välja rätt — utan marknadsföringsfluff. Vi listar Serveras styrkor, vad du faktiskt bör jämföra, och svarar på de vanligaste frågorna när restauranger jämför QR-menyer i Sverige.",
    serveraStrengths: [
      {
        title: "Köks- och servitörsvy ingår",
        body: "Servera levereras med en dedikerad kockvy och en servitörsvy. Beställningar pushas i realtid utan att skrivas ut, och servitörer ser pings från bord direkt. Det krävs ingen extra hårdvara — en tablet i köket räcker.",
      },
      {
        title: "Fast SEK-pris, inga provisioner",
        body: "Servera kostar 549 kr/mån (Start) eller 999 kr/mån (Tillväxt) — fasta priser i svenska kronor utan provisioner per beställning. Du behåller varje krona från varje order.",
      },
      {
        title: "Allergener och kostmärkning byggt in",
        body: "Märk varje rätt med gluten, laktos, nötter, ägg samt vegan, vegetariskt och glutenfritt. Informationen visas automatiskt i menyn — viktigt för att uppfylla branschens krav på allergeninformation.",
      },
      {
        title: "Realtidsuppdateringar",
        body: "Slut på en rätt? Markera som ej tillgänglig och den försvinner från menyn omedelbart. Inget tryck, ingen omladdning från gästen.",
      },
    ],
    decisionGuide: [
      {
        heading: "Räkna på totalkostnaden, inte bara månadspriset",
        body: "Vissa plattformar tar provision per beställning (1–5 %). På en restaurang med 500 000 kr i månadsomsättning kan det betyda 5 000–25 000 kr/månad utöver abonnemanget. Servera tar alltid en fast månadskostnad.",
      },
      {
        heading: "Testa själv hur det ser ut för gästen",
        body: "Beställ en QR-kod, skanna med din mobil och gå igenom hela flödet. Är menyn tydlig? Är det enkelt att lägga till modifiers? Hur snabb är laddningen på 4G? Det här är det enda som spelar roll för dina gäster.",
      },
      {
        heading: "Kontrollera support och svarstider",
        body: "Få demos, ställ verkliga frågor (t.ex. 'hur löser jag X?') och se svarstid. Servera har e-postsupport på Start-planen och prioriterad support på Tillväxt och Företag.",
      },
      {
        heading: "Fråga om kassasystem-integration",
        body: "Om du redan kör Caspeco, Trivec, Onslip eller liknande — fråga båda leverantörerna konkret hur integrationen fungerar. På Företag-planen kan Servera bygga skräddarsydda integrationer.",
      },
    ],
    faq: [
      {
        question: "Vad är skillnaden mellan Servera och Meny-QR?",
        answer:
          "Båda är svenska QR-menyplattformar som låter gäster beställa från bordet. Servera fokuserar på en komplett upplevelse med köks- och servitörsvy som ingår, fasta priser i SEK utan provisioner, och realtidsuppdatering av menyn. För en exakt funktionsjämförelse rekommenderar vi att du bokar en demo med båda och själv testar.",
      },
      {
        question: "Tar Servera provision per beställning?",
        answer:
          "Nej. Servera har fast månadskostnad i svenska kronor — 549 kr eller 999 kr beroende på plan, eller offert för Företag-kunder. Inga provisioner, inga dolda avgifter.",
      },
      {
        question: "Kan jag byta från Meny-QR till Servera?",
        answer:
          "Ja. Vi hjälper dig att importera din befintliga meny så övergången blir smidig. Boka en demo så går vi igenom hur det fungerar för just din restaurang.",
      },
      {
        question: "Behöver gästen ladda ned en app?",
        answer:
          "Nej, Servera-menyn öppnas direkt i mobilens webbläsare när gästen skannar QR-koden. Inget app-krav, ingen registrering, inga inloggningar — det här är standard för moderna QR-menyer i Sverige.",
      },
      {
        question: "Hur snabbt kan jag komma igång?",
        answer:
          "De flesta restauranger är igång på under 30 minuter. Du skapar ett konto, lägger in kategorier och rätter, väljer en QR-design och skriver ut bordskoderna.",
      },
    ],
    metaTitle: "Servera vs Meny-QR — jämförelse av QR-meny för restauranger",
    metaDescription:
      "Jämför Servera och Meny-QR: pris i SEK, provisioner, kockvy, allergener och kassasystem-integration. Ärlig guide för svenska restauranger som väljer QR-meny 2026.",
  },
  "servera-vs-qopla": {
    slug: "servera-vs-qopla",
    competitorName: "Qopla",
    hero: {
      eyebrow: "Jämförelse",
      h1: "Servera vs Qopla — så avgör du vilken plattform som passar din restaurang",
      sub: "Qopla är en bredare beställningsplattform. Servera är fokuserad på QR-beställning från bordet. Här är vad det innebär för dig.",
    },
    intro:
      "Qopla och Servera angriper restaurangteknik från olika håll. Qopla är en bred beställningsplattform med online-beställning, hemleverans och QR-meny. Servera är fokuserad — en ren QR-meny och bordsbeställning för restauranger som främst vill effektivisera in-house-flödet. Den här sidan hjälper dig avgöra vilken som passar din verksamhet.",
    serveraStrengths: [
      {
        title: "Smalt scope, lägre pris",
        body: "Servera gör QR-beställning från bordet — inte takeaway-portaler, inte hemleverans. Det betyder lägre månadskostnad och en enklare onboarding för restauranger som inte behöver bredden.",
      },
      {
        title: "Köks- och servitörsvy i realtid",
        body: "Beställningar pushas direkt till en kockskärm. Servitörer ser bordspings live. Inga skrivare, ingen pappersbongning.",
      },
      {
        title: "Allergener och kostmärkning byggt in",
        body: "Vegan, vegetariskt, glutenfritt och alla gängse allergener kan markeras per rätt. Informationen visas tydligt för gästen i menyn.",
      },
      {
        title: "Triad Solutions stöd i Sverige",
        body: "Servera utvecklas och supportas i Sverige av Triad Solutions. Svensk support på svensk arbetstid, ingen tidszon-fördröjning.",
      },
    ],
    decisionGuide: [
      {
        heading: "Behöver du takeaway och delivery?",
        body: "Om en stor del av din omsättning kommer från hämtning och hemleverans behöver du en bredare plattform. Om in-house-bordsbeställning är huvudsyftet är Servera billigare och enklare.",
      },
      {
        heading: "Hur stor del av menyn ändras?",
        body: "Om du byter dagens lunch varje dag eller har ofta ändrade priser, fokusera på hur snabb och tillgänglig adminpanelen är. Servera är byggd för att restaurangägaren själv ska kunna uppdatera.",
      },
      {
        heading: "Vad kostar det totalt om ett år?",
        body: "Räkna in månadsavgift, eventuell provision per beställning, hårdvara, support och onboarding. Jämför totalkostnad — inte bara skyltpris.",
      },
      {
        heading: "Hur ser kassasystem-flödet ut?",
        body: "Om du redan kör Caspeco eller Trivec, kontrollera båda leverantörerna kring exakt vilka fält som synkas. Servera Företag kan bygga skräddarsydda integrationer.",
      },
    ],
    faq: [
      {
        question: "Vad är skillnaden mellan Servera och Qopla?",
        answer:
          "Qopla är en bred beställningsplattform med online-beställning, takeaway och QR. Servera är specifikt en QR-meny och bordsbeställning. Servera har lägre månadskostnad och enklare setup men täcker inte hela kundresan från takeaway till hemleverans.",
      },
      {
        question: "Vilken är bäst för en pizzeria med både in-house och takeaway?",
        answer:
          "Det beror på fördelningen. Om majoriteten av omsättningen är takeaway behöver du en plattform som hanterar online-orderflödet. Om in-house är huvudsaken är Servera ofta lägre kostnad. Boka demo så hjälper vi dig räkna.",
      },
      {
        question: "Stöder Servera onlinebetalning?",
        answer:
          "Ja, via Stripe. Du kan välja att kräva betalning direkt vid beställning eller låta gästen betala till servitör som vanligt — inställningen är per restaurang.",
      },
      {
        question: "Kan jag byta från Qopla till Servera?",
        answer:
          "Ja. Vi hjälper dig importera menyn. För större ändringar (t.ex. om du också vill behålla takeaway-flödet via en annan kanal) går vi igenom det i demo.",
      },
      {
        question: "Hur lång uppsägningstid har Servera?",
        answer:
          "30 dagars uppsägning på Start och Tillväxt-planerna. Ingen bindningstid utöver det.",
      },
    ],
    metaTitle: "Servera vs Qopla — vilken plattform passar din restaurang?",
    metaDescription:
      "Jämför Servera och Qopla för svenska restauranger: bredd vs fokus, månadspris, kockvy, takeaway-stöd och kassasystem-integration. Boka kostnadsfri demo.",
  },
  "servera-vs-weiq": {
    slug: "servera-vs-weiq",
    competitorName: "WEIQ",
    hero: {
      eyebrow: "Jämförelse",
      h1: "Servera vs WEIQ — webbaserad QR vs terminal-driven beställning",
      sub: "WEIQ kombinerar QR-meny med betalterminaler. Servera är ren webb-baserad QR. Här är vad du bör tänka på vid valet.",
    },
    intro:
      "WEIQ och Servera är båda svenska aktörer inom restaurangbeställning, men de har olika tekniska upplägg. WEIQ erbjuder en kombination av QR-meny och egna betalterminaler — bra om du vill att gästen ska kunna betala på en fysisk enhet vid bordet. Servera är webb-först: gästen skannar, beställer och betalar (om du aktiverar Stripe) helt från sin egen mobil utan extra hårdvara. Den här sidan hjälper dig välja modell.",
    serveraStrengths: [
      {
        title: "Ingen extra hårdvara",
        body: "Servera kräver inga betalterminaler vid bordet. Allt fungerar i gästens egen mobil — vilket sparar kostnad, ström och underhåll. För kockvyn räcker en vanlig tablet eller skärm.",
      },
      {
        title: "Stripe-integration ingår",
        body: "Onlinebetalning via Stripe är inbyggt. Du väljer själv om gästen betalar vid beställning eller traditionellt till servitör.",
      },
      {
        title: "Fast SEK-pris från 549 kr/mån",
        body: "Servera har genomskinliga priser i svenska kronor utan provision per beställning. Inga dolda kostnader för terminaler eller transaktionsavgifter utöver Stripes egen.",
      },
      {
        title: "Snabb onboarding",
        body: "De flesta restauranger är igång på under 30 minuter. Lägg in menyn, skriv ut QR-koderna, börja ta emot beställningar.",
      },
    ],
    decisionGuide: [
      {
        heading: "Vill dina gäster betala vid bordet på en fysisk enhet?",
        body: "Vissa kundgrupper (äldre gäster, hotellrestauranger) föredrar en terminal de fysiskt knappar in på. Andra föredrar att betala i sin egen mobil. Vilket passar din publik bäst?",
      },
      {
        heading: "Hur ofta byter dina gäster bord?",
        body: "Om gäster ofta sitter kvar länge eller flyttar bord (barer, festsäsong) är webb-baserad QR mer flexibel än fast hårdvara per bord.",
      },
      {
        heading: "Räkna in hårdvarukostnaden",
        body: "Terminaler kostar både i inköp/leasing och underhåll. Servera har bara molnkostnad per restaurang, ingen hårdvara-investering.",
      },
      {
        heading: "Kontrollera Wi-Fi och 4G-täckning",
        body: "Webb-baserad QR förutsätter att gästens mobil får uppkoppling. På restauranger i källare eller med dålig täckning är det värt att verifiera innan du går live.",
      },
    ],
    faq: [
      {
        question: "Vad är skillnaden mellan Servera och WEIQ?",
        answer:
          "WEIQ kombinerar QR-meny med betalterminaler vid bordet. Servera är ren webb-baserad — gästen skannar QR-koden, beställer och betalar (om du aktiverar Stripe) helt i sin egen mobil. Servera kräver ingen extra hårdvara förutom en kockskärm.",
      },
      {
        question: "Är webb-baserad QR säker för betalningar?",
        answer:
          "Ja. Servera använder Stripe för betalningar — samma tekniska standard som de flesta e-handelssidor i Sverige. Stripe är PCI DSS Level 1-certifierad.",
      },
      {
        question: "Behöver jag en betalterminal vid varje bord om jag väljer Servera?",
        answer:
          "Nej. Servera fungerar utan terminaler vid bordet — gästen betalar i sin egen mobil eller traditionellt till servitör vid kassan beroende på din inställning.",
      },
      {
        question: "Hur ser totalpris ut jämfört med terminaler?",
        answer:
          "Servera kostar 549 kr/mån eller 999 kr/mån (fast SEK-pris). Lägg till Stripes transaktionsavgift om du aktiverar onlinebetalning. Inga hårdvarukostnader. Terminallösningar har vanligtvis månadsavgift för terminaler plus transaktionsavgifter.",
      },
      {
        question: "Kan jag köra både webb-baserad QR och terminaler parallellt?",
        answer:
          "Servera är webb-först. Om du vill kombinera med fysiska kortterminaler behåller du din befintliga terminallösning och låter Servera hantera digital meny + beställningsflödet. Boka demo så går vi igenom uppställningen.",
      },
    ],
    metaTitle: "Servera vs WEIQ — webb-QR eller terminal? Jämförelse 2026",
    metaDescription:
      "Servera är webb-baserad QR-meny utan extra hårdvara. WEIQ kombinerar QR med betalterminaler. Jämför pris, hårdvarukostnad och setup för svenska restauranger.",
  },
}

export const COMPARISON_SLUGS = Object.keys(COMPARISONS)
