"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SavedBuildCard({ build }) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  async function toggleVisibility() {
    setIsUpdating(true)
    setMessage("")

    const response = await fetch(`/api/builds/${build.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: !build.isPublic }),
    })

    const data = await response.json()
    setIsUpdating(false)

    if (!response.ok) {
      setMessage(data.error ?? "Build could not be updated.")
      return
    }

    router.refresh()
  }

  async function deleteBuild() {
    setIsUpdating(true)
    setMessage("")

    const response = await fetch(`/api/builds/${build.id}`, { method: "DELETE" })
    const data = await response.json()
    setIsUpdating(false)

    if (!response.ok) {
      setMessage(data.error ?? "Build could not be deleted.")
      return
    }

    router.refresh()
  }

  async function copyLink() {
    await navigator.clipboard.writeText(`${window.location.origin}/builds/${build.id}`)
    setMessage("Public link copied.")
  }

  return (
    <article className="border border-white/10 bg-[#111412] p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="section-label">{build.purpose}</span>
            <span className="bg-white/5 px-2 py-1 text-xs font-bold uppercase text-gray-300">
              {build.isPublic ? "Public" : "Private"}
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-black text-white">{build.name}</h2>
          <p className="mt-2 text-sm text-gray-400">
            {build.items.length} parts · {build.resolution || "Flexible resolution"} · ${build.total.toFixed(2)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href={`/builds/${build.id}`} className="border border-white/15 px-3 py-2 text-xs font-black uppercase text-white">
            View
          </Link>
          <button
            type="button"
            onClick={toggleVisibility}
            disabled={isUpdating}
            className="border border-white/15 px-3 py-2 text-xs font-black uppercase text-white disabled:opacity-50"
          >
            Make {build.isPublic ? "private" : "public"}
          </button>
          {build.isPublic && (
            <button type="button" onClick={copyLink} className="bg-[#b7f34a] px-3 py-2 text-xs font-black uppercase text-black">
              Copy link
            </button>
          )}
          <button
            type="button"
            onClick={deleteBuild}
            disabled={isUpdating}
            className="border border-red-500/40 px-3 py-2 text-xs font-black uppercase text-red-200 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
      {message && <p className="mt-4 text-sm text-[#dfffa9]">{message}</p>}
    </article>
  )
}
