import type { Guide } from "./types"

export const guide: Guide = {
  slug: "flersprakig-meny",
  title: "Flerspråkig meny — så gör du den bra (inte pinsam)",
  metaTitle: "Flerspråkig meny för restaurang — så gör du 2026",
  description:
    "Engelska är hygiennivån, men hur översätter man 'råraka' och 'skagenröra'? Så bygger du en flerspråkig restaurangmeny som hjälper gästen — utan översättningsgrodor.",
  datePublished: "2026-08-26",
  dateModified: "2026-08-26",
  readingMinutes: 7,
  category: "Fördjupning",
  intro: [
    "En flerspråkig meny är en meny där gästen själv kan växla språk — i praktiken oftast svenska plus engelska, och i turisttäta lägen fler språk därtill. På papper betyder varje språk ett eget kort att trycka och underhålla; i en digital meny är språkversionen en vy av samma meny, och gästen väljer själv.",
    "Men flerspråkighet är också där flest menyer blir ofrivilligt komiska. Maskinöversatta rätter (\"grandma's meatballs\" är fine — \"old woman's balls\" är det inte) skadar förtroendet mer än en enspråkig meny någonsin gjort. Så här gör du det bra."
  ],
  tldr: [
    "Engelska är hygiennivå för i stort sett alla svenska restauranger med internationella gäster; fler språk motiveras av din faktiska gästmix.",
    "Behåll rättens svenska namn och översätt **beskrivningen** — turister vill kunna peka på \"Toast Skagen\" och samtidigt förstå vad det är.",
    "Maskinöversätt gärna som utkast, men låt en människa granska varje rad innan publicering — särskilt maträttsnamn, tillagningssätt och allergener.",
    "Allergeninformationen måste vara korrekt på alla språk du publicerar — fel i översättningen är värre än ingen översättning.",
    "I en digital meny underhåller du en meny med språkvyer i stället för flera tryckta kort som glider isär."
  ],
  blocks: [
    { t: "h2", id: "vilka-sprak", text: "Vilka språk behöver min meny?" },
    { t: "p", text: "Utgå från gästmixen, inte ambitionen. En enkel metod: låt personalen under två veckor notera vilka språk gästerna faktiskt försöker beställa på. Typiska nivåer:" },
    { t: "ul", items: [
      "**Svenska + engelska** — grundnivån. Engelskan täcker turister, affärsresenärer, internationella studenter och nyinflyttade.",
      "**+ tyska** — tysktalande är en av Sveriges största turistgrupper, särskilt sommartid och utanför storstäderna.",
      "**+ ytterligare språk efter läge** — franska/spanska/italienska i citylägen, finska i norr och i Stockholm, arabiska/persiska där gästmixen motiverar det."
    ]},
    { t: "p", text: "Varje språk du publicerar är ett löfte om underhåll: när menyn ändras ska alla versioner ändras. Två välskötta språk slår fem eftersatta." },
    { t: "h2", id: "vad-oversatts", text: "Vad ska översättas — och vad ska inte?" },
    { t: "p", text: "Tumregeln som skiljer bra flerspråkiga menyer från pinsamma: **rättens namn behåller du, beskrivningen översätter du.** \"Toast Skagen\" ska heta Toast Skagen på engelska också — med beskrivningen \"toast with hand-peeled shrimp, mayonnaise, dill and roe\". Gästen kan då peka och uttala något som personalen känner igen, samtidigt som innehållet är begripligt." },
    { t: "ul", items: [
      "**Översätt:** beskrivningar, kategorinamn (Starters, Mains, Desserts), tillagningssätt, allergentexter, praktisk information (\"betala i baren\", \"självservering\").",
      "**Behåll:** etablerade rättnamn (råraka, skagenröra, plankstek), egennamn och signaturrätter. Förklara i beskrivningen i stället.",
      "**Var extra noga med:** styckningsdetaljer och fisksorter (härledningsfel är vanliga), \"viltskav\", svamparter och bär — här går maskinöversättningar oftast fel."
    ]},
    { t: "h2", id: "maskin-eller-manniska", text: "Kan jag lita på maskinöversättning?" },
    { t: "p", text: "Som utkast: ja. Som publicering utan granskning: nej. Moderna översättningstjänster klarar restaurangprosa förvånansvärt bra, men de saknar sammanhanget — att \"skav\" är en styckningsform och inte något som skaver, att \"glass\" är dessert och inte fönstermaterial. Låt alltid en människa med båda språken läsa varje rad före publicering, och bygg en liten ordlista över era återkommande termer så att samma sak heter samma sak överallt." },
    { t: "callout", title: "Allergener på flera språk", text: "Allergeninformationen är den del av menyn där översättningsfel får verkliga konsekvenser. De 14 allergenerna i EU-förordning 1169/2011 har etablerade namn på alla EU-språk — använd dem exakt (celery/Sellerie/céleri, inte omskrivningar). I Servera märks allergener strukturerat per rätt, så att märkningen följer med automatiskt oavsett vilket språk gästen valt och aldrig kan glida isär mellan språkversionerna." },
    { t: "h2", id: "digital-vs-tryckt", text: "Varför är flerspråkighet enklare digitalt?" },
    { t: "p", text: "På papper betyder tre språk tre uppsättningar kort — tre tryckkostnader per menyändring, tre versioner att hålla synkade, och bordslogistik när det tyska kortet är slut. I en digital meny väljer gästen språk med ett tryck, alla versioner bor i samma system, och en prisändring slår igenom i alla språk samtidigt eftersom priser och struktur delas. Kostnadssidan av den jämförelsen finns i [digital vs tryckt meny](/guider/digital-meny-vs-tryckt)." },
    { t: "h2", id: "sa-gor-du", text: "Så sätter du upp det, steg för steg" },
    { t: "ol", items: [
      "Bestäm språk utifrån gästmixen (börja med svenska + engelska).",
      "Skriv de svenska beskrivningarna färdigt först — översätt aldrig ett utkast.",
      "Maskinöversätt som första utkast, rad för rad.",
      "Låt en person med målspråket granska allt, med extra fokus på rättnamn, tillagning och allergener.",
      "Publicera och testa som gäst: växla språk mitt i en beställning och kontrollera att inget faller tillbaka till svenska.",
      "Lägg språkgranskning som en punkt i rutinen för varje menyändring."
    ]},
    { t: "p", text: "Om du sätter upp menyn från grunden samtidigt — börja med [steg-för-steg-guiden](/guider/hur-skapar-man-digital-meny) och lägg språken när grundmenyn sitter. Och räkna gärna på vad flerspråkigheten kostar hos olika leverantörer: hos vissa ligger den bakom dyrare planer, vilket [prisguiden](/guider/vad-kostar-digital-meny) varnar för." }
  ],
  faq: [
    { question: "Vilka språk bör en svensk restaurangmeny finnas på?", answer: "Svenska och engelska är grundnivån för restauranger med internationella gäster. Lägg till fler språk — tyska är ofta nästa steg — utifrån din faktiska gästmix, inte ambition. Varje publicerat språk måste underhållas vid varje menyändring." },
    { question: "Ska jag översätta maträtternas namn?", answer: "Nej, behåll etablerade rättnamn som Toast Skagen eller råraka och översätt beskrivningen i stället. Då kan gästen peka på rätten och personalen känner igen namnet, samtidigt som innehållet blir begripligt." },
    { question: "Räcker Google Översätt för menyn?", answer: "Som utkast, inte som slutprodukt. Maskinöversättningar går ofta fel på styckningsdetaljer, svamp, bär och tillagningssätt. Låt alltid en människa med målspråket granska varje rad före publicering — särskilt allergentexterna." },
    { question: "Hur hanteras allergener på flera språk?", answer: "Använd de etablerade namnen för de 14 EU-allergenerna på respektive språk, exakt och utan omskrivningar. I en digital meny med strukturerad allergenmärkning följer märkningen automatiskt med i alla språkvyer och kan inte glida isär mellan versionerna." },
    { question: "Kostar flera språk extra i en digital meny?", answer: "Det varierar mellan leverantörer — hos vissa ingår flerspråksstöd, hos andra ligger det i en dyrare plan. Kontrollera det mot din kravlista när du jämför priser." }
  ],
  sources: [
    { label: "Europaparlamentets och rådets förordning (EU) nr 1169/2011 om livsmedelsinformation (bilaga II: allergener)", href: "https://eur-lex.europa.eu/legal-content/SV/TXT/?uri=CELEX%3A02011R1169-20180101" }
  ],
}
