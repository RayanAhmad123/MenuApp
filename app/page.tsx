"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import OrderFlowAnimation from "@/components/OrderFlowAnimation"
import {
  UtensilsCrossed,
  QrCode,
  MonitorCheck,
  BellRing,
  LayoutGrid,
  Globe,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Mail,
  ArrowRight,
  Zap,
  Smartphone,
  Clock,
  Store,
  Menu,
  X,
} from "lucide-react"

// ─── Nav ────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const links = [
    { label: "Funktioner", href: "#features" },
    { label: "Så här fungerar det", href: "#how-it-works" },
    { label: "Priser", href: "#pricing" },
    { label: "Kontakt", href: "#contact" },
  ]

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
            <UtensilsCrossed className="h-4 w-4 text-stone-900" />
          </div>
          <span className="font-serif text-xl text-stone-900 font-semibold">MenuApp</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a
          href="#contact"
          className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-stone-900 text-sm font-semibold rounded-lg hover:bg-amber-400 transition-colors"
        >
          Kom igång <ChevronRight className="h-3.5 w-3.5" />
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-stone-500 hover:text-stone-900 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Växla meny"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pb-5 pt-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-stone-600 hover:text-amber-500 transition-colors text-sm font-medium"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-3 block text-center px-4 py-2.5 bg-amber-500 text-stone-900 text-sm font-semibold rounded-lg hover:bg-amber-400 transition-colors"
          >
            Kom igång
          </a>
        </div>
      )}
    </header>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-600/4 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-14 items-center">
        {/* Copy */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-xs font-medium mb-6">
            <Zap className="h-3 w-3" />
            Ingen app att ladda ned
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl xl:text-6xl text-stone-900 font-bold leading-tight mb-5">
            Gör varje bord till en{" "}
            <span className="text-amber-500">sömlös upplevelse</span>
          </h1>
          <p className="text-stone-600 text-lg leading-relaxed mb-8 max-w-xl">
            Gästerna skannar en QR-kod, bläddrar i menyn och beställer — direkt
            från sin egen telefon. Beställningarna visas på kökets skärm i
            realtid. Inga skrivare, inget ropande, inga förseningar.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 text-stone-900 font-semibold rounded-xl hover:bg-amber-400 transition-colors text-sm"
            >
              Boka en demo <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="https://menuapp-amber.vercel.app/admin/login"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-stone-100 border border-stone-200 text-stone-700 font-semibold rounded-xl hover:bg-stone-200 hover:text-stone-900 transition-colors text-sm"
            >
              Se hur det fungerar
            </Link>
          </div>
        </div>

        {/* Illustration card */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative w-72 sm:w-80">
            {/* Phone shell — keep dark, it's a phone screen */}
            <div className="rounded-[2.5rem] bg-stone-900 border-2 border-stone-700 shadow-2xl overflow-hidden">
              {/* Status bar */}
              <div className="h-8 bg-stone-800 flex items-center justify-center">
                <div className="w-24 h-4 rounded-full bg-stone-700" />
              </div>
              {/* Screen content */}
              <div className="bg-stone-950 p-5 space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <UtensilsCrossed className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="h-2.5 w-20 bg-stone-700 rounded" />
                    <div className="h-2 w-14 bg-stone-800 rounded mt-1" />
                  </div>
                </div>
                {/* QR scan indicator */}
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex flex-col items-center gap-2">
                  <QrCode className="h-12 w-12 text-amber-400" />
                  <div className="text-xs text-amber-400/80 font-medium">Bord 7 · Skanna för att beställa</div>
                </div>
                {/* Menu items */}
                {[
                  { name: "Tryffelrisotto", price: "199 kr" },
                  { name: "Burratrasallad", price: "129 kr" },
                  { name: "Lammkotletter", price: "299 kr" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between py-2 border-b border-stone-800/60 last:border-0"
                  >
                    <div>
                      <div className="h-2.5 w-28 bg-stone-600 rounded" />
                      <div className="h-2 w-16 bg-stone-800 rounded mt-1" />
                    </div>
                    <div className="text-xs font-semibold text-amber-400">{item.price}</div>
                  </div>
                ))}
                {/* CTA */}
                <div className="rounded-lg bg-amber-500 text-stone-900 text-xs font-bold text-center py-2.5">
                  Lägg till i beställning
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -right-4 top-20 bg-white border border-stone-200 rounded-xl px-3 py-2 shadow-md flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-stone-800 text-xs font-medium">Beställning mottagen</span>
            </div>
            <div className="absolute -left-6 bottom-24 bg-white border border-stone-200 rounded-xl px-3 py-2 shadow-md flex items-center gap-2">
              <MonitorCheck className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-stone-800 text-xs font-medium">Köket notifierat</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Stats ───────────────────────────────────────────────────────────────────

function Stats() {
  const items = [
    { icon: Zap, stat: "50ms", label: "Genomsnittlig leveranstid till köket" },
    { icon: Smartphone, stat: "0", label: "Appnedladdningar krävs" },
    { icon: Clock, stat: "<1 dag", label: "Genomsnittlig uppstartstid" },
    { icon: Store, stat: "Vilken telefon som helst", label: "Ingen speciell hårdvara behövs" },
  ]

  return (
    <section className="bg-amber-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map(({ icon: Icon, stat, label }) => (
          <div key={stat} className="flex flex-col items-center text-center gap-1">
            <Icon className="h-5 w-5 text-stone-900/60 mb-1" />
            <div className="font-serif text-3xl font-bold text-stone-900">{stat}</div>
            <div className="text-stone-800 text-sm">{label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Features ────────────────────────────────────────────────────────────────

function Features() {
  const features = [
    {
      icon: QrCode,
      title: "QR-beställning",
      desc: "Gästerna skannar, bläddrar och beställer utan att vänta. Ingen app behövs — bara en kamera.",
    },
    {
      icon: MonitorCheck,
      title: "Liveskärm för köket",
      desc: "Beställningar strömmar till köket i realtid. Inga pappersbiljetter, inga missförstånd.",
    },
    {
      icon: BellRing,
      title: "Servitörsnotiser",
      desc: "Bord kan larma personalen för hjälp, betalning eller påfyllning. Ingenting faller mellan stolarna.",
    },
    {
      icon: LayoutGrid,
      title: "Menyhantering",
      desc: "Uppdatera rätter, priser och tillgänglighet direkt från adminpanelen — ingen utvecklare behövs.",
    },
    {
      icon: Globe,
      title: "Flera restauranger",
      desc: "En plattform för alla dina restauranger. Varje med sin egen profil, personal och statistik.",
    },
    {
      icon: BarChart3,
      title: "Statistik & insikter",
      desc: "Följ populära rätter, rusningstider och beställningstrender för smartare menybeslut.",
    },
  ]

  return (
    <section id="features" className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-xs font-medium mb-4">
            Allt du behöver
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-bold mb-4">
            Byggt för moderna restauranger
          </h2>
          <p className="text-stone-600 max-w-xl mx-auto">
            Från köket till gästsalen — varje del av matupplevelsen är täckt.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm hover:border-amber-500/40 hover:shadow-md transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                <Icon className="h-5 w-5 text-amber-500" />
              </div>
              <h3 className="text-stone-900 font-semibold text-lg mb-2">{title}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

function Pricing() {
  const tiers = [
    {
      name: "Startpaketet",
      price: "549 kr",
      period: "/mån",
      desc: "Perfekt för restauranger med ett ställe som precis kommit igång.",
      features: [
        "1 restaurang",
        "Upp till 20 bord",
        "QR-beställning",
        "Kökets skärm",
        "Grundläggande statistik",
        "E-postsupport",
      ],
      highlight: false,
    },
    {
      name: "Tillväxtpaketet",
      price: "999 kr",
      period: "/mån",
      desc: "För växande restauranger som behöver mer kraft och fler platser.",
      features: [
        "3 restauranger",
        "Obegränsat antal bord",
        "QR-beställning",
        "Kökets skärm",
        "Avancerad statistik",
        "Prioriterad support",
      ],
      highlight: true,
    },
    {
      name: "Företagspaketet",
      price: "Offert",
      period: "",
      desc: "För kedjor och grupper som behöver full kontroll och dedikerad support.",
      features: [
        "Obegränsat antal restauranger",
        "White-label-varumärke",
        "Anpassade integrationer",
        "Dedikerad support",
        "SLA-garanti",
        "Onboardinghjälp",
      ],
      highlight: false,
    },
  ]

  return (
    <section id="pricing" className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-xs font-medium mb-4">
            Tydlig prissättning
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-bold mb-4">
            Enkla, ärliga priser
          </h2>
          <p className="text-stone-600 max-w-xl mx-auto">
            Inga dolda avgifter. Inga provisioner per beställning. Betala en fast
            månadskostnad och behåll varje krona din restaurang tjänar.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map(({ name, price, period, desc, features, highlight }) => (
            <div
              key={name}
              className={`relative rounded-2xl p-7 flex flex-col border transition-all ${
                highlight
                  ? "bg-amber-500 border-amber-400 shadow-xl shadow-amber-500/20 scale-[1.02]"
                  : "bg-white border-stone-200 shadow-sm"
              }`}
            >
              {highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white border border-amber-500/40 text-amber-500 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  Mest populär
                </div>
              )}
              <div className="mb-5">
                <div
                  className={`text-sm font-semibold mb-1 ${
                    highlight ? "text-stone-900" : "text-amber-500"
                  }`}
                >
                  {name}
                </div>
                <div className="flex items-end gap-1 mb-2">
                  <span
                    className={`font-serif text-4xl font-bold ${
                      highlight ? "text-stone-900" : "text-stone-900"
                    }`}
                  >
                    {price}
                  </span>
                  {period && (
                    <span
                      className={`text-sm mb-1.5 ${
                        highlight ? "text-stone-800" : "text-stone-500"
                      }`}
                    >
                      {period}
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm ${
                    highlight ? "text-stone-800" : "text-stone-600"
                  }`}
                >
                  {desc}
                </p>
              </div>

              <ul className="space-y-2.5 mb-7 flex-1">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2
                      className={`h-4 w-4 shrink-0 ${
                        highlight ? "text-stone-900" : "text-amber-500"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        highlight ? "text-stone-900" : "text-stone-700"
                      }`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`block text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
                  highlight
                    ? "bg-stone-900 text-amber-400 hover:bg-stone-800"
                    : "bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/20"
                }`}
              >
                Kontakta oss
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Contact ─────────────────────────────────────────────────────────────────

function Contact() {
  const [form, setForm] = useState({
    name: "",
    restaurant: "",
    email: "",
    phone: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="bg-stone-50 py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-xs font-medium mb-4">
            Hör av dig
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-bold mb-4">
            Redo att uppgradera din restaurang?
          </h2>
          <p className="text-stone-600 max-w-xl mx-auto">
            Berätta lite om din restaurang så återkommer vi inom 24 timmar för
            att boka en personlig demo.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3 bg-white border border-stone-200 rounded-2xl p-7 shadow-sm">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 gap-4">
                <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7 text-amber-500" />
                </div>
                <h3 className="font-serif text-2xl text-stone-900 font-semibold">
                  Meddelande skickat!
                </h3>
                <p className="text-stone-600 max-w-xs">
                  Tack för att du hörde av dig. Vi återkommer inom 24 timmar.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setForm({
                      name: "",
                      restaurant: "",
                      email: "",
                      phone: "",
                      message: "",
                    })
                  }}
                  className="text-amber-500 text-sm hover:underline"
                >
                  Skicka ett nytt meddelande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-600 text-xs font-medium mb-1.5">
                      Namn *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Anna Lindqvist"
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 text-xs font-medium mb-1.5">
                      Restaurangens namn *
                    </label>
                    <input
                      type="text"
                      name="restaurant"
                      required
                      value={form.restaurant}
                      onChange={handleChange}
                      placeholder="Bella Cucina"
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-600 text-xs font-medium mb-1.5">
                      E-postadress *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="anna@restaurang.se"
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 text-xs font-medium mb-1.5">
                      Telefon{" "}
                      <span className="text-stone-400">(valfritt)</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+46 70 000 00 00"
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-stone-600 text-xs font-medium mb-1.5">
                    Meddelande / Övrigt
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Berätta om din restaurang — antal bord, platser, specifika behov..."
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 text-stone-900 font-semibold rounded-xl hover:bg-amber-400 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  Skicka meddelande <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="lg:col-span-2 flex flex-col gap-6 justify-center">
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <Mail className="h-5 w-5 text-amber-500" />
              </div>
              <h3 className="text-stone-900 font-semibold mb-1">Maila oss direkt</h3>
              <a
                href="mailto:menu@hirly.app"
                className="text-amber-500 text-sm hover:underline"
              >
                menu@hirly.app
              </a>
              <p className="text-stone-500 text-xs mt-2">
                Vi svarar inom 24 timmar.
              </p>
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-5 w-5 text-amber-500" />
              </div>
              <h3 className="text-stone-900 font-semibold mb-2">Vad händer sedan?</h3>
              <ul className="space-y-2">
                {[
                  "Kort introduktionssamtal (15 min)",
                  "Live-demo av din digitala meny",
                  "Anpassat prisförslag för ditt upplägg",
                  "Lansering redan samma dag",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-stone-600">
                    <ChevronRight className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-stone-100 border-t border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
                <UtensilsCrossed className="h-4 w-4 text-stone-900" />
              </div>
              <span className="font-serif text-xl text-stone-900 font-semibold">MenuApp</span>
            </div>
            <p className="text-stone-600 text-sm max-w-xs">
              Den ledande QR-beställningsplattformen för moderna restauranger.
              Ingen app, ingen friktion — bara en fantastisk matupplevelse.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-stone-700 text-sm font-semibold mb-3">Produkt</h4>
            <ul className="space-y-2">
              {[
                { label: "Funktioner", href: "#features" },
                { label: "Priser", href: "#pricing" },
                { label: "Kontakt", href: "#contact" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-stone-600 text-sm hover:text-amber-500 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-stone-700 text-sm font-semibold mb-3">Juridiskt</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-stone-600 text-sm hover:text-amber-500 transition-colors"
                >
                  Integritetspolicy
                </a>
              </li>
              <li>
                <a
                  href="mailto:menu@hirly.app"
                  className="text-stone-600 text-sm hover:text-amber-500 transition-colors"
                >
                  menu@hirly.app
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-200 pt-6 text-center text-stone-500 text-xs">
          © 2025 MenuApp. Alla rättigheter förbehållna.
        </div>
      </div>
    </footer>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="font-sans antialiased bg-white" style={{ scrollBehavior: "smooth" }}>
      <Nav />
      <Hero />
      <OrderFlowAnimation />
      <Stats />
      <Features />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  )
}
