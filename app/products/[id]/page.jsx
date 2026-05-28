import ProductDetails from "@/components/ProductDetails"
import { getProductById } from "@/lib/productService"

export default async function ProductPage({ params }) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) return <main className="flex-1 p-6 text-white">Producto no encontrado.</main>

  return <ProductDetails product={product} />
}
