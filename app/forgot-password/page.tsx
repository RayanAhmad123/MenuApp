import type { Metadata } from "next"
import Link from "next/link"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = { title: "Återställ lösenord" }

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Servera" className="h-24 w-auto mx-auto mb-3" />
          <h1 className="font-serif text-2xl text-stone-50 font-semibold mb-1">Servera</h1>
          <p className="text-stone-400">Återställ ditt lösenord</p>
        </div>
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8">
          <ForgotPasswordForm resetPath="/reset-password" accent="amber" />
        </div>
        <p className="text-center mt-6">
          <Link href="/login" className="text-stone-500 text-sm hover:text-stone-300">
            Tillbaka till inloggning
          </Link>
        </p>
      </div>
    </div>
  )
}
