"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { useCart } from "@/context/CartContext"

export default function Navbar() {
  const { data: session } = useSession()
  const { cart } = useCart()
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#090b0a]/95 text-white backdrop-blur-xl">
      <div className="bg-[#b7f34a] px-4 py-2 text-center text-xs font-extrabold uppercase text-[#090b0a]">
        Guided PC recommendations for gaming, AI, and creative work
      </div>

      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 md:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="PCBuilder home">
          <span className="grid size-9 place-items-center border border-[#b7f34a] bg-[#b7f34a] text-sm font-black text-black">
            PC
          </span>
          <span className="text-lg font-black uppercase text-white">Builder</span>
        </Link>

        <div className="hidden items-center gap-7 text-sm font-semibold lg:flex">
          <Link className="text-gray-300 hover:text-[#b7f34a]" href="/builder">Build a PC</Link>
          <Link className="text-gray-300 hover:text-[#b7f34a]" href="/products">Components</Link>
          <Link className="text-gray-300 hover:text-[#b7f34a]" href="/#build-paths">Build paths</Link>
          <Link className="text-gray-300 hover:text-[#b7f34a]" href="/#how-it-works">How it works</Link>
          {session && <Link className="text-gray-300 hover:text-[#b7f34a]" href="/builds">My builds</Link>}
          {session && <Link className="text-gray-300 hover:text-[#b7f34a]" href="/orders">Orders</Link>}
          {session?.user?.role === "ADMIN" && <Link className="text-gray-300 hover:text-[#b7f34a]" href="/admin">Admin</Link>}
        </div>

        <div className="flex shrink-0 items-center gap-2 text-sm">
          <Link
            href="/cart"
            className="border border-white/15 px-3 py-2 font-bold text-white hover:border-[#b7f34a] hover:text-[#b7f34a]"
          >
            Cart {itemCount > 0 && `(${itemCount})`}
          </Link>
          {session ? (
            <button
              onClick={() => signOut()}
              className="bg-white px-3 py-2 font-bold text-black hover:bg-gray-200"
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="bg-[#b7f34a] px-3 py-2 font-bold text-black hover:bg-[#93d329]"
            >
              Sign in
            </button>
          )}
        </div>
      </nav>

      <div className="overflow-x-auto border-t border-white/10 px-4 lg:hidden">
        <div className="mx-auto flex w-max min-w-full items-center justify-center gap-6 py-3 text-xs font-bold uppercase text-gray-300">
          <Link href="/builder">Build a PC</Link>
          <Link href="/products">Components</Link>
          <Link href="/#build-paths">Build paths</Link>
          {session && <Link href="/builds">My builds</Link>}
          {session && <Link href="/orders">Orders</Link>}
          {session?.user?.role === "ADMIN" && <Link href="/admin">Admin</Link>}
        </div>
      </div>
    </header>
  )
}
