import { createServerFn } from '@tanstack/react-start'
import { getStore } from '@netlify/blobs'
import { getUser } from '@netlify/identity'

interface Bookmark {
  id: string
  url: string
  title: string
  createdAt: string
}

function getBookmarkStore() {
  return getStore({ name: 'bookmarks', consistency: 'strong' })
}

export const getBookmarks = createServerFn({ method: 'GET' }).handler(
  async () => {
    const user = await getUser()
    if (!user) throw new Error('Unauthorized')

    const store = getBookmarkStore()
    const { blobs } = await store.list({ prefix: `${user.id}/` })

    const bookmarks: Bookmark[] = await Promise.all(
      blobs.map((blob) => store.get(blob.key, { type: 'json' }) as Promise<Bookmark>),
    )

    return bookmarks.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  },
)

export const addBookmark = createServerFn({ method: 'POST' })
  .inputValidator((input: { url: string; title: string }) => input)
  .handler(async ({ data }) => {
    const user = await getUser()
    if (!user) throw new Error('Unauthorized')

    const id = crypto.randomUUID()
    const bookmark: Bookmark = {
      id,
      url: data.url,
      title: data.title,
      createdAt: new Date().toISOString(),
    }

    const store = getBookmarkStore()
    await store.setJSON(`${user.id}/${id}`, bookmark)
    return bookmark
  })

export const deleteBookmark = createServerFn({ method: 'POST' })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const user = await getUser()
    if (!user) throw new Error('Unauthorized')

    const store = getBookmarkStore()
    await store.delete(`${user.id}/${data.id}`)
  })
