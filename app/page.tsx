import Link from "next/link"

export default function Home() {
  return (
    <main className="flex-1">
      <section className="mx-auto grid min-h-[calc(100vh-150px)] max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-[1.1fr_0.9fr] md:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">PC Builder ecommerce</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold text-white md:text-6xl">
            Arma, revisa y compra tu PC en un solo flujo.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-300">
            Explora componentes, crea una configuracion compatible por categoria y prepara el checkout con Google OAuth, Prisma y Stripe.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/builder" className="rounded bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
              Crear build
            </Link>
            <Link href="/products" className="rounded border border-white/20 px-5 py-3 font-semibold text-white hover:border-white/40">
              Ver productos
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-gray-900 p-5">
          <div className="grid gap-3">
            {["CPU", "Motherboard", "RAM", "GPU", "Storage", "PSU"].map((part) => (
              <div key={part} className="flex items-center justify-between rounded border border-white/10 bg-gray-800 px-4 py-3">
                <span className="font-semibold text-white">{part}</span>
                <span className="text-sm text-blue-300">Listo para elegir</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
