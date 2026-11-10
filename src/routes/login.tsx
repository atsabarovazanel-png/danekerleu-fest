import { createFileRoute, redirect } from '@tanstack/react-router'
import { login, oauthLogin } from '@netlify/identity'
import { useState } from 'react'
import { getServerUser } from '../lib/auth'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const user = await getServerUser()
    if (user) throw redirect({ to: '/bookmarks' })
  },
  component: LoginPage,
})

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      window.location.href = '/bookmarks'
    } catch (err: any) {
      setError(err.message || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Log in</h1>
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
        <label className="block">
          <span className="text-sm text-gray-400">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <div className="my-6 border-t border-white/10" />

      <div className="space-y-3">
        <button
          onClick={() => oauthLogin('github')}
          className="w-full py-2 rounded border border-white/20 text-white hover:border-white/40 cursor-pointer bg-transparent"
        >
          Continue with GitHub
        </button>
        <button
          onClick={() => oauthLogin('google')}
          className="w-full py-2 rounded border border-white/20 text-white hover:border-white/40 cursor-pointer bg-transparent"
        >
          Continue with Google
        </button>
      </div>

      <p className="mt-6 text-sm text-center text-gray-400">
        <a href="/forgot-password">Forgot password?</a>
        {' · '}
        <a href="/signup">Create account</a>
      </p>
    </div>
  )
}
