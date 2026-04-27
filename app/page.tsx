"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import ScrollStory from "@/components/ScrollStory"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
    { label: "Så fungerar det", href: "#how-it-works" },
    { label: "Priser", href: "#pricing" },
    { label: "Kontakt", href: "#contact" },
  ]

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-stone-50/80 backdrop-blur-md border-b border-stone-200/80"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-stone-950 flex items-center justify-center shrink-0">
            <UtensilsCrossed className="h-4 w-4 text-amber-400" />
          </div>
          <span className="font-serif text-xl text-stone-950 font-bold tracking-tight">
            Servera
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-stone-600 hover:text-stone-950 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 bg-stone-950 text-white text-sm font-semibold rounded-full hover:bg-stone-800 transition-colors"
        >
          Boka demo <ChevronRight className="h-3.5 w-3.5" />
        </a>

        <button
          className="md:hidden text-stone-950"
          onClick={() => setOpen(!open)}
          aria-label="Växla meny"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-stone-50 border-b border-stone-200 px-4 pb-5 pt-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-stone-700 hover:text-amber-600 transition-colors text-sm font-medium"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-3 block text-center px-4 py-2.5 bg-stone-950 text-white text-sm font-semibold rounded-full"
          >
            Boka demo
          </a>
        </div>
      )}
    </header>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-stone-50 overflow-hidden pt-16">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #1c1917 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[560px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-200 rounded-full text-stone-700 text-xs font-medium mb-8 shadow-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
          </span>
          QR-beställning för moderna restauranger
        </div>

        <h1 className="font-serif text-[2.75rem] sm:text-6xl lg:text-7xl xl:text-8xl text-stone-950 font-bold leading-[0.95] tracking-tight mb-6">
          Menyn i fickan.
          <br />
          <span className="italic text-amber-500 font-semibold">Köket</span> i
          realtid.
        </h1>

        <p className="text-stone-600 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
          Gästen skannar en QR-kod och beställer från sin mobil. Beställningen
          går direkt till kökets skärm — inga skrivare, inget ropande, inga
          förseningar.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <a
            href="#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-stone-950 text-white font-semibold rounded-full hover:bg-stone-800 transition-colors text-sm"
          >
            Boka en demo <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white border border-stone-200 text-stone-950 font-semibold rounded-full hover:border-stone-300 transition-colors text-sm shadow-sm"
          >
            Se hur det fungerar
          </a>
        </div>

        {/* Scroll cue */}
        <div className="mt-14 sm:mt-20 lg:mt-24 flex flex-col items-center gap-3 text-stone-400">
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">
            Scrolla
          </span>
          <div className="relative w-px h-12 bg-stone-200 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-amber-500 to-transparent animate-[scrollcue_1.8s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scrollcue {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
      `}</style>
    </section>
  )
}

// ─── Stats ───────────────────────────────────────────────────────────────────

function Stats() {
  const items = [
    { icon: Zap, stat: "50ms", label: "Till köket" },
    { icon: Smartphone, stat: "0", label: "Appar att ladda ner" },
    { icon: Clock, stat: "<1 dag", label: "Att komma igång" },
    { icon: Store, stat: "∞", label: "Restauranger i en panel" },
  ]

  return (
    <section className="relative bg-stone-950 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map(({ icon: Icon, stat, label }) => (
          <div key={label} className="flex flex-col gap-2">
            <Icon className="h-4 w-4 text-amber-400" />
            <div className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight">
              {stat}
            </div>
            <div className="text-stone-400 text-sm">{label}</div>
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
      desc: "Gästerna skannar, bläddrar och beställer utan att vänta. Ingen app, bara en kamera.",
    },
    {
      icon: MonitorCheck,
      title: "Liveskärm för köket",
      desc: "Beställningar strömmar till köket i realtid. Inga pappersbiljetter, inga missförstånd.",
    },
    {
      icon: BellRing,
      title: "Servitörsnotiser",
      desc: "Bord kan larma personalen för hjälp, betalning eller påfyllning. Inget faller mellan stolarna.",
    },
    {
      icon: LayoutGrid,
      title: "Menyhantering",
      desc: "Uppdatera rätter, priser och tillgänglighet från adminpanelen — ingen utvecklare behövs.",
    },
    {
      icon: Globe,
      title: "Flera restauranger",
      desc: "En plattform för alla dina restauranger. Varje med egen profil, personal och statistik.",
    },
    {
      icon: BarChart3,
      title: "Menyintelligens",
      desc: "Stars/Plowhorses-matris, per-rätt statistik, heta timmar och attach-analys — bestäm med data, inte magkänsla.",
      badge: "Unikt",
    },
  ]

  return (
    <section id="features" className="bg-stone-50 py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-stone-200 rounded-full text-stone-700 text-[10px] font-bold uppercase tracking-widest mb-5 shadow-sm">
            Funktioner
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl text-stone-950 font-bold tracking-tight leading-[1.05] mb-4">
            Enkelt för er. <span className="italic text-amber-500">Smidigt för gästen.</span>
          </h2>
          <p className="text-stone-600 text-lg leading-relaxed">
            Från köket till gästsalen — varje del av matupplevelsen är täckt.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon
            const badge = "badge" in f ? (f as { badge?: string }).badge : undefined
            return (
              <div
                key={f.title}
                className="relative group bg-white border border-stone-200 rounded-2xl p-6 hover:border-stone-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                {badge && (
                  <span className="absolute top-4 right-4 text-[9px] font-bold tracking-wider uppercase bg-amber-500 text-stone-950 px-1.5 py-0.5 rounded">
                    {badge}
                  </span>
                )}
                <div className="w-10 h-10 rounded-xl bg-stone-950 flex items-center justify-center mb-5 group-hover:bg-amber-500 transition-colors">
                  <Icon className="h-5 w-5 text-amber-400 group-hover:text-stone-950 transition-colors" />
                </div>
                <h3 className="text-stone-950 font-semibold text-base mb-2">
                  {f.title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Intelligence block — product differentiator ────────────────────────────

function Intelligence() {
  const points = [
    { title: "Menu engineering-matris", desc: "Klassisk Stars / Plowhorses / Puzzles / Dogs — ingen konkurrent har det inbyggt." },
    { title: "Per-rätt insikter", desc: "Enheter sålda, intäkter, marginal, andel av beställningar och vanliga kombinationer." },
    { title: "Smarta förslag", desc: "Systemet pekar ut priskandidater, dolda pärlor och döda timmar med lämpliga åtgärder." },
    { title: "Värme-kartor", desc: "Se beställningsmönster per veckodag × timme — optimera bemanning och happy hours." },
  ]
  return (
    <section className="bg-white py-24 sm:py-32 border-y border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-[10px] font-bold uppercase tracking-widest mb-5">
            <BarChart3 className="h-3 w-3" /> Nytt — Menyintelligens
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl text-stone-950 font-bold tracking-tight leading-[1.05] mb-5">
            Varje rätt får en <span className="italic text-amber-500">betygsruta</span>.
          </h2>
          <p className="text-stone-600 text-lg leading-relaxed mb-8">
            Medan andra plattformar nöjer sig med total försäljning, analyserar vi varje rätt som en produkt —
            popularitet mot marginal, timing mot attach-rate. Resultatet: veta <em>exakt</em> vad du ska ta bort,
            höja priset på eller framhäva.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {points.map((p) => (
              <div key={p.title}>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-amber-500" />
                  <h3 className="font-semibold text-stone-950 text-sm">{p.title}</h3>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed pl-6">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mock matrix preview */}
        <div className="relative">
          <div className="absolute -inset-4 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
          <div className="relative bg-stone-50 border border-stone-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Menyanalys</p>
                <p className="font-serif text-lg text-stone-950 font-bold">Popularitet × Marginal</p>
              </div>
              <div className="flex gap-2 text-[10px] font-medium">
                <span className="px-2 py-0.5 rounded bg-green-100 text-green-700">Stars: 4</span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700">Plow: 3</span>
              </div>
            </div>
            <svg viewBox="0 0 300 240" className="w-full h-auto">
              <rect x="20" y="10" width="130" height="110" fill="#2563eb" fillOpacity="0.06" />
              <rect x="150" y="10" width="130" height="110" fill="#16a34a" fillOpacity="0.06" />
              <rect x="20" y="120" width="130" height="110" fill="#dc2626" fillOpacity="0.06" />
              <rect x="150" y="120" width="130" height="110" fill="#d97706" fillOpacity="0.06" />
              <line x1="150" y1="10" x2="150" y2="230" stroke="#d6d3d1" strokeDasharray="3 3" />
              <line x1="20" y1="120" x2="280" y2="120" stroke="#d6d3d1" strokeDasharray="3 3" />
              <text x="26" y="26" fontSize="9" fontWeight="600" fill="#2563eb">PUZZLE</text>
              <text x="274" y="26" fontSize="9" fontWeight="600" fill="#16a34a" textAnchor="end">STAR</text>
              <text x="26" y="222" fontSize="9" fontWeight="600" fill="#dc2626">DOG</text>
              <text x="274" y="222" fontSize="9" fontWeight="600" fill="#d97706" textAnchor="end">PLOWHORSE</text>
              {/* Stars */}
              <circle cx="210" cy="35" r="6" fill="#16a34a" stroke="white" strokeWidth="2" />
              <circle cx="240" cy="60" r="6" fill="#16a34a" stroke="white" strokeWidth="2" />
              <circle cx="185" cy="80" r="6" fill="#16a34a" stroke="white" strokeWidth="2" />
              <circle cx="260" cy="95" r="6" fill="#16a34a" stroke="white" strokeWidth="2" />
              {/* Plowhorses */}
              <circle cx="220" cy="160" r="6" fill="#d97706" stroke="white" strokeWidth="2" />
              <circle cx="200" cy="180" r="6" fill="#d97706" stroke="white" strokeWidth="2" />
              <circle cx="250" cy="175" r="6" fill="#d97706" stroke="white" strokeWidth="2" />
              {/* Puzzles */}
              <circle cx="70" cy="50" r="6" fill="#2563eb" stroke="white" strokeWidth="2" />
              <circle cx="110" cy="80" r="6" fill="#2563eb" stroke="white" strokeWidth="2" />
              {/* Dogs */}
              <circle cx="50" cy="190" r="6" fill="#dc2626" stroke="white" strokeWidth="2" />
              <circle cx="90" cy="170" r="6" fill="#dc2626" stroke="white" strokeWidth="2" />
            </svg>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-4 pt-4 border-t border-stone-200 text-[11px]">
              <div className="flex items-start gap-1.5">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                <p className="text-stone-600 leading-snug"><span className="font-semibold text-stone-950">Puzzle</span> — bra marginal, säljer dåligt. Marknadsför.</p>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="mt-1 h-2 w-2 rounded-full bg-green-600 shrink-0" />
                <p className="text-stone-600 leading-snug"><span className="font-semibold text-stone-950">Star</span> — säljer bra, hög marginal. Lyft fram.</p>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="mt-1 h-2 w-2 rounded-full bg-red-600 shrink-0" />
                <p className="text-stone-600 leading-snug"><span className="font-semibold text-stone-950">Dog</span> — låg på båda. Överväg att ta bort.</p>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-600 shrink-0" />
                <p className="text-stone-600 leading-snug"><span className="font-semibold text-stone-950">Plowhorse</span> — populär men låg marginal. Höj pris.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

function Pricing() {
  const tiers = [
    {
      name: "Start",
      price: "549",
      period: "kr/mån",
      desc: "Perfekt för restauranger med ett ställe.",
      features: [
        "1 restaurang",
        "Upp till 20 bord",
        "QR-beställning",
        "Kökets skärm",
        "E-postsupport",
      ],
      highlight: false,
    },
    {
      name: "Tillväxt",
      price: "999",
      period: "kr/mån",
      desc: "För växande restauranger med fler platser.",
      features: [
        "1 restaurang",
        "Obegränsat antal bord",
        "Allt i Start",
        "Avancerad statistik",
        "Prioriterad support",
      ],
      highlight: true,
    },
    {
      name: "Företag",
      price: "Offert",
      period: "",
      desc: "För kedjor och grupper som behöver mer.",
      features: [
        "Obegränsat antal restauranger",
        "White-label",
        "Anpassade integrationer",
        "Dedikerad support",
        "SLA-garanti",
      ],
      highlight: false,
    },
  ]

  return (
    <section id="pricing" className="bg-white py-24 sm:py-32 border-y border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-50 border border-stone-200 rounded-full text-stone-700 text-[10px] font-bold uppercase tracking-widest mb-5">
            Priser
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl text-stone-950 font-bold tracking-tight leading-[1.05] mb-4">
            Enkla, ärliga priser.
          </h2>
          <p className="text-stone-600 text-lg leading-relaxed">
            Inga dolda avgifter. Inga provisioner per beställning. En fast
            månadskostnad — behåll varje krona du tjänar.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {tiers.map(({ name, price, period, desc, features, highlight }) => (
            <div
              key={name}
              className={`relative rounded-3xl p-7 flex flex-col transition-all ${
                highlight
                  ? "bg-stone-950 text-white lg:scale-[1.04] shadow-2xl shadow-stone-950/20"
                  : "bg-stone-50 border border-stone-200"
              }`}
            >
              {highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-stone-950 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Mest populär
                </div>
              )}
              <div className="mb-6">
                <div
                  className={`text-xs font-bold uppercase tracking-widest mb-3 ${
                    highlight ? "text-amber-400" : "text-stone-500"
                  }`}
                >
                  {name}
                </div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span
                    className={`font-serif text-5xl font-bold ${
                      highlight ? "text-white" : "text-stone-950"
                    }`}
                  >
                    {price}
                  </span>
                  {period && (
                    <span
                      className={`text-sm ${
                        highlight ? "text-stone-400" : "text-stone-500"
                      }`}
                    >
                      {period}
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm ${
                    highlight ? "text-stone-300" : "text-stone-600"
                  }`}
                >
                  {desc}
                </p>
              </div>

              <ul className="space-y-2.5 mb-7 flex-1">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className={`h-4 w-4 shrink-0 mt-0.5 ${
                        highlight ? "text-amber-400" : "text-amber-500"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        highlight ? "text-stone-200" : "text-stone-700"
                      }`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`block text-center py-3 rounded-full font-semibold text-sm transition-colors ${
                  highlight
                    ? "bg-amber-500 text-stone-950 hover:bg-amber-400"
                    : "bg-stone-950 text-white hover:bg-stone-800"
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
    <section id="contact" className="bg-stone-50 py-24 sm:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-stone-200 rounded-full text-stone-700 text-[10px] font-bold uppercase tracking-widest mb-5 shadow-sm">
            Kontakt
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl text-stone-950 font-bold tracking-tight leading-[1.05] mb-4">
            Redo att <span className="italic text-amber-500">uppgradera</span>?
          </h2>
          <p className="text-stone-600 text-lg leading-relaxed">
            Berätta lite om din restaurang så hör vi av oss.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white border border-stone-200 rounded-3xl p-7 shadow-sm">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 gap-4">
                <div className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-serif text-2xl text-stone-950 font-bold">
                  Meddelande skickat!
                </h3>
                <p className="text-stone-600 max-w-xs">
                  Tack för att du hörde av dig. Vi återkommer så snart vi kan.
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
                  className="text-amber-600 text-sm hover:underline font-medium"
                >
                  Skicka ett nytt meddelande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    label="Namn *"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Anna Lindqvist"
                    required
                  />
                  <Field
                    label="Restaurang *"
                    name="restaurant"
                    value={form.restaurant}
                    onChange={handleChange}
                    placeholder="Bella Cucina"
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    label="E-post *"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="anna@restaurang.se"
                    required
                  />
                  <Field
                    label="Telefon"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+46 70 000 00 00"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 text-xs font-semibold mb-1.5">
                    Meddelande
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Antal bord, platser, specifika behov..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-stone-950 text-sm placeholder-stone-400 focus:outline-none focus:border-stone-950 focus:bg-white transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-stone-950 text-white font-semibold rounded-full hover:bg-stone-800 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  Skicka meddelande <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-stone-950 rounded-3xl p-6 text-white">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center mb-4">
                <Mail className="h-5 w-5 text-stone-950" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-1">Skriv till oss</h3>
              <a
                href="mailto:kontakt@triadsolutions.se"
                className="text-amber-400 text-sm hover:underline"
              >
                kontakt@triadsolutions.se
              </a>
            </div>
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-stone-950 font-semibold mb-3">
                Vad händer sedan?
              </h3>
              <ul className="space-y-2.5">
                {[
                  "15 min introduktionssamtal",
                  "Live-demo av din digitala meny",
                  "Anpassat prisförslag",
                  "Lansering redan samma dag",
                ].map((item, i) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-stone-700"
                  >
                    <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-stone-950 text-amber-400 flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </span>
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

function Field({
  label,
  ...props
}: {
  label: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-stone-700 text-xs font-semibold mb-1.5">
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-stone-950 text-sm placeholder-stone-400 focus:outline-none focus:border-stone-950 focus:bg-white transition-colors"
      />
    </div>
  )
}

// ─── Privacy policy dialog ──────────────────────────────────────────────────

function PrivacyPolicyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-stone-400 text-sm hover:text-amber-400 transition-colors text-left"
        >
          Integritetspolicy
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col bg-white text-stone-800">
        <DialogHeader className="text-left">
          <DialogTitle className="text-stone-950">Integritetspolicy</DialogTitle>
          <p className="text-xs text-stone-500 mt-1">
            Senast uppdaterad: 27 april 2026
          </p>
        </DialogHeader>

        <div className="overflow-y-auto pr-2 -mr-2 space-y-5 text-sm leading-relaxed text-stone-700">
          <p>
            Triad Solutions AB (&quot;Servera&quot;, &quot;vi&quot;, &quot;oss&quot;) värnar om din
            integritet. Den här policyn beskriver vilka personuppgifter vi
            behandlar, varför vi behandlar dem och vilka rättigheter du har
            enligt EU:s dataskyddsförordning (GDPR).
          </p>

          <section className="space-y-1.5">
            <h3 className="font-semibold text-stone-950">1. Personuppgiftsansvarig</h3>
            <p>
              Triad Solutions AB är personuppgiftsansvarig för behandlingen av
              dina personuppgifter. Kontakta oss på{" "}
              <a
                href="mailto:kontakt@triadsolutions.se"
                className="text-amber-600 hover:underline"
              >
                kontakt@triadsolutions.se
              </a>{" "}
              vid frågor.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-semibold text-stone-950">2. Vilka uppgifter vi samlar in</h3>
            <ul className="list-disc list-outside pl-5 space-y-1">
              <li>
                <strong>Kontoinformation</strong> för restauranger: namn,
                e-postadress, telefonnummer, organisationsnummer och
                faktureringsuppgifter.
              </li>
              <li>
                <strong>Beställningsdata</strong> från gäster: vald rätt,
                kvantitet, eventuella tillval, bordsnummer och tidpunkt. Inga
                namn eller kontaktuppgifter krävs av gästen.
              </li>
              <li>
                <strong>Betalningsdata</strong> behandlas av vår
                betalningsleverantör. Vi lagrar aldrig kortuppgifter.
              </li>
              <li>
                <strong>Teknisk information</strong>: IP-adress, enhetstyp,
                webbläsare och cookies för säkerhet, drift och analys.
              </li>
              <li>
                <strong>Supportkommunikation</strong>: meddelanden du skickar
                till oss via formulär eller e-post.
              </li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-semibold text-stone-950">3. Ändamål och rättslig grund</h3>
            <ul className="list-disc list-outside pl-5 space-y-1">
              <li>
                Tillhandahålla tjänsten (avtal, art. 6.1 b GDPR).
              </li>
              <li>
                Fakturering och bokföring (rättslig förpliktelse, art. 6.1 c).
              </li>
              <li>
                Säkerhet, bedrägeribekämpning och driftsstabilitet (berättigat
                intresse, art. 6.1 f).
              </li>
              <li>
                Produktförbättring och statistik på aggregerad nivå (berättigat
                intresse, art. 6.1 f).
              </li>
              <li>
                Marknadsföring sker enbart efter ditt samtycke (art. 6.1 a).
              </li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-semibold text-stone-950">4. Hur länge vi sparar uppgifter</h3>
            <p>
              Beställningsdata sparas i upp till 24 månader för analys och
              support. Bokföringsmaterial sparas i 7 år enligt bokföringslagen.
              Kontouppgifter raderas inom 90 dagar efter att avtalet upphört,
              om inget annat krävs enligt lag.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-semibold text-stone-950">5. Mottagare och underbiträden</h3>
            <p>
              Vi delar uppgifter endast med betrodda underbiträden som behövs
              för att leverera tjänsten — bland annat hosting (Vercel),
              databas (Supabase) samt betalningsleverantör. Samtliga är bundna
              av personuppgiftsbiträdesavtal. Vi säljer aldrig dina uppgifter.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-semibold text-stone-950">6. Överföringar utanför EU/EES</h3>
            <p>
              Vissa underbiträden kan behandla uppgifter utanför EU/EES. När så
              sker säkerställer vi skyddet genom EU-kommissionens
              standardavtalsklausuler eller motsvarande lagliga
              överföringsmekanism.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-semibold text-stone-950">7. Cookies</h3>
            <p>
              Vi använder nödvändiga cookies för inloggning och säkerhet samt
              valfria cookies för analys. Du kan när som helst återkalla ditt
              samtycke till valfria cookies via inställningarna i din
              webbläsare.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-semibold text-stone-950">8. Dina rättigheter</h3>
            <p>Enligt GDPR har du rätt att:</p>
            <ul className="list-disc list-outside pl-5 space-y-1">
              <li>begära ett registerutdrag över dina personuppgifter,</li>
              <li>begära rättelse av felaktiga uppgifter,</li>
              <li>begära radering eller begränsning av behandlingen,</li>
              <li>invända mot behandling som sker med stöd av berättigat intresse,</li>
              <li>begära dataportabilitet, samt</li>
              <li>återkalla ett tidigare lämnat samtycke.</li>
            </ul>
            <p>
              Skicka begäran till{" "}
              <a
                href="mailto:kontakt@triadsolutions.se"
                className="text-amber-600 hover:underline"
              >
                kontakt@triadsolutions.se
              </a>
              . Du har även rätt att lämna klagomål till
              Integritetsskyddsmyndigheten (IMY).
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-semibold text-stone-950">9. Säkerhet</h3>
            <p>
              Vi använder kryptering i transit (TLS) och i vila, åtkomstkontroll,
              loggning och regelbundna säkerhetsgenomgångar för att skydda dina
              uppgifter.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-semibold text-stone-950">10. Ändringar</h3>
            <p>
              Vi kan komma att uppdatera den här policyn. Vid väsentliga
              förändringar informerar vi via tjänsten eller e-post. Den senaste
              versionen finns alltid tillgänglig här.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
                <UtensilsCrossed className="h-4 w-4 text-stone-950" />
              </div>
              <span className="font-serif text-xl text-white font-bold tracking-tight">
                Servera
              </span>
            </div>
            <p className="text-stone-400 text-sm max-w-xs leading-relaxed">
              QR-beställning för moderna restauranger. Ingen app, ingen
              friktion — bara en fantastisk matupplevelse.
            </p>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">
              Produkt
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Funktioner", href: "#features" },
                { label: "Priser", href: "#pricing" },
                { label: "Kontakt", href: "#contact" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-stone-400 text-sm hover:text-amber-400 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">
              Juridiskt
            </h4>
            <ul className="space-y-2.5">
              <li>
                <PrivacyPolicyDialog />
              </li>
              <li>
                <a
                  href="mailto:kontakt@triadsolutions.se"
                  className="text-stone-400 text-sm hover:text-amber-400 transition-colors"
                >
                  kontakt@triadsolutions.se
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-6 text-xs text-stone-500">
          © 2026 Servera. Alla rättigheter förbehållna.
        </div>
      </div>
    </footer>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div
      className="font-sans antialiased bg-stone-50"
      style={{ scrollBehavior: "smooth" }}
    >
      <Nav />
      <Hero />
      <ScrollStory />
      <Stats />
      <Features />
      <Intelligence />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  )
}
