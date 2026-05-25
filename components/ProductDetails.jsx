"use client"

import Image from "next/image"
import { useCart } from "@/context/CartContext"

export default function ProductDetails({ product }) {
  const { addToCart } = useCart()

  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-4 py-8 md:grid-cols-2 md:px-8">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-900">
        <Image src={product.image} alt={product.name} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
      </div>
      <section>
        <p className="text-sm font-semibold uppercase text-blue-300">{product.category}</p>
        <h1 className="mt-3 text-4xl font-bold text-white">{product.name}</h1>
        <p className="mt-4 text-lg leading-8 text-gray-300">{product.description}</p>
        <p className="mt-5 text-3xl font-bold text-white">${product.price}</p>
        <p className="mt-2 text-sm text-gray-400">{product.stock} disponibles</p>
        <button
          onClick={() => addToCart(product)}
          className="mt-8 w-full rounded bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 md:w-auto"
        >
          Agregar al carrito
        </button>
      </section>
    </main>
  )
}
