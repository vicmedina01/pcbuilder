"use client"
import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { useCart } from "@/context/CartContext"

export default function CartPage() {
  return (
    <Suspense fallback={<main className="flex-1 p-6 text-white">Loading cart...</main>}>
      <CartContent />
    </Suspense>
  )
}

function CartContent() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const { cart, removeFromCart, updateQuantity, clearCart, total, isHydrated } = useCart()
  const [message, setMessage] = useState("")
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const checkoutStatus = searchParams.get("checkout")

  useEffect(() => {
    if (checkoutStatus === "success") {
      clearCart()
    }
  }, [checkoutStatus, clearCart])

  async function handleCheckout() {
    setMessage("")

    if (!session) {
      signIn("google")
      return
    }

    setIsCheckingOut(true)

    try {
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      })
      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        setMessage(orderData.error ?? "The order could not be created.")
        return
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderData.order.id }),
      })
      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
        return
      }

      setMessage(data.error ?? "Checkout is running in test mode. Configure Stripe to enable payments.")
    } catch (error) {
      console.error(error)
      setMessage("Checkout could not be started. Please try again.")
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (!isHydrated) {
    return <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 text-gray-300 md:px-8">Loading cart...</main>
  }

  if (cart.length === 0) {
    return (
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 md:px-8">
        {searchParams.get("checkout") === "success" && (
          <p className="mb-4 border border-green-500/30 bg-green-500/10 p-4 text-green-200">
            Payment completed. Thank you for your purchase.
          </p>
        )}
        {searchParams.get("checkout") === "cancelled" && (
          <p className="mb-4 border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-100">
            Checkout was cancelled. You can try again whenever you are ready.
          </p>
        )}
        <h1 className="text-3xl font-black text-white">Your cart is empty</h1>
        <p className="mt-3 text-gray-300">Add components from the catalog or guided PC Builder.</p>
      </main>
    )
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-4 py-8 md:grid-cols-[1fr_360px] md:px-8">
      <section>
        <p className="section-label">Checkout</p>
        <h1 className="mb-6 mt-3 text-4xl font-black text-white">Your cart</h1>
        <div className="grid gap-4">
          {cart.map((item) => (
            <div key={item.id} className="border border-white/10 bg-[#111412] p-4 text-white">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm text-gray-400">${item.price} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    aria-label={`Quantity of ${item.name}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item.id, event.target.value)}
                    className="w-20 border border-white/10 bg-[#090b0a] px-3 py-2 text-white"
                  />
                  <button onClick={() => removeFromCart(item.id)} className="border border-red-500/40 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="h-fit border border-white/10 bg-[#111412] p-5">
        <h2 className="text-xl font-black text-white">Summary</h2>
        {checkoutStatus === "cancelled" && (
          <p className="mt-4 border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-100">
            Checkout was cancelled. Review your cart and try again.
          </p>
        )}
        <div className="mt-5 flex justify-between border-b border-white/10 pb-4 text-gray-300">
          <span>Total</span>
          <span className="font-bold text-white">${total.toFixed(2)}</span>
        </div>
        {message && <p className="mt-4 border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-100">{message}</p>}
        <button
          onClick={handleCheckout}
          disabled={isCheckingOut}
          className="mt-5 w-full bg-[#b7f34a] px-5 py-3 font-black uppercase text-black hover:bg-[#93d329] disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
        >
          {isCheckingOut ? "Preparing..." : "Continue to checkout"}
        </button>
        <button onClick={clearCart} className="mt-3 w-full border border-white/15 px-5 py-3 font-semibold text-white hover:border-white/40">
          Clear cart
        </button>
      </aside>
    </main>
  )
}
