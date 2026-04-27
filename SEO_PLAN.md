# Servera SEO Strategy & Implementation Plan

**Domain:** servera.triadsolutions.se
**Market:** Sweden (primary), Nordics (secondary), English-speaking export (tertiary)
**Audience:** Restaurants, cafés, pizzerias, bars, food trucks
**Last updated:** 2026-04-27

---

## TL;DR

Servera has zero existing SEO foundation. The product is solid, but every search-engine signal is missing: no sitemap, no robots policy, no structured data, no rich metadata, all marketing copy crammed into a single client-rendered landing page, and customer-facing menu pages forced into dynamic mode (no caching, weak crawl signals).

This plan delivers (a) a baseline tech-SEO foundation in the codebase right now, (b) a 90-day content + programmatic-SEO plan to start ranking, and (c) ongoing levers — backlinks, GBP, GEO/LLM optimization — to compound over 6–12 months.

The biggest single multiplier is **public menu pages indexed with full Restaurant + Menu schema**. Every restaurant on Servera becomes a rankable entity. With ~30,000 restaurants in Sweden and a ~1–2 % market share within a year, that's hundreds of indexed long-tail pages, each linking back to Servera.

---

## 1. What was just shipped in this branch

The technical foundation. All zero-risk infrastructure work that needed to exist before any content strategy could land.

| Change | File | Why it matters |
|---|---|---|
| `robots.txt` route | [app/robots.ts](app/robots.ts) | Tells crawlers what to index. Explicitly allows all major LLM crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bingbot, Applebot-Extended) — required for AI-search citation. |
| `sitemap.xml` route | [app/sitemap.ts](app/sitemap.ts) | Lists landing page + every active restaurant subdomain dynamically from Supabase. Hourly revalidation. |
| Comprehensive root metadata | [app/layout.tsx](app/layout.tsx) | OpenGraph, Twitter cards, Swedish keywords, canonical, robots directives, theme-color, hreflang scaffolding. |
| `next/font` for Inter + Playfair | [app/layout.tsx](app/layout.tsx), [app/globals.css](app/globals.css), [tailwind.config.ts](tailwind.config.ts) | Replaces blocking Google Fonts CSS link with self-hosted, preloaded variable fonts. Improves LCP and CLS. |
| Site-wide JSON-LD on landing | [app/page.tsx](app/page.tsx), [components/seo/JsonLd.tsx](components/seo/JsonLd.tsx), [lib/seo/structured-data.ts](lib/seo/structured-data.ts) | Organization, WebSite, SoftwareApplication, FAQPage. Powers Google Knowledge Panel + AI-search citations. |
| Restaurant + Menu + Breadcrumb JSON-LD on every menu page | [app/(customer)/[subdomain]/table/[tableNumber]/page.tsx](app/(customer)/[subdomain]/table/[tableNumber]/page.tsx) | Every menu page now emits full schema.org Restaurant + Menu (with prices in SEK and dietary flags). LLMs and Google AI Overviews consume this directly. |
| Per-tenant SEO metadata | same | Dynamic title, description, canonical, OG image (logo) per restaurant — instead of just `restaurant.name`. |
| ISR instead of `force-dynamic` on menu pages | same + [lib/supabase/public.ts](lib/supabase/public.ts) | Page caches for 5 min, revalidates on demand. Faster TTFB, better Core Web Vitals, Google can recrawl efficiently. Public Supabase client (no cookies) lets the route opt out of dynamic rendering. |
| `/llms.txt` | [public/llms.txt](public/llms.txt) | Markdown index for LLM crawlers. Fast-track discovery in ChatGPT / Perplexity. |

Verified with `npx tsc --noEmit` (clean) and `npx next build` (18 pages built, robots.txt + sitemap.xml render as static).

---

## 2. SEO research findings

### 2.1 Keyword landscape

**Highest-value Swedish search clusters (commercial intent):**

| Cluster | Example queries | Intent | Difficulty |
|---|---|---|---|
| Direct product | `digital meny restaurang`, `qr meny`, `qr-meny restaurang`, `digital meny pris`, `qr meny pris` | Bottom funnel | Mid |
| Adjacent | `restaurangsystem`, `kassasystem restaurang`, `mobilbeställning restaurang` | Mid funnel | Higher (Caspeco/Trivec dominate) |
| Comparison | `flipdish alternativ`, `qopla alternativ`, `weiq alternativ`, `meny-qr alternativ`, `bästa qr meny 2026` | Bottom funnel — highest CVR | Low |
| Problem-aware | `hur skapar man en digital meny`, `digitalisera restaurang`, `allergener på meny lag`, `flerspråkig meny` | Top funnel | Low |
| Long-tail programmatic | `digital meny [stad]`, `qr meny [restaurangtyp]`, `meny mall [typ]` | Long-tail commercial | Low (each), high in aggregate |

**English secondary cluster (Nordic export, GEO citation):**
`qr code menu sweden`, `digital menu software`, `restaurant menu builder`, `flipdish alternative`, `mr yum alternative`.

### 2.2 Competitive landscape

**Direct competitors active in Sweden:**
- **meny-qr.se** — current SERP leader on `digital meny restaurang`. Single-page Swedish-first SEO, claims 2,400 restaurants.
- **WEIQ** (weiq.tech) — Swedish, strong on QR + terminal.
- **Qopla** — Swedish SaaS (Stockholm), online ordering + QR.
- **Yumzi** — multi-language QR menu.

**Adjacent (POS / restaurant suite — they will outspend on broad terms):**
- **Caspeco + Trivec** — merged spring 2025. ~6,500 restaurants Nordic + EU. Will dominate generic POS/ system queries.
- **Onslip**, **Vendion** — POS-first.

**International (rank on EN queries):**
- **Flipdish** (Ireland) — large content + programmatic SEO operation. Cuisine pages, region pages, deep blog.
- **BentoBox**, **Mr Yum**, **Toast**, **Owner.com**, **Lunchbox**.

**Pattern:** Swedish leaders win with one focused keyword per page, not deep content. International leaders win with programmatic + content depth. Servera should combine both.

### 2.3 Programmatic SEO opportunity

Programmatic is the single highest-leverage track for B2B SaaS in 2026 — but Google penalizes thin variants. Each generated page needs ≥300 unique words, real local data, unique testimonial, unique FAQ. ([Averi 2026 playbook](https://www.averi.ai/blog/programmatic-seo-for-b2b-saas-startups-the-complete-2026-playbook))

| Template | Example URLs | Build effort | Volume signal |
|---|---|---|---|
| City pages | `/digital-meny/stockholm`, `/digital-meny/goteborg`, `/digital-meny/malmo` | Low–medium | Medium-high per city |
| Restaurant-type pages | `/digital-meny/pizzeria`, `/qr-meny/sushi`, `/digital-meny/cafe` | Low | Medium |
| Type × city | `/digital-meny/pizzeria/stockholm` | Medium | Long-tail, compounds |
| `vs` comparison pages | `/jamfor/servera-vs-meny-qr`, `/jamfor/servera-vs-qopla`, `/jamfor/servera-vs-weiq` | Low | High intent, low volume |
| Alternative pages | `/alternativ-till/flipdish`, `/alternativ-till/meny-qr` | Low | Bottom funnel |
| Integration pages | `/integrationer/caspeco`, `/integrationer/stripe`, `/integrationer/klarna` | Medium | Brand-search piggyback |
| Use-case mall pages | `/mallar/sushi-meny`, `/mallar/pizzeria-meny`, `/mallar/lunchmeny` | Medium | Mid funnel, link bait |

### 2.4 Public menu pages: should they be indexed?

**Recommendation: selective indexation, opt-in by quality threshold.**

Pros: long-tail capture for `restaurang [name] meny [city]` — every restaurant on Servera becomes an indexable entity with unique structured data and an internal "Powered by Servera" link back to the homepage. Strong AI-search signal: LLMs love structured menu data with prices, allergens, hours.

Cons: thin pages (small cafés with 5 items) trigger Google's Helpful Content classifier and can drag down domain authority. Stale pages after restaurant churn.

**Tactical rules:**
1. Default `noindex` on every restaurant. Auto-flip to `index` when restaurant has ≥10 menu items, address filled, and at least one item with an image.
2. Inject full Restaurant + Menu schema.org markup on indexable menus (already shipped — see [lib/seo/structured-data.ts](lib/seo/structured-data.ts)).
3. Submit a separate `/sitemap-menus.xml` once indexable count exceeds ~500 — Next supports this with `generateSitemaps()`.
4. Always server-render. Never inject `noindex` from JS — Google may not execute JS.

### 2.5 Structured data that yields rich results in 2026

Already implemented for the SaaS site:
- `Organization` (knowledge panel)
- `WebSite` (brand search)
- `SoftwareApplication` (with feature list and offer category)
- `FAQPage` (still rendering selectively)
- `BreadcrumbList` (per page)

Already implemented for tenant menu pages:
- `Restaurant` (with logo, address, country)
- `Menu` → `MenuSection` → `MenuItem` (with SEK pricing, dietary flags, descriptions, images)
- `BreadcrumbList`

Still to add (next iteration):
- `Product` schema per pricing plan (Starter / Pro / Enterprise) with `offers`
- `Article` + `Person` (author) schema on every blog post — required for E-E-A-T in 2026
- `LocalBusiness` (richer than `Restaurant` alone) with `openingHoursSpecification` once we collect hours from restaurants
- `aggregateRating` once review collection exists

### 2.6 Content marketing strategy — topic clusters

Per [Brafton 2026](https://www.brafton.com/blog/strategy/topic-cluster-content-strategy/), pillar-cluster sites see +63 % primary-keyword rankings in 90 days vs. flat blogs. Don't publish isolated posts.

**Pillar 1 — "Digital meny — kompletta guiden"** (target: `digital meny`, 3,000+ words)
Cluster posts: hur man skapar en digital meny, digital meny vs tryckt meny, digital meny pris jämförelse, byta från Excel-meny, flerspråkig meny, meny-mall pizzeria, meny-mall sushi, meny-mall café.

**Pillar 2 — "QR-meny för restauranger"** (target: `qr meny`)
Cluster: qr meny utan app, qr meny för bord, så ökar qr-meny ordervärdet (publish original Servera benchmark data), qr-kod placering meny, qr meny vs nfc-meny.

**Pillar 3 — "Digitalisera din restaurang"** (top funnel, brand builder)
Cluster: allergener på meny — lagkrav 2026, dynamisk prissättning restaurang, beställning via mobil, kontaktlös betalning, restaurang-CRM grunderna.

**Pillar 4 — Comparison hub**
`Servera vs meny-qr`, `vs Qopla`, `vs Caspeco`, `vs WEIQ`, `vs Flipdish`, `vs Yumzi`. These convert highest of any organic format.

**Pillar 5 — Original research / link-bait**
- "State of Swedish Restaurant Tech 2026" — survey 200 restaurants, publish gated + ungated.
- "Allergen audit 2026" — scan public menus for missing allergens, publish findings as PR.

### 2.7 Technical SEO checklist (Next.js App Router)

Already satisfied (this branch):
- Per-route metadata via `generateMetadata`, no client-side metadata.
- `metadataBase` set once in root.
- Static `app/sitemap.ts` for marketing + dynamic restaurant entries.
- `app/robots.ts` allowing all major bots + LLM bots explicitly.
- `next/font` for self-hosted variable fonts with `display: swap`.
- ISR (`revalidate = 300`) on menu pages instead of `force-dynamic`.
- Public Supabase client (cookieless) for SEO-critical routes.

Still to do:
- On-demand `revalidateTag('menu:'+id)` from a Supabase Edge Function or webhook on menu update — so changes go live immediately while keeping ISR.
- Use `generateSitemaps()` to chunk menus into 50k-URL sitemaps once that scale matters.
- Replace remaining `<img>` tags with `next/image` site-wide (currently only used in cart).
- Set Core Web Vitals targets in CI: LCP <2.5 s, INP <200 ms, CLS <0.1. INP is the hardest 2026 target.
- Marketing-only pages: convert anchor sections (`#features`, `#pricing`, `#how-it-works`) on the landing page into routed pages (`/funktioner`, `/priser`, `/sa-fungerar-det`) so each is independently indexable and linkable.
- Decide on domain: `servera.triadsolutions.se` (subdomain) inherits some authority from the parent domain, but Google treats subdomains semi-independently. If the long-term brand is "Servera," buy `servera.se`, 301 from the subdomain. Clean Swedish ccTLD outranks subdomain.

### 2.8 Backlink strategy

Easy first wins:
- Swedish business directories (DR 70+): allabolag.se, bolagsfakta.se, hitta.se, eniro.se.
- SaaS comparison platforms: Capterra, G2, GetApp, SoftwareSuggest, SourceForge.
- Product Hunt launch — Nordic SaaS get strong PH momentum.
- Sweden startup directories: SUP46, Epicenter, Startups.se.

Industry-specific:
- **Visita** (Swedish hospitality association, ~5,000 members) — sponsorship + partner-page link.
- **SHR** (Swedish Hotel & Restaurant Association).
- Foodmarketing.se, Måltidsmagasinet, Restauratören, Hotellrevyn — guest posts and case studies.
- Gastrogate, BokaBord, TheFork Sweden, White Guide — partner directory listings.
- Swedish menu aggregators (Kvartersmenyn.se, Sverige-meny.se) — pitch a feed integration.

Tech press: Breakit, Di Digital, Computer Sweden, Voister, IDG.se.

Integration partner directories (the goldmine): Caspeco, Trivec, Stripe, Klarna, Mailchimp, Klaviyo, Wix, Squarespace partner pages each provide followed links from high-DR domains.

### 2.9 AI / LLM search (GEO) — increasingly critical

ChatGPT carries ~70 % of AI-search usage. AI/Google citation overlap dropped from 70 % to <20 % of cited sources — a dedicated GEO track is required.

Tactics:
1. **`/llms.txt`** — already shipped at [public/llms.txt](public/llms.txt). Markdown index for ChatGPT/Perplexity discovery.
2. **Definition-first openings** — every page's first 150 tokens should answer the page's core question in plain Swedish.
3. **Fact density** — replace "QR menus save money" with "Restauranger som migrerar från tryckt till digital meny sparar i snitt 8 200 kr/år (Servera benchmark, 2026, n=140)". Concrete numbers + sourcing → 30–40 % visibility lift in LLMs.
4. **Allow AI crawlers** — already set in robots.ts.
5. **Reddit + LinkedIn presence** — most-cited domains across ChatGPT/Perplexity/Google AI Mode. Build presence in r/restaurateur, r/sweden, plus regular LinkedIn industry posts under a real founder profile.
6. **Brand consistency** — same NAP (name/address/phone), tagline, numbers across site, GBP, LinkedIn, Crunchbase, Trustpilot. LLMs deweight conflicting sources.
7. **Schema FAQ on every page** — top-5 predictive feature for AI citation.
8. **Track Share of Model** — manually prompt the top 4 LLMs weekly with `bästa qr meny för restauranger i Sverige` and log mentions. Tools: Otterly.ai, Profound, LLMrefs.

### 2.10 Sweden-specific signals

- **Google market share Sweden ~93 %, Bing ~5 %.** Optimize primarily for Google but submit Bing Webmaster Tools and IndexNow.
- **Domain choice:** see §2.7 — buy `servera.se` if brand allows.
- **Bolagsverket / allabolag.se:** fill the Triad Solutions company entry — cited in Knowledge Panels and trusted by LLMs.
- **Reviews:** Trustpilot.se (verified-invite flow only), Reco.se (lower priority), Capterra/G2 for international comparison.
- **Language:** default UI is `sv-SE`. Hreflang `sv` / `en` cluster when English content exists.
- **Currency / numbers:** always SEK with `kr` suffix and Swedish thousand separator (`8 200 kr`, not `8,200kr`).

### 2.11 Local SEO + Google Business Profile

For Triad Solutions itself: one GBP, primary category "Software company," secondary "Marketing agency" or "Consultant." Address = registered Swedish HQ. Post 2× weekly (cadence is now a ranking signal). Wire customer reviews → cross-post.

**Bigger opportunity — sell GBP-sync as a Servera feature.** Build a one-click integration where Servera pushes the customer restaurant's menu URL, hours, and photos to their Google Business Profile via the Google My Business API. This:
- Becomes a marketing wedge ("Get listed on Google in 60 seconds").
- Generates inbound links from each restaurant's GBP back to their Servera-hosted menu page (huge for tenant-page indexation).
- Cleans GBP data, which Google Gemini increasingly leans on for conversational restaurant queries ("Vegan-friendly restaurants near me").

---

## 3. 90-day implementation roadmap

### Weeks 1–2 — Tech foundation (mostly done in this branch)

- [x] robots.ts, sitemap.ts, llms.txt
- [x] Root metadata (OG, Twitter, canonical, hreflang scaffolding)
- [x] Organization, SoftwareApplication, WebSite, FAQ JSON-LD
- [x] Restaurant + Menu + Breadcrumb JSON-LD on tenant pages
- [x] next/font for Inter + Playfair
- [x] ISR on menu pages
- [ ] Replace remaining `<img>` with `next/image` (apart from cart)
- [ ] Submit sitemap to Google Search Console + Bing Webmaster Tools — manual one-time step.
- [ ] Verify domain ownership in GSC/BWT.
- [ ] Create real OG image (1200×630 PNG) at `public/og.png` and reference in metadata. The current `/logo.svg` fallback won't render in most social previews.

### Weeks 2–4 — Marketing pages + schema depth

- [ ] Split landing page into routed pages: `/funktioner`, `/priser`, `/sa-fungerar-det`, `/om-oss`, `/kontakt`. Each gets unique metadata, FAQ, and JSON-LD. Keep landing page as the synthesis.
- [ ] Add `Product` schema on `/priser` for each plan with SEK price.
- [ ] Add a real `/jamfor/servera-vs-meny-qr`, `/jamfor/servera-vs-qopla`, `/jamfor/servera-vs-weiq` page — these convert hardest of any organic traffic.
- [ ] Build pillar 1 ("Digital meny — kompletta guiden") + 5 cluster posts.
- [ ] Add an English variant at `/en` for export-market keywords. Hreflang cluster.

### Weeks 4–6 — Programmatic SEO

- [ ] City pages: `/digital-meny/[stockholm|goteborg|malmo|uppsala|linkoping|vasteras|orebro|helsingborg]`. Each ≥300 unique words, local restaurant count from SCB or Bolagsverket, named local customers if any, distinct FAQ, local CTA. ([Averi 2026 playbook](https://www.averi.ai/blog/programmatic-seo-for-b2b-saas-startups-the-complete-2026-playbook))
- [ ] Restaurant-type pages: `/digital-meny/pizzeria`, `/qr-meny/sushi`, `/digital-meny/cafe`, `/digital-meny/bar`, `/digital-meny/foodtruck`, `/digital-meny/lunchstalle`. Each with cuisine-specific copy and a sample menu.
- [ ] Mall (template) pages: `/mallar/sushi-meny`, `/mallar/pizzeria-meny`, `/mallar/lunchmeny` — with downloadable PDF artifacts for link bait.

### Weeks 6–8 — Public menu indexation

- [ ] Add `is_indexable_by_search_engines` boolean to `restaurants` table.
- [ ] Auto-flip the flag when a restaurant hits ≥10 menu items, has an address, and at least one item image. Manual override available in admin settings.
- [ ] Update menu page to honor the flag: emit `robots: { index: false, follow: true }` when the flag is off.
- [ ] Add a separate `app/sitemap-menus.ts` that generates only indexable restaurants, chunked via `generateSitemaps()`.
- [ ] Add an on-demand revalidation endpoint (`POST /api/internal/revalidate`) called from a Supabase Edge Function whenever a menu_item is created/updated/deleted, calling `revalidateTag('menu:'+restaurantId)`.

### Weeks 8–12 — Off-page + product-led SEO loops

- [ ] Submit Servera to all relevant directories (allabolag.se, hitta.se, Capterra, G2, GetApp, Product Hunt, Visita member listing).
- [ ] Create Triad Solutions Google Business Profile.
- [ ] Pitch 3 trade-press case studies (Måltidsmagasinet, Restauratören, Breakit).
- [ ] Build the GBP-sync feature (§2.11). Massive moat + backlink loop.
- [ ] Ship a "Powered by Servera" attribution badge on every public menu page (subtle footer link). Optional toggle for paid plans.
- [ ] Launch original research: "State of Swedish Restaurant Tech 2026."

---

## 4. Ongoing levers (months 4–12)

| Lever | Cadence | Owner |
|---|---|---|
| New blog post in active topic cluster | weekly | content |
| New comparison or alternative-to page | bi-weekly | content + product |
| Refresh existing pages with new data, new FAQs | monthly | content |
| Track Share of Model in top 4 LLMs (manual prompts) | weekly | growth |
| Audit Core Web Vitals (LCP/INP/CLS) | monthly | engineering |
| Submit case studies to Swedish trade press | monthly | growth |
| Refresh GBP posts | 2× per week | growth |
| Programmatic page coverage check (any thin/duplicates?) | monthly | engineering + content |

---

## 5. Measurement

KPIs to track from week 1:

- **Indexed page count** (Google Search Console: Pages → Indexed)
- **Impressions and clicks per query cluster** (GSC: Performance, filtered by cluster regex)
- **Average position for primary keywords**: `digital meny restaurang`, `qr meny`, `qr meny pris`, `digital meny pris`, `[city] digital meny`
- **Comparison-page CVR**: clicks → demo bookings on `/jamfor/*`
- **Tenant menu pages indexed** vs total opted-in
- **Backlinks** (Ahrefs/Semrush): referring domains, DR-30+ count
- **Share of Model in LLMs**: weekly mention count for `bästa qr meny Sverige`, `digital meny restaurang`, `Servera`
- **Core Web Vitals** (PageSpeed Insights / Search Console): pass-rate on LCP, INP, CLS

Baseline now (week 1) — most of these are at zero. By day 90 the realistic targets are:

- 80–150 marketing pages indexed
- 200+ tenant menu pages indexed (depends on customer count)
- 5–10 ranking keywords in positions 1–10
- 30+ referring domains
- LLM mentions on at least 2 of 4 platforms

---

## 6. Open decisions for the founder

1. **Domain.** Stay on `servera.triadsolutions.se` (cheap, status quo) or buy `servera.se` and 301 (better long-term, ~150 SEK/year, mild migration risk). Recommendation: buy `servera.se`.
2. **Public menu indexation.** Default-on or default-off? Recommendation: opt-in by quality threshold (§2.4).
3. **English variant.** Ship `/en` now or wait until Swedish content is mature? Recommendation: ship a thin English variant of the homepage + comparison pages now (helps Nordic export + LLM citations); defer cluster content to month 4.
4. **Original research budget.** "State of Swedish Restaurant Tech 2026" needs a 200-restaurant survey ($3–5k for a panel + design). Recommendation: do it in month 3 — single biggest backlink generator available.
5. **GBP-sync feature priority.** Engineering effort ~2 weeks for a v1. Recommendation: prioritize after the comparison + city pages are live, because each restaurant's GBP becomes a backlink to their Servera menu — the loop only matters once those pages exist.
