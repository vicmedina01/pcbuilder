import { products } from "@/lib/products"

export default async function ProductPage({ params }) {
  const { id } = await params
  const product = products.find((p) => p.id === Number(id))

  if (!product) return <main className="flex-1 p-6 text-white">Product not found</main>

  return (
    <main className="flex-1 p-6">
      <img src={product.image} alt={product.name} className="w-96 h-64 object-cover rounded" />
      <h1 className="text-white text-3xl font-bold mt-4">{product.name}</h1>
      <p className="text-gray-400 text-xl mt-2">${product.price}</p>
      <p className="text-gray-300 mt-2">{product.category}</p>
      <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
        Add to cart
      </button>
    </main>
  )
}