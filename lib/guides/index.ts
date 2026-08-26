import type { Guide } from "./types"
import { guide as komplettaGuiden } from "./digital-meny-kompletta-guiden"
import { guide as hurSkaparMan } from "./hur-skapar-man-digital-meny"
import { guide as vsTryckt } from "./digital-meny-vs-tryckt"
import { guide as vadKostar } from "./vad-kostar-digital-meny"
import { guide as bytaFranExcel } from "./byta-fran-excel-pdf-meny"
import { guide as flersprakig } from "./flersprakig-meny"

export type { Guide, GuideBlock, GuideFaqItem, GuideSource } from "./types"

/** Ordered as shown on /guider — pillar first. */
export const GUIDES: Guide[] = [
  komplettaGuiden,
  hurSkaparMan,
  vsTryckt,
  vadKostar,
  bytaFranExcel,
  flersprakig,
]

export const GUIDE_SLUGS = GUIDES.map((g) => g.slug)

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug)
}
