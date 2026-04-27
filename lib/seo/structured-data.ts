export const SITE_URL = "https://servera.triadsolutions.se"
export const SITE_NAME = "Servera"
export const PUBLISHER_NAME = "Triad Solutions"
export const PUBLISHER_URL = "https://triadsolutions.se"

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: "Triad Solutions",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo-512.png`,
      width: 1080,
      height: 1080,
    },
    description:
      "Servera är en svensk plattform för digital meny, QR-beställning och kontaktlös betalning för restauranger.",
    foundingDate: "2024",
    parentOrganization: {
      "@type": "Organization",
      name: PUBLISHER_NAME,
      url: PUBLISHER_URL,
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "SE",
    },
    sameAs: [PUBLISHER_URL],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      url: SITE_URL,
      areaServed: "SE",
      availableLanguage: ["Swedish", "English"],
    },
  }
}

export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#software`,
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Restaurant Management Software",
    operatingSystem: "Web, iOS, Android",
    url: SITE_URL,
    description:
      "Digital meny och QR-beställningssystem för restauranger. Skapa QR-menyer, ta emot mobilbeställningar och uppdatera priser i realtid.",
    inLanguage: ["sv-SE", "en"],
    publisher: {
      "@type": "Organization",
      name: PUBLISHER_NAME,
      url: PUBLISHER_URL,
    },
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "SEK",
        category: "free",
      },
      {
        "@type": "Offer",
        name: "Pro",
        priceCurrency: "SEK",
        category: "subscription",
      },
      {
        "@type": "Offer",
        name: "Enterprise",
        priceCurrency: "SEK",
        category: "subscription",
      },
    ],
    featureList: [
      "Digital QR-meny",
      "Mobilbeställning",
      "Kontaktlös betalning",
      "Realtidsuppdatering av priser",
      "Allergeninformation",
      "Köks- och servitörsvy",
      "Försäljningsstatistik",
      "Flerspråkig meny",
    ],
  }
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "sv-SE",
    publisher: { "@id": `${SITE_URL}/#organization` },
  }
}

interface PricingPlan {
  name: string
  description: string
  priceSEK: number | null
  url: string
  features: string[]
}

export function productSchema(plan: PricingPlan) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Servera ${plan.name}`,
    description: plan.description,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: "Restaurant Management Software",
    url: plan.url,
    offers: {
      "@type": "Offer",
      url: plan.url,
      availability: "https://schema.org/InStock",
      priceCurrency: "SEK",
      ...(plan.priceSEK !== null
        ? {
            price: plan.priceSEK.toString(),
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: plan.priceSEK,
              priceCurrency: "SEK",
              unitText: "MONTH",
              referenceQuantity: {
                "@type": "QuantitativeValue",
                value: 1,
                unitCode: "MON",
              },
            },
          }
        : {}),
      seller: {
        "@type": "Organization",
        name: PUBLISHER_NAME,
        url: PUBLISHER_URL,
      },
    },
    additionalProperty: plan.features.map((f) => ({
      "@type": "PropertyValue",
      name: "Feature",
      value: f,
    })),
  }
}

export function faqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

interface RestaurantSchemaInput {
  name: string
  subdomain: string
  logoUrl?: string | null
  address?: string | null
  description?: string
}

export function restaurantSchema(input: RestaurantSchemaInput) {
  const url = `${SITE_URL}/${input.subdomain}/table/1`
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${url}#restaurant`,
    name: input.name,
    url,
    ...(input.logoUrl ? { image: input.logoUrl, logo: input.logoUrl } : {}),
    ...(input.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: input.address,
            addressCountry: "SE",
          },
        }
      : {}),
    ...(input.description ? { description: input.description } : {}),
    servesCuisine: [],
    acceptsReservations: false,
  }
}

interface MenuItemInput {
  id: string
  name: string
  description?: string | null
  price_cents: number
  image_url?: string | null
  is_vegetarian?: boolean
  is_vegan?: boolean
  is_gluten_free?: boolean
}

interface MenuCategoryInput {
  id: string
  name: string
}

export function menuSchema(
  restaurantUrl: string,
  categories: MenuCategoryInput[],
  items: Array<MenuItemInput & { category_id: string }>,
) {
  const dietMap = (item: MenuItemInput) => {
    const diets: string[] = []
    if (item.is_vegan) diets.push("https://schema.org/VeganDiet")
    if (item.is_vegetarian) diets.push("https://schema.org/VegetarianDiet")
    if (item.is_gluten_free) diets.push("https://schema.org/GlutenFreeDiet")
    return diets
  }

  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Meny",
    inLanguage: "sv-SE",
    hasMenuSection: categories.map((cat) => ({
      "@type": "MenuSection",
      name: cat.name,
      hasMenuItem: items
        .filter((it) => it.category_id === cat.id)
        .map((it) => {
          const diets = dietMap(it)
          return {
            "@type": "MenuItem",
            name: it.name,
            ...(it.description ? { description: it.description } : {}),
            ...(it.image_url ? { image: it.image_url } : {}),
            offers: {
              "@type": "Offer",
              price: (it.price_cents / 100).toFixed(2),
              priceCurrency: "SEK",
              availability: "https://schema.org/InStock",
            },
            ...(diets.length ? { suitableForDiet: diets } : {}),
          }
        }),
    })),
  }
}
