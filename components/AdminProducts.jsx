"use client"

import { useMemo, useState } from "react"
import Image from "next/image"

const categories = ["CPU", "Motherboard", "RAM", "GPU", "Storage", "PSU", "Case", "Cooling"]
const emptyProduct = {
  name: "",
  description: "",
  price: "",
  category: "CPU",
  image: "",
  stock: 0,
  brand: "",
  socket: "",
  chipset: "",
  formFactor: "",
  memoryType: "",
  capacityGb: "",
  storageType: "",
  wattage: "",
  tdp: "",
  vramGb: "",
  lengthMm: "",
  coolerHeightMm: "",
  radiatorSize: "",
  recommendedPsu: "",
  overclockable: "",
  maxGpuLengthMm: "",
  maxCoolerHeightMm: "",
  supportedSockets: "",
  supportedFormFactors: "",
  supportedRadiatorSizes: "",
  featured: false,
}

export default function AdminProducts({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts)
  const [draft, setDraft] = useState(emptyProduct)
  const [editingId, setEditingId] = useState(null)
  const [query, setQuery] = useState("")
  const [message, setMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return products
    return products.filter((product) =>
      [product.name, product.brand, product.category].some((value) => value?.toLowerCase().includes(normalized))
    )
  }, [products, query])

  const totalStock = products.reduce((sum, product) => sum + Number(product.stock), 0)
  const lowStock = products.filter((product) => product.stock > 0 && product.stock <= 5).length
  const featured = products.filter((product) => product.featured).length

  function updateDraft(field, value) {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  function startEditing(product) {
    setEditingId(product.id)
    setMessage("")
    setDraft({
      ...emptyProduct,
      ...product,
      price: String(product.price),
      stock: String(product.stock),
      supportedSockets: product.supportedSockets?.join(", ") ?? "",
      supportedFormFactors: product.supportedFormFactors?.join(", ") ?? "",
      supportedRadiatorSizes: product.supportedRadiatorSizes?.join(", ") ?? "",
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function resetForm() {
    setEditingId(null)
    setDraft(emptyProduct)
    setMessage("")
  }

  async function saveProduct(event) {
    event.preventDefault()
    setIsSaving(true)
    setMessage("")

    try {
      const url = editingId ? `/api/admin/products/${editingId}` : "/api/admin/products"
      const response = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      })
      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error ?? "Product could not be saved.")
        return
      }

      setProducts((current) =>
        editingId
          ? current.map((product) => (product.id === data.product.id ? data.product : product))
          : [data.product, ...current]
      )
      setMessage(editingId ? "Product updated." : "Product created.")
      setEditingId(null)
      setDraft(emptyProduct)
    } catch {
      setMessage("Product could not be saved.")
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteProduct(product) {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) return

    const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" })

    if (response.ok) {
      setProducts((current) => current.filter((item) => item.id !== product.id))
      setMessage("Product deleted.")
      if (editingId === product.id) resetForm()
      return
    }

    const data = await response.json()
    setMessage(data.error ?? "Product could not be deleted.")
  }

  return (
    <div className="mt-8 grid gap-8 xl:grid-cols-[380px_minmax(0,1fr)]">
      <section className="h-fit border border-white/10 bg-[#111412] p-4 sm:p-5 xl:sticky xl:top-32">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-black text-white">{editingId ? "Edit product" : "Add product"}</h2>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-xs font-black uppercase text-[#b7f34a]">
              Cancel
            </button>
          )}
        </div>

        <form onSubmit={saveProduct} className="mt-5 grid gap-4">
          <AdminField label="Product name" required value={draft.name} onChange={(value) => updateDraft("name", value)} />
          <AdminField label="Description" multiline value={draft.description} onChange={(value) => updateDraft("description", value)} />
          <div className="grid grid-cols-2 gap-3">
            <AdminField label="Price" type="number" min="0" step="0.01" required value={draft.price} onChange={(value) => updateDraft("price", value)} />
            <AdminField label="Stock" type="number" min="0" step="1" required value={draft.stock} onChange={(value) => updateDraft("stock", value)} />
          </div>
          <label className="grid gap-2 text-sm font-bold text-gray-300">
            Category
            <select
              value={draft.category}
              onChange={(event) => updateDraft("category", event.target.value)}
              className="min-h-11 border border-white/15 bg-[#090b0a] px-3 text-white"
            >
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <AdminField label="Local image path" placeholder="/products/gpu/example.jpg" value={draft.image} onChange={(value) => updateDraft("image", value)} />
          <AdminField label="Brand" value={draft.brand} onChange={(value) => updateDraft("brand", value)} />

          <details className="border-y border-white/10 py-4">
            <summary className="cursor-pointer text-sm font-black uppercase text-[#b7f34a]">Technical specifications</summary>
            <div className="mt-4 grid gap-4">
              <div className="grid grid-cols-2 gap-3">
                <AdminField label="Socket" value={draft.socket} onChange={(value) => updateDraft("socket", value)} />
                <AdminField label="Chipset" value={draft.chipset} onChange={(value) => updateDraft("chipset", value)} />
                <AdminField label="Form factor" value={draft.formFactor} onChange={(value) => updateDraft("formFactor", value)} />
                <AdminField label="Memory type" value={draft.memoryType} onChange={(value) => updateDraft("memoryType", value)} />
                <AdminField label="Capacity GB" type="number" min="0" value={draft.capacityGb} onChange={(value) => updateDraft("capacityGb", value)} />
                <AdminField label="VRAM GB" type="number" min="0" value={draft.vramGb} onChange={(value) => updateDraft("vramGb", value)} />
                <AdminField label="Wattage" type="number" min="0" value={draft.wattage} onChange={(value) => updateDraft("wattage", value)} />
                <AdminField label="Recommended PSU" type="number" min="0" value={draft.recommendedPsu} onChange={(value) => updateDraft("recommendedPsu", value)} />
                <AdminField label="GPU length mm" type="number" min="0" value={draft.lengthMm} onChange={(value) => updateDraft("lengthMm", value)} />
                <AdminField label="Radiator mm" type="number" min="0" value={draft.radiatorSize} onChange={(value) => updateDraft("radiatorSize", value)} />
              </div>
              <AdminField label="Supported sockets" hint="Comma separated" value={draft.supportedSockets} onChange={(value) => updateDraft("supportedSockets", value)} />
              <AdminField label="Supported form factors" hint="Comma separated" value={draft.supportedFormFactors} onChange={(value) => updateDraft("supportedFormFactors", value)} />
              <AdminField label="Supported radiator sizes" hint="Comma separated" value={draft.supportedRadiatorSizes} onChange={(value) => updateDraft("supportedRadiatorSizes", value)} />
            </div>
          </details>

          <label className="flex min-h-11 items-center gap-3 text-sm font-bold text-gray-300">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(event) => updateDraft("featured", event.target.checked)}
              className="size-4 accent-[#b7f34a]"
            />
            Feature this product
          </label>

          <button disabled={isSaving} className="min-h-12 bg-[#b7f34a] px-4 font-black uppercase text-black disabled:opacity-50">
            {isSaving ? "Saving..." : editingId ? "Save changes" : "Create product"}
          </button>
          {message && <p role="status" className="text-sm leading-6 text-gray-300">{message}</p>}
        </form>
      </section>

      <section className="min-w-0">
        <div className="grid gap-3 sm:grid-cols-3">
          <AdminStat label="Products" value={products.length} />
          <AdminStat label="Units in stock" value={totalStock} />
          <AdminStat label="Low stock / featured" value={`${lowStock} / ${featured}`} />
        </div>

        <label className="mt-5 block">
          <span className="sr-only">Search catalog administration</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by product, brand, or category..."
            className="min-h-12 w-full border border-white/15 bg-[#111412] px-4 text-white placeholder:text-gray-500"
          />
        </label>

        <div className="mt-5 grid gap-3">
          {filteredProducts.map((product) => (
            <article key={product.id} className="grid gap-4 border border-white/10 bg-[#111412] p-4 sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:items-center">
              <div className="relative aspect-square overflow-hidden bg-[#f2f4f0]">
                {product.image && <Image src={product.image} alt="" fill sizes="72px" className="object-contain p-2" />}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black uppercase text-[#b7f34a]">{product.category}</span>
                  {product.featured && <span className="bg-[#b7f34a]/15 px-2 py-1 text-[10px] font-black uppercase text-[#dfffa9]">Featured</span>}
                </div>
                <h3 className="mt-1 truncate font-black text-white">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-400">${Number(product.price).toFixed(2)} · {product.stock} in stock</p>
              </div>
              <div className="flex gap-2 sm:justify-end">
                <button type="button" onClick={() => startEditing(product)} className="min-h-11 flex-1 border border-white/15 px-4 text-sm font-bold text-white sm:flex-none">
                  Edit
                </button>
                <button type="button" onClick={() => deleteProduct(product)} className="min-h-11 flex-1 border border-red-500/40 px-4 text-sm font-bold text-red-200 sm:flex-none">
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function AdminField({ label, hint, multiline = false, onChange, ...props }) {
  const className = "w-full border border-white/15 bg-[#090b0a] px-3 py-2.5 text-white placeholder:text-gray-600"

  return (
    <label className="grid gap-2 text-sm font-bold text-gray-300">
      <span>{label} {hint && <span className="font-normal text-gray-500">({hint})</span>}</span>
      {multiline ? (
        <textarea {...props} rows={3} onChange={(event) => onChange(event.target.value)} className={className} />
      ) : (
        <input {...props} onChange={(event) => onChange(event.target.value)} className={`${className} min-h-11`} />
      )}
    </label>
  )
}

function AdminStat({ label, value }) {
  return (
    <div className="border border-white/10 bg-[#111412] p-4">
      <p className="text-xs font-black uppercase text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  )
}
