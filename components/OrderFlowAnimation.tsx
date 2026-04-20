"use client"

import { useState, useEffect } from "react"
import { QrCode, UtensilsCrossed, ShoppingCart, Send, ChefHat } from "lucide-react"

const steps = [
  {
    icon: QrCode,
    title: "Skanna QR-koden",
    desc: "Gästen håller upp kameran mot bordskortet — ingen app, ingen inloggning.",
    screen: <QRScreen />,
  },
  {
    icon: UtensilsCrossed,
    title: "Bläddra i menyn",
    desc: "Den digitala menyn öppnas direkt i webbläsaren med bilder, priser och allergener.",
    screen: <MenuScreen />,
  },
  {
    icon: ShoppingCart,
    title: "Lägg till i kundvagnen",
    desc: "Tryck på en rätt för att lägga till den. Anpassningar och önskemål är enkla att ange.",
    screen: <CartScreen />,
  },
  {
    icon: Send,
    title: "Skicka beställningen",
    desc: "En knapptryckning bekräftar beställningen — direkt till köket utan mellanhänder.",
    screen: <SendScreen />,
  },
  {
    icon: ChefHat,
    title: "Köket får ordern direkt",
    desc: "Beställningen visas omedelbart på KDS med bordsnummer och alla detaljer.",
    screen: <KitchenScreen />,
  },
]

function QRScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-4">
      <div className="rounded-2xl border-2 border-amber-500/40 bg-amber-500/5 p-6 flex flex-col items-center gap-3">
        <QrCode className="h-20 w-20 text-amber-400" />
        <div className="text-center">
          <div className="text-amber-400 text-xs font-semibold">Bord 7</div>
          <div className="text-stone-400 text-xs mt-0.5">Skanna för att beställa</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-stone-400 text-xs">Öppen för beställningar</span>
      </div>
    </div>
  )
}

function MenuScreen() {
  const items = [
    { name: "Tryffelrisotto", price: "€18", tag: "Populär" },
    { name: "Burratrasallad", price: "€12", tag: null },
    { name: "Lammkotletter", price: "€28", tag: "Nytt" },
  ]
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3 pb-2 border-b border-stone-800">
        <div className="text-stone-100 text-xs font-semibold">Bella Cucina</div>
        <div className="text-stone-500 text-xs">Bord 7 · Lunchmeny</div>
      </div>
      <div className="flex-1 overflow-hidden px-3 py-2 space-y-2">
        {items.map((item) => (
          <div key={item.name} className="flex items-center justify-between bg-stone-800/60 rounded-xl px-3 py-2.5">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-stone-100 text-xs font-medium">{item.name}</span>
                {item.tag && (
                  <span className="text-amber-400 text-[10px] bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full">
                    {item.tag}
                  </span>
                )}
              </div>
              <div className="text-amber-400 text-xs font-semibold mt-0.5">{item.price}</div>
            </div>
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm font-bold">
              +
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CartScreen() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3 pb-2 border-b border-stone-800">
        <div className="text-stone-100 text-xs font-semibold">Din beställning</div>
        <div className="text-stone-500 text-xs">Bord 7</div>
      </div>
      <div className="flex-1 px-3 py-2 space-y-2">
        <div className="flex items-center justify-between bg-stone-800/60 rounded-xl px-3 py-2.5">
          <div>
            <div className="text-stone-100 text-xs font-medium">Tryffelrisotto</div>
            <div className="text-stone-500 text-xs">Utan lök</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-xs font-semibold">€18</span>
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-stone-700 flex items-center justify-center text-stone-300 text-xs">−</div>
              <span className="text-stone-100 text-xs w-3 text-center">1</span>
              <div className="w-5 h-5 rounded-full bg-amber-500/30 flex items-center justify-center text-amber-400 text-xs">+</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between bg-stone-800/60 rounded-xl px-3 py-2.5">
          <div>
            <div className="text-stone-100 text-xs font-medium">Burratrasallad</div>
            <div className="text-stone-500 text-xs">Extra dressing</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-xs font-semibold">€12</span>
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-stone-700 flex items-center justify-center text-stone-300 text-xs">−</div>
              <span className="text-stone-100 text-xs w-3 text-center">1</span>
              <div className="w-5 h-5 rounded-full bg-amber-500/30 flex items-center justify-center text-amber-400 text-xs">+</div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-3 pb-3">
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-stone-400 text-xs">Totalt</span>
          <span className="text-stone-100 text-xs font-bold">€30</span>
        </div>
        <div className="rounded-xl bg-amber-500 text-stone-900 text-xs font-bold text-center py-2.5 flex items-center justify-center gap-1.5">
          <Send className="h-3 w-3" /> Skicka beställning
        </div>
      </div>
    </div>
  )
}

function SendScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-4">
      <div className="w-14 h-14 rounded-full bg-green-500/10 border-2 border-green-500/40 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center">
          <span className="text-white text-sm font-bold">✓</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-stone-100 text-sm font-semibold mb-1">Beställning skickad!</div>
        <div className="text-stone-400 text-xs">Köket förbereder din mat</div>
      </div>
      <div className="w-full bg-stone-800/60 rounded-xl p-3 space-y-1.5">
        <div className="flex justify-between">
          <span className="text-stone-400 text-xs">Tryffelrisotto</span>
          <span className="text-amber-400 text-xs">€18</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-400 text-xs">Burratrasallad</span>
          <span className="text-amber-400 text-xs">€12</span>
        </div>
        <div className="border-t border-stone-700 pt-1.5 flex justify-between">
          <span className="text-stone-300 text-xs font-semibold">Totalt</span>
          <span className="text-stone-100 text-xs font-bold">€30</span>
        </div>
      </div>
    </div>
  )
}

function KitchenScreen() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-3 pb-2 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChefHat className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-stone-100 text-xs font-semibold">Kökets skärm</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-xs">Live</span>
        </div>
      </div>
      <div className="flex-1 px-3 py-2 space-y-2">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-3 py-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-amber-400 text-xs font-bold">Bord 7</span>
            <span className="text-stone-500 text-xs">Just nu</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-amber-400" />
              <span className="text-stone-200 text-xs">Tryffelrisotto — utan lök</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-amber-400" />
              <span className="text-stone-200 text-xs">Burratrasallad — extra dressing</span>
            </div>
          </div>
          <div className="mt-2 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-semibold text-center py-1">
            Ny beställning
          </div>
        </div>
        <div className="rounded-xl border border-stone-700/60 bg-stone-800/40 px-3 py-2.5 opacity-50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-stone-400 text-xs font-bold">Bord 3</span>
            <span className="text-stone-600 text-xs">2 min sedan</span>
          </div>
          <div className="text-stone-500 text-xs">Lammkotletter × 2</div>
          <div className="mt-2 rounded-lg bg-green-500/10 text-green-400 text-xs font-semibold text-center py-1">
            Klar
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrderFlowAnimation() {
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const DURATION = 2500

  useEffect(() => {
    setProgress(0)
    const startTime = Date.now()

    const tick = () => {
      const elapsed = Date.now() - startTime
      const pct = Math.min((elapsed / DURATION) * 100, 100)
      setProgress(pct)
      if (pct < 100) {
        requestAnimationFrame(tick)
      }
    }
    const raf = requestAnimationFrame(tick)

    const timer = setTimeout(() => {
      setActiveStep((s) => (s + 1) % steps.length)
    }, DURATION)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [activeStep])

  const ActiveIcon = steps[activeStep].icon

  return (
    <section id="how-it-works" className="bg-stone-900/40 py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-medium mb-4">
            Så här fungerar det
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-50 font-bold mb-4">
            Beställ på sekunder
          </h2>
          <p className="text-stone-400 max-w-xl mx-auto">
            Ingen app, inget konto — gästen skannar och beställer direkt från sin telefon.
          </p>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start">
          {/* Step list */}
          <div className="w-full lg:w-80 shrink-0 space-y-2">
            {steps.map((step, i) => {
              const Icon = step.icon
              const isActive = i === activeStep
              return (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`w-full text-left flex items-start gap-4 rounded-2xl px-4 py-4 transition-all duration-300 ${
                    isActive
                      ? "bg-amber-500/10 border border-amber-500/30"
                      : "bg-stone-900/40 border border-stone-800/40 hover:border-stone-700/60"
                  }`}
                >
                  <div
                    className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      isActive ? "bg-amber-500/20" : "bg-stone-800"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-amber-400" : "text-stone-500"}`} />
                  </div>
                  <div className="min-w-0">
                    <div className={`text-sm font-semibold mb-0.5 ${isActive ? "text-amber-400" : "text-stone-400"}`}>
                      {step.title}
                    </div>
                    {isActive && (
                      <div className="text-stone-400 text-xs leading-relaxed">{step.desc}</div>
                    )}
                    {isActive && (
                      <div className="mt-2.5 h-1 bg-stone-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-none"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Phone mockup */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative w-64 sm:w-72">
              {/* Glow */}
              <div className="absolute inset-0 bg-amber-500/5 rounded-[2.5rem] blur-2xl scale-110 pointer-events-none" />

              {/* Phone shell */}
              <div className="relative rounded-[2.5rem] bg-stone-900 border-2 border-stone-700 shadow-2xl overflow-hidden">
                {/* Status bar */}
                <div className="h-8 bg-stone-800 flex items-center justify-between px-5">
                  <div className="text-stone-500 text-xs">9:41</div>
                  <div className="w-16 h-3.5 rounded-full bg-stone-700" />
                  <div className="flex gap-1">
                    <div className="w-3 h-2 rounded-sm bg-stone-600" />
                    <div className="w-1.5 h-2 rounded-sm bg-stone-600" />
                  </div>
                </div>

                {/* URL bar */}
                <div className="bg-stone-850 border-b border-stone-800 px-3 py-1.5">
                  <div className="bg-stone-800 rounded-lg px-3 py-1 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-stone-500 text-xs">menuapp.io/bord/7</span>
                  </div>
                </div>

                {/* Screen */}
                <div
                  key={activeStep}
                  className="bg-stone-950 h-72 animate-[fadeIn_0.35s_ease]"
                  style={{ animation: "fadeIn 0.35s ease" }}
                >
                  {steps[activeStep].screen}
                </div>

                {/* Home bar */}
                <div className="bg-stone-950 h-6 flex items-center justify-center pb-1">
                  <div className="w-20 h-1 bg-stone-700 rounded-full" />
                </div>
              </div>

              {/* Step badge */}
              <div className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 shadow-lg flex items-center gap-2">
                <ActiveIcon className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-stone-100 text-xs font-medium">{activeStep + 1} / {steps.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
