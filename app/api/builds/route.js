import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { builderCategories } from "@/lib/products"
import { getCompatibilityReport } from "@/lib/compatibility"
import { serializeBuild } from "@/lib/builds"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return Response.json({ error: "You must be signed in to view builds." }, { status: 401 })
  }

  if (!process.env.DATABASE_URL) {
    return Response.json({ error: "Database is not configured." }, { status: 503 })
  }

  const { prisma } = await import("@/lib/prisma")
  const builds = await prisma.build.findMany({
    where: { user: { email: session.user.email } },
    include: { items: { include: { product: true } } },
    orderBy: { updatedAt: "desc" },
  })

  return Response.json({ builds: builds.map(serializeBuild) })
}

export async function POST(request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return Response.json({ error: "You must be signed in to save a build." }, { status: 401 })
  }

  if (!process.env.DATABASE_URL) {
    return Response.json({ error: "Database is not configured." }, { status: 503 })
  }

  const body = await request.json()
  const name = typeof body.name === "string" ? body.name.trim() : ""
  const purpose = typeof body.purpose === "string" ? body.purpose : "gaming"
  const items = Array.isArray(body.items) ? body.items : []

  if (name.length < 2 || name.length > 80) {
    return Response.json({ error: "Build name must be between 2 and 80 characters." }, { status: 400 })
  }

  if (!items.length || items.length > builderCategories.length) {
    return Response.json({ error: "Select at least one valid component." }, { status: 400 })
  }

  const normalizedItems = items.map((item) => ({
    category: item.category,
    productId: Number(item.productId),
  }))
  const categories = new Set(normalizedItems.map((item) => item.category))

  if (
    categories.size !== normalizedItems.length ||
    normalizedItems.some(
      (item) => !builderCategories.includes(item.category) || !Number.isInteger(item.productId) || item.productId <= 0
    )
  ) {
    return Response.json({ error: "Build contains invalid component selections." }, { status: 400 })
  }

  const { prisma } = await import("@/lib/prisma")
  const products = await prisma.product.findMany({
    where: { id: { in: normalizedItems.map((item) => item.productId) } },
  })

  if (products.length !== normalizedItems.length) {
    return Response.json({ error: "One or more selected products no longer exist." }, { status: 400 })
  }

  const productsById = new Map(products.map((product) => [product.id, product]))

  if (normalizedItems.some((item) => productsById.get(item.productId).category !== item.category)) {
    return Response.json({ error: "A product does not match its selected category." }, { status: 400 })
  }

  const selection = Object.fromEntries(
    normalizedItems.map((item) => [item.category, productsById.get(item.productId)])
  )
  const compatibility = getCompatibilityReport(selection)

  if (compatibility.status === "incompatible") {
    return Response.json(
      { error: "The build contains incompatible parts.", issues: compatibility.issues },
      { status: 409 }
    )
  }

  const build = await prisma.$transaction(async (transaction) => {
    const user = await transaction.user.upsert({
      where: { email: session.user.email },
      update: { name: session.user.name, image: session.user.image },
      create: { email: session.user.email, name: session.user.name, image: session.user.image },
    })

    return transaction.build.create({
      data: {
        userId: user.id,
        name,
        purpose,
        resolution: body.resolution || null,
        fpsTarget: body.fpsTarget || null,
        budgetTier: body.budgetTier || null,
        isPublic: Boolean(body.isPublic),
        items: {
          create: normalizedItems,
        },
      },
      include: { items: { include: { product: true } } },
    })
  })

  return Response.json({ build: serializeBuild(build) }, { status: 201 })
}
