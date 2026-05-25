import { products } from "@/lib/products"
import ProductDetails from "@/components/ProductDetails"

export default async function ProductPage({ params }) {
  const { id } = await params
  const product = products.find((p) => p.id === Number(id))

  if (!product) return <main className="flex-1 p-6 text-white">Producto no encontrado.</main>

  return <ProductDetails product={product} />
}
