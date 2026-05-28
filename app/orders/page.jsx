import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return (
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 md:px-8">
        <p className="text-sm font-semibold uppercase text-blue-300">Orders</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Sign in to view your orders</h1>
        <p className="mt-3 text-gray-300">Your order history is connected to your Google account.</p>
      </main>
    )
  }

  const orders = await getOrdersByEmail(session.user.email)

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase text-blue-300">Orders</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Order history</h1>
      </div>

      {orders.length === 0 ? (
        <section className="rounded-lg border border-white/10 bg-gray-900 p-6">
          <h2 className="text-xl font-bold text-white">No orders yet</h2>
          <p className="mt-2 text-gray-300">When you create an order from the cart, it will show up here.</p>
          <Link href="/products" className="mt-5 inline-block rounded bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
            Browse products
          </Link>
        </section>
      ) : (
        <div className="grid gap-5">
          {orders.map((order) => (
            <article key={order.id} className="rounded-lg border border-white/10 bg-gray-900 p-5">
              <div className="flex flex-col gap-3 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-gray-400">Order #{order.id.slice(0, 8)}</p>
                  <h2 className="mt-1 text-xl font-bold text-white">${order.total.toFixed(2)}</h2>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="rounded border border-blue-400/30 px-3 py-1 font-semibold text-blue-200">{order.status}</span>
                  <span className="rounded border border-white/10 px-3 py-1 text-gray-300">{formatDate(order.createdAt)}</span>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex flex-col gap-2 rounded border border-white/10 bg-gray-800 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-white">{item.product.name}</p>
                      <p className="text-sm text-gray-400">{item.product.category}</p>
                    </div>
                    <p className="text-sm text-gray-300">
                      {item.quantity} x ${item.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

async function getOrdersByEmail(email) {
  try {
    if (!process.env.DATABASE_URL) {
      return []
    }

    const { prisma } = await import("@/lib/prisma")
    const orders = await prisma.order.findMany({
      where: {
        user: { email },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return orders.map((order) => ({
      ...order,
      total: Number(order.total),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    }))
  } catch (error) {
    console.error("Failed to load orders", error)
    return []
  }
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}
