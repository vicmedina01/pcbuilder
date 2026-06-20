import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { calculateOrderTotal, normalizeCartItems } from "@/lib/orderRules"

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

  let normalizedItems

  try {
    normalizedItems = normalizeCartItems(items)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }

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

  const total = calculateOrderTotal(normalizedItems, productMap)

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
