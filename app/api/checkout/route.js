import Stripe from "stripe"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return Response.json({ error: "You must be signed in to start checkout." }, { status: 401 })
  }

  if (!process.env.DATABASE_URL) {
    return Response.json({ error: "Database is not configured." }, { status: 503 })
  }

  const { orderId } = await request.json()

  if (typeof orderId !== "string" || orderId.length === 0) {
    return Response.json({ error: "A valid order is required." }, { status: 400 })
  }

  const { prisma } = await import("@/lib/prisma")
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      user: { email: session.user.email },
    },
    include: {
      items: {
        include: { product: true },
      },
    },
  })

  if (!order) {
    return Response.json({ error: "Order not found." }, { status: 404 })
  }

  if (order.status !== "PENDING") {
    return Response.json({ error: "This order can no longer be paid." }, { status: 409 })
  }

  if (order.items.length === 0) {
    return Response.json({ error: "Order has no items." }, { status: 400 })
  }

  const unavailableItem = order.items.find((item) => item.product.stock < item.quantity)

  if (unavailableItem) {
    return Response.json(
      { error: `${unavailableItem.product.name} does not have enough stock.` },
      { status: 409 }
    )
  }

  const calculatedTotal = order.items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  )

  if (Math.abs(calculatedTotal - Number(order.total)) > 0.001) {
    return Response.json({ error: "Order total validation failed." }, { status: 409 })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return Response.json(
      {
        error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY to enable checkout.",
        testMode: true,
      },
      { status: 503 }
    )
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${appUrl}/cart?checkout=success&order=${order.id}`,
      cancel_url: `${appUrl}/cart?checkout=cancelled&order=${order.id}`,
      client_reference_id: order.id,
      customer_email: session.user.email,
      metadata: { orderId: order.id },
      line_items: order.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(Number(item.price) * 100),
          product_data: {
            name: item.product.name,
          },
        },
      })),
    })

    return Response.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Stripe checkout failed", error)
    return Response.json({ error: "Stripe checkout failed." }, { status: 502 })
  }
}
