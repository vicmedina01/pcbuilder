import Image from "next/image"
import Link from "next/link"

const categories = ["CPU", "GPU", "Motherboard", "RAM", "Storage", "PSU", "Case", "Cooling"]

const buildPaths = [
  {
    title: "Competitive gaming",
    eyebrow: "High FPS",
    description: "Prioritize CPU response, stable frame times, and the right GPU for 1080p or 1440p.",
    target: "120-240 FPS",
    image: "/products/gpu/rtx-5070.jpg",
  },
  {
    title: "Cinematic gaming",
    eyebrow: "High fidelity",
    description: "Build around ray tracing, VRAM, and cooling for demanding games at 1440p or 4K.",
    target: "1440p-4K",
    image: "/products/gpu/rtx-5080.jpg",
  },
  {
    title: "AI and creation",
    eyebrow: "Workstation",
    description: "Balance CUDA support, memory capacity, fast storage, and multi-core performance.",
    target: "64GB ready",
    image: "/products/cpu/r9-7950x.jpg",
  },
]

const featuredParts = [
  {
    name: "AMD Ryzen 7 7800X3D",
    category: "Gaming CPU",
    image: "/products/cpu/r7-7800x3d.jpg",
    note: "A strong starting point for high-refresh gaming builds.",
  },
  {
    name: "GeForce RTX 5080",
    category: "4K GPU",
    image: "/products/gpu/rtx-5080.jpg",
    note: "Built for demanding games, ray tracing, and AI workloads.",
  },
  {
    name: "Fractal Design North",
    category: "Airflow case",
    image: "/products/Case/fractal-design-north.jpg",
    note: "Clean design with practical airflow for a balanced system.",
  },
]

export default function Home() {
  return (
    <main className="flex-1 overflow-hidden bg-[#090b0a]">
      <section className="hardware-grid relative isolate flex h-[calc(100svh-126px)] min-h-[560px] max-h-[780px] items-center overflow-hidden bg-[#eef2eb] text-[#0a0c0b]">
        <div className="absolute inset-y-0 right-0 w-[55%] bg-[#dce4da] max-md:w-full max-md:opacity-45" />
        <div className="absolute right-[-5%] top-1/2 h-[78%] w-[58%] -translate-y-1/2 max-md:right-[-36%] max-md:h-[58%] max-md:w-[105%]">
          <Image
            src="/products/Case/fractal-design-north.jpg"
            alt="Fractal Design North PC case"
            fill
            priority
            sizes="(min-width: 768px) 58vw, 100vw"
            className="object-contain mix-blend-multiply"
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase text-[#315d35]">Build for your real workload</p>
            <h1 className="mt-5 text-5xl font-black leading-[0.95] text-balance sm:text-6xl lg:text-8xl">
              Your perfect PC starts with what you need.
            </h1>
            <p className="mt-6 max-w-xl text-base font-medium leading-7 text-[#39413b] sm:text-lg">
              Tell us what you play, create, or train. PC Builder recommends a balanced system and helps you compare
              real-world performance before you buy.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/builder"
                className="bg-[#101310] px-6 py-4 text-sm font-black uppercase text-white hover:bg-[#315d35]"
              >
                Start guided build
              </Link>
              <Link
                href="/products"
                className="border-2 border-[#101310] px-6 py-4 text-sm font-black uppercase text-[#101310] hover:bg-white/60"
              >
                Browse components
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-xs font-bold uppercase text-[#4c554e]">
              <span>Gaming profiles</span>
              <span>AI-ready builds</span>
              <span>Performance videos</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#111412]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => (
            <Link
              key={category}
              href="/products"
              className="border-b border-r border-white/10 px-4 py-5 text-center text-xs font-black uppercase text-gray-300 hover:bg-[#b7f34a] hover:text-black"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section id="build-paths" className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="section-label">Choose your direction</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black text-white md:text-6xl">Different goals need different hardware.</h2>
          </div>
          <Link href="/builder" className="text-sm font-black uppercase text-[#b7f34a] hover:text-white">
            Compare recommendations
          </Link>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {buildPaths.map((path) => (
            <article key={path.title} className="group overflow-hidden border border-white/10 bg-[#111412]">
              <div className="relative aspect-[16/11] overflow-hidden bg-white">
                <Image
                  src={path.image}
                  alt={path.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 bg-[#101310] px-3 py-2 text-xs font-black uppercase text-white">
                  {path.target}
                </span>
              </div>
              <div className="p-6">
                <p className="section-label">{path.eyebrow}</p>
                <h3 className="mt-3 text-2xl font-black text-white">{path.title}</h3>
                <p className="mt-3 leading-7 text-gray-400">{path.description}</p>
                <Link href="/builder" className="mt-6 inline-block text-sm font-black uppercase text-[#b7f34a]">
                  Build this profile
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="border-y border-white/10 bg-[#eef2eb] text-[#0a0c0b]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-black uppercase text-[#315d35]">Recommendation engine</p>
            <h2 className="mt-4 text-4xl font-black md:text-6xl">More useful than a list of expensive parts.</h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#4b554d]">
              The builder starts with the result you want, then helps distribute the budget where it changes your
              experience the most.
            </p>
          </div>

          <div className="grid gap-px border border-black/15 bg-black/15 sm:grid-cols-2">
            {[
              ["01", "Define the workload", "Choose gaming, AI, or workstation use, then set resolution and FPS targets."],
              ["02", "Balance the build", "Compare CPU, GPU, memory, storage, and power choices against your goal."],
              ["03", "Review compatibility", "Catch socket, wattage, cooling, and case-clearance concerns before checkout."],
              ["04", "See expected performance", "Open focused YouTube benchmark searches using your CPU, GPU, and games."],
            ].map(([number, title, description]) => (
              <div key={number} className="bg-[#eef2eb] p-6 md:p-8">
                <p className="text-sm font-black text-[#315d35]">{number}</p>
                <h3 className="mt-8 text-xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-[#586159]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="section-label">Popular starting points</p>
            <h2 className="mt-4 text-4xl font-black text-white md:text-5xl">Components worth comparing.</h2>
          </div>
          <Link href="/products" className="text-sm font-black uppercase text-[#b7f34a]">View full catalog</Link>
        </div>

        <div className="mt-10 grid gap-px border border-white/10 bg-white/10 lg:grid-cols-3">
          {featuredParts.map((part) => (
            <article key={part.name} className="group bg-[#111412]">
              <div className="relative aspect-[4/3] overflow-hidden bg-white">
                <Image
                  src={part.image}
                  alt={part.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-contain p-7 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className="section-label">{part.category}</p>
                <h3 className="mt-3 text-2xl font-black text-white">{part.name}</h3>
                <p className="mt-3 leading-7 text-gray-400">{part.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#4ed8cf] text-[#09100f]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-4 py-16 md:flex-row md:items-center md:px-8">
          <div>
            <p className="text-xs font-black uppercase">Your build, explained</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black md:text-5xl">Stop guessing which component matters most.</h2>
          </div>
          <Link href="/builder" className="shrink-0 bg-[#09100f] px-6 py-4 text-sm font-black uppercase text-white hover:bg-[#24312e]">
            Build my PC
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <p className="section-label">Common questions</p>
          <h2 className="mt-4 text-4xl font-black text-white">Before you start building.</h2>
        </div>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {[
            ["Does PC Builder guarantee compatibility?", "The current version provides guidance and warnings. Exact socket, dimensions, BIOS, and connector validation will become stricter as structured component specifications are added."],
            ["Where do the performance videos come from?", "The builder creates focused YouTube searches using the selected CPU, GPU, resolution, FPS target, and games so you can compare real benchmark footage."],
            ["Can I build for AI instead of gaming?", "Yes. Choose AI / ML in the guided builder and it will prioritize GPU compute support, VRAM, memory capacity, storage, and multi-core performance."],
            ["Can I still choose every component myself?", "Yes. Recommendations are only a starting point. Every category remains editable before you add the build to your cart."],
          ].map(([question, answer]) => (
            <details key={question} className="group py-6">
              <summary className="cursor-pointer list-none pr-8 text-lg font-black text-white marker:content-none">
                {question}
              </summary>
              <p className="mt-4 max-w-3xl leading-7 text-gray-400">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  )
}
