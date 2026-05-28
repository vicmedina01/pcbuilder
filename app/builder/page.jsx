import BuilderClient from "@/components/BuilderClient"
import { getProducts } from "@/lib/productService"

export default async function BuilderPage() {
  const products = await getProducts()

  return <BuilderClient products={products} />
}
