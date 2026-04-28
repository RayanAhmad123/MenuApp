export interface CityContent {
  slug: string
  name: string
  population: string
  restaurantCountApprox: string
  region: string
  intro: string
  localContext: string
  whyServeraHere: Array<{ title: string; body: string }>
  cuisineHighlights: string[]
  faq: Array<{ question: string; answer: string }>
  metaTitle: string
  metaDescription: string
}

const COMMON_FAQ_END = (cityName: string) => [
  {
    question: "Hur snabbt kan jag komma igång med Servera i " + cityName + "?",
    answer:
      "De flesta restauranger är igång på under 30 minuter — du skapar konto, lägger in kategorier och rätter, väljer en QR-design och skriver ut bordskoderna. Ingen hårdvara, ingen integration mot kassasystem krävs för att starta.",
  },
  {
    question: "Behöver gästen ladda ned en app?",
    answer:
      "Nej. Servera-menyn öppnas direkt i mobilens webbläsare när gästen skannar QR-koden. Inget app-krav, ingen registrering.",
  },
  {
    question: "Kan menyn visas på flera språk?",
    answer:
      "Ja. Det är särskilt användbart i " +
      cityName +
      " där turister och internationella gäster ofta är en betydande del av kundkretsen.",
  },
]

export const CITIES: Record<string, CityContent> = {
  stockholm: {
    slug: "stockholm",
    name: "Stockholm",
    population: "ca 980 000",
    restaurantCountApprox: "ca 3 600",
    region: "Stockholms län",
    intro:
      "Stockholm är Sveriges största restaurangmarknad — från Östermalms finkrogar till Söders pizzerior, från Norrmalms lunchställen till Vasastans caféer. Servera ger restauranger i Stockholm en digital QR-meny som gästen scannar vid bordet, beställer från sin egen mobil och som köket ser i realtid på en skärm. Ingen app, inga skrivare, ingen tröskel.",
    localContext:
      "Med ungefär 3 600 restauranger i Stockholms kommun och en stor andel turister och internationella gäster är behovet av flerspråkiga menyer, snabba uppdateringar och tydlig allergeninformation särskilt högt. Restaurangägare i Stockholm kämpar också med personalbrist — en QR-meny från bordet kan minska antalet personalsteg per beställning märkbart.",
    whyServeraHere: [
      {
        title: "Flerspråkig meny för en turisttät stad",
        body: "Stockholm tar emot miljontals besökare varje år. Servera-menyn kan visas på flera språk så att internationella gäster själva kan beställa utan språkbarriär.",
      },
      {
        title: "Realtidsuppdateringar för snabbväxlande menyer",
        body: "Lunchstället på Norrmalm som byter dagens varje dag, eller bistron i Vasastan som tar slut på piggvar mitt i kvällen — båda kan uppdatera menyn i realtid utan att trycka något.",
      },
      {
        title: "Lägre personalkostnad per beställning",
        body: "I Stockholm där lönenivåerna är högst i landet kan en QR-meny från bordet minska antalet servitörsmoment per beställning och frigöra personal till service och uppselling.",
      },
    ],
    cuisineHighlights: [
      "Modernt nordiskt",
      "Sushi och ramen",
      "Italiensk bistro",
      "Mellanösternköket",
      "Vegansk fine dining",
    ],
    faq: [
      {
        question: "Använder restauranger i Stockholm digital meny?",
        answer:
          "Ja, antalet restauranger i Stockholm som infört digital QR-meny har ökat snabbt sedan 2020. Det är vanligast i centrum (Östermalm, Norrmalm, Södermalm, Vasastan), turisttäta områden som Gamla stan, samt i lunch- och kafékulturen kring kontorsområden.",
      },
      {
        question: "Vad kostar en digital meny för en restaurang i Stockholm?",
        answer:
          "Servera kostar 549 kr/mån (Start) eller 999 kr/mån (Tillväxt). Inga provisioner per beställning. För restauranger i Stockholm med högre kuvertvolymer betyder fast pris ofta lägre totalkostnad än internationella plattformar med procentavgift.",
      },
      ...COMMON_FAQ_END("Stockholm"),
    ],
    metaTitle: "Digital meny för restauranger i Stockholm — Servera",
    metaDescription:
      "QR-meny och mobilbeställning för restauranger i Stockholm. Flerspråkig meny, realtidsuppdatering, allergeninformation. Från 549 kr/mån. Boka demo med Servera.",
  },
  goteborg: {
    slug: "goteborg",
    name: "Göteborg",
    population: "ca 600 000",
    restaurantCountApprox: "ca 1 500",
    region: "Västra Götalands län",
    intro:
      "Göteborg är Sveriges andra största restaurangstad — med en stark fiskmiddagstradition vid Feskekörka, ett Linnéområde fullt av caféer, och Avenyn som restaurangstråk. Servera ger restauranger i Göteborg en digital QR-meny som gästen scannar vid bordet och beställer från sin egen mobil.",
    localContext:
      "Med ungefär 1 500 restauranger inom Göteborgs kommun och en stor andel besökare under sommaren och vid mässor som Bokmässan och Gothia Cup, är snabba menyuppdateringar och flerspråkig text särskilt värdefulla. Göteborg har också en stark caféscen där QR-meny kan eliminera kö vid kassan.",
    whyServeraHere: [
      {
        title: "Anpassad för säsong och evenemang",
        body: "Göteborg är en evenemangsstad — Way Out West, Liseberg-säsongen, mässor på Svenska Mässan. Servera låter dig snabbt uppdatera menyn och kapacitet utan trycktiden för fysiska menyer.",
      },
      {
        title: "Flerspråkig meny för cruise- och konferensgäster",
        body: "Med kryssningstrafik från Stena Line och konferensgäster på Svenska Mässan är engelska och tyska menyalternativ ofta efterfrågade.",
      },
      {
        title: "Café-friendly QR-flöde",
        body: "I Linnéstaden och kring Vasaplatsen där café-kulturen är stark, kan QR-beställning från bordet eliminera kön vid kassan och öka genomströmningen under lunchrusningen.",
      },
    ],
    cuisineHighlights: [
      "Skaldjursmiddag",
      "Café-kultur",
      "Modernt nordiskt",
      "Italienskt och pizzerior",
      "Asiatiskt streetfood",
    ],
    faq: [
      {
        question: "Är digital QR-meny vanlig i Göteborg?",
        answer:
          "Ja, särskilt i Linnéstaden, kring Vasaplatsen, längs Avenyn och i hamnnära områden. QR-beställning från bordet har växt snabbt sedan 2020 och är idag standard på många nya restauranger.",
      },
      {
        question: "Vad kostar Servera för en restaurang i Göteborg?",
        answer:
          "549 kr/mån för Start-planen, 999 kr/mån för Tillväxt. Fasta priser i SEK utan provisioner per beställning. För kedjor och flera enheter — kontakta säljteamet för Företag-offert.",
      },
      ...COMMON_FAQ_END("Göteborg"),
    ],
    metaTitle: "Digital meny för restauranger i Göteborg — Servera",
    metaDescription:
      "QR-meny för restauranger i Göteborg: Linnéstaden, Avenyn, Vasaplatsen. Flerspråkig, realtidsuppdatering, från 549 kr/mån. Boka kostnadsfri demo med Servera.",
  },
  malmo: {
    slug: "malmo",
    name: "Malmö",
    population: "ca 360 000",
    restaurantCountApprox: "ca 900",
    region: "Skåne län",
    intro:
      "Malmö har en av Sveriges mest dynamiska restaurangscener — en blandning av nordiskt, mellanösternkök, indiskt och en stor café-kultur kring Davidshallstorg och Lilla Torg. Servera ger Malmö-restauranger en digital QR-meny som gästen scannar vid bordet och beställer från sin egen mobil i realtid.",
    localContext:
      "Med ungefär 900 restauranger och en mycket internationell befolkning är flerspråkig meny ofta avgörande. Närheten till Köpenhamn gör också att gränsöverskridande gäster är vanligt — engelska och danska menyalternativ är värdefulla.",
    whyServeraHere: [
      {
        title: "Multikulturell meny stöder flera språk",
        body: "Malmö har en av Sveriges mest internationella demografier. Servera stöder flera språk per meny så att alla dina gäster kan beställa utan språkbarriär.",
      },
      {
        title: "Lägre kostnad än internationella plattformar",
        body: "Servera har fast SEK-pris utan provisioner. För Malmö-restauranger som ofta har lägre kuvertpriser än Stockholm är skillnaden i totalkostnad märkbar.",
      },
      {
        title: "Snabb setup för säsongsvariation",
        body: "Sommarsäsongen i Malmö är intensiv. Servera låter dig öppna ny meny på timmar när uteserveringarna kommer igång — istället för veckor med trycksaker.",
      },
    ],
    cuisineHighlights: [
      "Mellanösternkök",
      "Indiskt och pakistanskt",
      "Café-kultur",
      "Modernt skånskt",
      "Asiatiskt streetfood",
    ],
    faq: [
      {
        question: "Är QR-meny vanlig i Malmö?",
        answer:
          "Ja. QR-beställning är vanligt i Malmös centrum (Lilla Torg, Davidshallstorg, Möllevångstorget) och längs Limhamn. Det har växt snabbt sedan 2020.",
      },
      {
        question: "Vad kostar Servera för en restaurang i Malmö?",
        answer:
          "549 kr/mån för Start-planen och 999 kr/mån för Tillväxt-planen. Inga provisioner. För restauranger nära Köpenhamn med pendlargäster är flerspråkig meny vanligen efterfrågad.",
      },
      ...COMMON_FAQ_END("Malmö"),
    ],
    metaTitle: "Digital meny för restauranger i Malmö — Servera",
    metaDescription:
      "QR-meny och mobilbeställning för restauranger i Malmö: Lilla Torg, Davidshallstorg, Möllevången. Flerspråkig meny, från 549 kr/mån. Boka demo.",
  },
  uppsala: {
    slug: "uppsala",
    name: "Uppsala",
    population: "ca 240 000",
    restaurantCountApprox: "ca 400",
    region: "Uppsala län",
    intro:
      "Uppsala är Sveriges fjärde största stad med en levande studentkultur — kring nationerna, Stora torget och Fyrisån finns ett tätt nätverk av restauranger, lunchställen och caféer. Servera ger Uppsala-restauranger en QR-meny som gästen scannar vid bordet och beställer i sin mobil i realtid.",
    localContext:
      "Med ungefär 400 restauranger och drygt 50 000 studenter är prismedvetna lunchgäster en stor kundgrupp. Snabba menyuppdateringar för dagens lunch och tydlig allergeninformation är ofta särskilt viktiga.",
    whyServeraHere: [
      {
        title: "Snabb uppdatering av dagens lunch",
        body: "Lunchställen runt Stora torget och Fyrisåtorg byter dagens lunch varje dag. Servera låter dig uppdatera menyn i realtid utan att trycka något nytt.",
      },
      {
        title: "Tydlig allergeninformation för studentgäster",
        body: "Studenter värderar tydlig kostmärkning. Servera har vegan, vegetariskt, glutenfritt och alla gängse allergener som standardfält.",
      },
      {
        title: "Lägre personaldensitet med QR-flöde",
        body: "Många Uppsala-restauranger driver med slimmad personalstyrka. QR-beställning från bordet minskar servitörsmoment per beställning.",
      },
    ],
    cuisineHighlights: [
      "Lunchställen och dagens",
      "Café-kultur",
      "Pizzerior",
      "Modernt nordiskt",
      "Asiatiskt",
    ],
    faq: [
      {
        question: "Använder restauranger i Uppsala digital meny?",
        answer:
          "Ja, särskilt lunchställen kring Stora torget, restauranger nära nationerna och caféer längs Fyrisån. Det är effektivt för verksamheter med snabbväxlande menyer.",
      },
      {
        question: "Vad kostar Servera för en lunchrestaurang i Uppsala?",
        answer:
          "Start-planen för 549 kr/mån räcker oftast för en lunchrestaurang med upp till 20 bord. Inga provisioner per beställning.",
      },
      ...COMMON_FAQ_END("Uppsala"),
    ],
    metaTitle: "Digital meny för restauranger i Uppsala — Servera",
    metaDescription:
      "QR-meny för Uppsala-restauranger: Stora torget, nationerna, Fyrisån. Snabb uppdatering av dagens lunch, tydlig allergeninformation. Från 549 kr/mån.",
  },
  linkoping: {
    slug: "linkoping",
    name: "Linköping",
    population: "ca 165 000",
    restaurantCountApprox: "ca 250",
    region: "Östergötlands län",
    intro:
      "Linköping är Östergötlands centrum med ett livligt restaurangstråk kring Stora torget, Trädgårdstorget och Stångåns kajer. Servera ger restauranger i Linköping en digital QR-meny som gästen scannar vid bordet och beställer från sin mobil i realtid.",
    localContext:
      "Med ungefär 250 restauranger och en stor universitetsbefolkning samt en pendlartrafik från SAAB-anställda är lunchgäster och after-work-bokningar två stora kundgrupper. Snabba menyuppdateringar och flerspråkiga alternativ för internationella SAAB-anställda är särskilt värdefulla.",
    whyServeraHere: [
      {
        title: "Snabb omställning mellan lunch och kväll",
        body: "Lunchstället som blir kvällsbistro kan ha helt olika menyer på dagen. Servera låter dig schemalägga eller manuellt växla på sekunder.",
      },
      {
        title: "Engelsk meny för internationella anställda",
        body: "Saab och universitetet drar internationell personal. Engelsk menyversion kan ge dem en bättre upplevelse — och högre kuvertpriser.",
      },
      {
        title: "Stripe-integration för förbetalning",
        body: "Vid lunchrusning eller bokade after-works kan förbetalning via Stripe minska kö och kassatid.",
      },
    ],
    cuisineHighlights: [
      "Lunchställen",
      "After-work-barer",
      "Pizzerior",
      "Café-kultur",
      "Modernt svenskt",
    ],
    faq: [
      {
        question: "Är QR-meny vanlig i Linköping?",
        answer:
          "Ja. Restauranger kring Stora torget, Trädgårdstorget och i universitetsområdet använder allt oftare digital meny för lunch och kväll.",
      },
      {
        question: "Vad kostar en digital meny för en mindre restaurang i Linköping?",
        answer:
          "549 kr/mån för Start-planen — fast pris, inga provisioner. För större verksamheter med fler bord, 999 kr/mån för Tillväxt.",
      },
      ...COMMON_FAQ_END("Linköping"),
    ],
    metaTitle: "Digital meny för restauranger i Linköping — Servera",
    metaDescription:
      "QR-meny och mobilbeställning för Linköpings restauranger: Stora torget, Trädgårdstorget, Stångån. Flerspråkig, från 549 kr/mån. Boka demo med Servera.",
  },
  vasteras: {
    slug: "vasteras",
    name: "Västerås",
    population: "ca 155 000",
    restaurantCountApprox: "ca 230",
    region: "Västmanlands län",
    intro:
      "Västerås är en växande Mälardalsstad med ett restaurangstråk kring Stora torget, Bondtorget och Mälarhamnen. Servera ger Västerås-restauranger en digital QR-meny som gästen scannar vid bordet och beställer i sin mobil i realtid.",
    localContext:
      "Med ungefär 230 restauranger och en växande Mälardals-region där turism kring Mälaren ökar varje år är säsongsvariation ett viktigt tema. Lunchgäster från ABB och kontorsområden, samt sommargäster vid Mälarens kajer, är två stora kundsegment.",
    whyServeraHere: [
      {
        title: "Säsongsanpassning för uteserveringar",
        body: "När uteserveringarna kring hamnen öppnar i maj behövs ofta en utvidgad meny. Servera låter dig öppna säsongsmenyn på timmar utan trycktid.",
      },
      {
        title: "Flerspråkig meny för Mälar-turister",
        body: "Internationella gäster vid Mälaren och hotellgäster i centrum efterfrågar engelska menyalternativ.",
      },
      {
        title: "Lunch-effektivitet för kontorsområden",
        body: "Restauranger nära ABB och kontorsmetropoler kan minska lunchrusningens kassatid med QR-beställning från bordet.",
      },
    ],
    cuisineHighlights: [
      "Lunchställen",
      "Hamn- och uteserveringar",
      "Pizzerior",
      "Asiatiskt",
      "Modernt svenskt",
    ],
    faq: [
      {
        question: "Använder restauranger i Västerås digital meny?",
        answer:
          "Ja, allt fler. Restauranger kring Stora torget, Mälarhamnen och kontorsdistrikt har börjat använda QR-meny från bordet sedan 2020.",
      },
      {
        question: "Vad kostar Servera för en restaurang i Västerås?",
        answer:
          "549 kr/mån för Start-planen, 999 kr/mån för Tillväxt. Inga provisioner per beställning, inga dolda avgifter.",
      },
      ...COMMON_FAQ_END("Västerås"),
    ],
    metaTitle: "Digital meny för restauranger i Västerås — Servera",
    metaDescription:
      "QR-meny för Västerås-restauranger: Stora torget, Mälarhamnen, kontorsdistrikt. Säsongsanpassning, flerspråkig meny, från 549 kr/mån. Boka demo.",
  },
  orebro: {
    slug: "orebro",
    name: "Örebro",
    population: "ca 130 000",
    restaurantCountApprox: "ca 200",
    region: "Örebro län",
    intro:
      "Örebro växer snabbt som restaurangstad — kring Järntorget, Stortorget och Svartån finns ett livligt restaurangstråk. Servera ger Örebro-restauranger en digital QR-meny som gästen scannar vid bordet och beställer från sin mobil i realtid.",
    localContext:
      "Med ungefär 200 restauranger och en växande studentbefolkning vid Örebro universitet är prismedvetna gäster en stor kundgrupp. Snabba menyuppdateringar och tydlig allergeninformation är värdefulla för det dagliga lunchflödet.",
    whyServeraHere: [
      {
        title: "Studentvänlig menyhantering",
        body: "Studenter värderar tydliga priser, allergener och vegetariska alternativ. Servera har dessa fält som standard.",
      },
      {
        title: "Realtidsuppdatering vid utförsäljning",
        body: "På små lunchrestauranger där rätter ofta tar slut innan stängning kan realtidsuppdatering minska besvikelse hos gäster.",
      },
      {
        title: "Lägre personaltäthet i lunchrusningen",
        body: "QR-beställning från bordet minskar kassatid och frigör servitörer till service och rengöring mellan vändningar.",
      },
    ],
    cuisineHighlights: [
      "Lunchställen",
      "Café-kultur",
      "Pizzerior",
      "Asiatiskt",
      "Modernt svenskt",
    ],
    faq: [
      {
        question: "Är digital QR-meny vanlig i Örebro?",
        answer:
          "Ja, allt fler restauranger kring Järntorget, Stortorget och universitetsområdet använder digital meny.",
      },
      {
        question: "Vad kostar Servera för ett lunchställe i Örebro?",
        answer:
          "Start-planen på 549 kr/mån räcker för de flesta lunchrestauranger med upp till 20 bord. Inga provisioner.",
      },
      ...COMMON_FAQ_END("Örebro"),
    ],
    metaTitle: "Digital meny för restauranger i Örebro — Servera",
    metaDescription:
      "QR-meny och mobilbeställning för Örebro-restauranger: Järntorget, Stortorget, universitetet. Realtidsuppdatering, från 549 kr/mån. Boka demo.",
  },
  helsingborg: {
    slug: "helsingborg",
    name: "Helsingborg",
    population: "ca 115 000",
    restaurantCountApprox: "ca 210",
    region: "Skåne län",
    intro:
      "Helsingborg har en av Sveriges mest internationella restaurangscener tack vare närheten till Helsingør och kontinentaltrafik. Kring Stortorget, Norra Storgatan och hamnen finns ett tätt restaurangstråk. Servera ger Helsingborg-restauranger en digital QR-meny som gästen scannar och beställer från sin mobil.",
    localContext:
      "Med ungefär 210 restauranger och en konstant flödet av danska pendlargäster och kryssningsbesökare är flerspråkig meny — särskilt danska och engelska — ofta avgörande. Hamnnära restauranger har dessutom säsongsbetonade flöden där snabb omställning är värdefull.",
    whyServeraHere: [
      {
        title: "Dansk- och engelskspråkig meny",
        body: "Med pendlare från Helsingør och kryssningstrafik kan en flerspråkig meny göra stor skillnad för internationella gäster.",
      },
      {
        title: "Säsongsanpassning för hamn-uteserveringar",
        body: "När uteserveringarna kring Hamnen och Sundstorget öppnar är menyn ofta annorlunda. Servera låter dig öppna och stänga säsongsmenyer utan trycktid.",
      },
      {
        title: "Snabb betalning vid bordet",
        body: "Stripe-integrationen kan eliminera kassakön — gästen betalar direkt på sin mobil och kan gå när hen är klar.",
      },
    ],
    cuisineHighlights: [
      "Skaldjur",
      "Modernt nordiskt",
      "Italienskt",
      "Asiatiskt",
      "Danskt-svenskt fusion",
    ],
    faq: [
      {
        question: "Använder restauranger i Helsingborg digital meny?",
        answer:
          "Ja, särskilt vid Stortorget, hamnen, Norra Storgatan och Sundstorget. Det är vanligt på restauranger som tar emot mycket internationella gäster.",
      },
      {
        question: "Vad kostar Servera för en restaurang i Helsingborg?",
        answer:
          "549 kr/mån för Start-planen, 999 kr/mån för Tillväxt. Inga provisioner. För restauranggrupper — kontakta säljteamet för Företag-offert.",
      },
      ...COMMON_FAQ_END("Helsingborg"),
    ],
    metaTitle: "Digital meny för restauranger i Helsingborg — Servera",
    metaDescription:
      "QR-meny för Helsingborg-restauranger: Stortorget, hamnen, Sundstorget. Dansk-, svensk- och engelskspråkig meny. Från 549 kr/mån. Boka demo med Servera.",
  },
}

export const CITY_SLUGS = Object.keys(CITIES)
