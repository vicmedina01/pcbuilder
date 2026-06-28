"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/context/CartContext"

export default function ProductCard({ id, name, description, price, category, image, stock, viewMode = "grid" }) {
  const { addToCart } = useCart()
  const numericStock = Number(stock) || 0
  const isLowStock = numericStock > 0 && numericStock <= 5
  const product = { id, name, description, price, category, image, stock }

  if (viewMode === "list") {
    return (
      <article className="group grid overflow-hidden border border-white/10 bg-[#111412] sm:grid-cols-[150px_minmax(0,1fr)] lg:grid-cols-[170px_minmax(0,1fr)_190px]">
        <Link href={`/products/${id}`} className="relative aspect-[4/3] overflow-hidden bg-[#f2f4f0] sm:aspect-auto sm:min-h-40">
          <Image
            src={image}
            alt={name}
            fill
            unoptimized
            sizes="170px"
            className="object-contain p-7 transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        <Link href={`/products/${id}`} className="min-w-0 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#252b27] px-2 py-1 text-[11px] font-black uppercase text-[#b7f34a]">{category}</span>
            {isLowStock && <span className="text-xs font-bold text-[#f3c94a]">Low stock</span>}
          </div>
          <h2 className="mt-3 text-xl font-black leading-7 text-white group-hover:text-[#b7f34a]">{name}</h2>
          <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-gray-400">{description}</p>
          <p className="mt-3 text-xs font-bold uppercase text-gray-500">{numericStock} available</p>
        </Link>

        <div className="flex flex-col justify-center border-t border-white/10 p-5 sm:col-span-2 lg:col-span-1 lg:border-l lg:border-t-0">
          <p className="text-xs font-bold uppercase text-gray-500">Price</p>
          <p className="mt-1 text-2xl font-black text-white">${Number(price).toFixed(2)}</p>
          <button
            onClick={() => addToCart(product)}
            disabled={numericStock === 0}
            className="mt-4 w-full bg-[#b7f34a] px-4 py-3 text-xs font-black uppercase text-black hover:bg-[#93d329] disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
          >
            {numericStock === 0 ? "Out of stock" : "Add to cart"}
          </button>
        </div>
      </article>
    )
  }

  return (
    <article className="group flex h-full flex-col border border-white/10 bg-[#111412]">
      <Link href={`/products/${id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#f2f4f0]">
          <Image
            src={image}
            alt={name}
            fill
            unoptimized
            sizes="(min-width: 1280px) 22vw, (min-width: 640px) 40vw, 100vw"
            className="object-contain p-10 transition-transform duration-300 group-hover:scale-[1.03] sm:p-12"
          />
          <span className="absolute left-3 top-3 bg-[#101310] px-2.5 py-1.5 text-[11px] font-black uppercase text-white">
            {category}
          </span>
          {isLowStock && (
            <span className="absolute right-3 top-3 bg-[#f3c94a] px-2.5 py-1.5 text-[11px] font-black uppercase text-black">
              Low stock
            </span>
          )}
        </div>

        <div className="p-4 pb-3">
          <h2 className="min-h-12 text-lg font-black leading-6 text-white group-hover:text-[#b7f34a]">{name}</h2>
          <p className="mt-2 line-clamp-2 min-h-11 text-sm leading-5 text-gray-400">{description}</p>
          <div className="mt-4 flex items-end justify-between gap-3 border-t border-white/10 pt-3">
            <div>
              <p className="text-[11px] font-bold uppercase text-gray-500">Price</p>
              <p className="mt-1 text-xl font-black text-white">${Number(price).toFixed(2)}</p>
            </div>
            <p className="text-[11px] font-bold uppercase text-gray-500">{numericStock} available</p>
          </div>
        </div>
      </Link>

      <div className="mt-auto px-4 pb-4">
        <button
          onClick={() => addToCart(product)}
          disabled={numericStock === 0}
          className="w-full bg-[#b7f34a] py-2.5 text-xs font-black uppercase text-black hover:bg-[#93d329] disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
        >
          {numericStock === 0 ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </article>
  )
}
