import { createFileRoute, redirect } from '@tanstack/react-router'
import { getServerUser } from '../lib/auth'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const user = await getServerUser()
    if (user) throw redirect({ to: '/bookmarks' })
  },
  component: Home,
})

function Home() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Your bookmarks, everywhere</h1>
      <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto">
        Save links and access them from any device. Powered by{' '}
        <a href="https://www.npmjs.com/package/@netlify/identity">
          @netlify/identity
        </a>{' '}
        and{' '}
        <a href="https://docs.netlify.com/blobs/overview/">Netlify Blobs</a>.
      </p>
      <div className="flex gap-3 justify-center">
        <a
          href="/signup"
          className="px-5 py-2 rounded bg-teal-500 text-black font-medium no-underline hover:bg-teal-400"
        >
          Get started
        </a>
        <a
          href="/login"
          className="px-5 py-2 rounded border border-white/20 text-white no-underline hover:border-white/40"
        >
          Log in
        </a>
      </div>
    </div>
  )
}
