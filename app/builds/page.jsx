import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import SavedBuildCard from "@/components/SavedBuildCard"

export default async function BuildsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return (
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-16 md:px-8">
        <p className="section-label">Saved builds</p>
        <h1 className="mt-4 text-4xl font-black text-white">Sign in to save and share your PCs.</h1>
        <p className="mt-4 text-gray-400">Your builds are connected to your Google account.</p>
      </main>
    )
  }

  const builds = await getBuilds(session.user.email)

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 md:px-8 md:py-16">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="section-label">Saved builds</p>
          <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">Your PC configurations.</h1>
        </div>
        <Link href="/builder" className="bg-[#b7f34a] px-5 py-3 text-sm font-black uppercase text-black">
          Create a build
        </Link>
      </div>

      {builds.length ? (
        <div className="mt-10 grid gap-4">
          {builds.map((build) => <SavedBuildCard key={build.id} build={build} />)}
        </div>
      ) : (
        <section className="mt-10 border border-white/10 bg-[#111412] p-8">
          <h2 className="text-2xl font-black text-white">No saved builds yet</h2>
          <p className="mt-3 text-gray-400">Create a configuration in the guided builder and save it here.</p>
        </section>
      )}
    </main>
  )
}

async function getBuilds(email) {
  if (!process.env.DATABASE_URL) return []

  const { prisma } = await import("@/lib/prisma")
  const builds = await prisma.build.findMany({
    where: { user: { email } },
    include: { items: { include: { product: true } } },
    orderBy: { updatedAt: "desc" },
  })

  return builds.map((build) => ({
    ...build,
    total: build.items.reduce((sum, item) => sum + Number(item.product.price), 0),
  }))
}
