import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <span className="text-xl font-bold">PCBuilder</span>
      <div className="flex gap-6">
        <Link href="/products">Productos</Link>
        <Link href="/builder">PC Builder</Link>
        <Link href="/cart">Carrito</Link>
      </div>
    </nav>
  )
}