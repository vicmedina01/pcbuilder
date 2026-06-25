"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Menu, X } from "lucide-react"
import { useCart } from "@/context/CartContext"

export default function Navbar() {
  const { data: session } = useSession()
  const { cart } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#090b0a]/95 text-white backdrop-blur-xl">
      <div className="bg-[#b7f34a] px-4 py-2 text-center text-xs font-extrabold uppercase text-[#090b0a]">
        Guided PC recommendations for gaming, AI, and creative work
      </div>

      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-6 sm:py-4 md:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="PCBuilder home">
          <span className="grid size-9 place-items-center border border-[#b7f34a] bg-[#b7f34a] text-sm font-black text-black">
            PC
          </span>
          <span className="hidden text-lg font-black uppercase text-white min-[360px]:inline">Builder</span>
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
            className="flex min-h-11 items-center border border-white/15 px-3 font-bold text-white hover:border-[#b7f34a] hover:text-[#b7f34a]"
          >
            Cart {itemCount > 0 && `(${itemCount})`}
          </Link>
          {session ? (
            <button
              onClick={() => signOut()}
              className="hidden min-h-11 bg-white px-3 font-bold text-black hover:bg-gray-200 sm:block"
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="hidden min-h-11 bg-[#b7f34a] px-3 font-bold text-black hover:bg-[#93d329] sm:block"
            >
              Sign in
            </button>
          )}
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="grid size-11 place-items-center border border-white/15 text-white lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <div id="mobile-navigation" className={`${menuOpen ? "block" : "hidden"} border-t border-white/10 bg-[#0d100e] lg:hidden`}>
        <div className="mx-auto grid max-w-7xl gap-1 px-4 py-3 text-sm font-bold text-gray-200 md:px-8">
          <MobileLink href="/builder" onNavigate={() => setMenuOpen(false)}>Build a PC</MobileLink>
          <MobileLink href="/products" onNavigate={() => setMenuOpen(false)}>Components</MobileLink>
          <MobileLink href="/#build-paths" onNavigate={() => setMenuOpen(false)}>Build paths</MobileLink>
          <MobileLink href="/#how-it-works" onNavigate={() => setMenuOpen(false)}>How it works</MobileLink>
          {session && <MobileLink href="/builds" onNavigate={() => setMenuOpen(false)}>My builds</MobileLink>}
          {session && <MobileLink href="/orders" onNavigate={() => setMenuOpen(false)}>Orders</MobileLink>}
          {session?.user?.role === "ADMIN" && <MobileLink href="/admin" onNavigate={() => setMenuOpen(false)}>Admin</MobileLink>}
          <button
            type="button"
            onClick={() => session ? signOut() : signIn("google")}
            className="mt-2 min-h-11 bg-[#b7f34a] px-4 text-left font-black text-black sm:hidden"
          >
            {session ? "Sign out" : "Sign in"}
          </button>
        </div>
      </div>
    </header>
  )
}

function MobileLink({ href, children, onNavigate }) {
  return <Link href={href} onClick={onNavigate} className="flex min-h-11 items-center border-b border-white/5 px-2">{children}</Link>
}
