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
      "De flesta restauranger är igång på under 30 minuter. Du skapar ett konto, lägger in kategorier och rätter, väljer en QR-design och skriver ut bordskoderna. Ingen hårdvara och ingen koppling till kassasystemet krävs för att starta.",
  },
  {
    question: "Behöver gästen ladda ned en app?",
    answer:
      "Nej. Servera-menyn öppnas i mobilens webbläsare när gästen skannar QR-koden. Inget app-krav och ingen registrering.",
  },
  {
    question: "Kan menyn visas på flera språk?",
    answer:
      "Ja, och i " +
      cityName +
      " är det ofta värdefullt eftersom turister och internationella gäster utgör en betydande del av kundkretsen.",
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
      "Stockholm är Sveriges största restaurangmarknad: finkrogarna på Östermalm, pizzeriorna på Söder, lunchställena på Norrmalm och caféerna i Vasastan. Med Servera får en restaurang i Stockholm en digital meny bakom en QR-kod på bordet. Gästen beställer i sin egen mobil och köket ser ordern på en skärm, utan app och utan skrivare.",
    localContext:
      "I Stockholms kommun finns omkring 3 600 restauranger, och andelen turister och internationella gäster är hög. Det gör flerspråkiga menyer, snabba prisändringar och tydlig allergenmärkning särskilt viktiga. Många krögare i staden brottas dessutom med personalbrist, och en order som gästen lägger själv kortar antalet steg per beställning.",
    whyServeraHere: [
      {
        title: "Flerspråkig meny för en turiststad",
        body: "Stockholm tar emot miljontals besökare varje år. Menyn kan visas på flera språk, så internationella gäster beställer själva utan att fastna på språket.",
      },
      {
        title: "Menyn ändras samma sekund du sparar",
        body: "Lunchstället på Norrmalm som byter dagens rätt varje dag, eller bistron i Vasastan som får slut på piggvar mitt i kvällen, uppdaterar menyn direkt utan att trycka om något.",
      },
      {
        title: "Färre personalsteg per beställning",
        body: "Lönenivåerna i Stockholm hör till landets högsta. När gästen lägger ordern själv frigörs servitörerna till bordsservice och merförsäljning.",
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
          "Ja. Antalet Stockholmsrestauranger med digital QR-meny har ökat snabbt sedan 2020. Det är vanligast i innerstaden (Östermalm, Norrmalm, Södermalm, Vasastan), i turiststråk som Gamla stan och i lunch- och kafékulturen kring kontorsområdena.",
      },
      {
        question: "Vad kostar en digital meny för en restaurang i Stockholm?",
        answer:
          "Servera kostar 549 kr/mån (Start) eller 999 kr/mån (Tillväxt), utan provision per beställning. För restauranger med hög kuvertvolym blir ett fast pris ofta billigare än internationella plattformar med procentavgift.",
      },
      ...COMMON_FAQ_END("Stockholm"),
    ],
    metaTitle: "Digital meny för restauranger i Stockholm",
    metaDescription:
      "QR-meny och mobilbeställning för restauranger i Stockholm. Flerspråkig meny, snabba uppdateringar, allergeninformation. Från 549 kr/mån. Boka demo med Servera.",
  },
  goteborg: {
    slug: "goteborg",
    name: "Göteborg",
    population: "ca 600 000",
    restaurantCountApprox: "ca 1 500",
    region: "Västra Götalands län",
    intro:
      "Göteborg är Sveriges näst största restaurangstad, med fiskmiddagstraditionen vid Feskekörka, ett Linnéområde fullt av caféer och Avenyn som restaurangstråk. Servera digitaliserar menyn för Göteborgs krögare: en QR-kod på bordet, beställning i gästens mobil och order rakt in på en köksskärm.",
    localContext:
      "Inom Göteborgs kommun finns ungefär 1 500 restauranger, och under sommaren och vid mässor som Bokmässan och Gothia Cup ökar besökstrycket kraftigt. Då blir snabba menyuppdateringar och flerspråkig text särskilt värdefulla. Staden har också en stark caféscen där en QR-meny tar bort kön vid kassan.",
    whyServeraHere: [
      {
        title: "Byggd för säsong och evenemang",
        body: "Göteborg är en evenemangsstad: Way Out West, Liseberg-säsongen och mässorna på Svenska Mässan. Med Servera uppdaterar du menyn på minuter i stället för att vänta in trycktiden för fysiska menyer.",
      },
      {
        title: "Flerspråkig meny för kryssnings- och konferensgäster",
        body: "Med kryssningstrafiken från Stena Line och konferensgästerna på Svenska Mässan efterfrågas ofta meny på engelska och tyska.",
      },
      {
        title: "Snabbare flöde i caféerna",
        body: "I Linnéstaden och kring Vasaplatsen är cafékulturen tät. När gästen beställer från bordet försvinner kassakön och fler hinner serveras under lunchrusningen.",
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
          "Ja, särskilt i Linnéstaden, kring Vasaplatsen, längs Avenyn och i de hamnnära områdena. Beställning från bordet har vuxit snabbt sedan 2020 och är i dag standard på många nyöppnade restauranger.",
      },
      {
        question: "Vad kostar Servera för en restaurang i Göteborg?",
        answer:
          "Start-planen ligger på 549 kr/mån och Tillväxt på 999 kr/mån, båda i fast pris utan provision per beställning. Driver du en kedja eller flera enheter? Kontakta säljteamet för en Företag-offert.",
      },
      ...COMMON_FAQ_END("Göteborg"),
    ],
    metaTitle: "Digital meny för restauranger i Göteborg",
    metaDescription:
      "QR-meny för restauranger i Göteborg: Linnéstaden, Avenyn, Vasaplatsen. Flerspråkig, snabba uppdateringar, från 549 kr/mån. Boka kostnadsfri demo med Servera.",
  },
  malmo: {
    slug: "malmo",
    name: "Malmö",
    population: "ca 360 000",
    restaurantCountApprox: "ca 900",
    region: "Skåne län",
    intro:
      "Malmö har en av Sveriges mest dynamiska restaurangscener: nordiskt, mellanösternkök och indiskt sida vid sida med en stor cafékultur kring Davidshallstorg och Lilla Torg. En QR-meny från Servera låter Malmö-gästen skanna koden vid bordet och beställa själv, medan köket följer ordrarna på en skärm.",
    localContext:
      "Malmö har ungefär 900 restauranger och en mycket internationell befolkning, vilket gör flerspråkig meny till en nyckelfunktion. Närheten till Köpenhamn betyder dessutom att gränsöverskridande gäster är vanliga, så meny på engelska och danska är värd att ha.",
    whyServeraHere: [
      {
        title: "Meny på flera språk för en internationell stad",
        body: "Malmö har en av landets mest internationella demografier. Med flera språk per meny beställer alla gäster själva, oavsett modersmål.",
      },
      {
        title: "Lägre kostnad än internationella plattformar",
        body: "Servera har fast pris utan provision. Malmö-restauranger har ofta lägre kuvertpriser än Stockholm, och då blir skillnaden i totalkostnad tydlig.",
      },
      {
        title: "Snabb uppstart inför säsongen",
        body: "Sommaren i Malmö är intensiv. När uteserveringarna öppnar lägger du upp en ny meny på timmar i stället för att vänta veckor på trycksaker.",
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
          "Ja. Beställning från bordet är vanlig i Malmös centrum, vid Lilla Torg, Davidshallstorg och Möllevångstorget samt längs Limhamn. Användningen har vuxit snabbt sedan 2020.",
      },
      {
        question: "Vad kostar Servera för en restaurang i Malmö?",
        answer:
          "Start-planen kostar 549 kr/mån och Tillväxt-planen 999 kr/mån, helt utan provision. Nära Köpenhamn med många pendlargäster efterfrågas oftast en flerspråkig meny.",
      },
      ...COMMON_FAQ_END("Malmö"),
    ],
    metaTitle: "Digital meny för restauranger i Malmö",
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
      "Uppsala är Sveriges fjärde största stad, med ett tätt nät av restauranger, lunchställen och caféer kring nationerna, Stora torget och Fyrisån. Servera ger Uppsalas restauranger en meny som gästen når genom att skanna QR-koden på bordet och sedan beställa i mobilen.",
    localContext:
      "Med omkring 400 restauranger och drygt 50 000 studenter är prismedvetna lunchgäster en stor kundgrupp. Snabb uppdatering av dagens lunch och tydlig allergenmärkning väger därför tungt i vardagen.",
    whyServeraHere: [
      {
        title: "Dagens lunch uppdateras på sekunder",
        body: "Lunchställena runt Stora torget och Fyristorg byter dagens rätt varje dag. Med Servera ändrar du menyn när du vill, utan att trycka om något.",
      },
      {
        title: "Allergenmärkning som studentgäster litar på",
        body: "Studenter värdesätter tydlig kostmärkning. Vegan, vegetariskt, glutenfritt och de vanliga allergenerna finns som standardfält på varje rätt.",
      },
      {
        title: "Slimmad bemanning klarar fler bord",
        body: "Många Uppsala-restauranger drivs med liten personalstyrka. När gästen beställer från bordet minskar antalet servitörsmoment per order.",
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
          "Ja, framför allt lunchställen kring Stora torget, restauranger nära nationerna och caféer längs Fyrisån. Det fungerar väl för verksamheter med menyer som ändras ofta.",
      },
      {
        question: "Vad kostar Servera för en lunchrestaurang i Uppsala?",
        answer:
          "Start-planen för 549 kr/mån räcker oftast för en lunchrestaurang med upp till 20 bord. Inga provisioner tillkommer per beställning.",
      },
      ...COMMON_FAQ_END("Uppsala"),
    ],
    metaTitle: "Digital meny för restauranger i Uppsala",
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
      "Linköping är Östergötlands centrum, med ett livligt restaurangstråk kring Stora torget, Trädgårdstorget och Stångåns kajer. Med Servera lägger gästen i Linköping sin beställning via en QR-kod på bordet, och köket tar emot ordern på en skärm.",
    localContext:
      "Linköping har omkring 250 restauranger, en stor universitetsbefolkning och en pendlartrafik från Saab-anställda. Lunchgäster och after work-bokningar är därför två tunga kundgrupper, och både snabba menyuppdateringar och engelsk meny för internationella Saab-anställda är värda att ha.",
    whyServeraHere: [
      {
        title: "Smidig växling mellan lunch och kväll",
        body: "Lunchstället som blir kvällsbistro kan ha helt olika menyer under dagen. Med Servera växlar du dem på sekunder, manuellt eller schemalagt.",
      },
      {
        title: "Engelsk meny för internationella anställda",
        body: "Saab och universitetet drar internationell personal. En engelsk menyversion ger dem en bättre upplevelse, och ofta ett högre kuvertpris.",
      },
      {
        title: "Förbetalning via Stripe kortar kön",
        body: "Vid lunchrusningen eller bokade after work-tillfällen kan betalning via Stripe minska både kö och kassatid.",
      },
    ],
    cuisineHighlights: [
      "Lunchställen",
      "After work-barer",
      "Pizzerior",
      "Café-kultur",
      "Modernt svenskt",
    ],
    faq: [
      {
        question: "Är QR-meny vanlig i Linköping?",
        answer:
          "Ja. Restauranger kring Stora torget, Trädgårdstorget och i universitetsområdet använder allt oftare digital meny för både lunch och kväll.",
      },
      {
        question:
          "Vad kostar en digital meny för en mindre restaurang i Linköping?",
        answer:
          "Start-planen kostar 549 kr/mån i fast pris utan provision. För större verksamheter med fler bord finns Tillväxt-planen för 999 kr/mån.",
      },
      ...COMMON_FAQ_END("Linköping"),
    ],
    metaTitle: "Digital meny för restauranger i Linköping",
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
      "Västerås är en växande Mälardalsstad med ett restaurangstråk kring Stora torget, Bondtorget och Mälarhamnen. Servera är den digitala menyn bakom QR-koden: gästen i Västerås skannar, väljer och beställer i sin mobil.",
    localContext:
      "Västerås har ungefär 230 restauranger och ligger i en Mälardalsregion där turismen kring Mälaren ökar för varje år. Säsongsvariation är därför ett återkommande tema. Lunchgäster från ABB och kontorsområdena samt sommargäster vid Mälarens kajer är två stora kundsegment.",
    whyServeraHere: [
      {
        title: "Säsongsmeny för uteserveringarna",
        body: "När uteserveringarna kring hamnen öppnar i maj behövs ofta en utökad meny. Med Servera publicerar du säsongsmenyn på timmar, utan trycktid.",
      },
      {
        title: "Flerspråkig meny för Mälar-turister",
        body: "Internationella gäster vid Mälaren och hotellgäster i centrum efterfrågar ofta en engelsk menyversion.",
      },
      {
        title: "Effektiv lunch nära kontoren",
        body: "Restauranger nära ABB och de stora kontorsområdena kortar lunchrusningens kassatid när gästen beställer från bordet.",
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
          "Ja, allt fler. Restauranger kring Stora torget, Mälarhamnen och i kontorsdistrikten har börjat använda beställning från bordet sedan 2020.",
      },
      {
        question: "Vad kostar Servera för en restaurang i Västerås?",
        answer:
          "Priset är fast: 549 kr/mån för Start och 999 kr/mån för Tillväxt. Inga provisioner per beställning och inga dolda avgifter.",
      },
      ...COMMON_FAQ_END("Västerås"),
    ],
    metaTitle: "Digital meny för restauranger i Västerås",
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
      "Örebro växer snabbt som restaurangstad, med ett livligt stråk kring Järntorget, Stortorget och Svartån. Hos en restaurang som använder Servera skannar Örebro-gästen QR-koden på bordet och beställer utan att vänta in en servitör.",
    localContext:
      "Örebro har omkring 200 restauranger och en växande studentbefolkning vid universitetet, vilket gör prismedvetna gäster till en stor kundgrupp. Snabba menyuppdateringar och tydlig allergenmärkning underlättar det dagliga lunchflödet.",
    whyServeraHere: [
      {
        title: "Studentvänlig menyhantering",
        body: "Studenter vill se priser, allergener och vegetariska alternativ direkt. Servera har alla tre som standardfält i menyn.",
      },
      {
        title: "Uppdatering när rätter tar slut",
        body: "På små lunchrestauranger tar rätter ofta slut före stängning. Markerar du dem som otillgängliga försvinner de direkt och färre gäster blir besvikna.",
      },
      {
        title: "Mindre tryck på personalen i rusningen",
        body: "Beställning från bordet kortar kassatiden och frigör servitörerna till service och avdukning mellan vändningarna.",
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
          "Ja, allt fler restauranger kring Järntorget, Stortorget och i universitetsområdet använder digital meny.",
      },
      {
        question: "Vad kostar Servera för ett lunchställe i Örebro?",
        answer:
          "Start-planen på 549 kr/mån räcker för de flesta lunchrestauranger med upp till 20 bord, helt utan provision.",
      },
      ...COMMON_FAQ_END("Örebro"),
    ],
    metaTitle: "Digital meny för restauranger i Örebro",
    metaDescription:
      "QR-meny och mobilbeställning för Örebro-restauranger: Järntorget, Stortorget, universitetet. Snabba uppdateringar, från 549 kr/mån. Boka demo.",
  },
  helsingborg: {
    slug: "helsingborg",
    name: "Helsingborg",
    population: "ca 115 000",
    restaurantCountApprox: "ca 210",
    region: "Skåne län",
    intro:
      "Helsingborg har en av Sveriges mest internationella restaurangscener, tack vare närheten till Helsingör och kontinentaltrafiken. Kring Stortorget, Norra Storgatan och hamnen ligger restaurangerna tätt. Servera ger dem en QR-meny som gästen skannar vid bordet och beställer i sin mobil.",
    localContext:
      "Helsingborg har ungefär 210 restauranger och ett stadigt flöde av danska pendlargäster och kryssningsbesökare, vilket gör flerspråkig meny på framför allt danska och engelska viktig. De hamnnära restaurangerna har dessutom säsongsbetonade flöden där snabb omställning lönar sig.",
    whyServeraHere: [
      {
        title: "Meny på danska och engelska",
        body: "Med pendlare från Helsingör och kryssningstrafik gör en flerspråkig meny stor nytta för de internationella gästerna.",
      },
      {
        title: "Säsongsmeny för hamnens uteserveringar",
        body: "När uteserveringarna kring Hamnen och Sundstorget öppnar ser menyn ofta annorlunda ut. Med Servera öppnar och stänger du säsongsmenyer utan trycktid.",
      },
      {
        title: "Snabb betalning vid bordet",
        body: "Stripe-integrationen tar bort kassakön. Gästen betalar på sin mobil och kan gå så fort hen är klar.",
      },
    ],
    cuisineHighlights: [
      "Skaldjur",
      "Modernt nordiskt",
      "Italienskt",
      "Asiatiskt",
      "Dansk-svensk fusion",
    ],
    faq: [
      {
        question: "Använder restauranger i Helsingborg digital meny?",
        answer:
          "Ja, särskilt vid Stortorget, hamnen, Norra Storgatan och Sundstorget. Det är vanligt på restauranger som tar emot många internationella gäster.",
      },
      {
        question: "Vad kostar Servera för en restaurang i Helsingborg?",
        answer:
          "Start-planen kostar 549 kr/mån och Tillväxt-planen 999 kr/mån, utan provision. Driver du en restauranggrupp? Kontakta säljteamet för en Företag-offert.",
      },
      ...COMMON_FAQ_END("Helsingborg"),
    ],
    metaTitle: "Digital meny för restauranger i Helsingborg",
    metaDescription:
      "QR-meny för Helsingborg-restauranger: Stortorget, hamnen, Sundstorget. Meny på danska, svenska och engelska. Från 549 kr/mån. Boka demo med Servera.",
  },
  norrkoping: {
    slug: "norrkoping",
    name: "Norrköping",
    population: "ca 145 000",
    restaurantCountApprox: "ca 230",
    region: "Östergötlands län",
    intro:
      "Norrköping är en av Östergötlands största städer, och restaurangstråket har vuxit fram i det gamla Industrilandskapet längs Motala ström, framför allt kring Knäppingsborg. Med en QR-kod på bordet och Servera bakom den beställer Norrköpings-gästen direkt i mobilen.",
    localContext:
      "Norrköping har omkring 230 restauranger, och Campus Norrköping drar en stor studentbefolkning. Prismedvetna lunchgäster och after work-bokningar är därför tydliga kundgrupper. Knäppingsborg och stråket längs Strömmen har en stark café- och kvällskultur där snabba menyuppdateringar märks.",
    whyServeraHere: [
      {
        title: "Café- och kvällsliv i Knäppingsborg",
        body: "I det gamla Industrilandskapet kring Knäppingsborg är café- och kvällskulturen tät. Beställning från bordet tar bort kassakön och fler hinner serveras under rusningen.",
      },
      {
        title: "Smidig växling mellan lunch och kväll",
        body: "Lunchstället som blir kvällsbistro kan ha helt olika menyer under dagen. Med Servera byter du dem på sekunder.",
      },
      {
        title: "Allergenmärkning för studentgäster",
        body: "Med Campus Norrköping nära centrum är studenter en stor kundgrupp. Vegan, vegetariskt, glutenfritt och de vanliga allergenerna finns som standardfält.",
      },
    ],
    cuisineHighlights: [
      "Lunchställen",
      "Café-kultur",
      "Pizzerior",
      "Modernt nordiskt",
      "Asiatiskt streetfood",
    ],
    faq: [
      {
        question: "Är digital QR-meny vanlig i Norrköping?",
        answer:
          "Ja, särskilt kring Knäppingsborg, längs Motala ström och i centrum vid Tyska torget. Beställning från bordet har vuxit snabbt sedan 2020.",
      },
      {
        question: "Vad kostar Servera för en restaurang i Norrköping?",
        answer:
          "Start-planen kostar 549 kr/mån och Tillväxt-planen 999 kr/mån. Inga provisioner per beställning och inga dolda avgifter.",
      },
      ...COMMON_FAQ_END("Norrköping"),
    ],
    metaTitle: "Digital meny för restauranger i Norrköping",
    metaDescription:
      "QR-meny och mobilbeställning för Norrköpings restauranger: Knäppingsborg, Industrilandskapet, Tyska torget. Flerspråkig, från 549 kr/mån. Boka demo.",
  },
  jonkoping: {
    slug: "jonkoping",
    name: "Jönköping",
    population: "ca 145 000",
    restaurantCountApprox: "ca 230",
    region: "Jönköpings län",
    intro:
      "Jönköping ligger vid Vätterns södra spets, med ett restaurangstråk kring Tändsticksområdet, Östra Storgatan och Munksjöns kajer. Servera står för den digitala menyn: gästen i Jönköping skannar QR-koden och lägger sin order själv.",
    localContext:
      "Jönköping har ungefär 230 restauranger. Jönköping University och mässverksamheten på Elmia gör studentlunch, konferensgäster och after work till tre stora kundsegment. Sommarturismen längs Vättern lägger till ett återkommande behov av säsongsanpassning.",
    whyServeraHere: [
      {
        title: "Säsongsmeny för Vätterns sommargäster",
        body: "När uteserveringarna längs Vättern och Munksjön öppnar behövs ofta en utökad säsongsmeny. Med Servera öppnar och stänger du den på timmar.",
      },
      {
        title: "Flerspråkig meny för Elmia-konferenser",
        body: "Mässor och konferenser på Elmia drar internationella besökare. En meny på engelska och fler språk gör att gästen kan beställa på egen hand.",
      },
      {
        title: "Snabb lunch för studenter och kontor",
        body: "Beställning från bordet kortar kassatiden under lunchrusningen och frigör personalen till service, vilket märks i de täta lunchställena i centrum.",
      },
    ],
    cuisineHighlights: [
      "Lunchställen",
      "Café-kultur",
      "Sjö- och uteserveringar",
      "Pizzerior",
      "Modernt svenskt",
    ],
    faq: [
      {
        question: "Använder restauranger i Jönköping digital meny?",
        answer:
          "Ja, allt fler. Restauranger kring Tändsticksområdet, Östra Storgatan och Munksjöns kajer använder digital meny för både lunch och kväll.",
      },
      {
        question: "Vad kostar Servera för en restaurang i Jönköping?",
        answer:
          "549 kr/mån för Start och 999 kr/mån för Tillväxt, i fast pris utan provision per beställning.",
      },
      ...COMMON_FAQ_END("Jönköping"),
    ],
    metaTitle: "Digital meny för restauranger i Jönköping",
    metaDescription:
      "QR-meny för Jönköpings restauranger: Tändsticksområdet, Östra Storgatan, Munksjön. Säsongsanpassning, flerspråkig meny, från 549 kr/mån. Boka demo.",
  },
  umea: {
    slug: "umea",
    name: "Umeå",
    population: "ca 135 000",
    restaurantCountApprox: "ca 220",
    region: "Västerbottens län",
    intro:
      "Umeå är norra Sveriges största universitetsstad, med ett restaurangstråk kring Rådhustorget, Renmarkstorget och campusområdet. En restaurang i Umeå som använder Servera låter gästen skanna bordets QR-kod och beställa i mobilen.",
    localContext:
      "Umeå har omkring 220 restauranger, och universitetet drar tiotusentals studenter. Det gör prismedvetna lunchgäster till en mycket stor kundgrupp. Det kalla klimatet gör inomhusservering och en stark cafékultur till bärande delar av restaurangåret.",
    whyServeraHere: [
      {
        title: "Studentvänlig lunchhantering",
        body: "Med en av landets största studentbefolkningar väger tydliga priser, allergener och vegetariska alternativ tungt. Alla tre finns som standard i menyn.",
      },
      {
        title: "Cafékultur året om",
        body: "I ett kallt klimat står inomhusfikat för en stor del av omsättningen. Beställning från bordet kortar kön även under vinterhalvåret.",
      },
      {
        title: "Dagens lunch utan trycktid",
        body: "Lunchställena kring Rådhustorget och universitetet byter dagens rätt ofta. Med Servera uppdaterar du menyn direkt, utan att trycka om något.",
      },
    ],
    cuisineHighlights: [
      "Lunchställen och dagens",
      "Café-kultur",
      "Norrländskt",
      "Pizzerior",
      "Asiatiskt",
    ],
    faq: [
      {
        question: "Är digital QR-meny vanlig i Umeå?",
        answer:
          "Ja, särskilt kring Rådhustorget, Renmarkstorget och i campusområdet. Beställning från bordet har blivit vanlig på restauranger med stort lunchflöde sedan 2020.",
      },
      {
        question: "Vad kostar Servera för ett lunchställe i Umeå?",
        answer:
          "Start-planen på 549 kr/mån räcker för de flesta lunchrestauranger med upp till 20 bord. Inga provisioner tillkommer per beställning.",
      },
      ...COMMON_FAQ_END("Umeå"),
    ],
    metaTitle: "Digital meny för restauranger i Umeå",
    metaDescription:
      "QR-meny och mobilbeställning för Umeå-restauranger: Rådhustorget, Renmarkstorget, campus. Snabba uppdateringar, från 549 kr/mån. Boka demo med Servera.",
  },
  lund: {
    slug: "lund",
    name: "Lund",
    population: "ca 130 000",
    restaurantCountApprox: "ca 180",
    region: "Skåne län",
    intro:
      "Lund är en av Nordens äldsta universitetsstäder, med ett tätt nät av restauranger och caféer kring Mårtenstorget, Stortorget och Clemenstorget. Servera ger dem en QR-meny som gästen öppnar i mobilen genom att skanna koden på bordet.",
    localContext:
      "Lund har ungefär 180 restauranger. Universitetet och forskningsanläggningarna ESS och MAX IV drar internationella forskare, vilket gör flerspråkig meny till en nyckelfunktion. Staden har dessutom en mycket stark fika- och cafékultur kring de centrala torgen.",
    whyServeraHere: [
      {
        title: "Flerspråkig meny för internationella forskare",
        body: "ESS, MAX IV och universitetet drar forskare och studenter från hela världen. Menyn kan visas på flera språk, så alla gäster beställer själva.",
      },
      {
        title: "Stark fika- och cafékultur",
        body: "Cafékulturen kring Mårtenstorget och Stortorget är intensiv. Beställning från bordet kortar kön vid kassan under de hektiska fika-timmarna.",
      },
      {
        title: "Snabb lunch för studenter",
        body: "När gästen beställer från bordet minskar servitörsmomenten per order under lunchrusningen, vilket gör skillnad för de prismedvetna studentgästerna.",
      },
    ],
    cuisineHighlights: [
      "Café- och fika-kultur",
      "Lunchställen",
      "Modernt skånskt",
      "Internationellt",
      "Pizzerior",
    ],
    faq: [
      {
        question: "Använder restauranger i Lund digital meny?",
        answer:
          "Ja, särskilt kring Mårtenstorget, Stortorget, Clemenstorget och i universitetsområdet. Digital meny är vanlig på restauranger och caféer med många internationella gäster.",
      },
      {
        question: "Vad kostar Servera för en restaurang i Lund?",
        answer:
          "Start-planen kostar 549 kr/mån och Tillväxt-planen 999 kr/mån, utan provision per beställning. Driver du en restauranggrupp? Kontakta säljteamet för en Företag-offert.",
      },
      ...COMMON_FAQ_END("Lund"),
    ],
    metaTitle: "Digital meny för restauranger i Lund",
    metaDescription:
      "QR-meny för Lunds restauranger: Mårtenstorget, Stortorget, universitetet. Flerspråkig meny för internationella gäster, från 549 kr/mån. Boka demo.",
  },
  boras: {
    slug: "boras",
    name: "Borås",
    population: "ca 115 000",
    restaurantCountApprox: "ca 190",
    region: "Västra Götalands län",
    intro:
      "Borås är Sjuhärads centrum, känt för sin textil- och designhistoria. Restaurangerna samlas kring Stora torget, Lilla Brogatan och Sandwalls plats. Med Servera skannar Borås-gästen QR-koden på bordet och beställer från sin plats.",
    localContext:
      "Borås har ungefär 190 restauranger. Högskolan i Borås och en stark handelstradition kring Knalleland gör lunchgäster från kontor och handel till en stor kundgrupp. Snabb uppdatering av dagens lunch och tydlig allergenmärkning underlättar det dagliga flödet.",
    whyServeraHere: [
      {
        title: "Effektiv lunch i handels- och kontorsstaden",
        body: "Borås har ett tätt handels- och kontorscentrum. Beställning från bordet kortar kassatiden i lunchrusningen och frigör personalen mellan vändningarna.",
      },
      {
        title: "Dagens lunch uppdateras direkt",
        body: "Lunchställena kring Stora torget och Lilla Brogatan byter dagens rätt ofta. Med Servera ändrar du menyn utan att trycka om något.",
      },
      {
        title: "Allergenmärkning som standard",
        body: "Vegan, vegetariskt, glutenfritt och de vanliga allergenerna finns som standardfält, så gästen ser informationen utan att fråga servitören.",
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
        question: "Är digital QR-meny vanlig i Borås?",
        answer:
          "Ja, allt fler restauranger kring Stora torget, Lilla Brogatan, Sandwalls plats och i handelsområdena använder beställning från bordet.",
      },
      {
        question: "Vad kostar Servera för en restaurang i Borås?",
        answer:
          "549 kr/mån för Start och 999 kr/mån för Tillväxt, i fast pris utan provision per beställning.",
      },
      ...COMMON_FAQ_END("Borås"),
    ],
    metaTitle: "Digital meny för restauranger i Borås",
    metaDescription:
      "QR-meny och mobilbeställning för Borås restauranger: Stora torget, Lilla Brogatan, Sandwalls plats. Snabba uppdateringar, från 549 kr/mån. Boka demo.",
  },
  sundsvall: {
    slug: "sundsvall",
    name: "Sundsvall",
    population: "ca 100 000",
    restaurantCountApprox: "ca 170",
    region: "Västernorrlands län",
    intro:
      "Sundsvall — Stenstaden — är södra Norrlands regionala centrum, med ett restaurangstråk kring Storgatan, Stora torget och Esplanaden. Servera digitaliserar menyn: gästen i Sundsvall skannar QR-koden vid bordet och beställer i mobilen.",
    localContext:
      "Sundsvall har omkring 170 restauranger och fungerar som regionalt centrum för södra Norrland. Lunchgäster, affärsresenärer och konferensgäster är tre stora kundgrupper, och både snabba menyuppdateringar och flerspråkiga alternativ underlättar det dagliga flödet i Stenstaden.",
    whyServeraHere: [
      {
        title: "Lunch och affärsresenärer i Stenstaden",
        body: "Som regionalt centrum tar Sundsvall emot många affärsresenärer. Beställning från bordet kortar kassatiden och håller lunchen smidig även när det är fullt.",
      },
      {
        title: "Flerspråkig meny för konferensgäster",
        body: "Konferens- och affärsgäster efterfrågar ofta en engelsk menyversion. Servera-menyn kan visas på flera språk så att gästen beställer själv.",
      },
      {
        title: "Dagens lunch utan trycktid",
        body: "Lunchställena kring Storgatan och Stora torget byter dagens rätt ofta. Med Servera uppdaterar du menyn direkt.",
      },
    ],
    cuisineHighlights: [
      "Lunchställen",
      "Café-kultur",
      "Norrländskt",
      "Pizzerior",
      "Modernt svenskt",
    ],
    faq: [
      {
        question: "Använder restauranger i Sundsvall digital meny?",
        answer:
          "Ja, allt fler. Restauranger kring Storgatan, Stora torget och Esplanaden i Stenstaden använder digital meny för både lunch och kväll.",
      },
      {
        question: "Vad kostar Servera för en restaurang i Sundsvall?",
        answer:
          "Start-planen kostar 549 kr/mån och Tillväxt-planen 999 kr/mån. Inga provisioner per beställning och inga dolda avgifter.",
      },
      ...COMMON_FAQ_END("Sundsvall"),
    ],
    metaTitle: "Digital meny för restauranger i Sundsvall",
    metaDescription:
      "QR-meny och mobilbeställning för Sundsvalls restauranger: Storgatan, Stora torget, Esplanaden. Flerspråkig meny, från 549 kr/mån. Boka demo.",
  },
  eskilstuna: {
    slug: "eskilstuna",
    name: "Eskilstuna",
    population: "ca 110 000",
    restaurantCountApprox: "ca 180",
    region: "Södermanlands län",
    intro:
      "Eskilstuna är en Mälardalsstad med stark industri- och smideshistoria. Restaurangerna samlas kring Fristadstorget, Kungsgatan och Eskilstunaåns kajer, med en växande scen i gamla Munktellstaden. En QR-kod på bordet kopplad till Servera låter Eskilstuna-gästen beställa direkt i mobilen.",
    localContext:
      "Eskilstuna har ungefär 180 restauranger. Mälardalens universitet och en lång tradition av industri- och kontorsarbetsplatser gör lunchgäster till en stor kundgrupp. Den ombyggda industrimiljön i Munktellstaden har dessutom en växande café- och kvällskultur.",
    whyServeraHere: [
      {
        title: "Restaurangscen i Munktellstaden",
        body: "Den gamla industrimiljön i Munktellstaden har blivit ett café- och restaurangstråk. Beställning från bordet kortar kön och fler hinner serveras under rusningen.",
      },
      {
        title: "Effektiv lunch i industri- och kontorsstaden",
        body: "Eskilstuna har många industri- och kontorsarbetsplatser med koncentrerade lunchtider. Beställning från bordet minskar kassatiden och frigör personalen.",
      },
      {
        title: "Allergenmärkning för studentgäster",
        body: "Med Mälardalens universitet i staden är studenter en stor kundgrupp. Vegan, vegetariskt, glutenfritt och de vanliga allergenerna finns som standardfält.",
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
        question: "Är digital QR-meny vanlig i Eskilstuna?",
        answer:
          "Ja, allt fler restauranger kring Fristadstorget, Kungsgatan och i Munktellstaden använder digital meny för både lunch och kväll.",
      },
      {
        question: "Vad kostar Servera för en restaurang i Eskilstuna?",
        answer:
          "Start-planen kostar 549 kr/mån och Tillväxt-planen 999 kr/mån. Inga provisioner per beställning och inga dolda avgifter.",
      },
      ...COMMON_FAQ_END("Eskilstuna"),
    ],
    metaTitle: "Digital meny för restauranger i Eskilstuna",
    metaDescription:
      "QR-meny och mobilbeställning för Eskilstunas restauranger: Fristadstorget, Kungsgatan, Munktellstaden. Flerspråkig meny, från 549 kr/mån. Boka demo.",
  },
  gavle: {
    slug: "gavle",
    name: "Gävle",
    population: "ca 105 000",
    restaurantCountApprox: "ca 175",
    region: "Gävleborgs län",
    intro:
      "Gävle är porten till Norrland, med ett restaurangstråk kring Stortorget, Drottninggatan och hamnen. Servera ger Gävles restauranger en meny som gästen når genom att skanna QR-koden på bordet.",
    localContext:
      "Gävle har ungefär 175 restauranger. Högskolan i Gävle och en lång kaffe- och kafétradition gör lunchgäster och fika-gäster till två stora kundgrupper. Snabb uppdatering av dagens lunch och tydlig allergenmärkning underlättar vardagen.",
    whyServeraHere: [
      {
        title: "Cafékultur i en stad med kaffetradition",
        body: "Gävle har en lång kaffe- och kafétradition. Beställning från bordet kortar kön vid kassan under de hektiska fika-timmarna.",
      },
      {
        title: "Snabb lunch för kontor och högskola",
        body: "Beställning från bordet minskar servitörsmomenten per order under lunchrusningen och frigör personalen mellan vändningarna.",
      },
      {
        title: "Dagens lunch uppdateras direkt",
        body: "Lunchställena kring Stortorget och Drottninggatan byter dagens rätt ofta. Med Servera ändrar du menyn utan att trycka om något.",
      },
    ],
    cuisineHighlights: [
      "Lunchställen",
      "Café- och kaffekultur",
      "Pizzerior",
      "Norrländskt",
      "Modernt svenskt",
    ],
    faq: [
      {
        question: "Använder restauranger i Gävle digital meny?",
        answer:
          "Ja, allt fler. Restauranger kring Stortorget, Drottninggatan och hamnen använder digital meny för både lunch och kväll.",
      },
      {
        question: "Vad kostar Servera för en restaurang i Gävle?",
        answer:
          "549 kr/mån för Start och 999 kr/mån för Tillväxt, i fast pris utan provision per beställning.",
      },
      ...COMMON_FAQ_END("Gävle"),
    ],
    metaTitle: "Digital meny för restauranger i Gävle",
    metaDescription:
      "QR-meny och mobilbeställning för Gävles restauranger: Stortorget, Drottninggatan, hamnen. Snabba uppdateringar, från 549 kr/mån. Boka demo med Servera.",
  },
  halmstad: {
    slug: "halmstad",
    name: "Halmstad",
    population: "ca 105 000",
    restaurantCountApprox: "ca 185",
    region: "Hallands län",
    intro:
      "Halmstad är en västkuststad med stark sommar- och badturism kring Tylösand. Restaurangerna samlas kring Stora torg, Storgatan och Nissans kajer. Med Servera bakom QR-koden beställer Halmstad-gästen själv från bordet, i sin egen mobil.",
    localContext:
      "Halmstad har ungefär 185 restauranger. Högskolan i Halmstad och en intensiv sommarsäsong med badgäster vid Tylösand gör säsongsanpassning till ett återkommande tema. Flerspråkiga menyer för svenska och internationella sommarturister efterfrågas ofta.",
    whyServeraHere: [
      {
        title: "Säsongsmeny för sommar- och badgäster",
        body: "När badsäsongen kring Tylösand drar igång ökar trycket kraftigt. Med Servera öppnar och stänger du säsongsmenyer på timmar, utan trycktid.",
      },
      {
        title: "Flerspråkig meny för västkust-turister",
        body: "Sommargäster och internationella besökare är en stor kundgrupp. Menyn kan visas på flera språk, så alla gäster beställer själva.",
      },
      {
        title: "Snabb betalning vid bordet",
        body: "Stripe-integrationen tar bort kassakön under sommarrusningen. Gästen betalar på sin mobil och kan gå så fort hen är klar.",
      },
    ],
    cuisineHighlights: [
      "Skaldjur och fisk",
      "Lunchställen",
      "Café-kultur",
      "Sommar- och uteserveringar",
      "Modernt svenskt",
    ],
    faq: [
      {
        question: "Är digital QR-meny vanlig i Halmstad?",
        answer:
          "Ja, särskilt kring Stora torg, Storgatan, hamnen och i badområdena. Beställning från bordet är vanlig på restauranger med stark sommarsäsong.",
      },
      {
        question: "Vad kostar Servera för en restaurang i Halmstad?",
        answer:
          "Start-planen kostar 549 kr/mån och Tillväxt-planen 999 kr/mån, utan provision per beställning. För säsongsverksamheter räcker Start-planen ofta.",
      },
      ...COMMON_FAQ_END("Halmstad"),
    ],
    metaTitle: "Digital meny för restauranger i Halmstad",
    metaDescription:
      "QR-meny för Halmstads restauranger: Stora torg, Storgatan, Tylösand. Säsongsanpassning, flerspråkig meny, från 549 kr/mån. Boka demo med Servera.",
  },
  vaxjo: {
    slug: "vaxjo",
    name: "Växjö",
    population: "ca 95 000",
    restaurantCountApprox: "ca 160",
    region: "Kronobergs län",
    intro:
      "Växjö är Smålands universitetscentrum, omgivet av sjöar och med en tydlig hållbarhetsprofil. Restaurangerna samlas kring Stortorget, Storgatan och Sandgärdsgatan. Servera står för den digitala menyn i Växjö: skanna QR-koden, välj och beställ i mobilen.",
    localContext:
      "Växjö har ungefär 160 restauranger, och Linnéuniversitetet drar en stor studentbefolkning. Det gör prismedvetna lunchgäster till en betydande kundgrupp. Närheten till Glasriket innebär dessutom att internationella turister är vanliga under sommarhalvåret.",
    whyServeraHere: [
      {
        title: "Studentvänlig lunchhantering",
        body: "Med Linnéuniversitetet i staden väger tydliga priser, allergener och vegetariska alternativ tungt. Alla tre finns som standard i menyn.",
      },
      {
        title: "Dagens lunch uppdateras direkt",
        body: "Lunchställena kring Stortorget och Storgatan byter dagens rätt ofta. Med Servera ändrar du menyn utan att trycka om något.",
      },
      {
        title: "Flerspråkig meny för Glasriket-turister",
        body: "Internationella besökare på väg till eller från Glasriket efterfrågar ofta en engelsk menyversion. Servera-menyn kan visas på flera språk.",
      },
    ],
    cuisineHighlights: [
      "Lunchställen",
      "Café-kultur",
      "Modernt småländskt",
      "Pizzerior",
      "Asiatiskt",
    ],
    faq: [
      {
        question: "Använder restauranger i Växjö digital meny?",
        answer:
          "Ja, allt fler. Restauranger kring Stortorget, Storgatan, Sandgärdsgatan och i universitetsområdet använder digital meny.",
      },
      {
        question: "Vad kostar Servera för ett lunchställe i Växjö?",
        answer:
          "Start-planen på 549 kr/mån räcker för de flesta lunchrestauranger med upp till 20 bord. Inga provisioner tillkommer per beställning.",
      },
      ...COMMON_FAQ_END("Växjö"),
    ],
    metaTitle: "Digital meny för restauranger i Växjö",
    metaDescription:
      "QR-meny och mobilbeställning för Växjös restauranger: Stortorget, Storgatan, universitetet. Flerspråkig meny, från 549 kr/mån. Boka demo med Servera.",
  },
  karlstad: {
    slug: "karlstad",
    name: "Karlstad",
    population: "ca 95 000",
    restaurantCountApprox: "ca 165",
    region: "Värmlands län",
    intro:
      "Karlstad ligger vid Vänern i Klarälvens delta, staden känd som Sola i Karlstad. Restaurangerna samlas kring Stora torget, Kungsgatan och Inre hamn. En restaurang i Karlstad som använder Servera låter gästen skanna bordets QR-kod och beställa i mobilen.",
    localContext:
      "Karlstad har ungefär 165 restauranger. Karlstads universitet och en växande sommarturism vid Vänern och Klarälven gör studenter, sommargäster och konferensbesökare till tre stora kundgrupper. Säsongsanpassning och flerspråkiga menyer blir därmed återkommande behov.",
    whyServeraHere: [
      {
        title: "Säsongsmeny för Vänern-sommaren",
        body: "När uteserveringarna kring Inre hamn och Klarälven öppnar behövs ofta en utökad säsongsmeny. Med Servera öppnar och stänger du den på timmar.",
      },
      {
        title: "Studentvänlig lunchhantering",
        body: "Med Karlstads universitet i staden är studenter en stor lunchkundgrupp. Tydliga priser, allergener och vegetariska alternativ finns som standardfält.",
      },
      {
        title: "Flerspråkig meny för konferens- och sommargäster",
        body: "Konferensbesökare och internationella sommarturister efterfrågar ofta en engelsk menyversion. Servera-menyn kan visas på flera språk.",
      },
    ],
    cuisineHighlights: [
      "Lunchställen",
      "Café-kultur",
      "Värmländskt",
      "Sjö- och uteserveringar",
      "Pizzerior",
    ],
    faq: [
      {
        question: "Är digital QR-meny vanlig i Karlstad?",
        answer:
          "Ja, allt fler restauranger kring Stora torget, Kungsgatan och Inre hamn använder digital meny för både lunch och kväll.",
      },
      {
        question: "Vad kostar Servera för en restaurang i Karlstad?",
        answer:
          "549 kr/mån för Start och 999 kr/mån för Tillväxt, i fast pris utan provision per beställning.",
      },
      ...COMMON_FAQ_END("Karlstad"),
    ],
    metaTitle: "Digital meny för restauranger i Karlstad",
    metaDescription:
      "QR-meny och mobilbeställning för Karlstads restauranger: Stora torget, Kungsgatan, Inre hamn. Säsongsanpassning, flerspråkig meny, från 549 kr/mån.",
  },
}

export const CITY_SLUGS = Object.keys(CITIES)
