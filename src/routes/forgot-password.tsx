import { createFileRoute } from '@tanstack/react-router'
import { requestPasswordRecovery } from '@netlify/identity'
import { useState } from 'react'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await requestPasswordRecovery(email)
      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send recovery email')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="max-w-sm mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Check your email</h1>
        <p className="text-gray-400">
          We sent a password reset link to <strong className="text-white">{email}</strong>.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Forgot password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm text-gray-400">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded bg-navy-800 border border-white/10 px-3 py-2 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
          />
        </label>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-teal-500 text-navy-900 font-medium hover:bg-teal-400 disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
      <p className="mt-6 text-sm text-center text-gray-400">
        <a href="/login">Back to log in</a>
      </p>
    </div>
  )
}
