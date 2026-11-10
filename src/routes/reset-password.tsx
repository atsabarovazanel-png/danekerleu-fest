import { createFileRoute } from '@tanstack/react-router'
import { updateUser } from '@netlify/identity'
import { useState } from 'react'

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await updateUser({ password })
      window.location.href = '/bookmarks'
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Set new password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm text-gray-400">New password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="mt-1 block w-full rounded bg-navy-800 border border-white/10 px-3 py-2 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
          />
        </label>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-teal-500 text-navy-900 font-medium hover:bg-teal-400 disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Saving…' : 'Save password'}
        </button>
      </form>
    </div>
  )
}
