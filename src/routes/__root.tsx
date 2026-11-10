import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { IdentityProvider, useIdentity } from '../lib/identity-context'
import { CallbackHandler } from '../components/CallbackHandler'

import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Netlify Identity Bookmarks' },
    ],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  return (
    <IdentityProvider>
      <CallbackHandler>
        <Nav />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <Outlet />
        </main>
      </CallbackHandler>
    </IdentityProvider>
  )
}

function Nav() {
  const { user, ready, logout } = useIdentity()

  return (
    <nav className="h-14 flex items-center justify-between px-6 border-b border-white/10">
      <a
        href="/"
        className="flex items-center gap-2 text-white no-underline hover:text-white"
      >
        <img
          src="/images/logo-netlify-small-monochrome-darkmode.svg"
          alt="Netlify"
          className="h-5 w-auto"
        />
        <span className="font-semibold text-sm">Identity Bookmarks</span>
      </a>
      <div className="flex items-center gap-4 text-sm">
        {ready && user ? (
          <>
            <a href="/bookmarks">Bookmarks</a>
            <button
              className="text-gray-400 hover:text-white cursor-pointer bg-transparent border-none text-sm"
              onClick={async () => {
                await logout()
                window.location.href = '/'
              }}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <a href="/login">Log in</a>
            <a href="/signup">Sign up</a>
          </>
        )}
      </div>
    </nav>
  )
}
