"use client"

import { useMemo, useState } from "react"
import ProductCard from "@/components/ProductCard"

const categories = ["All", "CPU", "GPU", "Motherboard", "RAM", "Storage", "PSU", "Case", "Cooling"]

export default function ProductsCatalog({ products }) {
  const [category, setCategory] = useState("All")
  const [query, setQuery] = useState("")

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description?.toLowerCase().includes(normalizedQuery)

      return matchesCategory && matchesQuery
    })
  }, [category, products, query])

  return (
    <>
      <div className="border-y border-white/10 bg-[#111412]">
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`shrink-0 border px-4 py-2 text-xs font-black uppercase ${
                    category === item
                      ? "border-[#b7f34a] bg-[#b7f34a] text-black"
                      : "border-white/10 text-gray-300 hover:border-white/30"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <label className="relative block w-full lg:max-w-sm">
              <span className="sr-only">Search components</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search CPU, GPU, brand..."
                className="w-full border border-white/15 bg-[#090b0a] px-4 py-3 text-sm text-white placeholder:text-gray-500"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-sm font-bold text-gray-400">
            <span className="text-white">{filteredProducts.length}</span> components
          </p>
          <p className="text-xs font-bold uppercase text-gray-500">{category} results</p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="border border-white/10 bg-[#111412] px-6 py-16 text-center">
            <h2 className="text-2xl font-black text-white">No components found</h2>
            <p className="mt-3 text-gray-400">Try another category or a shorter search.</p>
          </div>
        )}
      </div>
    </>
  )
}
