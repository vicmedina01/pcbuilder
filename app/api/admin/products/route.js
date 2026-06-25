import { requireAdminResponse } from "@/lib/admin"
import { validateProductInput } from "@/lib/productValidation"

export async function GET() {
  const unauthorized = await requireAdminResponse()
  if (unauthorized) return unauthorized

  const { prisma } = await import("@/lib/prisma")
  const products = await prisma.product.findMany({ orderBy: { updatedAt: "desc" } })

  return Response.json({ products: products.map(serializeProduct) })
}

export async function POST(request) {
  const unauthorized = await requireAdminResponse()
  if (unauthorized) return unauthorized

  try {
    const input = validateProductInput(await request.json())
    const { prisma } = await import("@/lib/prisma")
    const product = await prisma.product.create({ data: input })

    return Response.json({ product: serializeProduct(product) }, { status: 201 })
  } catch (error) {
    return Response.json({ error: error.message ?? "Product could not be created." }, { status: 400 })
  }
}

function serializeProduct(product) {
  return { ...product, price: Number(product.price) }
}
