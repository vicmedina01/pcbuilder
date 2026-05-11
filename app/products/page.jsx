import ProductCard from "@/components/ProductCard"
import { products } from "@/lib/products"

export default function ProductsPage() {
  return (
    <main className="flex-1 p-6">
      <h1 className="text-white text-2xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </main>
  )
}