export async function POST(request) {
  const { items = [], orderId } = await request.json()

  if (!Array.isArray(items) || items.length === 0) {
    return Response.json({ error: "Cart is empty." }, { status: 400 })
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
  const params = new URLSearchParams({
    mode: "payment",
    success_url: `${appUrl}/cart?checkout=success&order=${orderId ?? ""}`,
    cancel_url: `${appUrl}/cart?checkout=cancelled&order=${orderId ?? ""}`,
  })

  if (orderId) {
    params.append("client_reference_id", orderId)
    params.append("metadata[orderId]", orderId)
  }

  items.forEach((item, index) => {
    const quantity = Math.max(1, Number(item.quantity) || 1)
    const unitAmount = Math.round(Number(item.price) * 100)

    params.append(`line_items[${index}][quantity]`, String(quantity))
    params.append(`line_items[${index}][price_data][currency]`, "usd")
    params.append(`line_items[${index}][price_data][unit_amount]`, String(unitAmount))
    params.append(`line_items[${index}][price_data][product_data][name]`, item.name)
  })

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  })

  const checkoutSession = await response.json()

  if (!response.ok) {
    return Response.json({ error: checkoutSession.error?.message ?? "Stripe checkout failed." }, { status: 502 })
  }

  return Response.json({ url: checkoutSession.url })
}
