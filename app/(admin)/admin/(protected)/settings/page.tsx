import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentRestaurant } from "@/lib/actions/restaurant"
import { SettingsClient } from "@/components/admin/settings-client"

export const metadata: Metadata = { title: "Settings" }

export default async function SettingsPage() {
  const ctx = await getCurrentRestaurant()
  if (!ctx) return redirect("/admin/login")
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-serif text-3xl text-stone-800 font-semibold mb-6">Settings</h1>
      <SettingsClient restaurant={ctx.restaurant} />
    </div>
  )
}
