"use client"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { useCart } from "@/context/CartContext"

export default function Navbar() {
  const { data: session } = useSession()
  const { cart } = useCart()
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="sticky top-0 z-10 border-b border-white/10 bg-[#111827]/95 px-4 py-4 text-white backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="text-xl font-bold tracking-wide">PCBuilder</Link>
        <div className="flex flex-wrap items-center gap-4 text-sm md:gap-6">
          <Link className="text-gray-200 hover:text-white" href="/products">Productos</Link>
          <Link className="text-gray-200 hover:text-white" href="/builder">PC Builder</Link>
          <Link className="text-gray-200 hover:text-white" href="/cart">Carrito ({itemCount})</Link>
          {session && <Link className="text-gray-200 hover:text-white" href="/orders">Orders</Link>}
        {session ? (
          <button onClick={() => signOut()} className="rounded bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700">
            Salir
          </button>
        ) : (
          <button onClick={() => signIn("google")} className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700">
            Entrar
          </button>
        )}
        </div>
      </div>
    </nav>
  )
}
