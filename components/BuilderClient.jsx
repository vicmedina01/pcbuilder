"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { builderCategories } from "@/lib/products"
import { getCompatibilityReport, isCompatibleChoice } from "@/lib/compatibility"
import { useCart } from "@/context/CartContext"

const NEEDS = [
  {
    id: "gaming",
    label: "Gaming",
    description: "Balanced performance for games, FPS targets, and visuals.",
  },
  {
    id: "ai",
    label: "AI / ML",
    description: "Prioritizes NVIDIA GPUs, VRAM, RAM, and storage speed.",
  },
  {
    id: "work",
    label: "Workstation",
    description: "Strong CPU, memory, storage, and stable power delivery.",
  },
]

const GAME_PROFILES = [
  "Cyberpunk 2077",
  "Alan Wake 2",
  "Starfield",
  "Fortnite",
  "Valorant",
  "Call of Duty Warzone",
  "Apex Legends",
  "Minecraft RTX",
]

const RESOLUTIONS = ["1080p", "1440p", "4K"]
const FPS_TARGETS = ["60 FPS", "120 FPS", "240 FPS"]
const BUDGETS = [
  { id: "entry", label: "Entry", max: 1000 },
  { id: "balanced", label: "Balanced", max: 1800 },
  { id: "premium", label: "Premium", max: Infinity },
]

export default function BuilderClient({ products }) {
  const { addToCart } = useCart()
  const { data: session } = useSession()
  const [selection, setSelection] = useState({})
  const [buildName, setBuildName] = useState("My PC Build")
  const [isPublic, setIsPublic] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState({
    need: "gaming",
    budget: "balanced",
    resolution: "1440p",
    fps: "120 FPS",
    games: ["Cyberpunk 2077", "Valorant"],
  })

  const total = useMemo(
    () => Object.values(selection).reduce((sum, product) => sum + Number(product.price), 0),
    [selection]
  )

  const completedParts = Object.keys(selection).length
  const missingParts = builderCategories.filter((category) => !selection[category])
  const recommendations = useMemo(() => getRecommendations(products, profile), [products, profile])
  const compatibility = useMemo(() => getCompatibilityReport(selection), [selection])
  const buildNotes = getBuildNotes(selection, missingParts, profile, recommendations, compatibility)
  const performanceLinks = getPerformanceLinks(selection, profile)
  const selectedBudget = BUDGETS.find((budget) => budget.id === profile.budget)
  const budgetStatus = selectedBudget?.max === Infinity ? "Flexible" : `$${selectedBudget?.max}`

  function selectProduct(category, productId) {
    const product = products.find((item) => item.id === Number(productId))

    setSelection((current) => {
      if (!product) {
        const next = { ...current }
        delete next[category]
        return next
      }

      return { ...current, [category]: product }
    })
  }

  function updateProfile(key, value) {
    setProfile((current) => ({ ...current, [key]: value }))
  }

  function toggleGame(game) {
    setProfile((current) => {
      const games = current.games.includes(game)
        ? current.games.filter((item) => item !== game)
        : [...current.games, game]

      return { ...current, games }
    })
  }

  function applyRecommendedBuild() {
    setSelection(recommendations)
  }

  function addBuildToCart() {
    Object.values(selection).forEach((product) => addToCart(product))
  }

  async function saveBuild() {
    setSaveMessage("")

    if (!session) {
      signIn("google")
      return
    }

    if (completedParts === 0) {
      setSaveMessage("Select at least one component before saving.")
      return
    }

    if (compatibility.status === "incompatible") {
      setSaveMessage("Resolve compatibility errors before saving.")
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch("/api/builds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: buildName,
          purpose: profile.need,
          resolution: profile.resolution,
          fpsTarget: profile.fps,
          budgetTier: profile.budget,
          isPublic,
          items: Object.entries(selection).map(([category, product]) => ({
            category,
            productId: product.id,
          })),
        }),
      })
      const data = await response.json()

      setSaveMessage(response.ok ? "Build saved successfully." : data.error ?? "Build could not be saved.")
    } catch (error) {
      console.error(error)
      setSaveMessage("Build could not be saved.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="mx-auto grid w-full max-w-7xl flex-1 gap-8 px-4 py-8 md:px-8 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="min-w-0">
        <div className="border-b border-white/10 pb-8">
          <p className="section-label">PC Builder</p>
          <div className="mt-3 grid gap-5 lg:grid-cols-[1fr_300px] lg:items-end">
            <div>
              <h1 className="text-4xl font-bold text-white md:text-5xl">Build around what you actually play.</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-gray-300">
                Pick the goal, budget, games, and performance target. The builder highlights a stronger starting point
                and generates video searches for the CPU/GPU combo you choose.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 border border-white/10 bg-[#111412] p-3 text-center">
              <Stat label="Parts" value={`${completedParts}/${builderCategories.length}`} />
              <Stat label="Target" value={profile.resolution} />
              <Stat label="Budget" value={budgetStatus} />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6">
          <section className="grid gap-4 border border-white/10 bg-[#0d100e] p-4">
            <div className="grid gap-3 lg:grid-cols-3">
              {NEEDS.map((need) => (
                <button
                  key={need.id}
                  type="button"
                  onClick={() => updateProfile("need", need.id)}
                  className={`rounded border p-4 text-left ${
                    profile.need === need.id
                      ? "border-[#b7f34a] bg-[#b7f34a]/10 text-white"
                      : "border-white/10 bg-[#111412] text-gray-300 hover:border-white/30"
                  }`}
                >
                  <span className="block text-lg font-bold">{need.label}</span>
                  <span className="mt-2 block text-sm leading-6 text-gray-400">{need.description}</span>
                </button>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <SegmentedControl
                label="Resolution"
                value={profile.resolution}
                options={RESOLUTIONS}
                onChange={(value) => updateProfile("resolution", value)}
              />
              <SegmentedControl
                label="FPS target"
                value={profile.fps}
                options={FPS_TARGETS}
                onChange={(value) => updateProfile("fps", value)}
              />
              <SegmentedControl
                label="Budget"
                value={profile.budget}
                options={BUDGETS.map((budget) => ({ value: budget.id, label: budget.label }))}
                onChange={(value) => updateProfile("budget", value)}
              />
            </div>

            {profile.need === "gaming" && (
              <div>
                <p className="text-sm font-semibold uppercase text-gray-400">Games</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {GAME_PROFILES.map((game) => (
                    <button
                      key={game}
                      type="button"
                      onClick={() => toggleGame(game)}
                      className={`rounded border px-3 py-2 text-sm font-semibold ${
                        profile.games.includes(game)
                          ? "border-[#b7f34a] bg-[#b7f34a]/10 text-[#e7ffc0]"
                          : "border-white/10 bg-[#111412] text-gray-300 hover:border-white/30"
                      }`}
                    >
                      {game}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="border border-[#b7f34a]/30 bg-[#b7f34a]/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="section-label">Recommended starting point</p>
                <p className="mt-1 text-sm text-gray-300">
                  Based on {profile.need}, {profile.resolution}, {profile.fps}, and your budget profile.
                </p>
              </div>
              <button
                type="button"
                onClick={applyRecommendedBuild}
                className="bg-[#b7f34a] px-4 py-2 font-black text-black hover:bg-[#93d329]"
              >
                Apply build
              </button>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {builderCategories.slice(0, 8).map((category) => (
                <MiniProduct key={category} category={category} product={recommendations[category]} />
              ))}
            </div>
          </section>

          <section className="grid gap-4">
            {builderCategories.map((category) => {
              const options = products.filter((product) => product.category === category)
              const selected = selection[category]
              const recommended = recommendations[category]

              return (
                <div key={category} className="border border-white/10 bg-[#111412] p-4">
                  <div className="grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)_260px] lg:items-center">
                    <div>
                      <p className="section-label">{category}</p>
                      <p className="mt-2 text-sm text-gray-400">{selected ? "Selected component" : "No part selected"}</p>
                    </div>

                    <select
                      id={`builder-${category}`}
                      value={selected?.id ?? ""}
                      onChange={(event) => selectProduct(category, event.target.value)}
                      className="w-full rounded border border-white/10 bg-gray-800 px-3 py-3 text-white"
                    >
                      <option value="">Select component</option>
                      {options.map((product) => {
                        const compatible = isCompatibleChoice(selection, category, product)

                        return (
                          <option key={product.id} value={product.id} disabled={!compatible}>
                            {product.name} - ${product.price}{compatible ? "" : " - incompatible"}
                          </option>
                        )
                      })}
                    </select>

                    {recommended && (
                      <button
                        type="button"
                        onClick={() => selectProduct(category, recommended.id)}
                        className="border border-[#b7f34a]/40 px-3 py-3 text-sm font-bold text-[#e7ffc0] hover:bg-[#b7f34a]/10"
                      >
                        Use recommended
                      </button>
                    )}
                  </div>

                  {selected && (
                    <div className="mt-4 grid gap-4 border-t border-white/10 pt-4 md:grid-cols-[120px_1fr]">
                      <div className="relative aspect-[4/3] overflow-hidden rounded bg-gray-800">
                        {selected.image && (
                          <Image
                            src={selected.image}
                            alt={selected.name}
                            fill
                            sizes="120px"
                            className="object-contain p-2"
                            unoptimized
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{selected.name}</h3>
                        <p className="mt-1 text-sm leading-6 text-gray-300">{selected.description}</p>
                        <p className="mt-3 text-xl font-bold text-white">${Number(selected.price).toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </section>
        </div>
      </section>

      <aside className="h-fit border border-white/10 bg-[#0d100e] p-5 xl:sticky xl:top-32">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-white">Build summary</h2>
          <span className={`px-2 py-1 text-xs font-black uppercase ${getCompatibilityClasses(compatibility.status)}`}>
            {compatibility.status}
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-400">
          {completedParts} of {builderCategories.length} parts selected
        </p>

        <div className="mt-5 grid gap-3">
          {builderCategories.map((category) => (
            <div key={category} className="flex justify-between gap-4 border-b border-white/10 pb-3 text-sm">
              <span className="text-gray-400">{category}</span>
              <span className="max-w-[210px] text-right font-semibold text-white">
                {selection[category]?.name ?? "Pending"}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 border border-white/10 bg-[#111412] p-4">
          <p className="text-sm font-semibold uppercase text-gray-400">Estimated total</p>
          <p className="mt-1 text-3xl font-bold text-white">${total.toFixed(2)}</p>
        </div>

        <div className="mt-5 border border-white/10 bg-[#111412] p-4">
          <h3 className="font-semibold text-white">Build notes</h3>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-gray-300">
            {buildNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>

        <div className="mt-5 border border-white/10 bg-[#111412] p-4">
          <h3 className="font-semibold text-white">Performance videos</h3>
          <div className="mt-3 grid gap-2">
            {performanceLinks.length > 0 ? (
              performanceLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-white/10 px-3 py-2 text-sm font-semibold text-[#dfffa9] hover:border-[#b7f34a]/50"
                >
                  {link.label}
                </a>
              ))
            ) : (
              <p className="text-sm leading-6 text-gray-400">Select a CPU and GPU to generate performance searches.</p>
            )}
          </div>
        </div>

        <div className="mt-5 border border-white/10 bg-[#111412] p-4">
          <h3 className="font-semibold text-white">Save this build</h3>
          <label className="mt-3 block">
            <span className="sr-only">Build name</span>
            <input
              value={buildName}
              onChange={(event) => setBuildName(event.target.value)}
              maxLength={80}
              className="w-full border border-white/15 bg-[#090b0a] px-3 py-2.5 text-sm text-white"
            />
          </label>
          <label className="mt-3 flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(event) => setIsPublic(event.target.checked)}
              className="size-4 accent-[#b7f34a]"
            />
            Allow public sharing
          </label>
          <button
            type="button"
            onClick={saveBuild}
            disabled={isSaving}
            className="mt-4 w-full border border-[#b7f34a]/50 px-4 py-3 text-sm font-black uppercase text-[#dfffa9] disabled:opacity-50"
          >
            {isSaving ? "Saving..." : session ? "Save build" : "Sign in to save"}
          </button>
          {saveMessage && <p className="mt-3 text-sm text-gray-300">{saveMessage}</p>}
        </div>

        <button
          onClick={addBuildToCart}
          disabled={completedParts === 0}
          className="mt-5 w-full bg-[#b7f34a] px-5 py-3 font-black text-black hover:bg-[#93d329] disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
        >
          Add build to cart
        </button>
      </aside>
    </main>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
      <p className="mt-1 truncate text-sm font-bold text-white">{value}</p>
    </div>
  )
}

function SegmentedControl({ label, value, options, onChange }) {
  const normalizedOptions = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option
  )

  return (
    <div>
      <p className="text-sm font-semibold uppercase text-gray-400">{label}</p>
      <div className="mt-3 grid grid-cols-3 border border-white/10 bg-[#111412] p-1">
        {normalizedOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded px-2 py-2 text-sm font-semibold ${
              value === option.value ? "bg-[#b7f34a] text-black" : "text-gray-300 hover:bg-white/5"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function MiniProduct({ category, product }) {
  if (!product) {
    return (
      <div className="border border-white/10 bg-[#111412] p-3">
        <p className="text-xs font-semibold uppercase text-gray-500">{category}</p>
        <p className="mt-2 text-sm font-semibold text-gray-300">No match yet</p>
      </div>
    )
  }

  return (
    <div className="border border-white/10 bg-[#111412] p-3">
      <p className="section-label">{category}</p>
      <p className="mt-2 line-clamp-2 text-sm font-bold text-white">{product.name}</p>
      <p className="mt-2 text-sm font-semibold text-gray-300">${Number(product.price).toFixed(2)}</p>
    </div>
  )
}

function getRecommendations(products, profile) {
  const selectedBudget = BUDGETS.find((budget) => budget.id === profile.budget)
  const budgetMax = selectedBudget?.max ?? Infinity

  return Object.fromEntries(
    builderCategories.map((category) => {
      const options = products.filter((product) => product.category === category)
      const ranked = options
        .map((product) => ({ product, score: scoreProduct(product, profile, budgetMax) }))
        .sort((a, b) => b.score - a.score || Number(a.product.price) - Number(b.product.price))

      return [category, ranked[0]?.product]
    })
  )
}

function scoreProduct(product, profile, budgetMax) {
  const name = product.name.toLowerCase()
  const price = Number(product.price)
  let score = 1000 - price * 0.1

  if (budgetMax !== Infinity && price > budgetMax / 3) score -= 90

  if (profile.need === "gaming") {
    if (product.category === "GPU") {
      if (profile.resolution === "4K") score += matchAny(name, ["5080", "4080", "7900 xtx"]) ? 220 : 0
      if (profile.resolution === "1440p") score += matchAny(name, ["5070", "4070", "7800 xt", "7900 xt"]) ? 200 : 0
      if (profile.resolution === "1080p") score += matchAny(name, ["4060", "7600 xt", "4070"]) ? 180 : 0
      if (profile.fps === "240 FPS") score += matchAny(name, ["5070", "5080", "4070 super"]) ? 90 : 0
    }

    if (product.category === "CPU") {
      score += matchAny(name, ["7800x3d", "14700k", "14600k", "7700x"]) ? 160 : 0
    }
  }

  if (profile.need === "ai") {
    if (product.category === "GPU") score += matchAny(name, ["rtx", "5080", "4080", "5070"]) ? 260 : -80
    if (product.category === "RAM") score += matchAny(name, ["64gb", "6000", "6400"]) ? 140 : 0
    if (product.category === "Storage") score += matchAny(name, ["2tb", "4tb", "990", "t700"]) ? 100 : 0
    if (product.category === "CPU") score += matchAny(name, ["7950x", "7900x", "14900k", "285k"]) ? 120 : 0
  }

  if (profile.need === "work") {
    if (product.category === "CPU") score += matchAny(name, ["7950x", "7900x", "14900k", "285k"]) ? 220 : 0
    if (product.category === "RAM") score += matchAny(name, ["64gb"]) ? 180 : 0
    if (product.category === "Storage") score += matchAny(name, ["2tb", "4tb"]) ? 110 : 0
    if (product.category === "PSU") score += matchAny(name, ["850w", "1000w", "1200w"]) ? 90 : 0
  }

  if (product.category === "Motherboard") {
    score += matchAny(name, ["b650", "z790"]) ? 70 : 0
  }

  if (product.category === "PSU") {
    score += matchAny(name, ["750", "850", "1000"]) ? 80 : 0
  }

  return score
}

function getBuildNotes(selection, missingParts, profile, recommendations, compatibility) {
  const notes = []
  const gpu = selection.GPU
  const cpu = selection.CPU
  const psu = selection.PSU
  const ram = selection.RAM

  if (missingParts.length > 0) {
    notes.push(`Missing: ${missingParts.join(", ")}`)
  } else {
    notes.push("All main component categories are selected.")
  }

  if (gpu && recommendations.GPU && gpu.id !== recommendations.GPU.id) {
    notes.push(`For this profile, compare your GPU against ${recommendations.GPU.name}.`)
  }

  if (profile.need === "ai" && gpu && !gpu.name.toLowerCase().includes("rtx")) {
    notes.push("For AI workloads, NVIDIA RTX cards usually have better CUDA support.")
  }

  if (profile.need === "gaming" && profile.resolution === "4K" && gpu && Number(gpu.price) < 600) {
    notes.push("For 4K gaming, consider a stronger GPU before upgrading other parts.")
  }

  if (ram && profile.need !== "gaming" && !ram.name.toLowerCase().includes("64gb")) {
    notes.push("For AI or workstation use, 64GB RAM is a safer target.")
  }

  if (gpu && psu) {
    notes.push("GPU and power supply are selected. Confirm wattage requirements before buying.")
  }

  if (cpu && selection.Motherboard) {
    notes.push("CPU and motherboard socket compatibility was checked.")
  }

  compatibility.issues.forEach((issue) => notes.push(issue.message))

  return notes
}

function getPerformanceLinks(selection, profile) {
  if (!selection.CPU || !selection.GPU) return []

  const baseParts = `${selection.CPU.name} ${selection.GPU.name} ${profile.resolution} ${profile.fps}`
  const games = profile.need === "gaming" && profile.games.length > 0 ? profile.games.slice(0, 4) : ["benchmark"]

  return games.map((game) => {
    const query = encodeURIComponent(`${baseParts} ${game} benchmark`)
    return {
      label: game === "benchmark" ? "CPU/GPU benchmark search" : `${game} performance`,
      href: `https://www.youtube.com/results?search_query=${query}`,
    }
  })
}

function matchAny(value, terms) {
  return terms.some((term) => value.includes(term))
}

function getCompatibilityClasses(status) {
  if (status === "incompatible") return "bg-red-500/15 text-red-200"
  if (status === "warning") return "bg-yellow-500/15 text-yellow-100"
  return "bg-[#b7f34a]/15 text-[#dfffa9]"
}
