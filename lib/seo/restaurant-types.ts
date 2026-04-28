export interface RestaurantTypeContent {
  slug: string
  name: string
  pluralName: string
  intro: string
  context: string
  whyServeraFits: Array<{ title: string; body: string }>
  exampleSections: string[]
  faq: Array<{ question: string; answer: string }>
  metaTitle: string
  metaDescription: string
}

const COMMON_FAQ = (singular: string, plural: string) => [
  {
    question: `Hur snabbt kan en ${singular} komma igång med Servera?`,
    answer:
      "Under 30 minuter. Du skapar konto, lägger in kategorier och rätter, väljer en QR-design och skriver ut bordskoderna. Inget kassasystem behöver kopplas in för att starta.",
  },
  {
    question: `Vad kostar Servera för ${plural}?`,
    answer:
      "549 kr/mån (Start, upp till 20 bord) eller 999 kr/mån (Tillväxt, obegränsat antal bord). Inga provisioner per beställning, inga dolda avgifter.",
  },
  {
    question: "Behöver gästen ladda ned en app?",
    answer:
      "Nej. Servera-menyn öppnas direkt i mobilens webbläsare när gästen scannar QR-koden — ingen registrering, ingen inloggning.",
  },
]

export const RESTAURANT_TYPES: Record<string, RestaurantTypeContent> = {
  pizzeria: {
    slug: "pizzeria",
    name: "pizzeria",
    pluralName: "pizzerior",
    intro:
      "Servera är en digital meny och QR-beställning byggd för svenska pizzerior. Gästen scannar en QR-kod på bordet, väljer pizza med tillval (extra topping, glutenfri botten, halvt-halvt) och skickar beställningen direkt till köket — inga bonsar, inga skrivare, ingen missuppfattning kring 'utan lök'.",
    context:
      "Pizzerior i Sverige har två återkommande utmaningar: komplicerade tillval per pizza (kunderna vill anpassa) och hög lunchtopp där servitören står och repeterar samma frågor om allergener och storlek hela passet. Servera löser båda — modifiers byggs in i menyn så gästen själv väljer, och allergeninformation visas automatiskt på varje rätt.",
    whyServeraFits: [
      {
        title: "Modifiers för tillval och toppings",
        body: "Lägg till valfria toppings, storlekar (familj, mellan, liten), botten (vanlig, glutenfri, fullkorn) och halvt-halvt-pizzor med automatisk prissättning. Gästen ser exakt vad slutpriset blir innan beställning.",
      },
      {
        title: "Allergeninformation per pizza",
        body: "Märk varje pizza med gluten, laktos, ägg och kostpreferenser. Pizzerian slipper svara på samma frågor 50 gånger per kväll.",
      },
      {
        title: "Avlasta köket vid lunchrusning",
        body: "Beställningar pushas direkt till en kocktablet. Inga skrivare, ingen pappersbongning. Pizzabagaren ser nästa beställning direkt och kan börja jäsa parallellt.",
      },
      {
        title: "Hämtbeställningar via samma QR",
        body: "Sätt upp en 'hämtning'-bordskod vid kassan så gästen kan beställa, betala via Stripe och hämta när det är klart — utan att blockera bordsplatser.",
      },
    ],
    exampleSections: [
      "Klassiska pizzor",
      "Specialpizzor",
      "Vita pizzor",
      "Sallader",
      "Dessert",
      "Drycker",
    ],
    faq: [
      {
        question: "Kan jag erbjuda halvt-halvt-pizzor med olika priser?",
        answer:
          "Ja. Modifiers stöder alternativ med olika prispåslag, så gästen kan kombinera halvor med automatisk uträkning av slutpris.",
      },
      {
        question:
          "Hur hanterar Servera glutenfri botten eller andra extra-tillval?",
        answer:
          "Glutenfri botten, fullkornsbotten, extra ost — alla läggs till som modifiers per rätt med valfritt prispåslag. Gästen ser tillvalet tydligt och köket ser det per beställning.",
      },
      ...COMMON_FAQ("pizzeria", "pizzerior"),
    ],
    metaTitle: "Digital meny för pizzeria — QR-beställning från bordet | Servera",
    metaDescription:
      "Servera är digital meny och QR-beställning för svenska pizzerior. Modifiers, allergener, halvt-halvt, glutenfri botten. Från 549 kr/mån. Boka demo.",
  },
  sushi: {
    slug: "sushi",
    name: "sushiställe",
    pluralName: "sushiställen",
    intro:
      "Servera är digital meny och QR-beställning för sushiställen — perfekt för verksamheter med långa menyer, stora variantfält (8-bitars, 16-bitars, mix) och intensiv lunchrusning. Gästen scannar bordkoden, bygger sin beställning på sin egen mobil och köket ser ordningsföljden i realtid.",
    context:
      "Sushiställen i Sverige har ofta menyer med 80–150 enskilda rätter. Att hantera detta i tryckt form innebär ofta utdaterade menyer, och i lunchrusning blir handskriven beställning till köket en flaskhals. Servera ger gästen sökbar meny och köket en realtidsvy.",
    whyServeraFits: [
      {
        title: "Hantera långa menyer i kategorier",
        body: "Maki, nigiri, sashimi, signature rolls, varmrätter, tillbehör — Servera hanterar obegränsade kategorier och hundratals rätter utan att menyn blir överväldigande.",
      },
      {
        title: "Bildrika rätter där bilden säljer",
        body: "Sushi säljs ofta på utseendet. Servera stöder högkvalitativa bilder per rätt så att gästen ser exakt vad hen beställer.",
      },
      {
        title: "Allergener — soja, sesam, gluten",
        body: "Soja, sesam och gluten är vanliga allergener i sushi. Servera har dessa som standardfält och visar dem tydligt på varje rätt.",
      },
      {
        title: "Snabb hantering av lunchrusning",
        body: "Förbeställning via Stripe vid bordet eller takeaway minskar kassakön. Köket ser hela inkommande kö direkt.",
      },
    ],
    exampleSections: [
      "Maki",
      "Nigiri",
      "Sashimi",
      "Signature rolls",
      "Varmrätter",
      "Lunch combo",
      "Sallader",
      "Drycker",
    ],
    faq: [
      {
        question: "Hur hanterar Servera bitar/storlekar för rolls och nigiri?",
        answer:
          "Du kan skapa varianter (8-bitar, 16-bitar, mix) som modifiers med olika pris. Gästen väljer storlek och slutpriset räknas ut automatiskt.",
      },
      {
        question: "Stöds vegansk och vegetarisk märkning?",
        answer:
          "Ja. Vegan, vegetariskt och glutenfritt är standardfält som visas tydligt i menyn.",
      },
      ...COMMON_FAQ("sushiställe", "sushiställen"),
    ],
    metaTitle: "Digital meny för sushiställen — QR-beställning | Servera",
    metaDescription:
      "Servera är digital meny för sushiställen i Sverige. Långa menyer, bildrika rätter, allergener (soja, sesam, gluten), lunch-combo. Från 549 kr/mån.",
  },
  cafe: {
    slug: "cafe",
    name: "café",
    pluralName: "caféer",
    intro:
      "Servera är en QR-meny byggd för svenska caféer. Gästen scannar koden på bordet, beställer kaffe, fika eller lunch — och slipper kön vid kassan. Caféet ser beställningen i realtid och kan ha kaffet klart när gästen kommer fram.",
    context:
      "Caféer kämpar ofta med långa kassaköer i lunchrusningen och med gäster som sitter länge med en kopp men inte vågar beställa mer eftersom det innebär kö-väntning igen. QR-beställning från bordet löser båda problemen — gästen beställer från sin plats, betalar i mobilen och får serveringen när det är klart.",
    whyServeraFits: [
      {
        title: "Eliminera kassakön",
        body: "Gästen sitter ner direkt och beställer från bordet. Kön vid kassan försvinner — och din barista kan fokusera på att brygga, inte ta beställningar.",
      },
      {
        title: "Enkel återbeställning",
        body: "När gästen vill ha en till kopp eller en bulle räcker det att öppna menyn igen i samma flik. Caféer ser ofta 25–40 % uppselling när gästen inte behöver lämna sin plats.",
      },
      {
        title: "Snabb uppdatering vid utförsäljning",
        body: "Om kanelbullarna tar slut markerar du bara som ej tillgänglig. Gästen ser det direkt — ingen besvikelse.",
      },
      {
        title: "Stripe vid bordet eller traditionell betalning",
        body: "Du väljer själv. Stripe-integrationen ger gästen möjlighet att betala direkt på sin mobil och bara gå när hen är klar.",
      },
    ],
    exampleSections: [
      "Kaffe och te",
      "Bullar och kakor",
      "Smörgåsar",
      "Lunch / dagens",
      "Smoothies",
      "Glass och kalla drycker",
    ],
    faq: [
      {
        question: "Lämpar sig Servera för småcaféer med få bord?",
        answer:
          "Ja. Start-planen på 549 kr/mån är byggd just för verksamheter med upp till 20 bord. Många små caféer rapporterar att QR-flödet betalar sig själv på första lunchpasset i tidsbesparing.",
      },
      {
        question: "Kan vi använda QR både för bordsbeställning och takeaway?",
        answer:
          "Ja. Sätt upp en 'takeaway'-bordskod vid kassan eller tryck ut en speciell QR-affisch i fönstret för förbeställningar.",
      },
      ...COMMON_FAQ("café", "caféer"),
    ],
    metaTitle: "Digital meny för caféer — QR-beställning från bordet | Servera",
    metaDescription:
      "Servera är digital meny och QR-beställning för svenska caféer. Eliminera kassakön, öka återbeställning, uppdatera meny i realtid. Från 549 kr/mån.",
  },
  bar: {
    slug: "bar",
    name: "bar",
    pluralName: "barer",
    intro:
      "Servera är en QR-meny för svenska barer och cocktailbarer. Gästerna scannar koden på bordet eller bardisken, bläddrar i drinklistan, och beställer från sin egen mobil — perfekt när det är fullt och bartendern inte hinner ta varje beställning manuellt.",
    context:
      "Barer i fredags- och lördagsrush har ofta 3-djupa köer vid disken. Det innebär missade beställningar, lägre genomsnittsorder och frustrerade gäster. Servera ger gästen möjlighet att beställa och betala från sin plats, så bartendern kan fokusera på att shaka.",
    whyServeraFits: [
      {
        title: "Minska kötrycket vid disken",
        body: "Gästen scannar bordkoden eller QR vid disken, bläddrar i drinklistan och beställer från sin mobil. Bartendern ser kön i realtid på en skärm.",
      },
      {
        title: "Modifiers för cocktailtillval",
        body: "Single eller double, garnish, choice of spirit, sockerlag — alla cocktailtillval kan modelleras som modifiers med automatisk prissättning.",
      },
      {
        title: "Stripe-betalning för stängda flikar",
        body: "Gästen kan betala för varje runda direkt på mobilen — inga öppna flikar att stänga vid stängningstid, inga 'jag glömde betala'-situationer.",
      },
      {
        title: "Höj genomsnittlig kuvert med uppselling",
        body: "Servera kan visa rekommendationer per kategori (premium-versioner av drinkar, snacks). Genomsnittlig kuvert tenderar att öka när gästen själv bläddrar i menyn.",
      },
    ],
    exampleSections: [
      "Signature cocktails",
      "Klassiska cocktails",
      "Öl",
      "Vin",
      "Alkoholfritt",
      "Snacks",
    ],
    faq: [
      {
        question: "Stöder Servera 18+-spärr för alkohol?",
        answer:
          "Servera ersätter inte legitimationskontroll — bartender eller servitör behöver fortsätta verifiera ålder vid leverans, precis som idag. Men gästen kan beställa och betala digitalt utan att blockera kön.",
      },
      {
        question: "Hur hanteras open tabs eller flera rundor?",
        answer:
          "Du kan välja mellan att låta gästen betala per runda via Stripe, eller låta servitören öppna och stänga en bordsflik manuellt. Inställningen är per restaurang.",
      },
      ...COMMON_FAQ("bar", "barer"),
    ],
    metaTitle: "Digital meny för barer — QR-beställning av cocktails | Servera",
    metaDescription:
      "Servera är QR-meny och mobilbeställning för svenska barer och cocktailbarer. Minska kö vid disken, höj kuvertstorlek, smidig betalning. Från 549 kr/mån.",
  },
  foodtruck: {
    slug: "foodtruck",
    name: "food truck",
    pluralName: "food trucks",
    intro:
      "Servera är en QR-meny för food trucks och mobila kök. En QR-affisch på sidan av trucken låter gäster beställa från sin mobil — ingen lång kö framför luckan, ingen handskriven sedel, ingen missförstånd.",
    context:
      "Food trucks har en unik utmaning: en intensiv 1-timmes lunchtopp med en single point of failure i form av en lucka. När kön blir för lång tappar du gäster som går vidare. Med QR-beställning kan flera gäster lägga in sin beställning samtidigt, och köket producerar i en jämnare takt.",
    whyServeraFits: [
      {
        title: "Eliminera lunchkön",
        body: "Gäster scannar QR-affischen från trottoaren, beställer i mobilen och kommer bara fram när maten är klar. Trucken kan serva 30–40 % fler kuvert per timme.",
      },
      {
        title: "Realtid-statusuppdatering",
        body: "Gästen ser om beställningen är 'mottagen', 'tillagas' eller 'klar' — inga frågor till luckan.",
      },
      {
        title: "Förbeställning via Stripe",
        body: "Gäster i närliggande kontor kan förbeställa kvarter i förväg, betala direkt och hämta utan kö.",
      },
      {
        title: "Inget WiFi krävs i trucken",
        body: "Servera fungerar via 4G/5G — det enda som behövs i trucken är en surfplatta för köksvy och mobiluppkoppling.",
      },
    ],
    exampleSections: [
      "Veckans special",
      "Burgare",
      "Pommes och tillbehör",
      "Drycker",
    ],
    faq: [
      {
        question: "Hur sätter jag upp QR för en food truck utan fasta bord?",
        answer:
          "Du sätter upp en 'pickup'-bordskod (t.ex. nummer 1) som gäller för hela trucken. QR-affischen sätter du på sidan av trucken eller på en stativ-skylt.",
      },
      {
        question: "Hur fungerar det om trucken byter plats?",
        answer:
          "Servera är platsoberoende — så länge trucken har 4G/5G fungerar det överallt i Sverige.",
      },
      ...COMMON_FAQ("food truck", "food trucks"),
    ],
    metaTitle: "Digital meny för food trucks — QR-beställning utan kö | Servera",
    metaDescription:
      "Servera är QR-meny och mobilbeställning för food trucks. Eliminera lunchkön, realtidsstatus, Stripe-betalning, fungerar via 4G/5G. Från 549 kr/mån.",
  },
  lunchstalle: {
    slug: "lunchstalle",
    name: "lunchställe",
    pluralName: "lunchställen",
    intro:
      "Servera är en QR-meny för svenska lunchställen. Gästen scannar koden på bordet, väljer dagens lunch eller från ordinarie meny, och beställer på sekunder — perfekt för 11:30–13:00-rusningen där varje minut räknas.",
    context:
      "Lunchställen är en av de mest QR-vänliga restaurangtyperna: korta vistelser, prismedvetna gäster, snabb omsättning. Stresspunkten är de 90 minuterna mitt på dagen när alla kommer samtidigt. Servera är byggd för exakt det.",
    whyServeraFits: [
      {
        title: "Daglig uppdatering av dagens lunch",
        body: "Byt dagens varje dag direkt i admin-panelen utan att trycka något. Gästen ser den aktuella menyn varje gång.",
      },
      {
        title: "Snabb beställning under lunchrusningen",
        body: "Gästen sitter ner och beställer på 30 sekunder. Köket ser kön och kan producera i ordningsföljd. Inga servitörsmoment per kuvert.",
      },
      {
        title: "Stripe vid bordet eliminerar kassakö",
        body: "Gästen betalar i mobilen direkt vid beställning och kan gå när hen är klar — ingen tid vid kassa, ingen handsignatur av kvitto.",
      },
      {
        title: "Allergener tydligt markerade",
        body: "Lunchgäster som måste fatta ett snabbt val behöver tydlig information. Servera visar gluten, laktos, vegan och vegetariskt på varje rätt.",
      },
    ],
    exampleSections: [
      "Dagens lunch",
      "Veckans soppa",
      "Sallader",
      "Smörgåsar",
      "Husmanskost",
      "Drycker och kaffe",
    ],
    faq: [
      {
        question:
          "Kan jag schemalägga olika menyer för lunch och kväll?",
        answer:
          "Ja, du kan ha kategorier som du visar och döljer manuellt. Många lunchställen har 'Lunch' som kategori under 11–14 och döljer den resten av dagen.",
      },
      {
        question: "Hur ser dagens lunch ut för gästen?",
        answer:
          "Du markerar dagens lunch som en kategori eller särskild rätt. Du kan ändra den varje morgon direkt från admin — det tar mindre än 30 sekunder.",
      },
      ...COMMON_FAQ("lunchställe", "lunchställen"),
    ],
    metaTitle: "Digital meny för lunchställen — snabb QR-beställning | Servera",
    metaDescription:
      "Servera är QR-meny och mobilbeställning för svenska lunchställen. Daglig uppdatering av dagens, eliminera kassakö, allergener, från 549 kr/mån.",
  },
}

export const RESTAURANT_TYPE_SLUGS = Object.keys(RESTAURANT_TYPES)
