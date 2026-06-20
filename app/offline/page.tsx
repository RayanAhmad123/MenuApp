"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

export default function OfflinePage() {
  const [lastSeen, setLastSeen] = useState<string>("")

  useEffect(() => {
    const now = new Date()
    setLastSeen(
      now.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })
    )
  }, [])

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-sm w-full space-y-6">
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="Servera"
            width={80}
            height={80}
            className="rounded-2xl"
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-stone-800">
            Du är offline
          </h1>
          <p className="text-stone-500 text-sm leading-relaxed">
            Menyn laddades senast {lastSeen ? `kl. ${lastSeen}` : "tidigare"}.{" "}
            Koppla upp dig för att se uppdaterade priser och beställa.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-150"
          >
            Försök igen
          </button>
        </div>

        <p className="text-xs text-stone-400">
          Kontrollera din Wi-Fi eller mobildata och försök igen.
        </p>
      </div>
    </div>
  )
}
