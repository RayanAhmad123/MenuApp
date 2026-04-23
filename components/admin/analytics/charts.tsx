"use client"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * Tiny SVG chart library (no external deps).
 * All charts scale to container width via viewBox; height is configurable.
 */

type Point = { x: number; y: number; label?: string; subLabel?: string }

export function SparklineChart({
  points,
  height = 48,
  color = "#d97706",
  fill = true,
  className,
}: {
  points: number[]
  height?: number
  color?: string
  fill?: boolean
  className?: string
}) {
  if (points.length === 0) return <div className={cn("h-12", className)} />
  const max = Math.max(...points, 1)
  const min = Math.min(...points, 0)
  const range = max - min || 1
  const w = 100
  const h = height
  const step = points.length > 1 ? w / (points.length - 1) : w
  const coords = points.map((v, i) => [i * step, h - ((v - min) / range) * (h - 4) - 2] as const)
  const path = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`).join(" ")
  const area = `${path} L ${coords[coords.length - 1][0]} ${h} L 0 ${h} Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cn("w-full", className)} preserveAspectRatio="none">
      {fill && <path d={area} fill={color} fillOpacity={0.12} />}
      <path d={path} fill="none" stroke={color} strokeWidth={1.4} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

export function LineChart({
  data,
  height = 220,
  color = "#d97706",
  yLabel,
  formatY = (n: number) => String(n),
}: {
  data: Point[]
  height?: number
  color?: string
  yLabel?: string
  formatY?: (n: number) => string
}) {
  const [hover, setHover] = useState<number | null>(null)
  const w = 800
  const pad = { top: 16, right: 16, bottom: 28, left: 44 }
  const ys = data.map(d => d.y)
  const maxY = Math.max(...ys, 1)
  const minY = 0
  const innerW = w - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom
  const step = data.length > 1 ? innerW / (data.length - 1) : innerW
  const coords = data.map((d, i) => [pad.left + i * step, pad.top + innerH - ((d.y - minY) / (maxY - minY || 1)) * innerH] as const)
  const path = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")
  const area = coords.length > 0
    ? `${path} L ${coords[coords.length - 1][0]} ${pad.top + innerH} L ${pad.left} ${pad.top + innerH} Z`
    : ""

  const gridLines = 4
  const gridValues = Array.from({ length: gridLines + 1 }, (_, i) => (maxY / gridLines) * i)

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${w} ${height}`} className="w-full h-auto" onMouseLeave={() => setHover(null)}>
        {gridValues.map((v, i) => {
          const y = pad.top + innerH - (v / (maxY || 1)) * innerH
          return (
            <g key={i}>
              <line x1={pad.left} x2={pad.left + innerW} y1={y} y2={y} stroke="#e7e5e4" strokeWidth={1} />
              <text x={pad.left - 8} y={y + 4} fontSize={10} fill="#a8a29e" textAnchor="end">{formatY(v)}</text>
            </g>
          )
        })}
        <path d={area} fill={color} fillOpacity={0.1} />
        <path d={path} fill="none" stroke={color} strokeWidth={2} />

        {data.map((d, i) => (
          <g key={i}>
            <rect
              x={pad.left + i * step - step / 2}
              y={pad.top}
              width={step}
              height={innerH}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
          </g>
        ))}

        {hover !== null && coords[hover] && (
          <g>
            <line
              x1={coords[hover][0]} x2={coords[hover][0]}
              y1={pad.top} y2={pad.top + innerH}
              stroke={color} strokeWidth={1} strokeDasharray="3 3"
            />
            <circle cx={coords[hover][0]} cy={coords[hover][1]} r={4} fill={color} />
          </g>
        )}

        {/* X-axis labels: first, middle, last */}
        {data.length > 0 && (() => {
          const indices = data.length <= 3 ? data.map((_, i) => i) : [0, Math.floor(data.length / 2), data.length - 1]
          return indices.map(i => (
            <text key={i} x={coords[i][0]} y={height - 8} fontSize={10} fill="#a8a29e" textAnchor="middle">
              {data[i].label ?? ""}
            </text>
          ))
        })()}
      </svg>

      {hover !== null && data[hover] && (
        <div
          className="absolute pointer-events-none bg-stone-900 text-white text-xs rounded px-2 py-1 shadow"
          style={{
            left: `${(coords[hover][0] / w) * 100}%`,
            top: `${(coords[hover][1] / height) * 100}%`,
            transform: "translate(-50%, -110%)",
          }}
        >
          <div className="font-medium">{data[hover].label}</div>
          <div className="text-stone-300">{data[hover].subLabel ?? formatY(data[hover].y)}</div>
        </div>
      )}
    </div>
  )
}

export function BarChart({
  data,
  height = 220,
  color = "#d97706",
  horizontal = false,
  formatValue = (n: number) => String(n),
}: {
  data: { label: string; value: number; color?: string }[]
  height?: number
  color?: string
  horizontal?: boolean
  formatValue?: (n: number) => string
}) {
  const max = Math.max(...data.map(d => d.value), 1)

  if (horizontal) {
    return (
      <div className="w-full space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-stone-600 w-28 truncate" title={d.label}>{d.label}</span>
            <div className="flex-1 h-6 bg-stone-100 rounded overflow-hidden relative">
              <div
                className="h-full rounded transition-all"
                style={{ width: `${(d.value / max) * 100}%`, background: d.color ?? color }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-stone-700">
                {formatValue(d.value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const w = 800
  const pad = { top: 16, right: 16, bottom: 40, left: 44 }
  const innerW = w - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom
  const barW = data.length > 0 ? innerW / data.length : innerW
  const gap = Math.min(8, barW * 0.3)

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full h-auto">
      <line x1={pad.left} x2={pad.left + innerW} y1={pad.top + innerH} y2={pad.top + innerH} stroke="#e7e5e4" />
      {data.map((d, i) => {
        const x = pad.left + i * barW + gap / 2
        const bw = barW - gap
        const bh = (d.value / max) * innerH
        const y = pad.top + innerH - bh
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={bh} fill={d.color ?? color} rx={3} />
            <text x={x + bw / 2} y={height - 18} fontSize={10} fill="#a8a29e" textAnchor="middle">
              {d.label}
            </text>
            <text x={x + bw / 2} y={height - 6} fontSize={9} fill="#78716c" textAnchor="middle">
              {formatValue(d.value)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function Heatmap({
  cells,
  rows,
  cols,
  rowLabels,
  colLabels,
  color = "#d97706",
  cellSize = 22,
}: {
  cells: { row: number; col: number; value: number }[]
  rows: number
  cols: number
  rowLabels: string[]
  colLabels: string[]
  color?: string
  cellSize?: number
}) {
  const max = Math.max(...cells.map(c => c.value), 1)
  const get = (r: number, c: number) => cells.find(x => x.row === r && x.col === c)?.value ?? 0
  const labelCol = 36
  const labelRow = 18
  const w = labelCol + cols * cellSize
  const h = labelRow + rows * cellSize

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {colLabels.map((lbl, c) => (
        <text key={c} x={labelCol + c * cellSize + cellSize / 2} y={labelRow - 4} fontSize={9} fill="#a8a29e" textAnchor="middle">
          {lbl}
        </text>
      ))}
      {rowLabels.map((lbl, r) => (
        <text key={r} x={labelCol - 4} y={labelRow + r * cellSize + cellSize / 2 + 3} fontSize={10} fill="#78716c" textAnchor="end">
          {lbl}
        </text>
      ))}
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const v = get(r, c)
          const intensity = v / max
          const x = labelCol + c * cellSize
          const y = labelRow + r * cellSize
          return (
            <rect
              key={`${r}-${c}`}
              x={x + 1} y={y + 1} width={cellSize - 2} height={cellSize - 2}
              fill={color} fillOpacity={Math.max(0.04, intensity)}
              rx={2}
            >
              <title>{`${rowLabels[r]} ${colLabels[c]}: ${v}`}</title>
            </rect>
          )
        })
      )}
    </svg>
  )
}

export type MatrixPoint = {
  x: number // 0-1 popularity
  y: number // 0-1 profit
  label: string
  id: string
  quadrant: "star" | "plowhorse" | "puzzle" | "dog"
}

export function QuadrantMatrix({
  points,
  height = 380,
  xAxisLabel = "Popularity →",
  yAxisLabel = "Profit →",
  onPointClick,
}: {
  points: MatrixPoint[]
  height?: number
  xAxisLabel?: string
  yAxisLabel?: string
  onPointClick?: (id: string) => void
}) {
  const w = 600
  const pad = { top: 24, right: 24, bottom: 36, left: 48 }
  const innerW = w - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom

  const quadColors = {
    star: "#16a34a",
    plowhorse: "#d97706",
    puzzle: "#2563eb",
    dog: "#dc2626",
  }

  // Group overlapping points
  const [hoverId, setHoverId] = useState<string | null>(null)

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${w} ${height}`} className="w-full h-auto">
        {/* Quadrant bg */}
        <rect x={pad.left} y={pad.top} width={innerW / 2} height={innerH / 2} fill="#2563eb" fillOpacity={0.04} />
        <rect x={pad.left + innerW / 2} y={pad.top} width={innerW / 2} height={innerH / 2} fill="#16a34a" fillOpacity={0.04} />
        <rect x={pad.left} y={pad.top + innerH / 2} width={innerW / 2} height={innerH / 2} fill="#dc2626" fillOpacity={0.04} />
        <rect x={pad.left + innerW / 2} y={pad.top + innerH / 2} width={innerW / 2} height={innerH / 2} fill="#d97706" fillOpacity={0.04} />

        {/* Quadrant labels */}
        <text x={pad.left + 8} y={pad.top + 16} fontSize={11} fill="#2563eb" fontWeight="600">PUZZLE</text>
        <text x={pad.left + innerW - 8} y={pad.top + 16} fontSize={11} fill="#16a34a" fontWeight="600" textAnchor="end">STAR</text>
        <text x={pad.left + 8} y={pad.top + innerH - 8} fontSize={11} fill="#dc2626" fontWeight="600">DOG</text>
        <text x={pad.left + innerW - 8} y={pad.top + innerH - 8} fontSize={11} fill="#d97706" fontWeight="600" textAnchor="end">PLOWHORSE</text>

        {/* Axes */}
        <line x1={pad.left} x2={pad.left + innerW} y1={pad.top + innerH} y2={pad.top + innerH} stroke="#a8a29e" />
        <line x1={pad.left} x2={pad.left} y1={pad.top} y2={pad.top + innerH} stroke="#a8a29e" />

        {/* Midlines */}
        <line x1={pad.left + innerW / 2} x2={pad.left + innerW / 2} y1={pad.top} y2={pad.top + innerH} stroke="#d6d3d1" strokeDasharray="4 4" />
        <line x1={pad.left} x2={pad.left + innerW} y1={pad.top + innerH / 2} y2={pad.top + innerH / 2} stroke="#d6d3d1" strokeDasharray="4 4" />

        {/* Points */}
        {points.map(p => {
          const cx = pad.left + p.x * innerW
          const cy = pad.top + innerH - p.y * innerH
          const isHover = hoverId === p.id
          return (
            <g key={p.id} style={{ cursor: onPointClick ? "pointer" : undefined }}>
              <circle
                cx={cx} cy={cy}
                r={isHover ? 9 : 6}
                fill={quadColors[p.quadrant]}
                fillOpacity={0.85}
                stroke="white"
                strokeWidth={2}
                onMouseEnter={() => setHoverId(p.id)}
                onMouseLeave={() => setHoverId(null)}
                onClick={() => onPointClick?.(p.id)}
              />
            </g>
          )
        })}

        {/* Axis labels */}
        <text x={pad.left + innerW / 2} y={height - 8} fontSize={11} fill="#78716c" textAnchor="middle">{xAxisLabel}</text>
        <text x={14} y={pad.top + innerH / 2} fontSize={11} fill="#78716c" textAnchor="middle" transform={`rotate(-90 14 ${pad.top + innerH / 2})`}>{yAxisLabel}</text>
      </svg>

      {hoverId && (() => {
        const p = points.find(x => x.id === hoverId)
        if (!p) return null
        return (
          <div
            className="absolute pointer-events-none bg-stone-900 text-white text-xs rounded px-2 py-1 shadow font-medium"
            style={{
              left: `${(pad.left + p.x * innerW) / w * 100}%`,
              top: `${(pad.top + innerH - p.y * innerH) / height * 100}%`,
              transform: "translate(-50%, -150%)",
            }}
          >
            {p.label}
            <div className="text-stone-300 font-normal capitalize">{p.quadrant}</div>
          </div>
        )
      })()}
    </div>
  )
}

export function Donut({
  slices,
  size = 160,
  thickness = 22,
  centerLabel,
  centerValue,
}: {
  slices: { label: string; value: number; color: string }[]
  size?: number
  thickness?: number
  centerLabel?: string
  centerValue?: string
}) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1
  const r = (size - thickness) / 2
  const c = size / 2

  const arcs = useMemo(() => {
    let acc = -Math.PI / 2
    return slices.map(slice => {
      const angle = (slice.value / total) * Math.PI * 2
      const start = acc
      const end = acc + angle
      acc += angle
      const x0 = c + r * Math.cos(start)
      const y0 = c + r * Math.sin(start)
      const x1 = c + r * Math.cos(end)
      const y1 = c + r * Math.sin(end)
      const large = angle > Math.PI ? 1 : 0
      return { slice, d: `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`, angle }
    })
  }, [slices, total, c, r])

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="#f5f5f4" strokeWidth={thickness} />
        {arcs.map((a, i) => (
          <path key={i} d={a.d} fill="none" stroke={a.slice.color} strokeWidth={thickness} strokeLinecap="butt" />
        ))}
        {centerValue && (
          <text x={c} y={c - 2} textAnchor="middle" fontSize={18} fontWeight="600" fill="#292524">{centerValue}</text>
        )}
        {centerLabel && (
          <text x={c} y={c + 14} textAnchor="middle" fontSize={10} fill="#a8a29e">{centerLabel}</text>
        )}
      </svg>
      <div className="flex-1 space-y-1.5">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
            <span className="text-stone-600 flex-1 truncate">{s.label}</span>
            <span className="text-stone-800 font-medium">{((s.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
