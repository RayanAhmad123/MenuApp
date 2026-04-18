"use client"
import { useState, useEffect, useRef } from "react"
import QRCode from "qrcode"
import { Download, Plus, Trash2, QrCode } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import type { QrCode as QrCodeType } from "@/types/database"

interface Props {
  restaurantId: string
  restaurantSubdomain: string
  initialQrCodes: QrCodeType[]
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export function QrCodesClient({ restaurantId, restaurantSubdomain, initialQrCodes }: Props) {
  const [qrCodes, setQrCodes] = useState(initialQrCodes)
  const [tableCount, setTableCount] = useState("")
  const [generating, setGenerating] = useState(false)
  const [qrDataUrls, setQrDataUrls] = useState<Record<number, string>>({})
  const { toast } = useToast()
  const supabase = createClient()

  // Generate QR data URLs for all table numbers
  useEffect(() => {
    async function generateAll() {
      const urls: Record<number, string> = {}
      for (const qr of qrCodes) {
        const url = `${APP_URL}/${restaurantSubdomain}/table/${qr.table_number}`
        try {
          urls[qr.table_number] = await QRCode.toDataURL(url, {
            width: 300,
            margin: 2,
            color: { dark: "#1c1917", light: "#ffffff" },
          })
        } catch {
          // ignore individual failures
        }
      }
      setQrDataUrls(urls)
    }
    if (qrCodes.length > 0) generateAll()
  }, [qrCodes, restaurantSubdomain])

  async function handleGenerateTables() {
    const count = parseInt(tableCount, 10)
    if (isNaN(count) || count < 1 || count > 100) {
      toast({ title: "Enter a number between 1 and 100", variant: "destructive" })
      return
    }
    setGenerating(true)

    const existingNumbers = new Set(qrCodes.map(q => q.table_number))
    const toCreate: number[] = []
    for (let i = 1; i <= count; i++) {
      if (!existingNumbers.has(i)) toCreate.push(i)
    }

    if (toCreate.length === 0) {
      toast({ title: "All tables up to that number already exist." })
      setGenerating(false)
      return
    }

    const rows = toCreate.map(table_number => ({
      restaurant_id: restaurantId,
      table_number,
      is_active: true,
    }))

    const { data, error } = await supabase.from("qr_codes").insert(rows).select()
    setGenerating(false)

    if (error) {
      toast({ title: "Failed to generate QR codes", variant: "destructive" })
    } else {
      setQrCodes(prev => [...prev, ...(data ?? [])].sort((a, b) => a.table_number - b.table_number))
      toast({ title: `${toCreate.length} QR code${toCreate.length !== 1 ? "s" : ""} created` })
      setTableCount("")
    }
  }

  async function handleDelete(id: string, tableNumber: number) {
    const { error } = await supabase.from("qr_codes").delete().eq("id", id)
    if (error) {
      toast({ title: "Failed to delete QR code", variant: "destructive" })
    } else {
      setQrCodes(prev => prev.filter(q => q.id !== id))
      setQrDataUrls(prev => {
        const next = { ...prev }
        delete next[tableNumber]
        return next
      })
    }
  }

  function handleDownload(tableNumber: number) {
    const dataUrl = qrDataUrls[tableNumber]
    if (!dataUrl) return
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = `table-${tableNumber}-qr.png`
    link.click()
  }

  function handleDownloadAll() {
    for (const qr of qrCodes) {
      if (qrDataUrls[qr.table_number]) {
        handleDownload(qr.table_number)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Generate controls */}
      <div className="flex items-end gap-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-stone-700">Number of tables</label>
          <Input
            type="number"
            min={1}
            max={100}
            placeholder="e.g. 20"
            value={tableCount}
            onChange={e => setTableCount(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleGenerateTables() }}
            className="w-36"
          />
        </div>
        <Button variant="amber" onClick={handleGenerateTables} disabled={generating || !tableCount}>
          <Plus className="h-4 w-4 mr-1" />
          {generating ? "Creating…" : "Generate Tables"}
        </Button>
        {qrCodes.length > 0 && (
          <Button variant="outline" onClick={handleDownloadAll}>
            <Download className="h-4 w-4 mr-1" /> Download All
          </Button>
        )}
      </div>

      {/* Info */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
        <p>
          Customer menu URL pattern:{" "}
          <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-xs">
            {APP_URL}/{restaurantSubdomain}/table/[number]
          </code>
        </p>
      </div>

      {/* QR code grid */}
      {qrCodes.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <QrCode className="h-12 w-12 mx-auto mb-3 text-stone-300" />
          <p>No QR codes yet. Enter a table count above and click Generate.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {qrCodes.map(qr => (
            <Card key={qr.id} className="border-stone-200">
              <CardContent className="p-4 flex flex-col items-center gap-3">
                {qrDataUrls[qr.table_number] ? (
                  <img
                    src={qrDataUrls[qr.table_number]}
                    alt={`Table ${qr.table_number} QR`}
                    className="w-full aspect-square rounded-lg"
                  />
                ) : (
                  <div className="w-full aspect-square bg-stone-100 rounded-lg flex items-center justify-center">
                    <QrCode className="h-8 w-8 text-stone-300" />
                  </div>
                )}
                <p className="text-sm font-semibold text-stone-700">Table {qr.table_number}</p>
                <div className="flex gap-1 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => handleDownload(qr.table_number)}
                    disabled={!qrDataUrls[qr.table_number]}
                  >
                    <Download className="h-3 w-3 mr-1" /> Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:bg-red-50 border-red-200"
                    onClick={() => handleDelete(qr.id, qr.table_number)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
