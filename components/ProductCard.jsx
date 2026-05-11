import Link from "next/link"

export default function ProductCard({ id, name, price, image }) {
  return (
    <Link href={`/products/${id}`}>
      <div className="bg-gray-800 rounded-lg p-4">
        <img src={image} alt={name} className="w-full h-48 object-cover rounded" />
        <h2 className="text-white text-lg font-bold mt-2">{name}</h2>
        <p className="text-gray-400">${price}</p>
        <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Add to cart
        </button>
      </div>
    </Link>
  )
}