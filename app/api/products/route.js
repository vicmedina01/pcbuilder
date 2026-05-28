import { getProducts } from "@/lib/productService"

export async function GET() {
  const products = await getProducts()
  return Response.json(products)
}
