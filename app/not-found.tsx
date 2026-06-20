import Link from "next/link"

export default function NotFound() {
  return (
    <main className="hardware-grid mx-auto grid w-full max-w-7xl flex-1 place-items-center px-4 py-20 text-center md:px-8">
      <div>
        <p className="section-label">404 · Component not found</p>
        <h1 className="mt-4 text-5xl font-black text-white">This part is not in the build.</h1>
        <p className="mx-auto mt-4 max-w-xl text-gray-400">Return to the catalog or start a new guided PC configuration.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="bg-[#b7f34a] px-5 py-3 text-sm font-black uppercase text-black">Browse components</Link>
          <Link href="/builder" className="border border-white/20 px-5 py-3 text-sm font-black uppercase text-white">Open builder</Link>
        </div>
      </div>
    </main>
  )
}
