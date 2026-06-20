import Image from "next/image"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getCompatibilityReport } from "@/lib/compatibility"

export default async function SharedBuildPage({ params }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  const build = await getBuild(id, session?.user?.email)

  if (!build) notFound()

  const selection = Object.fromEntries(build.items.map((item) => [item.category, item.product]))
  const compatibility = getCompatibilityReport(selection)
  const total = build.items.reduce((sum, item) => sum + Number(item.product.price), 0)

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 md:px-8 md:py-16">
      <p className="section-label">{build.isPublic ? "Shared PC build" : "Private PC build"}</p>
      <div className="mt-4 flex flex-col justify-between gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-black text-white md:text-5xl">{build.name}</h1>
          <p className="mt-3 text-gray-400">
            {build.purpose} · {build.resolution || "Flexible resolution"} · {build.fpsTarget || "Flexible FPS"}
          </p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-xs font-black uppercase text-gray-500">Estimated total</p>
          <p className="mt-1 text-3xl font-black text-white">${total.toFixed(2)}</p>
        </div>
      </div>

      <div className={`mt-8 border p-4 ${compatibility.status === "compatible" ? "border-[#b7f34a]/40 bg-[#b7f34a]/5" : "border-yellow-500/40 bg-yellow-500/5"}`}>
        <p className="text-sm font-black uppercase text-white">Compatibility: {compatibility.status}</p>
        {compatibility.issues.length > 0 && (
          <ul className="mt-3 grid gap-2 text-sm text-gray-300">
            {compatibility.issues.map((issue) => <li key={issue.code}>{issue.message}</li>)}
          </ul>
        )}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {build.items.map((item) => (
          <article key={item.id} className="border border-white/10 bg-[#111412]">
            <div className="relative aspect-[4/3] bg-[#f2f4f0]">
              <Image src={item.product.image} alt={item.product.name} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-contain p-6" />
            </div>
            <div className="p-4">
              <p className="section-label">{item.category}</p>
              <h2 className="mt-2 text-lg font-black text-white">{item.product.name}</h2>
              <p className="mt-3 font-black text-white">${Number(item.product.price).toFixed(2)}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

async function getBuild(id, email) {
  if (!process.env.DATABASE_URL) return null

  const { prisma } = await import("@/lib/prisma")
  return prisma.build.findFirst({
    where: {
      id,
      OR: [
        { isPublic: true },
        ...(email ? [{ user: { email } }] : []),
      ],
    },
    include: { items: { include: { product: true } } },
  })
}
