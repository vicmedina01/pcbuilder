"use client"

import Image from "next/image"
import { useCart } from "@/context/CartContext"

export default function ProductDetails({ product }) {
  const { addToCart } = useCart()

  return (
    <main className="mx-auto grid w-full max-w-7xl flex-1 gap-10 px-4 py-12 md:grid-cols-2 md:px-8 md:py-20">
      <div className="relative aspect-square overflow-hidden bg-[#f2f4f0]">
        <Image src={product.image} alt={product.name} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-contain p-8" />
      </div>
      <section>
        <p className="section-label">{product.category}</p>
        <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">{product.name}</h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-gray-300">{product.description}</p>
        <div className="mt-8 border-y border-white/10 py-5">
          <p className="text-xs font-bold uppercase text-gray-500">Price</p>
          <p className="mt-1 text-4xl font-black text-white">${Number(product.price).toFixed(2)}</p>
          <p className="mt-2 text-sm font-semibold text-gray-400">{product.stock} available</p>
        </div>
        <button
          onClick={() => addToCart(product)}
          className="mt-8 w-full bg-[#b7f34a] px-6 py-4 text-sm font-black uppercase text-black hover:bg-[#93d329] md:w-auto"
        >
          Add to cart
        </button>
      </section>
    </main>
  )
}
