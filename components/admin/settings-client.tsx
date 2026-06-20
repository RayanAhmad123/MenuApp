"use client"
import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { updateRestaurant } from "@/lib/actions/restaurant"
import { useToast } from "@/hooks/use-toast"
import { tenantUrl } from "@/lib/tenant"
import type { Restaurant } from "@/types/database"

const SettingsSchema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
})

export function SettingsClient({ restaurant }: { restaurant: Restaurant }) {
  const { toast } = useToast()
  const [paymentEnabled, setPaymentEnabled] = useState(restaurant.payment_enabled)
  const [savingPayment, setSavingPayment] = useState(false)
  const [yellowThreshold, setYellowThreshold] = useState(restaurant.yellow_threshold_minutes)
  const [redThreshold, setRedThreshold] = useState(restaurant.red_threshold_minutes)
  const [savingThresholds, setSavingThresholds] = useState(false)
  const [googlePlaceId, setGooglePlaceId] = useState((restaurant as Restaurant & { google_place_id?: string | null }).google_place_id ?? "")
  const [savingGoogle, setSavingGoogle] = useState(false)

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: { name: restaurant.name, address: restaurant.address ?? "" },
  })

  async function onSubmit(data: z.infer<typeof SettingsSchema>) {
    const { error } = await updateRestaurant(restaurant.id, { name: data.name, address: data.address })
    if (error) {
      toast({ title: "Kunde inte uppdatera inställningar", variant: "destructive" })
    } else {
      toast({ title: "Inställningar sparade" })
    }
  }

  async function handlePaymentToggle(enabled: boolean) {
    setSavingPayment(true)
    const { error } = await updateRestaurant(restaurant.id, { paymentEnabled: enabled })
    if (error) {
      toast({ title: "Kunde inte uppdatera betalningsinställning", variant: "destructive" })
    } else {
      setPaymentEnabled(enabled)
      toast({ title: enabled ? "Online-betalning aktiverad" : "Online-betalning inaktiverad", description: enabled ? "Kunder betalar via Stripe när de beställer." : "Kunder betalar i kassan eller via servitören." })
    }
    setSavingPayment(false)
  }

  return (
    <div className="space-y-6">
      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-stone-800">Restaurangprofil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label>Restaurangnamn</Label>
              <Input {...register("name")} placeholder="Min restaurang" />
            </div>
            <div className="space-y-1.5">
              <Label>Adress</Label>
              <Input {...register("address")} placeholder="Storgatan 1, Stockholm" />
            </div>
            <div className="space-y-1.5">
              <Label>Subdomän</Label>
              <Input value={restaurant.subdomain} disabled className="bg-stone-50 text-stone-500" />
              <p className="text-xs text-stone-500">
                Din meny-URL: <span className="font-mono">{tenantUrl(restaurant.subdomain, "/table/1")}</span>
              </p>
            </div>
            <Button type="submit" variant="amber" disabled={isSubmitting}>
              {isSubmitting ? "Sparar..." : "Spara ändringar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-stone-800">Google Recensioner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-stone-600">
            Klistret in ditt Google Place ID så visas en direktlänk till Google Recensioner efter att kunder har betalat. Hitta ditt Place ID på{" "}
            <a href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder" target="_blank" rel="noopener noreferrer" className="text-amber-600 underline">
              Google Place ID Finder
            </a>.
          </p>
          <div className="space-y-1.5">
            <Label>Google Place ID</Label>
            <Input
              value={googlePlaceId}
              onChange={e => setGooglePlaceId(e.target.value)}
              placeholder="ChIJN1t_tDeuEmsRUsoyG83frY4"
            />
          </div>
          {googlePlaceId && (
            <p className="text-xs text-stone-500">
              Förhandsgranskning:{" "}
              <a
                href={`https://search.google.com/local/writereview?placeid=${googlePlaceId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 underline font-mono break-all"
              >
                {`https://search.google.com/local/writereview?placeid=${googlePlaceId}`}
              </a>
            </p>
          )}
          <Button
            variant="amber"
            disabled={savingGoogle}
            onClick={async () => {
              setSavingGoogle(true)
              const { error } = await updateRestaurant(restaurant.id, { googlePlaceId: googlePlaceId || null })
              setSavingGoogle(false)
              if (error) {
                toast({ title: "Kunde inte spara Google Place ID", variant: "destructive" })
              } else {
                toast({ title: "Google Place ID sparat" })
              }
            }}
          >
            {savingGoogle ? "Sparar..." : "Spara Google Place ID"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-stone-800">Betalningsinställningar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-stone-800">Online-betalning via Stripe</p>
              <p className="text-sm text-stone-500 mt-0.5">
                {paymentEnabled
                  ? "Kunder betalar online via Stripe när de beställer."
                  : "Kunder betalar i kassan eller via servitören med kortläsare."}
              </p>
            </div>
            <Switch
              checked={paymentEnabled}
              onCheckedChange={handlePaymentToggle}
              disabled={savingPayment}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-stone-800">Köksinställningar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-stone-500">
            Färgkoda beställningar på köksskärmen baserat på väntetid.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-amber-400" />
                Gul varning (min)
              </Label>
              <Input
                type="number"
                min={1}
                value={yellowThreshold}
                onChange={e => setYellowThreshold(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-red-500" />
                Röd varning (min)
              </Label>
              <Input
                type="number"
                min={1}
                value={redThreshold}
                onChange={e => setRedThreshold(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          <Button
            variant="amber"
            disabled={savingThresholds}
            onClick={async () => {
              setSavingThresholds(true)
              const { error } = await updateRestaurant(restaurant.id, {
                yellowThreshold,
                redThreshold,
              })
              setSavingThresholds(false)
              if (error) {
                toast({ title: "Kunde inte spara trösklar", variant: "destructive" })
              } else {
                toast({ title: "Trösklar sparade" })
              }
            }}
          >
            {savingThresholds ? "Sparar..." : "Spara trösklar"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
