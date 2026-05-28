import ProductCard from "@/components/ProductCard"
import { getProducts } from "@/lib/productService"

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-8">
      <div className="mb-6 flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase text-blue-300">Catalogo</p>
        <h1 className="text-3xl font-bold text-white">Componentes para tu PC</h1>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </main>
  )
}
