import Link from "next/link"
import type { Guide, GuideBlock } from "@/lib/guides/types"

/**
 * Minimal inline renderer for guide prose: supports [text](href) links and
 * **bold**. Content is authored in lib/guides/*.ts, never user-supplied.
 */
function renderInline(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = []
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g
  let last = 0
  let m: RegExpExecArray | null
  let key = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1] !== undefined) {
      const href = m[2]
      const internal = href.startsWith("/")
      out.push(
        internal ? (
          <Link key={key++} href={href} className="text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-amber-800">
            {m[1]}
          </Link>
        ) : (
          <a key={key++} href={href} target="_blank" rel="noopener noreferrer" className="text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-amber-800">
            {m[1]}
          </a>
        ),
      )
    } else if (m[3] !== undefined) {
      out.push(
        <strong key={key++} className="font-semibold text-stone-900">
          {m[3]}
        </strong>,
      )
    }
    last = re.lastIndex
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function Block({ b }: { b: GuideBlock }) {
  switch (b.t) {
    case "p":
      return <p className="text-stone-700 leading-relaxed mb-5">{renderInline(b.text)}</p>
    case "h2":
      return (
        <h2 id={b.id} className="font-serif text-2xl sm:text-3xl text-stone-950 font-bold tracking-tight mt-12 mb-4 scroll-mt-24">
          {b.text}
        </h2>
      )
    case "h3":
      return <h3 className="font-serif text-xl text-stone-950 font-semibold mt-8 mb-3">{b.text}</h3>
    case "ul":
      return (
        <ul className="list-disc pl-6 mb-5 space-y-2 text-stone-700 leading-relaxed">
          {b.items.map((it, i) => (
            <li key={i}>{renderInline(it)}</li>
          ))}
        </ul>
      )
    case "ol":
      return (
        <ol className="list-decimal pl-6 mb-5 space-y-2 text-stone-700 leading-relaxed">
          {b.items.map((it, i) => (
            <li key={i}>{renderInline(it)}</li>
          ))}
        </ol>
      )
    case "table":
      return (
        <div className="overflow-x-auto mb-6 rounded-xl border border-stone-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-100 text-left">
                {b.head.map((h, i) => (
                  <th key={i} className="px-4 py-2.5 font-semibold text-stone-900 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, ri) => (
                <tr key={ri} className="border-t border-stone-200 bg-white">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 text-stone-700 align-top">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case "callout":
      return (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 mb-6">
          {b.title ? <div className="font-semibold text-stone-900 mb-1.5">{b.title}</div> : null}
          <p className="text-stone-700 leading-relaxed text-sm">{renderInline(b.text)}</p>
        </div>
      )
  }
}

export function GuideArticle({ guide }: { guide: Guide }) {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <nav aria-label="Brödsmulor" className="text-xs text-stone-500 mb-6">
        <Link href="/" className="hover:text-stone-900">Startsida</Link>
        <span className="mx-1.5">/</span>
        <Link href="/guider" className="hover:text-stone-900">Guider</Link>
        <span className="mx-1.5">/</span>
        <span className="text-stone-700">{guide.title}</span>
      </nav>

      <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 border border-stone-200 rounded-full text-stone-700 text-[10px] font-bold uppercase tracking-widest mb-4">
        {guide.category}
      </div>
      <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] text-stone-950 font-bold tracking-tight leading-tight mb-4">
        {guide.title}
      </h1>
      <p className="text-xs text-stone-500 mb-8">
        Uppdaterad{" "}
        <time dateTime={guide.dateModified}>
          {new Date(guide.dateModified).toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" })}
        </time>{" "}
        · {guide.readingMinutes} min läsning · Av Servera-teamet
      </p>

      {guide.intro.map((p, i) => (
        <p key={i} className="text-stone-700 leading-relaxed text-lg mb-5">
          {renderInline(p)}
        </p>
      ))}

      <div className="rounded-2xl border border-stone-200 bg-stone-100/70 p-6 my-8">
        <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-3">
          TL;DR — det viktigaste
        </div>
        <ul className="list-disc pl-5 space-y-2 text-stone-800 leading-relaxed text-[15px]">
          {guide.tldr.map((it, i) => (
            <li key={i}>{renderInline(it)}</li>
          ))}
        </ul>
      </div>

      {guide.blocks.map((b, i) => (
        <Block key={i} b={b} />
      ))}

      {guide.sources.length > 0 ? (
        <section className="mt-12 rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="font-serif text-lg text-stone-950 font-semibold mb-3">Källor</h2>
          <ul className="space-y-1.5 text-sm">
            {guide.sources.map((s, i) => (
              <li key={i}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-amber-800">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  )
}
