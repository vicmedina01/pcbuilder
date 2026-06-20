export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 md:px-8">
      <div className="h-3 w-28 animate-pulse bg-[#b7f34a]/40" />
      <div className="mt-5 h-12 max-w-xl animate-pulse bg-white/10" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="border border-white/10 bg-[#111412] p-4">
            <div className="aspect-[4/3] animate-pulse bg-white/10" />
            <div className="mt-4 h-5 w-3/4 animate-pulse bg-white/10" />
            <div className="mt-3 h-4 w-full animate-pulse bg-white/5" />
          </div>
        ))}
      </div>
    </main>
  )
}
