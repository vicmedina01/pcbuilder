import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Cpu,
  Gauge,
  MonitorPlay,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react"

const categories = ["CPU", "GPU", "Motherboard", "RAM", "Storage", "PSU", "Case", "Cooling"]

const buildPaths = [
  {
    title: "Competitive gaming",
    eyebrow: "High FPS",
    description: "Prioritize frame times, CPU response, and the right GPU for 1080p or 1440p multiplayer games.",
    target: "120-240 FPS",
    image: "/products/gpu/nvidia-geforce-rtx-5070.jpg",
    href: "/builder?profile=gaming",
  },
  {
    title: "Cinematic gaming",
    eyebrow: "High fidelity",
    description: "Build around ray tracing, VRAM, cooling, and stable performance for demanding games at 1440p or 4K.",
    target: "1440p-4K",
    image: "/products/gpu/rtx-5080.jpg",
    href: "/builder?profile=gaming",
  },
  {
    title: "AI and creation",
    eyebrow: "Workstation",
    description: "Balance CUDA support, memory capacity, fast storage, and multi-core performance for serious workloads.",
    target: "64GB ready",
    image: "/products/cpu/r9-7950x.jpg",
    href: "/builder?profile=ai",
  },
]

const capabilities = [
  {
    number: "01",
    icon: Gauge,
    title: "Start with the result",
    description: "Choose gaming, AI, or workstation use, then set resolution, FPS target, games, and budget.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Get a balanced starting point",
    description: "Recommendations distribute the budget toward the components that change your real workload most.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Catch compatibility issues",
    description: "Socket, RAM, wattage, case clearance, GPU length, cooler height, and radiator size are checked.",
  },
  {
    number: "04",
    icon: MonitorPlay,
    title: "Validate expected performance",
    description: "Open focused benchmark searches using your CPU, GPU, resolution, FPS target, and selected games.",
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

const questions = [
  [
    "Does PCBuilder guarantee compatibility?",
    "PCBuilder checks structured socket, memory, power, form-factor, GPU, cooler, and radiator specifications. Manufacturer documentation should still be reviewed before purchasing.",
  ],
  [
    "Where do the performance videos come from?",
    "The builder creates focused YouTube searches using the selected CPU, GPU, resolution, FPS target, and games so you can review real benchmark footage.",
  ],
  [
    "Can I build for AI instead of gaming?",
    "Yes. The AI / ML profile prioritizes GPU compute support, VRAM, memory capacity, fast storage, and multi-core performance.",
  ],
  [
    "Can I change every recommended component?",
    "Yes. Recommendations are only a starting point. Every component remains editable before you save the build or add it to the cart.",
  ],
]

export default function Home() {
  return (
    <main className="flex-1 overflow-hidden bg-[#080b0a]">
      <section className="relative isolate flex h-[calc(100svh-104px)] min-h-[620px] max-h-[860px] items-center overflow-hidden text-white">
        <Image
          src="/images/pc-builder-hero-v2.png"
          alt="White gaming PC with a desktop monitor"
          fill
          loading="eager"
          sizes="100vw"
          quality={95}
          className="-z-20 object-cover object-[70%_center] sm:object-center"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,8,7,0.88)_0%,rgba(5,8,7,0.72)_34%,rgba(5,8,7,0.34)_58%,rgba(5,8,7,0.06)_78%)] max-sm:bg-[linear-gradient(180deg,rgba(5,8,7,0.76)_0%,rgba(5,8,7,0.58)_55%,rgba(5,8,7,0.88)_100%)]" />

        <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-12 md:px-8 lg:pb-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-[#b7f34a]">
              <Sparkles size={16} aria-hidden="true" />
              Goal-based PC recommendations
            </div>
            <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[0.96] text-balance sm:text-6xl lg:text-7xl">
              Build the PC your games and work actually need.
            </h1>
            <p className="mt-6 max-w-xl text-base font-medium leading-7 text-gray-200 sm:text-lg">
              Tell us what you play, create, or train. PCBuilder recommends a balanced system, validates compatibility,
              and helps you compare real performance before checkout.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/builder"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#b7f34a] px-6 text-sm font-black uppercase text-black hover:bg-[#93d329]"
              >
                Start guided build <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link
                href="/products"
                className="inline-flex min-h-12 items-center justify-center border border-white/50 bg-black/20 px-6 text-sm font-black uppercase text-white hover:border-white hover:bg-black/45"
              >
                Browse components
              </Link>
            </div>

            <div className="mt-9 grid max-w-xl grid-cols-3 border-y border-white/20 py-4">
              <HeroStat value="80" label="Components" />
              <HeroStat value="8" label="Compatibility checks" />
              <HeroStat value="3" label="Build profiles" />
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t border-white/15 bg-[#080b0a]/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-4 text-xs font-black uppercase text-gray-300 md:px-8">
            <span className="shrink-0 text-[#b7f34a]">Built for</span>
            <span className="shrink-0">High-FPS gaming</span>
            <span className="shrink-0">4K gaming</span>
            <span className="shrink-0">AI / ML</span>
            <span className="shrink-0">Streaming</span>
            <span className="shrink-0">Creative work</span>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#111412]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/products?category=${encodeURIComponent(category)}`}
              className="flex min-h-16 items-center justify-center border-b border-r border-white/10 px-4 text-center text-xs font-black uppercase text-gray-300 hover:bg-[#b7f34a] hover:text-black"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section id="build-paths" className="bg-[#eef2eb] text-[#0a0c0b]">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase text-[#315d35]">Choose your direction</p>
              <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
                Different goals need different hardware.
              </h2>
            </div>
            <Link href="/builder" className="inline-flex items-center gap-2 text-sm font-black uppercase text-[#315d35] hover:text-black">
              Compare recommendations <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {buildPaths.map((path) => (
              <article key={path.title} className="group flex h-full flex-col border border-black/15 bg-white">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#f7f8f5]">
                  <Image
                    src={path.image}
                    alt={path.title}
                    fill
                    unoptimized
                    sizes="(min-width: 1280px) 360px, (min-width: 1024px) 30vw, 90vw"
                    className="object-contain p-10 transition-transform duration-300 group-hover:scale-[1.03] sm:p-12"
                  />
                  <span className="absolute left-4 top-4 bg-[#0a0c0b] px-3 py-2 text-xs font-black uppercase text-white">
                    {path.target}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-black uppercase text-[#315d35]">{path.eyebrow}</p>
                  <h3 className="mt-3 text-2xl font-black">{path.title}</h3>
                  <p className="mt-3 flex-1 leading-7 text-[#59615b]">{path.description}</p>
                  <Link href={path.href} className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase text-[#315d35]">
                    Build this profile <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-white/10 bg-[#080b0a] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="lg:sticky lg:top-32 lg:h-fit">
            <p className="section-label">Recommendation engine</p>
            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">The hard parts, handled before checkout.</h2>
            <p className="mt-6 max-w-lg leading-7 text-gray-400">
              PCBuilder turns your goal into a component shortlist, then keeps every decision editable and explainable.
            </p>
            <Link href="/builder" className="mt-8 inline-flex min-h-12 items-center gap-2 bg-[#b7f34a] px-5 text-sm font-black uppercase text-black">
              Open the builder <Wrench size={17} aria-hidden="true" />
            </Link>
          </div>

          <div className="border-y border-white/10">
            {capabilities.map(({ number, icon: Icon, title, description }) => (
              <article key={number} className="grid gap-5 border-b border-white/10 py-7 last:border-b-0 sm:grid-cols-[72px_56px_1fr] sm:items-start">
                <p className="text-sm font-black text-[#b7f34a]">{number}</p>
                <span className="grid size-12 place-items-center border border-white/15 bg-[#111412] text-[#4ed8cf]">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-xl font-black">{title}</h3>
                  <p className="mt-2 max-w-2xl leading-7 text-gray-400">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#4ed8cf] text-[#07100e]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-8 md:py-20 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase">Real-world validation</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
              See how your CPU and GPU perform in the games you care about.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#183b37]">
              Every complete gaming build generates focused benchmark searches using your exact CPU, GPU, resolution,
              FPS target, and selected games.
            </p>
          </div>
          <div className="grid gap-3 border-l border-black/20 pl-0 sm:grid-cols-3 lg:grid-cols-1 lg:pl-10">
            <ProofPoint icon={Cpu} title="Exact parts" detail="CPU + GPU combination" />
            <ProofPoint icon={Gauge} title="Real target" detail="Resolution + FPS" />
            <ProofPoint icon={MonitorPlay} title="Focused videos" detail="Your selected games" />
          </div>
        </div>
      </section>

      <section className="bg-[#0d100e] text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="section-label">Popular starting points</p>
              <h2 className="mt-4 text-4xl font-black sm:text-5xl">Components worth comparing.</h2>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-black uppercase text-[#b7f34a]">
              View full catalog <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid gap-px border border-white/10 bg-white/10 lg:grid-cols-3">
            {featuredParts.map((part) => (
              <article key={part.name} className="group bg-[#111412]">
                <div className="relative aspect-[4/3] overflow-hidden bg-white">
                  <Image
                    src={part.image}
                    alt={part.name}
                    fill
                    unoptimized
                    sizes="(min-width: 1280px) 360px, (min-width: 1024px) 30vw, 90vw"
                    className="object-contain p-14 transition-transform duration-300 group-hover:scale-[1.03] sm:p-16 xl:p-20"
                  />
                </div>
                <div className="p-6">
                  <p className="section-label">{part.category}</p>
                  <h3 className="mt-3 text-2xl font-black">{part.name}</h3>
                  <p className="mt-3 leading-7 text-gray-400">{part.note}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#eef2eb] text-[#0a0c0b]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:px-8 md:py-24 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-[#315d35]">
              <Bot size={17} aria-hidden="true" /> Built to keep your choices flexible
            </div>
            <h2 className="mt-4 text-4xl font-black leading-tight">Build, save, share, and refine.</h2>
            <p className="mt-5 max-w-md leading-7 text-[#59615b]">
              Save private configurations, publish a shareable build URL, return later, or move the selected parts to
              the cart when the system feels right.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Editable component recommendations",
              "Structured compatibility report",
              "Private and public saved builds",
              "Server-validated Stripe checkout",
            ].map((item) => (
              <div key={item} className="flex min-h-20 items-center gap-3 border border-black/15 bg-white px-5 font-bold">
                <CheckCircle2 className="shrink-0 text-[#315d35]" size={21} aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#b7f34a] text-[#09100f]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-4 py-14 md:flex-row md:items-center md:px-8 md:py-16">
          <div>
            <p className="text-xs font-black uppercase">Your goal. Your parts. One balanced build.</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">Stop guessing which component matters most.</h2>
          </div>
          <Link href="/builder" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 bg-[#09100f] px-6 text-sm font-black uppercase text-white hover:bg-[#24312e]">
            Build my PC <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:px-8 md:py-24 lg:grid-cols-[0.65fr_1.35fr]">
        <div>
          <p className="section-label">Common questions</p>
          <h2 className="mt-4 text-4xl font-black text-white">Before you start building.</h2>
        </div>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {questions.map(([question, answer]) => (
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

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-r border-white/20 px-3 first:pl-0 last:border-r-0">
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase leading-4 text-gray-300">{label}</p>
    </div>
  )
}

function ProofPoint({ icon: Icon, title, detail }: { icon: typeof Cpu; title: string; detail: string }) {
  return (
    <div className="flex items-center gap-4 border-b border-black/15 py-3 last:border-b-0 sm:border-b-0 lg:border-b">
      <span className="grid size-11 shrink-0 place-items-center border border-black/25">
        <Icon size={21} aria-hidden="true" />
      </span>
      <div>
        <p className="font-black">{title}</p>
        <p className="text-sm text-[#28534d]">{detail}</p>
      </div>
    </div>
  )
}
