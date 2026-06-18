"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/context/CartContext"

export default function ProductCard({ id, name, description, price, category, image, stock }) {
  const { addToCart } = useCart()
  const isLowStock = Number(stock) > 0 && Number(stock) <= 5

  return (
    <article className="group flex h-full flex-col border border-white/10 bg-[#111412]">
      <Link href={`/products/${id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[#f2f4f0]">
          <Image
            src={image}
            alt={name}
            fill
            unoptimized
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 bg-[#101310] px-3 py-2 text-xs font-black uppercase text-white">
            {category}
          </span>
          {isLowStock && (
            <span className="absolute right-3 top-3 bg-[#f3c94a] px-3 py-2 text-xs font-black uppercase text-black">
              Low stock
            </span>
          )}
        </div>

        <div className="p-5 pb-3">
          <h2 className="min-h-14 text-xl font-black leading-7 text-white group-hover:text-[#b7f34a]">{name}</h2>
          <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-gray-400">{description}</p>
          <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/10 pt-4">
            <div>
              <p className="text-xs font-bold uppercase text-gray-500">Price</p>
              <p className="mt-1 text-2xl font-black text-white">${Number(price).toFixed(2)}</p>
            </div>
            <p className="text-xs font-bold uppercase text-gray-500">{Number(stock) || 0} available</p>
          </div>
        </div>
      </Link>

      <div className="mt-auto px-5 pb-5">
        <button
          onClick={() => addToCart({ id, name, description, price, category, image, stock })}
          disabled={Number(stock) === 0}
          className="w-full bg-[#b7f34a] py-3 text-sm font-black uppercase text-black hover:bg-[#93d329] disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
        >
          {Number(stock) === 0 ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </article>
  )
}
