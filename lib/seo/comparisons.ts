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
  /**
   * Side-by-side feature comparison. Competitor cells must reflect only
   * publicly verifiable claims from the competitor's own website.
   */
  comparisonTable?: Array<{
    feature: string
    servera: string
    competitor: string
  }>
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
        body: "Servera levereras med en dedikerad kockvy och en servitörsvy. Beställningar skickas direkt utan att skrivas ut, och servitören ser med en gång när ett bord behöver hjälp. Det krävs ingen extra hårdvara — en surfplatta i köket räcker.",
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
    comparisonTable: [
      {
        feature: "Digital meny med QR-kod per bord",
        servera: "Ja",
        competitor: "Ja",
      },
      {
        feature: "Beställning från bordet i mobilen",
        servera: "Ja — gästen lägger sin order själv",
        competitor:
          "Nej — Meny-QR visar menyn; beställning sker via personalen",
      },
      {
        feature: "Kock- och servitörsvy",
        servera: "Ingår",
        competitor: "Ingår ej",
      },
      {
        feature: "Allergen- och kostmärkning per rätt",
        servera: "Inbyggt",
        competitor: "Anges i menytexten",
      },
      {
        feature: "Flerspråkig meny",
        servera: "Ja",
        competitor: "Ja",
      },
      {
        feature: "Menyanalys",
        servera: "Ja, i adminpanelen",
        competitor: "Ja, från betald plan",
      },
      {
        feature: "Prismodell",
        servera: "Fast pris i SEK, ingen provision per order",
        competitor: "Fast pris i SEK, ingen provision per order",
      },
      {
        feature: "Publika priser (maj 2026)",
        servera: "549 kr/mån (Start) · 999 kr/mån (Tillväxt)",
        competitor: "0 kr (Gratis) · 199 kr/mån · 499 kr/mån",
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
        body: "Beställningar skickas direkt till en kockskärm. Servitören ser med en gång när ett bord behöver hjälp. Inga skrivare, ingen pappersbongning.",
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
    comparisonTable: [
      {
        feature: "QR-beställning från bordet",
        servera: "Ja",
        competitor: "Ja",
      },
      {
        feature: "Köks-/kockskärm",
        servera: "Ingår",
        competitor: "Ja, som separat produkt (Köksskärm)",
      },
      {
        feature: "Kassasystem (POS)",
        servera: "Nej — körs parallellt med din befintliga kassa",
        competitor: "Ja — komplett kassasystem",
      },
      {
        feature: "Online-beställning, takeaway & leverans",
        servera: "Nej — fokus på bordsbeställning",
        competitor: "Ja",
      },
      {
        feature: "Betalning i mobilen",
        servera: "Ja, via Stripe",
        competitor: "Ja, via Swish och kort",
      },
      {
        feature: "Prismodell",
        servera: "Fast pris i SEK, ingen provision per order",
        competitor: "Offert — pris ej publicerat",
      },
      {
        feature: "Publika priser (maj 2026)",
        servera: "549 kr/mån (Start) · 999 kr/mån (Tillväxt)",
        competitor: "Ej publicerade — kontakta Qopla för offert",
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
        body: "Servera kräver inga betalterminaler vid bordet. Allt fungerar i gästens egen mobil — vilket sparar kostnad, ström och underhåll. För kockvyn räcker en vanlig surfplatta eller skärm.",
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
    comparisonTable: [
      {
        feature: "QR-beställning från bordet",
        servera: "Ingår i alla planer",
        competitor: "Ingår på WEIQ Pro",
      },
      {
        feature: "Köks-/kockvy",
        servera: "Köksskärm ingår",
        competitor: "Bongsystem med kvittoskrivare (Star, Epson, SNBC)",
      },
      {
        feature: "Extra hårdvara vid bordet",
        servera: "Ingen — allt sker i gästens egen mobil",
        competitor: "Egna betalterminaler ingår",
      },
      {
        feature: "Kassasystem (POS)",
        servera: "Nej — körs parallellt med din kassa",
        competitor: "Ja — Skatteverket-certifierat kassasystem",
      },
      {
        feature: "Prismodell",
        servera: "Fast pris i SEK, ingen provision per order",
        competitor: "Månadsavgift + transaktionsavgift (t.ex. 0,8 %)",
      },
      {
        feature: "Publika priser (maj 2026)",
        servera: "549 kr/mån (Start) · 999 kr/mån (Tillväxt)",
        competitor:
          "0 kr (Free) · från 250 kr/mån (Easy) · från 750 kr/mån (Pro)",
      },
    ],
    metaTitle: "Servera vs WEIQ — webb-QR eller terminal? Jämförelse 2026",
    metaDescription:
      "Servera är webb-baserad QR-meny utan extra hårdvara. WEIQ kombinerar QR med betalterminaler. Jämför pris, hårdvarukostnad och setup för svenska restauranger.",
  },
}

COMPARISONS["servera-vs-caspeco"] = {
  slug: "servera-vs-caspeco",
  competitorName: "Caspeco",
  hero: {
    eyebrow: "Jämförelse",
    h1: "Servera vs Caspeco — fokuserad QR-meny eller komplett kassasystem?",
    sub: "Caspeco är ett bredt restaurangsystem som växte ihop med Trivec våren 2025. Servera är en ren QR-meny och bordsbeställning. Här är vad det innebär för dig.",
  },
  intro:
    "Caspeco och Servera angriper restaurangteknik från olika håll. Caspeco är ett bredt kassa- och driftsystem som täcker schemaläggning, lön, redovisning och kassa — efter sammanslagningen med Trivec våren 2025 är de en av Nordens största aktörer. Servera är fokuserad på QR-beställning från bordet och digital meny — det vi gör vill vi göra riktigt bra. Den här sidan hjälper dig avgöra om du behöver hela bredden eller om en enkel, fokuserad QR-meny räcker.",
  serveraStrengths: [
    {
      title: "Lägre månadskostnad och tröskel",
      body: "Servera börjar på 549 kr/mån utan provisioner. Bredare restaurangsystem har vanligtvis högre månadsavgift, fler moduler du betalar för och längre onboarding. Om QR-meny är det enda du saknar är Servera betydligt lägre kostnad.",
    },
    {
      title: "Snabb onboarding — inga konsulttimmar",
      body: "De flesta restauranger är igång på Servera under 30 minuter. Du behöver inte schemalägga implementation eller koppla in befintliga system. Lägg in menyn, skriv ut QR-koderna, kör.",
    },
    {
      title: "Modern, mobilfokuserad gästupplevelse",
      body: "Servera är byggd från grunden för att menyn ska se rätt ut i gästens mobil. Inga arvslager från gamla kassasystem, ingen nedbantad skrivbordslösning — bara en snabb webbmeny och en kockvy som fungerar på en vanlig surfplatta.",
    },
    {
      title: "Du behåller ditt kassasystem",
      body: "Servera kräver inte att du byter kassa. Kör Caspeco eller Trivec parallellt om du redan gjort den investeringen — Servera tar hand om QR-flödet vid bordet utan att tvinga ett systembyte.",
    },
  ],
  decisionGuide: [
    {
      heading: "Behöver du verkligen ett komplett restaurangsystem?",
      body: "Caspeco/Trivec ger schemaläggning, lön, redovisning, kassa, lagerstyrning och rapportering. Om du redan har de modulerna du behöver är Servera ett enklare och billigare tillägg för QR-flödet. Om du startar från noll och vill ha allt i ett kan ett bredare system vara värt högre kostnad.",
    },
    {
      heading: "Vad kostar du faktiskt över ett år?",
      body: "Räkna in månadsavgift för alla moduler, eventuell hårdvara, implementation, utbildning och support. Jämför totalkostnad — inte bara abonnemangets bottenpris.",
    },
    {
      heading: "Hur ofta uppdaterar du menyn?",
      body: "Servera är byggd för att restaurangägaren själv ska kunna uppdatera menyn på mobilen. Bredare system kan kräva mer klick eller IT-stöd för menyändringar — viktigt om du byter dagens lunch ofta.",
    },
    {
      heading: "Om du redan kör Caspeco eller Trivec",
      body: "Du behöver inte byta. På Företag-planen kan Servera bygga skräddarsydda integrationer mot ditt befintliga kassasystem. Ofta börjar restauranger med Servera parallellt för QR-menyn och utvärderar djupare integration senare.",
    },
  ],
  faq: [
    {
      question: "Är Servera ett alternativ till Caspeco?",
      answer:
        "Servera ersätter inte ett komplett kassa- och driftsystem som Caspeco. Servera är fokuserad på QR-meny, mobilbeställning och kockvy. Många restauranger kör Servera parallellt med sitt befintliga kassasystem — du behöver inte byta för att lägga till QR-flödet.",
    },
    {
      question: "Kan jag integrera Servera med Caspeco eller Trivec?",
      answer:
        "På Företag-planen kan vi bygga skräddarsydda integrationer mot Caspeco, Trivec eller andra kassasystem. Standardflödet är att Servera tar hand om gästens beställning från bordet, och kassasystemet hanterar betalning och bokföring som vanligt.",
    },
    {
      question: "Vad är skillnaden i kostnad?",
      answer:
        "Servera kostar 549 kr/mån (Start) eller 999 kr/mån (Tillväxt) i fast SEK utan provisioner. Caspeco/Trivec är ett bredare system där priset beror på vilka moduler och tillägg du behöver — typiskt en betydligt högre totalkostnad eftersom du betalar för fler funktioner.",
    },
    {
      question: "Hur snabbt kommer jag igång?",
      answer:
        "Under 30 minuter på Servera. Du skapar konto, lägger in kategorier och rätter, väljer en QR-design och skriver ut bordskoderna. Implementation av ett komplett restaurangsystem som Caspeco tar normalt veckor med konsulttimmar.",
    },
    {
      question: "Kan Servera räcka som ensamt system?",
      answer:
        "För mindre verksamheter ja — i kombination med en enkel kassa eller Stripe-betalning. För större verksamheter med behov av schemaläggning, lön, lagerstyrning och avancerad rapportering rekommenderar vi att Servera kompletterar ett befintligt kassasystem snarare än ersätter det.",
    },
  ],
  comparisonTable: [
    {
      feature: "QR-beställning från bordet",
      servera: "Ja",
      competitor: "Ja, som en av flera försäljningskanaler",
    },
    {
      feature: "Kassasystem (POS)",
      servera: "Nej — körs parallellt med din befintliga kassa",
      competitor: "Ja — Caspeco Kassa och Trivec Kassa",
    },
    {
      feature: "Personal: schema, lön, tidrapportering",
      servera: "Nej",
      competitor: "Ja",
    },
    {
      feature: "Bordsbokning",
      servera: "Nej",
      competitor: "Ja",
    },
    {
      feature: "Analys och lönsamhetsuppföljning",
      servera: "Orderstatistik i adminpanelen",
      competitor: "Ja — branschanalys, budget och prognoser",
    },
    {
      feature: "Produktomfång",
      servera: "Fokuserad QR-meny och bordsbeställning",
      competitor:
        "Komplett restaurangsystem (kassa, personal, bokning, analys)",
    },
    {
      feature: "Prismodell",
      servera: "Fast pris i SEK, ingen provision per order",
      competitor: "Offert — pris ej publicerat",
    },
    {
      feature: "Publika priser (maj 2026)",
      servera: "549 kr/mån (Start) · 999 kr/mån (Tillväxt)",
      competitor: "Ej publicerade — kontakta Caspeco för offert",
    },
  ],
  metaTitle: "Servera vs Caspeco — QR-meny eller komplett kassasystem?",
  metaDescription:
    "Servera är fokuserad QR-meny från 549 kr/mån. Caspeco är ett brett restaurangsystem efter Trivec-sammanslagningen 2025. Jämför pris, scope och onboarding.",
}

COMPARISONS["servera-vs-flipdish"] = {
  slug: "servera-vs-flipdish",
  competitorName: "Flipdish",
  hero: {
    eyebrow: "Jämförelse",
    h1: "Servera vs Flipdish — svensk QR-meny eller internationell beställningsplattform?",
    sub: "Flipdish är en irländsk plattform med stort scope. Servera är byggd specifikt för svenska restauranger med fast SEK-pris. Här är vad det innebär för dig.",
  },
  intro:
    "Flipdish och Servera är båda inom restaurangbeställning men de har olika fokus. Flipdish är en irländsk plattform som täcker takeaway-portaler, hemleverans, QR-meny och kioskorder — bred och internationell. Servera är fokuserad på svenska restauranger som vill ha en ren QR-meny och bordsbeställning, med fast pris i SEK och support på svensk arbetstid. Den här sidan hjälper dig avgöra vilken modell som passar din verksamhet.",
  serveraStrengths: [
    {
      title: "Fast SEK-pris — inga provisioner per beställning",
      body: "Servera kostar 549 kr/mån eller 999 kr/mån i fast SEK utan provision per order. Många internationella plattformar (inklusive Flipdish historiskt) tar 1–5 % per beställning, vilket på en restaurang med 500 000 kr/månad i omsättning kan betyda 5 000–25 000 kr extra utöver abonnemanget.",
    },
    {
      title: "Svensk support på svensk arbetstid",
      body: "Servera utvecklas och supportas i Sverige av Triad Solutions. Inga tidszon-fördröjningar, inga engelskspråkiga ärendeflöden — frågor besvaras på svenska under svensk kontorstid.",
    },
    {
      title: "Lokalanpassat för svenska behov",
      body: "Allt är byggt för svenska restauranger: SEK med korrekt tusentalsavgränsare, svenska allergenstandarder, Stripe-koppling med svenska betalmetoder, integration med kassasystem som finns i Sverige.",
    },
    {
      title: "Smalare scope, lägre tröskel",
      body: "Servera gör QR-meny från bordet — inte takeaway-marknadsplats, inte egen leveransflotta. Det betyder enklare onboarding och lägre månadskostnad om in-house-bordsbeställning är huvudbehovet.",
    },
  ],
  decisionGuide: [
    {
      heading: "Hur stor del av omsättningen är takeaway och delivery?",
      body: "Om majoriteten av din omsättning är hämtning eller hemleverans behöver du en bredare plattform med marknadsplats- och leveransflöden. Om det är in-house-bordsbeställning som dominerar är Servera fokuserad och billigare.",
    },
    {
      heading: "Räkna in provisioner i totalkostnaden",
      body: "Procentavgifter per beställning skalar med din försäljning. Fast SEK-pris gör inte det. På högre kuvertvolymer blir Servera ofta lägre totalkostnad även om abonnemanget vid första anblick ser likvärdigt ut.",
    },
    {
      heading: "Hur viktig är svensk support och svenskt språk?",
      body: "Om du värdesätter att kunna ringa eller maila support på svenska, ha avtal under svensk lag och få fakturor med svensk moms är en svensk leverantör ofta enklare att hantera.",
    },
    {
      heading: "Behöver du flerspråkig meny?",
      body: "Båda kan visa menyn på flera språk. På Servera är språkstöd inbyggt och optimerat för svenska restauranger med internationell publik (Stockholm, Göteborg, Malmö, turistorter).",
    },
  ],
  faq: [
    {
      question: "Vad är skillnaden mellan Servera och Flipdish?",
      answer:
        "Flipdish är en irländsk bred beställningsplattform som täcker takeaway-portaler, hemleverans och QR-meny. Servera är en svensk fokuserad QR-meny och bordsbeställning med fast SEK-pris utan provisioner. Servera är enklare och billigare för restauranger där in-house är huvudfokus.",
    },
    {
      question: "Tar Servera provision per beställning?",
      answer:
        "Nej. Servera har fast månadskostnad i svenska kronor. Inga provisioner per order, inga dolda transaktionsavgifter (utöver Stripes egna kortavgifter om du aktiverar onlinebetalning).",
    },
    {
      question: "Kan jag byta från Flipdish till Servera?",
      answer:
        "Ja. Vi hjälper dig importera din meny och dina kategorier. Om du också använder Flipdish för takeaway-marknadsplats kan du behålla det parallellt och låta Servera ta hand om QR-flödet vid bordet.",
    },
    {
      question: "Är Servera tillgänglig på engelska?",
      answer:
        "Adminpanelen är på svenska. Gästmenyn kan visas på flera språk inklusive engelska, särskilt användbart i turisttäta områden. Support sker på svenska och engelska.",
    },
    {
      question: "Vilken plattform fungerar bäst för en restaurang i Sverige?",
      answer:
        "Det beror på behovet. Om du främst vill ha QR-beställning från bordet är Servera fokuserad, billigare och svensk-supportad. Om du vill ha en marknadsplats för takeaway, egen leveransflotta och internationell skalning är en bredare plattform som Flipdish bättre lämpad — till en högre totalkostnad.",
    },
  ],
  comparisonTable: [
    {
      feature: "Produktomfång",
      servera: "Fokuserad QR-meny och bordsbeställning",
      competitor:
        "Bred plattform: online-beställning, egen app och webbplats, POS, kiosk, leverans",
    },
    {
      feature: "Köks-/kockvy",
      servera: "Köksskärm ingår",
      competitor: "Kitchen Display System ingår",
    },
    {
      feature: "Egen gäst-app och beställningswebbplats",
      servera: "Nej — fokus på QR vid bordet",
      competitor: "Ja",
    },
    {
      feature: "Marknad och support",
      servera: "Sverige — support på svenska",
      competitor: "Internationell (Irland-baserad) — support på engelska",
    },
    {
      feature: "Prisvaluta och modell",
      servera: "Fast pris i SEK, ingen provision per order",
      competitor: "Pris i EUR per enhet, plus transaktionsavgift",
    },
    {
      feature: "Publika priser (maj 2026)",
      servera: "549 kr/mån (Start) · 999 kr/mån (Tillväxt)",
      competitor:
        "Från €99/mån (årsvis) · €129/mån (månadsvis), per enhet",
    },
    {
      feature: "Onboarding",
      servera: "Igång på under 30 minuter, självbetjäning",
      competitor: "Dedikerad onboarding med införandeteam",
    },
  ],
  metaTitle: "Servera vs Flipdish — svensk QR-meny eller internationell plattform?",
  metaDescription:
    "Servera är svensk QR-meny från 549 kr/mån utan provisioner. Flipdish är en bred internationell beställningsplattform. Jämför pris, scope och support.",
}

COMPARISONS["servera-vs-yumzi"] = {
  slug: "servera-vs-yumzi",
  competitorName: "Yumzi",
  hero: {
    eyebrow: "Jämförelse",
    h1: "Servera vs Yumzi — två QR-menyplattformar, två olika fokus",
    sub: "Yumzi är en internationell QR-meny med starkt fokus på flerspråkighet. Servera är byggd specifikt för svenska restauranger med fast SEK-pris och svensk support.",
  },
  intro:
    "Servera och Yumzi är båda inom QR-meny för restauranger, men de skiljer sig i lokal närvaro och hur de prissätter. Yumzi är en internationell aktör med stark flerspråkighet och en globalt fokuserad produkt. Servera är byggd specifikt för svenska restauranger — fast pris i SEK, svensk support, svensk lagring av data och funktioner som matchar svenska allergen- och momsregler. Den här sidan hjälper dig välja vilket fokus som passar din verksamhet bäst.",
  serveraStrengths: [
    {
      title: "Fast SEK-pris och svensk faktura",
      body: "Servera kostar 549 kr/mån eller 999 kr/mån i fast SEK. Faktura med svensk moms från Triad Solutions. Inga valutaväxlingar, inga oväntade prishöjningar från utländska valutaförändringar.",
    },
    {
      title: "Svensk support — utan tidszons-fördröjning",
      body: "Frågor besvaras av oss i Sverige under svensk kontorstid. För restauranger som behöver hjälp under fredagskvällens rusning är det en konkret skillnad jämfört med en supportkö i en annan tidszon.",
    },
    {
      title: "Köks- och servitörsvy ingår",
      body: "Servera levereras med en dedikerad kockvy och en servitörsvy. Beställningar skickas direkt utan att skrivas ut, och servitören ser med en gång när ett bord behöver hjälp.",
    },
    {
      title: "Allergener och svenska kostmärkningar inbyggt",
      body: "Vegan, vegetariskt, glutenfritt och alla vanliga allergener kan markeras per rätt — strukturerat så det matchar svenska branschstandarder och visas tydligt för gästen.",
    },
  ],
  decisionGuide: [
    {
      heading: "Hur internationell är din publik?",
      body: "Yumzi är byggt med flerspråkighet som huvudfokus och kan vara starkt om gästkretsen är extremt internationell. Servera stöder också flerspråkig meny men är primärt optimerad för svenska restauranger med svensk eller blandad publik.",
    },
    {
      heading: "Vill du ha en svensk eller internationell leverantör?",
      body: "Var leverantören har sin hemvist spelar roll för avtalsvillkor (svensk lag eller annan jurisdiktion), faktureringsvaluta, var data lagras och hur supporten fungerar. Avgör vad som väger tyngst för dig.",
    },
    {
      heading: "Räkna på totalkostnaden",
      body: "Båda har månadsabonnemang. Kontrollera om någon tar provision per beställning, om det finns hårdvarukostnader, transaktionsavgifter och vad onboarding kostar. Jämför slutsumman över ett år.",
    },
    {
      heading: "Testa gästflödet själv",
      body: "Skanna en demo-QR och gå igenom hela flödet i din egen mobil. Är menyn snabb? Tydlig på svenska? Lätt att lägga till modifiers? Visas allergener automatiskt? Det är det enda dina gäster märker.",
    },
  ],
  faq: [
    {
      question: "Vad är skillnaden mellan Servera och Yumzi?",
      answer:
        "Servera är en svensk QR-menyplattform med fast SEK-pris, svensk support och svenska faktureringsvillkor. Yumzi är en internationell aktör med starkt fokus på flerspråkighet. Båda löser QR-meny från bordet, men leverantörsstruktur, support och prisvaluta skiljer.",
    },
    {
      question: "Är båda gratis att testa?",
      answer:
        "Servera erbjuder en kostnadsfri demo där vi går igenom plattformen live, tittar på din meny och svarar på frågor. Boka via kontaktsidan.",
    },
    {
      question: "Kan jag visa menyn på flera språk på Servera?",
      answer:
        "Ja. Servera stöder flerspråkig meny — särskilt användbart för restauranger i Stockholm, Göteborg och Malmö med en internationell gästkrets.",
    },
    {
      question: "Vilken plattform passar bäst för en svensk restaurang?",
      answer:
        "För restauranger som vill ha lokal support, fast SEK-pris och svenska faktureringsvillkor är Servera ofta enklare. För starkt internationellt orienterade verksamheter med extrem flerspråkighet kan en bredare internationell plattform vara likvärdig.",
    },
    {
      question: "Hur snabbt kommer jag igång?",
      answer:
        "På Servera är de flesta restauranger igång under 30 minuter — du skapar konto, lägger in kategorier och rätter, väljer en QR-design och skriver ut bordskoderna.",
    },
  ],
  comparisonTable: [
    {
      feature: "Digital meny med QR-kod",
      servera: "Ja",
      competitor: "Ja",
    },
    {
      feature: "Beställning från bordet i mobilen",
      servera: "Ja — gästen lägger sin order själv",
      competitor:
        "Nej — Yumzi är en menyskapare för digital meny och tryck",
    },
    {
      feature: "Kock- och servitörsvy",
      servera: "Ingår",
      competitor: "Ingår ej",
    },
    {
      feature: "Tryckta menyer (PDF/print)",
      servera: "Nej — Servera är helt digital",
      competitor: "Ja",
    },
    {
      feature: "Flerspråkig meny",
      servera: "Ja",
      competitor: "Ja — automatiska översättningar",
    },
    {
      feature: "Allergen- och näringsmärkning",
      servera: "Inbyggt per rätt",
      competitor: "Ja — allergener och näringsvärden",
    },
    {
      feature: "Prismodell",
      servera: "Fast pris i SEK, ingen provision per order",
      competitor: "Pris i SEK, terminbaserat abonnemang",
    },
    {
      feature: "Publika priser (maj 2026)",
      servera: "549 kr/mån (Start) · 999 kr/mån (Tillväxt)",
      competitor: "Från 113 kr/mån (2-årsavtal) · 142 kr/mån (årsvis)",
    },
  ],
  metaTitle: "Servera vs Yumzi — svensk eller internationell QR-meny?",
  metaDescription:
    "Servera är en svensk QR-meny från 549 kr/mån med svensk support och fakturering. Yumzi är en internationell aktör. Jämför fokus, pris och leverantörsstruktur.",
}

export const COMPARISON_SLUGS = Object.keys(COMPARISONS)
