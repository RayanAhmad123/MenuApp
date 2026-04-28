import Link from "next/link"

interface MarketingShellProps {
  children: React.ReactNode
}

export function MarketingShell({ children }: MarketingShellProps) {
  return (
    <main className="min-h-screen bg-stone-50 font-sans antialiased">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Servera" className="h-9 w-auto" />
            <span className="font-serif text-xl text-stone-950 font-bold tracking-tight">
              Servera
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-stone-600">
            <Link href="/priser" className="hover:text-stone-950 transition-colors">
              Priser
            </Link>
            <Link href="/#features" className="hover:text-stone-950 transition-colors">
              Funktioner
            </Link>
            <Link href="/#how-it-works" className="hover:text-stone-950 transition-colors">
              Så fungerar det
            </Link>
          </nav>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-950 text-white text-sm font-semibold rounded-full hover:bg-stone-800 transition-colors"
          >
            Boka demo
          </Link>
        </div>
      </header>

      {children}

      <footer className="border-t border-stone-800 bg-stone-950 text-stone-500 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            © {new Date().getFullYear()} Servera — en del av Triad Solutions.
          </div>
          <div className="flex gap-5">
            <Link href="/" className="hover:text-stone-300 transition-colors">
              Startsida
            </Link>
            <Link href="/priser" className="hover:text-stone-300 transition-colors">
              Priser
            </Link>
            <Link href="/#contact" className="hover:text-stone-300 transition-colors">
              Kontakt
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

interface FAQAccordionProps {
  items: Array<{ question: string; answer: string }>
  heading?: string
}

export function FAQAccordion({
  items,
  heading = "Vanliga frågor",
}: FAQAccordionProps) {
  return (
    <section className="py-16 sm:py-20 bg-white border-t border-stone-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-50 border border-stone-200 rounded-full text-stone-700 text-[10px] font-bold uppercase tracking-widest mb-5">
            FAQ
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-bold tracking-tight">
            {heading}
          </h2>
        </div>
        <div className="space-y-3">
          {items.map((q) => (
            <details
              key={q.question}
              className="group rounded-2xl border border-stone-200 bg-stone-50 p-5 open:bg-white open:shadow-sm transition-all"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h3 className="font-serif text-lg text-stone-950 font-semibold pr-4">
                  {q.question}
                </h3>
                <span className="text-stone-400 group-open:rotate-45 transition-transform text-2xl leading-none">
                  +
                </span>
              </summary>
              <p className="mt-3 text-stone-600 leading-relaxed text-sm">
                {q.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTASection({ headline, sub }: { headline: string; sub: string }) {
  return (
    <section className="py-20 bg-stone-950 text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          {headline}
        </h2>
        <p className="text-stone-400 text-lg mb-8 leading-relaxed">{sub}</p>
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-500 text-stone-950 font-semibold rounded-full hover:bg-amber-400 transition-colors text-sm"
        >
          Boka kostnadsfri demo
        </Link>
      </div>
    </section>
  )
}
