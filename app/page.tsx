"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
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
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ]

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-stone-950/80 backdrop-blur-md border-b border-stone-800/60 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
            <UtensilsCrossed className="h-4 w-4 text-stone-900" />
          </div>
          <span className="font-serif text-xl text-stone-50 font-semibold">MenuApp</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-stone-400 hover:text-stone-50 transition-colors"
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
          Get Started <ChevronRight className="h-3.5 w-3.5" />
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-stone-400 hover:text-stone-50 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-stone-950/95 backdrop-blur-md border-b border-stone-800/60 px-4 pb-5 pt-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-stone-300 hover:text-amber-400 transition-colors text-sm font-medium"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-3 block text-center px-4 py-2.5 bg-amber-500 text-stone-900 text-sm font-semibold rounded-lg hover:bg-amber-400 transition-colors"
          >
            Get Started
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
      {/* Background gradient */}
      <div className="absolute inset-0 bg-stone-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-14 items-center">
        {/* Copy */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-medium mb-6">
            <Zap className="h-3 w-3" />
            No app download required
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl xl:text-6xl text-stone-50 font-bold leading-tight mb-5">
            Turn Every Table Into a{" "}
            <span className="text-amber-400">Seamless Experience</span>
          </h1>
          <p className="text-stone-400 text-lg leading-relaxed mb-8 max-w-xl">
            Guests scan a QR code, browse your menu, and order — all from their
            own phone. Orders land on the kitchen display in real-time. No
            printers, no shouting, no delays.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 text-stone-900 font-semibold rounded-xl hover:bg-amber-400 transition-colors text-sm"
            >
              Request a Demo <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="https://menuapp-amber.vercel.app/admin/login"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-stone-800/60 border border-stone-700/60 text-stone-300 font-semibold rounded-xl hover:bg-stone-700/60 hover:text-stone-100 transition-colors text-sm"
            >
              See It In Action
            </Link>
          </div>
        </div>

        {/* Illustration card */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative w-72 sm:w-80">
            {/* Phone shell */}
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
                  <div className="text-xs text-amber-400/80 font-medium">Table 7 · Scan to order</div>
                </div>
                {/* Menu items */}
                {[
                  { name: "Truffle Risotto", price: "€18" },
                  { name: "Burrata Salad", price: "€12" },
                  { name: "Lamb Chops", price: "€28" },
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
                  Add to Order
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -right-4 top-20 bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 shadow-lg flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-stone-100 text-xs font-medium">Order received</span>
            </div>
            <div className="absolute -left-6 bottom-24 bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 shadow-lg flex items-center gap-2">
              <MonitorCheck className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-stone-100 text-xs font-medium">Kitchen notified</span>
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
    { icon: Zap, stat: "50ms", label: "Average order delivery to kitchen" },
    { icon: Smartphone, stat: "0", label: "App downloads required" },
    { icon: Clock, stat: "<1 day", label: "Average setup time" },
    { icon: Store, stat: "Any phone", label: "No special hardware needed" },
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
      title: "QR Ordering",
      desc: "Customers scan, browse, and order without waiting. No app download needed — just a camera.",
    },
    {
      icon: MonitorCheck,
      title: "Live Kitchen Display",
      desc: "Orders stream to the kitchen in real-time. No paper tickets, no relay mistakes.",
    },
    {
      icon: BellRing,
      title: "Waiter Alerts",
      desc: "Tables ping staff for assistance, payment, or refills. Nothing slips through.",
    },
    {
      icon: LayoutGrid,
      title: "Menu Management",
      desc: "Update items, prices, and availability instantly from the admin panel — no developer needed.",
    },
    {
      icon: Globe,
      title: "Multi-Location Ready",
      desc: "One platform for all your venues. Each with its own branding, staff, and analytics.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      desc: "Track popular items, peak hours, and order trends to make smarter menu decisions.",
    },
  ]

  return (
    <section id="features" className="bg-stone-950 py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-medium mb-4">
            Everything you need
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-50 font-bold mb-4">
            Built for Modern Restaurants
          </h2>
          <p className="text-stone-400 max-w-xl mx-auto">
            From the kitchen to the front-of-house, every part of the dining
            experience is covered.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-stone-900/60 border border-stone-800/60 rounded-2xl p-6 hover:border-amber-500/30 hover:bg-stone-900 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                <Icon className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="text-stone-50 font-semibold text-lg mb-2">{title}</h3>
              <p className="text-stone-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "We set up your digital menu",
      desc: "Send us your menu and we'll have it live in minutes — or use the admin panel to build it yourself.",
    },
    {
      n: "02",
      title: "Print QR codes for each table",
      desc: "Download print-ready QR codes from your dashboard and place them on tables, stands, or coasters.",
    },
    {
      n: "03",
      title: "Customers scan and order",
      desc: "Guests open their camera, scan the code, and place orders directly from their phone. No account needed.",
    },
    {
      n: "04",
      title: "Orders appear on the kitchen display",
      desc: "Each order lands on the KDS instantly with table number, items, and any modifications.",
    },
    {
      n: "05",
      title: "Waiters stay in the loop",
      desc: "Staff get notified when tables request attention, payment, or refills — in real-time.",
    },
  ]

  return (
    <section id="how-it-works" className="bg-stone-900/40 py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-medium mb-4">
            Simple by design
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-50 font-bold mb-4">
            Up and Running in Under a Day
          </h2>
          <p className="text-stone-400 max-w-xl mx-auto">
            No lengthy onboarding. No tech team required. Just a smarter way to
            run your restaurant floor.
          </p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute left-[2.35rem] top-8 bottom-8 w-px bg-gradient-to-b from-amber-500/40 via-amber-500/20 to-transparent" />

          <div className="space-y-6">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="flex gap-5 items-start">
                <div className="shrink-0 w-11 h-11 rounded-full bg-stone-900 border-2 border-amber-500/50 flex items-center justify-center z-10">
                  <span className="text-amber-400 text-xs font-bold">{n}</span>
                </div>
                <div className="bg-stone-900/60 border border-stone-800/60 rounded-2xl px-6 py-5 flex-1 hover:border-amber-500/20 transition-colors">
                  <h3 className="text-stone-50 font-semibold mb-1">{title}</h3>
                  <p className="text-stone-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
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
      name: "Starter",
      price: "€49",
      period: "/mo",
      desc: "Perfect for single-location restaurants just getting started.",
      features: [
        "1 location",
        "Up to 20 tables",
        "QR ordering",
        "Kitchen display",
        "Basic analytics",
        "Email support",
      ],
      highlight: false,
    },
    {
      name: "Growth",
      price: "€99",
      period: "/mo",
      desc: "For growing restaurants that need more power and locations.",
      features: [
        "3 locations",
        "Unlimited tables",
        "QR ordering",
        "Kitchen display",
        "Advanced analytics",
        "Priority support",
      ],
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "For groups and chains that need full control and dedicated care.",
      features: [
        "Unlimited locations",
        "White-label branding",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
        "Onboarding assistance",
      ],
      highlight: false,
    },
  ]

  return (
    <section id="pricing" className="bg-stone-950 py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-medium mb-4">
            Transparent pricing
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-50 font-bold mb-4">
            Simple, Honest Pricing
          </h2>
          <p className="text-stone-400 max-w-xl mx-auto">
            No hidden fees. No per-order commissions. Pay a flat monthly rate and
            keep every euro your restaurant earns.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map(({ name, price, period, desc, features, highlight }) => (
            <div
              key={name}
              className={`relative rounded-2xl p-7 flex flex-col border transition-all ${
                highlight
                  ? "bg-amber-500 border-amber-400 shadow-xl shadow-amber-500/20 scale-[1.02]"
                  : "bg-stone-900/60 border-stone-800/60"
              }`}
            >
              {highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-stone-900 border border-amber-500/40 text-amber-400 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}
              <div className="mb-5">
                <div
                  className={`text-sm font-semibold mb-1 ${
                    highlight ? "text-stone-900" : "text-amber-400"
                  }`}
                >
                  {name}
                </div>
                <div className="flex items-end gap-1 mb-2">
                  <span
                    className={`font-serif text-4xl font-bold ${
                      highlight ? "text-stone-900" : "text-stone-50"
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
                    highlight ? "text-stone-800" : "text-stone-400"
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
                        highlight ? "text-stone-900" : "text-amber-400"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        highlight ? "text-stone-900" : "text-stone-300"
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
                    : "bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                }`}
              >
                Contact Us
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
    <section id="contact" className="bg-stone-900/40 py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-medium mb-4">
            Get in touch
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-50 font-bold mb-4">
            Ready to Upgrade Your Restaurant?
          </h2>
          <p className="text-stone-400 max-w-xl mx-auto">
            Tell us a bit about your restaurant and we'll get back to you within
            24 hours to set up a personalised demo.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3 bg-stone-900/60 border border-stone-800/60 rounded-2xl p-7">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 gap-4">
                <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7 text-amber-400" />
                </div>
                <h3 className="font-serif text-2xl text-stone-50 font-semibold">
                  Message Sent!
                </h3>
                <p className="text-stone-400 max-w-xs">
                  Thanks for reaching out. We'll get back to you within 24
                  hours.
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
                  className="text-amber-400 text-sm hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-400 text-xs font-medium mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                      className="w-full bg-stone-800/60 border border-stone-700/60 rounded-xl px-4 py-2.5 text-stone-100 text-sm placeholder-stone-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-xs font-medium mb-1.5">
                      Restaurant Name *
                    </label>
                    <input
                      type="text"
                      name="restaurant"
                      required
                      value={form.restaurant}
                      onChange={handleChange}
                      placeholder="Bella Cucina"
                      className="w-full bg-stone-800/60 border border-stone-700/60 rounded-xl px-4 py-2.5 text-stone-100 text-sm placeholder-stone-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-400 text-xs font-medium mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jane@restaurant.com"
                      className="w-full bg-stone-800/60 border border-stone-700/60 rounded-xl px-4 py-2.5 text-stone-100 text-sm placeholder-stone-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 text-xs font-medium mb-1.5">
                      Phone{" "}
                      <span className="text-stone-600">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 555 000 0000"
                      className="w-full bg-stone-800/60 border border-stone-700/60 rounded-xl px-4 py-2.5 text-stone-100 text-sm placeholder-stone-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-stone-400 text-xs font-medium mb-1.5">
                    Message / Notes
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your restaurant — number of tables, locations, anything specific you need..."
                    className="w-full bg-stone-800/60 border border-stone-700/60 rounded-xl px-4 py-2.5 text-stone-100 text-sm placeholder-stone-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 text-stone-900 font-semibold rounded-xl hover:bg-amber-400 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  Send Message <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="lg:col-span-2 flex flex-col gap-6 justify-center">
            <div className="bg-stone-900/60 border border-stone-800/60 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <Mail className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="text-stone-100 font-semibold mb-1">Email us directly</h3>
              <a
                href="mailto:menu@hirly.app"
                className="text-amber-400 text-sm hover:underline"
              >
                menu@hirly.app
              </a>
              <p className="text-stone-500 text-xs mt-2">
                We respond within 24 hours.
              </p>
            </div>
            <div className="bg-stone-900/60 border border-stone-800/60 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="text-stone-100 font-semibold mb-2">What to expect</h3>
              <ul className="space-y-2">
                {[
                  "Quick discovery call (15 min)",
                  "Live demo of your digital menu",
                  "Custom pricing for your setup",
                  "Go live within the day",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-stone-400">
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
    <footer className="bg-stone-950 border-t border-stone-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
                <UtensilsCrossed className="h-4 w-4 text-stone-900" />
              </div>
              <span className="font-serif text-xl text-stone-50 font-semibold">MenuApp</span>
            </div>
            <p className="text-stone-500 text-sm max-w-xs">
              The premium QR ordering platform for modern restaurants. No app
              download, no friction — just great dining.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-stone-300 text-sm font-semibold mb-3">Product</h4>
            <ul className="space-y-2">
              {[
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "Contact", href: "#contact" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-stone-500 text-sm hover:text-amber-400 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-stone-300 text-sm font-semibold mb-3">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-stone-500 text-sm hover:text-amber-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="mailto:menu@hirly.app"
                  className="text-stone-500 text-sm hover:text-amber-400 transition-colors"
                >
                  menu@hirly.app
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800/60 pt-6 text-center text-stone-600 text-xs">
          © 2025 MenuApp. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="font-sans antialiased" style={{ scrollBehavior: "smooth" }}>
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  )
}
