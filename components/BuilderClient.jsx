"use client"

import { useMemo, useState } from "react"
import { builderCategories } from "@/lib/products"
import { useCart } from "@/context/CartContext"

export default function BuilderClient({ products }) {
  const { addToCart } = useCart()
  const [selection, setSelection] = useState({})

  const total = useMemo(
    () => Object.values(selection).reduce((sum, product) => sum + Number(product.price), 0),
    [selection]
  )
  const completedParts = Object.keys(selection).length

  function selectProduct(category, productId) {
    const product = products.find((item) => item.id === Number(productId))

    setSelection((current) => {
      if (!product) {
        const next = { ...current }
        delete next[category]
        return next
      }

      return { ...current, [category]: product }
    })
  }

  function addBuildToCart() {
    Object.values(selection).forEach((product) => addToCart(product))
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-4 py-8 md:grid-cols-[1fr_360px] md:px-8">
      <section>
        <p className="text-sm font-semibold uppercase text-blue-300">PC Builder</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Elige una pieza por categoria</h1>
        <div className="mt-6 grid gap-4">
          {builderCategories.map((category) => {
            const options = products.filter((product) => product.category === category)
            const selected = selection[category]

            return (
              <div key={category} className="rounded-lg border border-white/10 bg-gray-900 p-4">
                <label className="block text-sm font-semibold uppercase text-gray-400" htmlFor={`builder-${category}`}>
                  {category}
                </label>
                <select
                  id={`builder-${category}`}
                  value={selected?.id ?? ""}
                  onChange={(event) => selectProduct(category, event.target.value)}
                  className="mt-3 w-full rounded border border-white/10 bg-gray-800 px-3 py-3 text-white"
                >
                  <option value="">Selecciona componente</option>
                  {options.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ${product.price}
                    </option>
                  ))}
                </select>
                {selected && <p className="mt-3 text-sm text-gray-300">{selected.description}</p>}
              </div>
            )
          })}
        </div>
      </section>

      <aside className="h-fit rounded-lg border border-white/10 bg-gray-900 p-5">
        <h2 className="text-xl font-bold text-white">Resumen del build</h2>
        <p className="mt-2 text-sm text-gray-400">
          {completedParts} de {builderCategories.length} piezas seleccionadas
        </p>
        <div className="mt-5 grid gap-3">
          {builderCategories.map((category) => (
            <div key={category} className="flex justify-between gap-4 border-b border-white/10 pb-3 text-sm">
              <span className="text-gray-400">{category}</span>
              <span className="text-right font-semibold text-white">{selection[category]?.name ?? "Pendiente"}</span>
            </div>
          ))}
        </div>
        <p className="mt-5 text-2xl font-bold text-white">${total.toFixed(2)}</p>
        <button
          onClick={addBuildToCart}
          disabled={completedParts === 0}
          className="mt-5 w-full rounded bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-900"
        >
          Agregar build al carrito
        </button>
      </aside>
    </main>
  )
}
