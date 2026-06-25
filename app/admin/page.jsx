import { redirect } from "next/navigation"
import AdminProducts from "@/components/AdminProducts"
import { getAdminSession } from "@/lib/admin"

export const metadata = {
  title: "Catalog administration | PCBuilder",
}

export default async function AdminPage() {
  const session = await getAdminSession()

  if (!session) redirect("/")

  const { prisma } = await import("@/lib/prisma")
  const products = await prisma.product.findMany({ orderBy: { updatedAt: "desc" } })

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8 md:py-12">
      <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end">
        <div>
          <p className="section-label">Administration</p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Catalog and inventory</h1>
          <p className="mt-3 max-w-2xl leading-7 text-gray-400">
            Create components, update pricing and stock, or select the products highlighted in the storefront.
          </p>
        </div>
        <p className="text-sm text-gray-400">
          Signed in as <span className="font-bold text-white">{session.user.email}</span>
        </p>
      </div>

      <AdminProducts initialProducts={products.map((product) => ({ ...product, price: Number(product.price) }))} />
    </main>
  )
}
