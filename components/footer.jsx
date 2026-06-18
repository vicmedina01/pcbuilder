import Link from "next/link"

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0d100e] text-gray-400">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <Link href="/" className="flex items-center gap-3 text-white">
            <span className="grid size-10 place-items-center bg-[#b7f34a] text-sm font-black text-black">PC</span>
            <span className="text-xl font-black uppercase">Builder</span>
          </Link>
          <p className="mt-5 max-w-md leading-7">
            Guided PC recommendations for gaming, AI, and creative work. Compare components, understand tradeoffs, and
            validate performance before checkout.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase text-white">Build</h2>
          <div className="mt-5 grid gap-3 text-sm">
            <Link href="/builder" className="hover:text-[#b7f34a]">Guided builder</Link>
            <Link href="/products" className="hover:text-[#b7f34a]">Component catalog</Link>
            <Link href="/cart" className="hover:text-[#b7f34a]">Cart</Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase text-white">Project</h2>
          <div className="mt-5 grid gap-3 text-sm">
            <Link href="/#how-it-works" className="hover:text-[#b7f34a]">How recommendations work</Link>
            <a href="https://github.com/vicmedina01/pcbuilder" target="_blank" rel="noreferrer" className="hover:text-[#b7f34a]">
              GitHub repository
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-xs md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 sm:flex-row">
          <p>&copy; 2026 PCBuilder.</p>
          <p>Portfolio project built with Next.js, Prisma, PostgreSQL, and Stripe.</p>
        </div>
      </div>
    </footer>
  )
}
