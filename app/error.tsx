"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
    Sentry.captureException(error)
  }, [error])

  return (
    <main className="mx-auto grid w-full max-w-4xl flex-1 place-items-center px-4 py-20 text-center md:px-8">
      <div>
        <p className="section-label">Something went wrong</p>
        <h1 className="mt-4 text-4xl font-black text-white">This page could not be loaded.</h1>
        <p className="mt-4 text-gray-400">The issue was logged. You can retry without losing the rest of the application.</p>
        <button onClick={reset} className="mt-8 bg-[#b7f34a] px-6 py-3 text-sm font-black uppercase text-black">
          Try again
        </button>
      </div>
    </main>
  )
}
