"use client"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/context/CartContext"

export default function ProductCard({ id, name, description, price, category, image }) {
  const { addToCart } = useCart()

  return (
    <div className="flex h-full flex-col rounded-lg border border-white/10 bg-gray-900 p-4 shadow-lg shadow-black/10">
      <Link href={`/products/${id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded bg-gray-800">
          <Image src={image} alt={name} fill unoptimized sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
        </div>
        <p className="mt-4 text-xs font-semibold uppercase text-blue-300">{category}</p>
        <h2 className="mt-1 text-lg font-bold text-white">{name}</h2>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm text-gray-400">{description}</p>
        <p className="mt-3 text-xl font-bold text-white">${price}</p>
        </Link>
        <button 
        onClick={() => addToCart({ id, name, description, price, category, image })}
        className="mt-auto w-full rounded bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700">
          Agregar al carrito
        </button>
      </div>
  )
}
