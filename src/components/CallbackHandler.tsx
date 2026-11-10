import { useEffect, useState } from 'react'
import { handleAuthCallback, hydrateSession } from '@netlify/identity'

const AUTH_HASH_PATTERN =
  /^#(confirmation_token|recovery_token|invite_token|email_change_token|access_token)=/

export function CallbackHandler({ children }: { children: React.ReactNode }) {
  const [processing, setProcessing] = useState(() =>
    typeof window !== 'undefined'
      ? AUTH_HASH_PATTERN.test(window.location.hash)
      : false,
  )

  useEffect(() => {
    if (!AUTH_HASH_PATTERN.test(window.location.hash)) {
      hydrateSession()
      return
    }

    handleAuthCallback().then((result) => {
      setProcessing(false)
      if (result?.type === 'recovery') {
        window.location.href = '/reset-password'
      } else {
        window.location.href = '/bookmarks'
      }
    })
  }, [])

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Confirming…</p>
      </div>
    )
  }

  return <>{children}</>
}
