"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import Link from "next/link"
import { Cookie, X } from "lucide-react"

const STORAGE_KEY = "servera_cookie_consent"
const CONSENT_VERSION = 1

export type CookieConsent = {
  version: number
  necessary: true
  analytics: boolean
  timestamp: string
}

type ConsentContextValue = {
  consent: CookieConsent | null
  ready: boolean
  save: (analytics: boolean) => void
  openSettings: () => void
}

const CookieConsentContext = createContext<ConsentContextValue | null>(null)

export function useCookieConsent(): ConsentContextValue {
  const ctx = useContext(CookieConsentContext)
  if (!ctx) {
    throw new Error(
      "useCookieConsent must be used within a CookieConsentProvider"
    )
  }
  return ctx
}

function readStoredConsent(): CookieConsent | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CookieConsent
    // A bump to CONSENT_VERSION re-prompts everyone after a policy change.
    if (parsed.version !== CONSENT_VERSION) return null
    return parsed
  } catch {
    return null
  }
}

export function CookieConsentProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [consent, setConsent] = useState<CookieConsent | null>(null)
  const [ready, setReady] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const existing = readStoredConsent()
    setConsent(existing)
    setReady(true)
    if (!existing) setShowBanner(true)
  }, [])

  const save = useCallback((analytics: boolean) => {
    const value: CookieConsent = {
      version: CONSENT_VERSION,
      necessary: true,
      analytics,
      timestamp: new Date().toISOString(),
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      if (!analytics) {
        // Drop any identifier set while analytics was previously allowed.
        window.localStorage.removeItem("triad_sid")
      }
    } catch {}
    setConsent(value)
    setShowBanner(false)
    setShowSettings(false)
  }, [])

  const openSettings = useCallback(() => {
    setShowSettings(true)
    setShowBanner(false)
  }, [])

  return (
    <CookieConsentContext.Provider
      value={{ consent, ready, save, openSettings }}
    >
      {children}
      {ready && showBanner && (
        <CookieBanner
          onAcceptAll={() => save(true)}
          onRejectAll={() => save(false)}
          onCustomize={openSettings}
        />
      )}
      {ready && showSettings && (
        <CookieSettings
          current={consent}
          onSave={save}
          onClose={() => {
            setShowSettings(false)
            if (!consent) setShowBanner(true)
          }}
        />
      )}
    </CookieConsentContext.Provider>
  )
}

function CookieBanner({
  onAcceptAll,
  onRejectAll,
  onCustomize,
}: {
  onAcceptAll: () => void
  onRejectAll: () => void
  onCustomize: () => void
}) {
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie-samtycke"
      className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-stone-200 bg-white shadow-2xl shadow-stone-900/10">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
          <div className="flex-1">
            <div className="mb-1.5 flex items-center gap-2">
              <Cookie className="h-4 w-4 text-amber-500" aria-hidden="true" />
              <h2 className="font-serif text-base font-bold text-stone-950">
                Vi värnar om din integritet
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-stone-600">
              Vi använder nödvändiga cookies för att webbplatsen ska fungera.
              Med ditt samtycke använder vi även cookies för anonym
              besöksstatistik så att vi kan förbättra Servera. Läs mer i vår{" "}
              <Link
                href="/cookies"
                className="font-medium text-stone-950 underline underline-offset-2 hover:text-amber-600"
              >
                cookiepolicy
              </Link>
              .
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:w-44">
            <button
              type="button"
              onClick={onAcceptAll}
              className="rounded-full bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
            >
              Acceptera alla
            </button>
            <button
              type="button"
              onClick={onRejectAll}
              className="rounded-full border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100"
            >
              Endast nödvändiga
            </button>
            <button
              type="button"
              onClick={onCustomize}
              className="text-xs font-medium text-stone-500 underline underline-offset-2 transition-colors hover:text-stone-950"
            >
              Anpassa inställningar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CookieSettings({
  current,
  onSave,
  onClose,
}: {
  current: CookieConsent | null
  onSave: (analytics: boolean) => void
  onClose: () => void
}) {
  const [analytics, setAnalytics] = useState<boolean>(
    current?.analytics ?? false
  )

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cookie-inställningar"
      className="fixed inset-0 z-[100] flex items-end justify-center bg-stone-950/50 p-3 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div className="w-full max-w-lg rounded-2xl border border-stone-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-200 p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Cookie className="h-4 w-4 text-amber-500" aria-hidden="true" />
            <h2 className="font-serif text-lg font-bold text-stone-950">
              Cookie-inställningar
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Stäng"
            className="rounded-full p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-950"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 p-5 sm:p-6">
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-stone-950">
                  Nödvändiga cookies
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-stone-600">
                  Krävs för inloggning, säkerhet och grundläggande
                  funktioner. Kan inte stängas av.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-stone-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-stone-600">
                Alltid på
              </span>
            </div>
          </div>

          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-4 transition-colors hover:bg-stone-50">
            <div>
              <h3 className="text-sm font-semibold text-stone-950">
                Analys & statistik
              </h3>
              <p className="mt-0.5 text-xs leading-relaxed text-stone-600">
                Anonym besöksstatistik som hjälper oss att förstå hur
                webbplatsen används och förbättra den.
              </p>
            </div>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="h-5 w-5 shrink-0 cursor-pointer rounded border-stone-300 text-stone-950 focus:ring-stone-950"
            />
          </label>
        </div>

        <div className="flex flex-col gap-2 border-t border-stone-200 p-5 sm:flex-row sm:justify-end sm:p-6">
          <button
            type="button"
            onClick={() => onSave(false)}
            className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100"
          >
            Avvisa alla
          </button>
          <button
            type="button"
            onClick={() => onSave(analytics)}
            className="rounded-full bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
          >
            Spara val
          </button>
        </div>
      </div>
    </div>
  )
}

export function CookieSettingsLink({
  className,
  children = "Cookie-inställningar",
}: {
  className?: string
  children?: React.ReactNode
}) {
  const { openSettings } = useCookieConsent()
  return (
    <button type="button" onClick={openSettings} className={className}>
      {children}
    </button>
  )
}
