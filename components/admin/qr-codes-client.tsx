"use client"
import { useState, useEffect } from "react"
import QRCode from "qrcode"
import { Download, Plus, Trash2, QrCode, Printer } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { tenantUrl } from "@/lib/tenant"
import type { QrCode as QrCodeType } from "@/types/database"

interface Props {
  restaurantId: string
  restaurantSubdomain: string
  initialQrCodes: QrCodeType[]
}

export function QrCodesClient({ restaurantId, restaurantSubdomain, initialQrCodes }: Props) {
  const [qrCodes, setQrCodes] = useState(initialQrCodes)
  const [tableCount, setTableCount] = useState("")
  const [generating, setGenerating] = useState(false)
  const [confirmCount, setConfirmCount] = useState<{ toCreate: number[] } | null>(null)
  const [qrDataUrls, setQrDataUrls] = useState<Record<number, string>>({})
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    async function generateAll() {
      const urls: Record<number, string> = {}
      for (const qr of qrCodes) {
        const url = tenantUrl(restaurantSubdomain, `/table/${qr.table_number}`)
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

  function handleStartGenerate() {
    const count = parseInt(tableCount, 10)
    if (isNaN(count) || count < 1 || count > 100) {
      toast({ title: "Ange ett antal mellan 1 och 100", variant: "destructive" })
      return
    }

    const existingNumbers = new Set(qrCodes.map(q => q.table_number))
    const toCreate: number[] = []
    for (let i = 1; i <= count; i++) {
      if (!existingNumbers.has(i)) toCreate.push(i)
    }

    if (toCreate.length === 0) {
      toast({ title: "Alla bord upp till det numret finns redan" })
      return
    }

    setConfirmCount({ toCreate })
  }

  async function handleConfirmGenerate() {
    if (!confirmCount) return
    const { toCreate } = confirmCount
    setConfirmCount(null)
    setGenerating(true)

    const rows = toCreate.map(table_number => ({
      restaurant_id: restaurantId,
      table_number,
      is_active: true,
    }))

    const { data, error } = await supabase.from("qr_codes").insert(rows).select()
    setGenerating(false)

    if (error) {
      toast({ title: "Kunde inte skapa QR-koder", variant: "destructive" })
    } else {
      setQrCodes(prev => [...prev, ...(data ?? [])].sort((a, b) => a.table_number - b.table_number))
      toast({ title: `${toCreate.length} QR-kod${toCreate.length !== 1 ? "er" : ""} skapad${toCreate.length !== 1 ? "e" : ""}` })
      setTableCount("")
    }
  }

  async function handleDelete(id: string, tableNumber: number) {
    const { error } = await supabase.from("qr_codes").delete().eq("id", id)
    if (error) {
      toast({ title: "Kunde inte ta bort QR-kod", variant: "destructive" })
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
    link.download = `bord-${tableNumber}-qr.png`
    link.click()
  }

  function handleDownloadAll() {
    for (const qr of qrCodes) {
      if (qrDataUrls[qr.table_number]) {
        handleDownload(qr.table_number)
      }
    }
  }

  function handlePrint() {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Current count */}
      <div className="flex items-baseline gap-3 print:hidden">
        <span className="font-serif text-2xl font-semibold text-stone-800">{qrCodes.length}</span>
        <span className="text-sm text-stone-500">
          {qrCodes.length === 1 ? "bord registrerat" : "bord registrerade"}
        </span>
      </div>

      {/* Generate controls */}
      <div className="flex flex-wrap items-end gap-3 print:hidden">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-stone-700">Antal bord</label>
          <Input
            type="number"
            min={1}
            max={100}
            placeholder="t.ex. 20"
            value={tableCount}
            onChange={e => setTableCount(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleStartGenerate() }}
            className="w-36"
          />
        </div>
        <Button variant="amber" onClick={handleStartGenerate} disabled={generating || !tableCount}>
          <Plus className="h-4 w-4 mr-1" />
          {generating ? "Skapar…" : "Skapa bord"}
        </Button>
        {qrCodes.length > 0 && (
          <>
            <Button variant="outline" onClick={handleDownloadAll}>
              <Download className="h-4 w-4 mr-1" /> Ladda ner alla
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-1" /> Skriv ut
            </Button>
          </>
        )}
      </div>

      {/* Info */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800 print:hidden">
        <p>
          Mönster för gästmenylänk:{" "}
          <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-xs">
            {tenantUrl(restaurantSubdomain, "/table/[nummer]")}
          </code>
        </p>
      </div>

      {/* QR code grid */}
      {qrCodes.length === 0 ? (
        <div className="text-center py-20 text-stone-400 print:hidden">
          <QrCode className="h-12 w-12 mx-auto mb-3 text-stone-300" />
          <p>Inga QR-koder ännu. Ange ett antal bord ovan och klicka på Skapa.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 print:grid-cols-3 print:gap-6">
          {qrCodes.map(qr => (
            <Card key={qr.id} className="border-stone-200 print:break-inside-avoid print:border-stone-400">
              <CardContent className="p-4 flex flex-col items-center gap-3">
                {qrDataUrls[qr.table_number] ? (
                  <img
                    src={qrDataUrls[qr.table_number]}
                    alt={`Bord ${qr.table_number} QR`}
                    className="w-full aspect-square rounded-lg"
                  />
                ) : (
                  <div className="w-full aspect-square bg-stone-100 rounded-lg flex items-center justify-center">
                    <QrCode className="h-8 w-8 text-stone-300" />
                  </div>
                )}
                <p className="text-sm font-semibold text-stone-700">Bord {qr.table_number}</p>
                <div className="flex gap-1 w-full print:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => handleDownload(qr.table_number)}
                    disabled={!qrDataUrls[qr.table_number]}
                  >
                    <Download className="h-3 w-3 mr-1" /> Spara
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

      <AlertDialog open={confirmCount !== null} onOpenChange={open => { if (!open) setConfirmCount(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Skapa nya bord?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmCount && (
                <>
                  Detta skapar {confirmCount.toCreate.length} nya bord
                  {confirmCount.toCreate.length <= 10
                    ? ` (bord ${confirmCount.toCreate.join(", ")}).`
                    : ` (bord ${confirmCount.toCreate[0]}–${confirmCount.toCreate[confirmCount.toCreate.length - 1]}).`}
                  {" "}Befintliga QR-koder förblir oförändrade.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmGenerate} className="bg-amber-500 text-stone-900 hover:bg-amber-400">
              Skapa bord
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
