export type GuideBlock =
  | { t: "p"; text: string }
  | { t: "h2"; id: string; text: string }
  | { t: "h3"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "callout"; title?: string; text: string }

export interface GuideFaqItem {
  question: string
  answer: string
}

export interface GuideSource {
  label: string
  href: string
}

export interface Guide {
  slug: string
  /** H1 on the page */
  title: string
  /** <title> — keep under ~60 chars */
  metaTitle: string
  description: string
  datePublished: string
  dateModified: string
  readingMinutes: number
  /** Short label shown on cards, e.g. "Grundguide" */
  category: string
  /** Definition-first intro paragraph(s), rendered before the TL;DR */
  intro: string[]
  tldr: string[]
  blocks: GuideBlock[]
  faq: GuideFaqItem[]
  sources: GuideSource[]
}
