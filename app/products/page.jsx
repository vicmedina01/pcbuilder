import ProductsCatalog from "@/components/ProductsCatalog"
import { getProducts } from "@/lib/productService"

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <main className="flex-1 bg-[#090b0a]">
      <div className="hardware-grid mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
        <p className="section-label">Component catalog</p>
        <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <h1 className="max-w-3xl text-4xl font-black text-white md:text-6xl">Find the right part, not just another part.</h1>
          <p className="max-w-md leading-7 text-gray-400">
            Browse the catalog by category or search for a specific model. Add parts directly or compare them inside
            the guided builder.
          </p>
        </div>
      </div>
      <ProductsCatalog products={products} />
    </main>
  )
}
