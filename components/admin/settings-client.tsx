"use client"
import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateRestaurant } from "@/lib/actions/restaurant"
import { useToast } from "@/hooks/use-toast"
import type { Restaurant } from "@/types/database"

const SettingsSchema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
})

export function SettingsClient({ restaurant }: { restaurant: Restaurant }) {
  const { toast } = useToast()
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: { name: restaurant.name, address: restaurant.address ?? "" },
  })

  async function onSubmit(data: z.infer<typeof SettingsSchema>) {
    const { error } = await updateRestaurant(restaurant.id, { name: data.name, address: data.address })
    if (error) {
      toast({ title: "Failed to update settings", variant: "destructive" })
    } else {
      toast({ title: "Settings saved" })
    }
  }

  return (
    <Card className="border-stone-200">
      <CardHeader>
        <CardTitle className="text-stone-800">Restaurant Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label>Restaurant Name</Label>
            <Input {...register("name")} placeholder="My Restaurant" />
          </div>
          <div className="space-y-1.5">
            <Label>Address</Label>
            <Input {...register("address")} placeholder="123 Main St, City" />
          </div>
          <div className="space-y-1.5">
            <Label>Subdomain</Label>
            <Input value={restaurant.subdomain} disabled className="bg-stone-50 text-stone-500" />
            <p className="text-xs text-stone-500">
              Your menu URL: <span className="font-mono">{process.env.NEXT_PUBLIC_APP_URL}/{restaurant.subdomain}/table/1</span>
            </p>
          </div>
          <Button type="submit" variant="amber" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
