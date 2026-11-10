import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { getServerUser } from '../lib/auth'
import {
  getBookmarks,
  addBookmark,
  deleteBookmark,
} from '../lib/bookmarks'

export const Route = createFileRoute('/bookmarks')({
  beforeLoad: async () => {
    const user = await getServerUser()
    if (!user) throw redirect({ to: '/login' })
    return { user }
  },
  loader: () => getBookmarks(),
  component: BookmarksPage,
})

function BookmarksPage() {
  const { user } = Route.useRouteContext()
  const bookmarks = Route.useLoaderData()
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await addBookmark({ data: { url, title } })
      setUrl('')
      setTitle('')
      window.location.reload()
    } catch (err: any) {
      setError(err.message || 'Failed to add bookmark')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteBookmark({ data: { id } })
      window.location.reload()
    } catch (err: any) {
      setError(err.message || 'Failed to delete bookmark')
    }
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-2xl font-bold">Bookmarks</h1>
        <span className="text-sm text-gray-400">
          {user.name || user.email}
        </span>
      </div>

      {bookmarks.length === 0 ? (
        <p className="text-gray-400 py-8">
          No bookmarks yet. Add your first one below.
        </p>
      ) : (
        <ul className="divide-y divide-white/10 mb-8">
          {bookmarks.map((bookmark) => (
            <li
              key={bookmark.id}
              className="py-3 flex items-baseline justify-between gap-4"
            >
              <div className="min-w-0">
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium"
                >
                  {bookmark.title}
                </a>
                <p className="text-sm text-gray-500 truncate">
                  {bookmark.url}
                </p>
              </div>
              <span
                className="text-sm text-gray-500 hover:text-red-400 cursor-pointer shrink-0"
                onClick={() => handleDelete(bookmark.id)}
              >
                remove
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="border-t border-white/10 pt-6">
        <h2 className="text-lg font-semibold mb-4">Add a bookmark</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="flex-1 rounded bg-navy-800 border border-white/10 px-3 py-2 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="flex-1 rounded bg-navy-800 border border-white/10 px-3 py-2 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-teal-500 text-navy-900 font-medium hover:bg-teal-400 disabled:opacity-50 cursor-pointer shrink-0"
            >
              {loading ? 'Adding…' : 'Add'}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  )
}
