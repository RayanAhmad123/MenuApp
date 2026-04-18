import type { Metadata } from "next"
import { LoginForm } from "@/components/admin/login-form"

export const metadata: Metadata = { title: "Sign In" }

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-stone-50 font-semibold mb-2">MenuApp</h1>
          <p className="text-stone-400">Sign in to your restaurant dashboard</p>
        </div>
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8">
          <LoginForm />
        </div>
        <p className="text-center text-stone-600 text-xs mt-6">
          Demo: admin@hirly.demo · any password
        </p>
      </div>
    </div>
  )
}
