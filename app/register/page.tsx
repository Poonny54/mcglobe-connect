"use client"

import { useState } from "react"
import Link from "next/link"
import { Globe, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const inputClass =
  "w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 bg-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all"

export default function RegisterPage() {
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [success, setSuccess]   = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const fd          = new FormData(e.currentTarget)
    const companyName = (fd.get("company_name") as string).trim()
    const fullName    = (fd.get("full_name") as string).trim()
    const email       = (fd.get("email") as string).trim()
    const password    = fd.get("password") as string
    const confirm     = fd.get("confirm_password") as string

    if (password !== confirm) {
      setError("Passwords do not match.")
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role:         "client",
          company_name: companyName,
          full_name:    fullName,
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-7">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 mb-3">
            <Globe className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">MCGlobe</h1>
          <p className="text-xs text-slate-500 font-semibold tracking-widest uppercase mt-0.5">
            Logistics Portal
          </p>
        </div>

        {success ? (
          /* ── Success state ── */
          <div className="text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Check your email</h2>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              We sent a confirmation link to your inbox. Click it to activate your account.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-slate-900">Create account</h2>
              <p className="text-sm text-slate-500 mt-1">Get access to the MCGlobe client portal</p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 mb-5 px-3.5 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name</label>
                <input
                  name="company_name"
                  type="text"
                  required
                  placeholder="Acme Corporation"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input
                  name="full_name"
                  type="text"
                  required
                  placeholder="Jane Smith"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@company.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                <input
                  name="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-150 mt-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account…
                  </>
                ) : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign In
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
