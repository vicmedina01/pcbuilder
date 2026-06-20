"use client"
import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { useCart } from "@/context/CartContext"

export default function CartPage() {
  return (
    <Suspense fallback={<main className="flex-1 p-6 text-white">Cargando carrito...</main>}>
      <CartContent />
    </Suspense>
  )
}

function CartContent() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart()
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
        setMessage(orderData.error ?? "No se pudo crear la orden.")
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

      setMessage(data.error ?? "Checkout preparado en modo test. Configura Stripe para activar pagos.")
    } catch (error) {
      console.error(error)
      setMessage("No se pudo iniciar el checkout. Intenta de nuevo.")
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (cart.length === 0) {
    return (
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 md:px-8">
        {searchParams.get("checkout") === "success" && (
          <p className="mb-4 rounded border border-green-500/30 bg-green-500/10 p-4 text-green-200">
            Pago completado. Gracias por tu compra.
          </p>
        )}
        {searchParams.get("checkout") === "cancelled" && (
          <p className="mb-4 rounded border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-100">
            Checkout cancelado. Puedes volver a intentarlo cuando quieras.
          </p>
        )}
        <h1 className="text-3xl font-bold text-white">Tu carrito esta vacio</h1>
        <p className="mt-3 text-gray-300">Agrega componentes desde el catalogo o desde PC Builder.</p>
      </main>
    )
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-4 py-8 md:grid-cols-[1fr_360px] md:px-8">
      <section>
        <h1 className="mb-6 text-3xl font-bold text-white">Tu carrito</h1>
        <div className="grid gap-4">
          {cart.map((item) => (
            <div key={item.id} className="rounded-lg border border-white/10 bg-gray-900 p-4 text-white">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm text-gray-400">${item.price} cada uno</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    aria-label={`Cantidad de ${item.name}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item.id, event.target.value)}
                    className="w-20 rounded border border-white/10 bg-gray-800 px-3 py-2 text-white"
                  />
                  <button onClick={() => removeFromCart(item.id)} className="rounded border border-red-500/40 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10">
                    Quitar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="h-fit rounded-lg border border-white/10 bg-gray-900 p-5">
        <h2 className="text-xl font-bold text-white">Resumen</h2>
        {checkoutStatus === "cancelled" && (
          <p className="mt-4 rounded border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-100">
            Checkout cancelado. Revisa tu carrito e intenta de nuevo.
          </p>
        )}
        <div className="mt-5 flex justify-between border-b border-white/10 pb-4 text-gray-300">
          <span>Total</span>
          <span className="font-bold text-white">${total.toFixed(2)}</span>
        </div>
        {message && <p className="mt-4 rounded border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-100">{message}</p>}
        <button
          onClick={handleCheckout}
          disabled={isCheckingOut}
          className="mt-5 w-full rounded bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-900"
        >
          {isCheckingOut ? "Preparando..." : "Ir a checkout"}
        </button>
        <button onClick={clearCart} className="mt-3 w-full rounded border border-white/15 px-5 py-3 font-semibold text-white hover:border-white/40">
          Vaciar carrito
        </button>
      </aside>
    </main>
  )
}
