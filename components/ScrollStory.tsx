"use client"

import { useRef, useState, useEffect } from "react"
import {
  QrCode,
  Plus,
  Minus,
  Send,
  CheckCircle2,
  ChefHat,
  Flame,
} from "lucide-react"

type StepDef = {
  label: string
  title: string
  desc: string
}

const STEPS: StepDef[] = [
  {
    label: "Skanna",
    title: "En QR-kod. Ingen app.",
    desc: "Gästen öppnar kameran, skannar koden på bordet — menyn öppnas direkt i webbläsaren.",
  },
  {
    label: "Bläddra",
    title: "Menyn, alltid färsk.",
    desc: "Bilder, allergener och priser på varje rätt. Redigera i adminpanelen — uppdateras överallt på sekunden.",
  },
  {
    label: "Beställ",
    title: "Bygg beställningen enkelt.",
    desc: "Anpassa rätter, lägg till noteringar och se totalen i realtid. Allt från telefonen.",
  },
  {
    label: "Skicka",
    title: "Ett tryck till köket.",
    desc: "Beställningen går direkt till kökets skärm. Inga skrivare, inga missförstånd, ingen väntan.",
  },
  {
    label: "Njut",
    title: "Maten är på väg.",
    desc: "Gästen får bekräftelse och uppskattad tid. Personalen fokuserar på upplevelsen — inte på att ta beställningar.",
  },
]

export default function ScrollStory() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const totalScrollable = el.offsetHeight - window.innerHeight
      if (totalScrollable <= 0) return
      const scrolled = Math.min(Math.max(-rect.top, 0), totalScrollable)
      const pct = scrolled / totalScrollable
      const raw = pct * STEPS.length
      const idx = Math.min(Math.floor(raw), STEPS.length - 1)
      setActive(idx)
      setProgress(Math.min(Math.max(raw - idx, 0), 1))
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative bg-stone-50"
      style={{ height: `${STEPS.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden pt-16 lg:pt-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 grid lg:grid-cols-2 gap-5 sm:gap-8 lg:gap-16 items-center">
          {/* Phone column */}
          <div className="order-1 lg:order-2 flex justify-center">
            <Phone active={active} progress={progress} />
          </div>

          {/* Progress bars — horizontal on mobile, vertical on desktop */}
          <div className="order-2 lg:hidden flex justify-center gap-2">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-full transition-all duration-500 bg-stone-200 h-1 ${
                  i === active ? "w-10" : "w-5"
                }`}
              >
                <div
                  className="absolute inset-0 bg-amber-500 origin-left"
                  style={{
                    width:
                      i === active ? `${progress * 100}%` : i < active ? "100%" : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Copy column */}
          <div className="order-3 lg:order-1 relative min-h-[140px] sm:min-h-[180px] lg:min-h-[320px] text-center lg:text-left">
            {STEPS.map((s, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-all duration-500 flex flex-col items-center lg:items-start"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform: `translateY(${i === active ? 0 : 24}px)`,
                  pointerEvents: i === active ? "auto" : "none",
                }}
              >
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white border border-stone-200 rounded-full text-stone-950 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-3 sm:mb-4 lg:mb-5 shadow-sm">
                  <span className="text-amber-500">0{i + 1}</span>
                  <span className="w-1 h-1 bg-stone-300 rounded-full" />
                  {s.label}
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-6xl text-stone-950 font-bold leading-[1.05] tracking-tight mb-2 sm:mb-3 lg:mb-5 px-2 lg:px-0">
                  {s.title}
                </h3>
                <p className="text-stone-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-md lg:max-w-lg px-4 lg:px-0">
                  {s.desc}
                </p>
              </div>
            ))}

            {/* Desktop vertical progress bars */}
            <div className="hidden lg:flex absolute bottom-auto -left-10 top-1/2 -translate-y-1/2 flex-col gap-2">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-full transition-all duration-500 bg-stone-200 ${
                    i === active ? "w-1 h-12" : "w-1 h-6"
                  }`}
                >
                  <div
                    className="absolute inset-0 bg-amber-500 origin-top"
                    style={{
                      height:
                        i === active ? `${progress * 100}%` : i < active ? "100%" : "0%",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───── Phone ───── */

function Phone({ active, progress }: { active: number; progress: number }) {
  const Screens = [ScreenScan, ScreenMenu, ScreenCart, ScreenSend, ScreenDone]
  return (
    <div className="relative w-[180px] sm:w-[220px] lg:w-[300px]">
      <div className="absolute -inset-6 bg-amber-500/15 blur-3xl rounded-full pointer-events-none" />

      <div className="relative rounded-[2.25rem] sm:rounded-[2.75rem] lg:rounded-[3rem] bg-stone-950 p-1.5 sm:p-2 shadow-2xl shadow-stone-900/30 ring-1 ring-stone-800/60">
        <div
          className="relative rounded-[1.75rem] sm:rounded-[2.25rem] lg:rounded-[2.5rem] bg-stone-50 overflow-hidden"
          style={{ aspectRatio: "9 / 19" }}
        >
          <div className="absolute top-2 lg:top-2.5 left-1/2 -translate-x-1/2 w-16 sm:w-20 lg:w-24 h-4 sm:h-5 lg:h-6 bg-stone-950 rounded-full z-30" />

          {Screens.map((Screen, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-500"
              style={{ opacity: i === active ? 1 : 0 }}
            >
              <Screen progress={i === active ? progress : 0} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ───── Screen shell ───── */

function ScreenShell({
  children,
  title,
  table = "Bord 7",
}: {
  children: React.ReactNode
  title?: string
  table?: string
}) {
  return (
    <div className="relative h-full w-full flex flex-col pt-12 bg-stone-50">
      <div className="px-4 pb-2">
        <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-full px-3 py-1.5">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          <span className="text-[9px] text-stone-500 font-medium truncate">
            menu.bellacucina.se · {table}
          </span>
        </div>
      </div>
      {title && (
        <div className="px-4 pb-1.5 flex items-center justify-between">
          <div className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold">
            {title}
          </div>
          <div className="text-[9px] text-stone-400">{table}</div>
        </div>
      )}
      {children}
    </div>
  )
}

/* ───── Screens ───── */

function ScreenScan({ progress }: { progress: number }) {
  const scanY = Math.min(progress * 100, 100)
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-5 bg-gradient-to-b from-stone-50 via-stone-50 to-amber-50/50 pt-12 px-6">
      <div className="text-center">
        <div className="text-[9px] uppercase tracking-[0.2em] text-amber-600 font-bold mb-1">
          Bella Cucina
        </div>
        <div className="font-serif text-stone-950 text-xl font-bold">Bord 7</div>
      </div>
      <div className="relative w-40 h-40 rounded-2xl bg-white border border-stone-200 shadow-md flex items-center justify-center overflow-hidden">
        <QrCode className="w-28 h-28 text-stone-950" strokeWidth={1.5} />
        <div
          className="absolute left-2 right-2 h-[2px] bg-amber-500 shadow-[0_0_16px_rgba(245,158,11,0.9)]"
          style={{ top: `${scanY}%`, opacity: progress > 0.05 ? 1 : 0 }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-amber-500/0 to-amber-500/10"
          style={{ opacity: progress }}
        />
      </div>
      <div className="text-center">
        <div className="text-stone-600 text-[11px] leading-relaxed">
          Håll upp kameran mot QR-koden
        </div>
      </div>
    </div>
  )
}

function ScreenMenu({ progress }: { progress: number }) {
  const items = [
    {
      name: "Tryffelrisotto",
      desc: "Parmesan · svart tryffel",
      price: "199 kr",
      tag: "Populär",
    },
    {
      name: "Burratrasallad",
      desc: "Tomat · basilika · olja",
      price: "129 kr",
    },
    {
      name: "Lammkotletter",
      desc: "Rosmarin · rödvinssås",
      price: "299 kr",
      tag: "Nytt",
    },
  ]
  const revealCount = Math.min(items.length, Math.floor(progress * 4) + 1)

  return (
    <ScreenShell title="Huvudrätter">
      <div className="flex-1 px-3 pt-2 pb-3 space-y-2 overflow-hidden">
        {items.map((item, i) => (
          <div
            key={item.name}
            className="rounded-xl bg-white border border-stone-200 p-2.5 flex items-center gap-2.5 transition-all duration-500"
            style={{
              opacity: i < revealCount ? 1 : 0.15,
              transform: `translateY(${i < revealCount ? 0 : 8}px)`,
            }}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-stone-950 text-[11px] font-semibold truncate">
                  {item.name}
                </span>
                {item.tag && (
                  <span className="shrink-0 text-amber-700 text-[7px] font-bold bg-amber-100 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    {item.tag}
                  </span>
                )}
              </div>
              <div className="text-stone-500 text-[9px] mt-0.5 truncate">{item.desc}</div>
              <div className="text-amber-600 text-[11px] font-bold mt-0.5">{item.price}</div>
            </div>
            <div className="w-6 h-6 rounded-full bg-stone-950 flex items-center justify-center shrink-0">
              <Plus className="w-3 h-3 text-white" strokeWidth={2.5} />
            </div>
          </div>
        ))}
      </div>
    </ScreenShell>
  )
}

function ScreenCart({ progress }: { progress: number }) {
  const items = [
    { name: "Tryffelrisotto", note: "Utan lök", price: 199 },
    { name: "Burratrasallad", note: "Extra dressing", price: 129 },
  ]
  const revealCount = Math.min(items.length, Math.floor(progress * 3) + 1)
  const total = items.slice(0, revealCount).reduce((s, i) => s + i.price, 0)

  return (
    <ScreenShell title="Din beställning">
      <div className="flex-1 px-3 pt-1 pb-3 flex flex-col gap-2">
        {items.map((it, i) => (
          <div
            key={it.name}
            className="rounded-xl bg-white border border-stone-200 p-2.5 transition-all duration-500"
            style={{
              opacity: i < revealCount ? 1 : 0.1,
              transform: `translateY(${i < revealCount ? 0 : 10}px) scale(${
                i < revealCount ? 1 : 0.97
              })`,
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-stone-950 text-[11px] font-semibold">{it.name}</div>
                <div className="text-stone-500 text-[9px] mt-0.5">{it.note}</div>
              </div>
              <div className="text-amber-600 text-[11px] font-bold">{it.price} kr</div>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <button className="w-5 h-5 rounded-md bg-stone-100 flex items-center justify-center">
                <Minus className="w-2.5 h-2.5 text-stone-500" strokeWidth={2.5} />
              </button>
              <span className="text-stone-950 text-[10px] font-semibold w-3 text-center">
                1
              </span>
              <button className="w-5 h-5 rounded-md bg-amber-100 flex items-center justify-center">
                <Plus className="w-2.5 h-2.5 text-amber-700" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        ))}

        <div className="mt-auto pt-2 border-t border-stone-200 flex items-center justify-between">
          <span className="text-stone-500 text-[10px] uppercase tracking-wider font-semibold">
            Totalt
          </span>
          <span className="text-stone-950 font-serif text-base font-bold">{total} kr</span>
        </div>
      </div>
    </ScreenShell>
  )
}

function ScreenSend({ progress }: { progress: number }) {
  const fill = Math.min(progress * 100, 100)
  return (
    <ScreenShell title="Granska & skicka">
      <div className="flex-1 px-3 pt-1 pb-3 flex flex-col">
        <div className="rounded-xl bg-white border border-stone-200 p-3 space-y-1.5 mb-3">
          <div className="flex justify-between">
            <span className="text-stone-700 text-[10px]">Tryffelrisotto × 1</span>
            <span className="text-stone-900 text-[10px] font-semibold">199 kr</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-700 text-[10px]">Burratrasallad × 1</span>
            <span className="text-stone-900 text-[10px] font-semibold">129 kr</span>
          </div>
          <div className="border-t border-stone-200 pt-1.5 flex justify-between">
            <span className="text-stone-950 text-[10px] font-bold">Totalt</span>
            <span className="text-amber-600 text-[10px] font-bold">328 kr</span>
          </div>
        </div>

        <div className="mt-auto">
          <div className="relative rounded-full overflow-hidden bg-stone-950">
            <div
              className="absolute inset-y-0 left-0 bg-amber-500 transition-all"
              style={{ width: `${fill}%` }}
            />
            <div className="relative flex items-center justify-center gap-1.5 py-3 text-white text-xs font-bold">
              <Send className="w-3 h-3" strokeWidth={2.5} />
              {fill >= 95 ? "Skickat!" : "Skicka beställning"}
            </div>
          </div>
          <div className="text-center text-stone-400 text-[9px] mt-2">
            Håll fingret för att bekräfta
          </div>
        </div>
      </div>
    </ScreenShell>
  )
}

function ScreenDone({ progress }: { progress: number }) {
  return (
    <ScreenShell>
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div
          className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center transition-all duration-500"
          style={{
            transform: `scale(${0.7 + Math.min(progress * 2, 1) * 0.3})`,
            boxShadow: `0 0 ${progress * 40}px rgba(245,158,11,0.5)`,
          }}
        >
          <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <div className="font-serif text-stone-950 text-lg font-bold leading-tight">
            Beställningen är i köket
          </div>
          <div className="text-stone-600 text-[11px] mt-1.5">
            Uppskattad tid · <span className="text-stone-950 font-semibold">18 min</span>
          </div>
        </div>

        <div className="w-full rounded-xl bg-white border border-stone-200 p-3 mt-1 flex items-center gap-2.5 text-left">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
            <ChefHat className="w-4 h-4 text-amber-700" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-stone-950 text-[10px] font-bold">Köket förbereder</div>
            <div className="text-stone-500 text-[9px]">2 rätter · Bord 7</div>
          </div>
          <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
        </div>
      </div>
    </ScreenShell>
  )
}
