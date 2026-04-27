import type { Metadata } from "next"
import { LoginForm } from "@/components/admin/login-form"

export const metadata: Metadata = { title: "Logga in" }

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Servera" className="h-16 w-auto mx-auto mb-3" />
          <h1 className="font-serif text-2xl text-stone-50 font-semibold mb-1">Servera</h1>
          <p className="text-stone-400">Logga in på din restaurangpanel</p>
        </div>
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8">
          <LoginForm />
        </div>
        <p className="text-center text-stone-600 text-xs mt-6">
          Demo: admin@hirly.demo · valfritt lösenord
        </p>
      </div>
    </div>
  )
}
