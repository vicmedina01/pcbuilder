"use client"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <span className="text-xl font-bold">PCBuilder</span>
      <div className="flex gap-6 items-center">
        <Link href="/products">Products</Link>
        <Link href="/builder">PC Builder</Link>
        <Link href="/cart">Cart</Link>
        {session ? (
          <button onClick={() => signOut()} className="bg-red-600 px-4 py-1 rounded">
            Sign out
          </button>
        ) : (
          <button onClick={() => signIn("google")} className="bg-blue-600 px-4 py-1 rounded">
            Sign in
          </button>
        )}
      </div>
    </nav>
  )
}