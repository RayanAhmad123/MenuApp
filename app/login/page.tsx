import type { Metadata } from "next"
import { CentralLoginForm } from "@/components/auth/central-login-form"

export const metadata: Metadata = { title: "Logga in" }

export default function CentralLoginPage() {
  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Servera" className="h-24 w-auto mx-auto mb-3" />
          <h1 className="font-serif text-2xl text-stone-50 font-semibold mb-1">Servera</h1>
          <p className="text-stone-400">Logga in på din restaurangpanel</p>
        </div>
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8">
          <CentralLoginForm />
        </div>
      </div>
    </div>
  )
}
