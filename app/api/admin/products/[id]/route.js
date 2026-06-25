import { requireAdminResponse } from "@/lib/admin"
import { validateProductInput } from "@/lib/productValidation"

export async function PATCH(request, { params }) {
  const unauthorized = await requireAdminResponse()
  if (unauthorized) return unauthorized

  const { id } = await params
  const productId = Number(id)

  if (!Number.isInteger(productId) || productId <= 0) {
    return Response.json({ error: "Invalid product id." }, { status: 400 })
  }

  try {
    const input = validateProductInput(await request.json())
    const { prisma } = await import("@/lib/prisma")
    const product = await prisma.product.update({
      where: { id: productId },
      data: input,
    })

    return Response.json({ product: { ...product, price: Number(product.price) } })
  } catch (error) {
    const status = error?.code === "P2025" ? 404 : 400
    return Response.json({ error: error.message ?? "Product could not be updated." }, { status })
  }
}

export async function DELETE(_request, { params }) {
  const unauthorized = await requireAdminResponse()
  if (unauthorized) return unauthorized

  const { id } = await params
  const productId = Number(id)

  if (!Number.isInteger(productId) || productId <= 0) {
    return Response.json({ error: "Invalid product id." }, { status: 400 })
  }

  try {
    const { prisma } = await import("@/lib/prisma")
    await prisma.product.delete({ where: { id: productId } })
    return new Response(null, { status: 204 })
  } catch (error) {
    const status = error?.code === "P2025" ? 404 : error?.code === "P2003" ? 409 : 400
    const message =
      error?.code === "P2003"
        ? "This product is referenced by an order or saved build and cannot be deleted."
        : "Product could not be deleted."
    return Response.json({ error: message }, { status })
  }
}
