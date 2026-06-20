import Stripe from "stripe"
import { paymentMatchesOrder } from "@/lib/orderRules"

export async function POST(request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return Response.json({ error: "Stripe webhook is not configured." }, { status: 503 })
  }

  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return Response.json({ error: "Missing Stripe signature." }, { status: 400 })
  }

  const rawBody = await request.text()
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  let event

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    console.error("Invalid Stripe webhook signature", error.message)
    return Response.json({ error: "Invalid webhook signature." }, { status: 400 })
  }

  try {
    if (event.type === "checkout.session.completed") {
      if (event.data.object.payment_status === "paid") {
        await markOrderAsPaid(event.data.object)
      }
    }

    if (event.type === "checkout.session.expired") {
      await cancelPendingOrder(event.data.object)
    }

    return Response.json({ received: true })
  } catch (error) {
    console.error("Failed to process Stripe webhook", error)
    return Response.json({ error: "Webhook processing failed." }, { status: 500 })
  }
}

async function markOrderAsPaid(session) {
  const orderId = session.metadata?.orderId || session.client_reference_id

  if (!orderId || !process.env.DATABASE_URL) {
    return
  }

  const { prisma } = await import("@/lib/prisma")
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  })

  if (!order) {
    throw new Error(`Order ${orderId} was not found.`)
  }

  if (!paymentMatchesOrder(order.total, session)) {
    throw new Error(`Payment amount validation failed for order ${orderId}.`)
  }

  await prisma.$transaction(async (transaction) => {
    const currentOrder = await transaction.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })

    if (!currentOrder || currentOrder.status === "PAID") {
      return
    }

    if (currentOrder.status !== "PENDING") {
      throw new Error(`Order ${orderId} is not pending.`)
    }

    for (const item of currentOrder.items) {
      const result = await transaction.product.updateMany({
        where: {
          id: item.productId,
          stock: { gte: item.quantity },
        },
        data: {
          stock: { decrement: item.quantity },
        },
      })

      if (result.count !== 1) {
        throw new Error(`Insufficient stock for product ${item.productId}.`)
      }
    }

    await transaction.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    })
  })
}

async function cancelPendingOrder(session) {
  const orderId = session.metadata?.orderId || session.client_reference_id

  if (!orderId || !process.env.DATABASE_URL) {
    return
  }

  const { prisma } = await import("@/lib/prisma")

  await prisma.order.updateMany({
    where: {
      id: orderId,
      status: "PENDING",
    },
    data: { status: "CANCELLED" },
  })
}
