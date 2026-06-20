import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return Response.json({ error: "You must be signed in to create an order." }, { status: 401 })
  }

  if (!process.env.DATABASE_URL) {
    return Response.json({ error: "Database is not configured." }, { status: 503 })
  }

  const body = await request.json()
  const items = Array.isArray(body.items) ? body.items : []

  if (items.length === 0) {
    return Response.json({ error: "Cart is empty." }, { status: 400 })
  }

  const quantityByProduct = new Map()

  for (const item of items) {
    const id = Number(item.id)
    const quantity = Number(item.quantity)

    if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(quantity) || quantity <= 0) {
      return Response.json({ error: "Cart contains invalid product data." }, { status: 400 })
    }

    quantityByProduct.set(id, (quantityByProduct.get(id) ?? 0) + quantity)
  }

  const normalizedItems = Array.from(quantityByProduct, ([id, quantity]) => ({ id, quantity }))

  const { prisma } = await import("@/lib/prisma")
  const products = await prisma.product.findMany({
    where: { id: { in: normalizedItems.map((item) => item.id) } },
  })

  if (products.length !== normalizedItems.length) {
    return Response.json({ error: "One or more products are unavailable." }, { status: 400 })
  }

  const productMap = new Map(products.map((product) => [product.id, product]))
  const unavailableItem = normalizedItems.find((item) => productMap.get(item.id).stock < item.quantity)

  if (unavailableItem) {
    return Response.json(
      { error: `${productMap.get(unavailableItem.id).name} does not have enough stock.` },
      { status: 409 }
    )
  }

  const total = normalizedItems.reduce((sum, item) => {
    const product = productMap.get(item.id)
    return sum + Number(product.price) * item.quantity
  }, 0)

  const order = await prisma.$transaction(async (transaction) => {
    const user = await transaction.user.upsert({
      where: { email: session.user.email },
      update: {
        name: session.user.name,
        image: session.user.image,
      },
      create: {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      },
    })

    return transaction.order.create({
      data: {
        userId: user.id,
        total,
        items: {
          create: normalizedItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: productMap.get(item.id).price,
          })),
        },
      },
      include: {
        items: true,
      },
    })
  })

  return Response.json({
    order: {
      ...order,
      total: Number(order.total),
      items: order.items.map((item) => ({ ...item, price: Number(item.price) })),
    },
  })
}
