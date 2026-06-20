import type { Metadata } from "next"
import { DemoMenuClient } from "./demo-menu-client"

export const metadata: Metadata = {
  title: "Demo — Se hur Servera fungerar",
  description:
    "Prova Servera gratis. Se hur din digitala meny ser ut för gästerna — bläddra, lägg till rätter och upplev hela beställningsflödet utan att skapa ett konto.",
  robots: { index: true, follow: true },
}

export default function DemoPage() {
  return <DemoMenuClient />
}
