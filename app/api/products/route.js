import { products } from "@/lib/products"

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return Response.json(products)
    }

    const { prisma } = await import("@/lib/prisma")
    const dbProducts = await prisma.product.findMany({
      orderBy: { id: "asc" },
    })

    return Response.json(dbProducts.map(serializeProduct))
  } catch (error) {
    console.error("Failed to load products", error)
    return Response.json(products)
  }
}

function serializeProduct(product) {
  return {
    ...product,
    price: Number(product.price),
  }
}
