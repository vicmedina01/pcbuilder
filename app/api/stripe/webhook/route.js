import Stripe from "stripe"

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
      await updateOrderStatus(event.data.object, "PAID")
    }

    if (event.type === "checkout.session.expired") {
      await updateOrderStatus(event.data.object, "CANCELLED")
    }

    return Response.json({ received: true })
  } catch (error) {
    console.error("Failed to process Stripe webhook", error)
    return Response.json({ error: "Webhook processing failed." }, { status: 500 })
  }
}

async function updateOrderStatus(session, status) {
  const orderId = session.metadata?.orderId || session.client_reference_id

  if (!orderId || !process.env.DATABASE_URL) {
    return
  }

  const { prisma } = await import("@/lib/prisma")

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  })
}
