import { products as fallbackProducts } from "@/lib/products"

export async function getProducts() {
  try {
    if (!process.env.DATABASE_URL) {
      return fallbackProducts
    }

    const { prisma } = await import("@/lib/prisma")
    const products = await prisma.product.findMany({
      orderBy: { id: "asc" },
    })

    if (products.length === 0) {
      return fallbackProducts
    }

    return products.map(serializeProduct)
  } catch (error) {
    console.error("Failed to load products", error)
    return fallbackProducts
  }
}

export async function getProductById(id) {
  const products = await getProducts()
  return products.find((product) => product.id === Number(id))
}

function serializeProduct(product) {
  return {
    ...product,
    price: Number(product.price),
  }
}
