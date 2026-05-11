"use client"
import { useCart } from "@/context/CartContext"

export default function CartPage() {
  const { cart, removeFromCart } = useCart()

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cart.length === 0) return <main className="flex-1 p-6 text-white">Your cart is empty.</main>

  return (
    <main className="flex-1 p-6">
      <h1 className="text-white text-2xl font-bold mb-6">Your Cart</h1>
      {cart.map((item) => (
        <div key={item.id} className="bg-gray-800 text-white p-4 rounded mb-3 flex justify-between items-center">
          <div>
            <p className="font-bold">{item.name}</p>
            <p className="text-gray-400">${item.price} x {item.quantity}</p>
          </div>
          <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
            Remove
          </button>
        </div>
      ))}
      <p className="text-white text-xl font-bold mt-4">Total: ${total}</p>
    </main>
  )
}