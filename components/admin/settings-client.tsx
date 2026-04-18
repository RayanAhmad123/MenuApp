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
import type { Restaurant } from "@/types/database"

const SettingsSchema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
})

export function SettingsClient({ restaurant }: { restaurant: Restaurant }) {
  const { toast } = useToast()
  const [paymentEnabled, setPaymentEnabled] = useState(restaurant.payment_enabled)
  const [savingPayment, setSavingPayment] = useState(false)

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
      toast({ title: enabled ? "Betalning aktiverad" : "Betalning inaktiverad", description: enabled ? "Kunder betalar online vid beställning." : "Kunder kan beställa utan att betala direkt." })
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
                Din meny-URL: <span className="font-mono">{typeof window !== "undefined" ? window.location.origin : ""}/{restaurant.subdomain}/table/1</span>
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
          <CardTitle className="text-stone-800">Betalningsinställningar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-stone-800">Kräv betalning vid beställning</p>
              <p className="text-sm text-stone-500 mt-0.5">
                {paymentEnabled
                  ? "Kunder måste betala online via Stripe innan beställningen bekräftas."
                  : "Kunder kan beställa utan att betala direkt. Betalning hanteras separat."}
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
    </div>
  )
}
