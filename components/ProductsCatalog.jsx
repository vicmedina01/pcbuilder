"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Grid3X3, List } from "lucide-react"
import ProductCard from "@/components/ProductCard"

const categories = ["All", "CPU", "GPU", "Motherboard", "RAM", "Storage", "PSU", "Case", "Cooling"]
const socketOptions = ["AM5", "LGA1700", "LGA1851"]
const coolerOptions = ["Air Cooler", "Liquid Cooler (240mm)", "Liquid Cooler (280mm)", "Liquid Cooler (360mm)"]
const caseOptions = ["ATX Mid Tower", "Compact ATX", "Mini ITX"]

const sortOptions = [
  ["relevance", "Relevance"],
  ["name-asc", "Name A-Z"],
  ["name-desc", "Name Z-A"],
  ["price-desc", "Highest price"],
  ["price-asc", "Lowest price"],
  ["availability", "Availability"],
  ["newest", "Newest"],
]

export default function ProductsCatalog({ products }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const priceLimits = useMemo(() => {
    const prices = products.map((product) => Number(product.price))
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) }
  }, [products])

  const gpuOptions = useMemo(
    () => products.filter((product) => product.category === "GPU").map((product) => product.name),
    [products]
  )

  const [category, setCategory] = useState(() => validOption(searchParams.get("category"), categories, "All"))
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "")
  const [sort, setSort] = useState(() => validOption(searchParams.get("sort"), sortOptions.map(([value]) => value), "relevance"))
  const [viewMode, setViewMode] = useState(() => validOption(searchParams.get("view"), ["grid", "list"], "grid"))
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [priceMin, setPriceMin] = useState(() => validPrice(searchParams.get("min"), priceLimits.min, priceLimits))
  const [priceMax, setPriceMax] = useState(() => validPrice(searchParams.get("max"), priceLimits.max, priceLimits))
  const [availability, setAvailability] = useState(() => validOption(searchParams.get("availability"), ["all", "in-stock", "low-stock"], "all"))
  const [overclocked, setOverclocked] = useState(() => validOption(searchParams.get("overclocked"), ["all", "true", "false"], "all"))
  const [sockets, setSockets] = useState(() => readList(searchParams, "socket"))
  const [gpuModels, setGpuModels] = useState(() => readList(searchParams, "gpu"))
  const [caseTypes, setCaseTypes] = useState(() => readList(searchParams, "case"))
  const [coolerTypes, setCoolerTypes] = useState(() => readList(searchParams, "cooler"))
  const [page, setPage] = useState(() => Math.max(1, Number(searchParams.get("page")) || 1))
  const [expandedGroups, setExpandedGroups] = useState({ gpu: false })
  const pageSize = viewMode === "grid" ? 12 : 10

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    const matches = products.filter((product) => {
      const specs = getProductSpecs(product)
      const matchesCategory = category === "All" || product.category === category
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description?.toLowerCase().includes(normalizedQuery)
      const price = Number(product.price)
      const stock = Number(product.stock)
      const matchesPrice = price >= priceMin && price <= priceMax
      const matchesAvailability =
        availability === "all" ||
        (availability === "in-stock" && stock > 0) ||
        (availability === "low-stock" && stock > 0 && stock <= 5)
      const matchesOverclock =
        overclocked === "all" ||
        (product.category === "CPU" && String(specs.overclocked) === overclocked)
      const matchesSocket = sockets.length === 0 || (specs.socket && sockets.includes(specs.socket))
      const matchesGpu = gpuModels.length === 0 || gpuModels.includes(product.name)
      const matchesCase = caseTypes.length === 0 || (specs.caseType && caseTypes.includes(specs.caseType))
      const matchesCooler = coolerTypes.length === 0 || (specs.coolerType && coolerTypes.includes(specs.coolerType))

      return (
        matchesCategory &&
        matchesQuery &&
        matchesPrice &&
        matchesAvailability &&
        matchesOverclock &&
        matchesSocket &&
        matchesGpu &&
        matchesCase &&
        matchesCooler
      )
    })

    return [...matches].sort((a, b) => sortProducts(a, b, sort, normalizedQuery))
  }, [
    availability,
    caseTypes,
    category,
    coolerTypes,
    gpuModels,
    overclocked,
    priceMax,
    priceMin,
    products,
    query,
    sockets,
    sort,
  ])

  const activeFilterCount =
    Number(priceMin !== priceLimits.min || priceMax !== priceLimits.max) +
    Number(availability !== "all") +
    Number(overclocked !== "all") +
    sockets.length +
    gpuModels.length +
    caseTypes.length +
    coolerTypes.length
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => {
    const params = new URLSearchParams()
    setOptionalParam(params, "category", category, "All")
    setOptionalParam(params, "q", query.trim(), "")
    setOptionalParam(params, "sort", sort, "relevance")
    setOptionalParam(params, "view", viewMode, "grid")
    setOptionalParam(params, "min", priceMin, priceLimits.min)
    setOptionalParam(params, "max", priceMax, priceLimits.max)
    setOptionalParam(params, "availability", availability, "all")
    setOptionalParam(params, "overclocked", overclocked, "all")
    appendList(params, "socket", sockets)
    appendList(params, "gpu", gpuModels)
    appendList(params, "case", caseTypes)
    appendList(params, "cooler", coolerTypes)
    setOptionalParam(params, "page", currentPage, 1)

    const nextUrl = params.size ? `${pathname}?${params.toString()}` : pathname
    router.replace(nextUrl, { scroll: false })
  }, [
    availability,
    caseTypes,
    category,
    coolerTypes,
    currentPage,
    gpuModels,
    overclocked,
    pathname,
    priceLimits.max,
    priceLimits.min,
    priceMax,
    priceMin,
    query,
    router,
    sockets,
    sort,
    viewMode,
  ])

  function changeCategory(nextCategory) {
    setCategory(nextCategory)
    setPage(1)
    setOverclocked("all")
    setSockets([])
    setGpuModels([])
    setCaseTypes([])
    setCoolerTypes([])
  }

  function resetFilters() {
    setPage(1)
    setPriceMin(priceLimits.min)
    setPriceMax(priceLimits.max)
    setAvailability("all")
    setOverclocked("all")
    setSockets([])
    setGpuModels([])
    setCaseTypes([])
    setCoolerTypes([])
  }

  function updateFilter(setter, value) {
    setPage(1)
    setter(value)
  }

  return (
    <>
      <div className="border-y border-white/10 bg-[#111412]">
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => changeCategory(item)}
                className={`shrink-0 border px-4 py-2 text-xs font-black uppercase ${
                  category === item
                    ? "border-[#b7f34a] bg-[#b7f34a] text-black"
                    : "border-white/10 text-gray-300 hover:border-white/30"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <div className="mb-8 grid gap-3 lg:grid-cols-[minmax(260px,1fr)_auto_auto]">
          <label className="relative block">
            <span className="sr-only">Search components</span>
            <input
              value={query}
              onChange={(event) => updateFilter(setQuery, event.target.value)}
              placeholder="Search CPU, GPU, brand..."
              className="h-12 w-full border border-white/15 bg-[#111412] px-4 text-sm text-white placeholder:text-gray-500"
            />
          </label>

          <div className="flex items-center border border-white/15 bg-[#111412] p-1">
            <button
              type="button"
              title="Grid view"
              aria-label="Show products in grid view"
              aria-pressed={viewMode === "grid"}
              onClick={() => updateFilter(setViewMode, "grid")}
              className={`grid size-10 place-items-center ${viewMode === "grid" ? "bg-[#b7f34a] text-black" : "text-gray-400 hover:text-white"}`}
            >
              <Grid3X3 size={18} />
            </button>
            <button
              type="button"
              title="List view"
              aria-label="Show products in list view"
              aria-pressed={viewMode === "list"}
              onClick={() => updateFilter(setViewMode, "list")}
              className={`grid size-10 place-items-center ${viewMode === "list" ? "bg-[#b7f34a] text-black" : "text-gray-400 hover:text-white"}`}
            >
              <List size={19} />
            </button>
          </div>

          <label className="flex h-12 min-w-52 items-center border border-white/15 bg-[#111412] px-3">
            <span className="sr-only">Sort products</span>
            <select
              value={sort}
              onChange={(event) => updateFilter(setSort, event.target.value)}
              className="w-full bg-transparent text-sm font-bold text-white outline-none"
            >
              {sortOptions.map(([value, label]) => (
                <option key={value} value={value} className="bg-[#111412]">{label}</option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="button"
          onClick={() => setFiltersOpen((current) => !current)}
          className="mb-5 w-full border border-white/15 bg-[#111412] px-4 py-3 text-left text-sm font-black uppercase text-white lg:hidden"
        >
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>

        <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className={`${filtersOpen ? "block" : "hidden"} h-fit border border-white/10 bg-[#111412] p-5 lg:block lg:sticky lg:top-32`}>
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <h2 className="text-xl font-black text-white">Filters</h2>
              {activeFilterCount > 0 && (
                <button type="button" onClick={resetFilters} className="text-xs font-black uppercase text-[#b7f34a]">
                  Clear
                </button>
              )}
            </div>

            <FilterSection title="Price">
              <PriceFilter
                limits={priceLimits}
                minValue={priceMin}
                maxValue={priceMax}
                onMinChange={(value) => updateFilter(setPriceMin, value)}
                onMaxChange={(value) => updateFilter(setPriceMax, value)}
              />
            </FilterSection>

            <FilterSection title="Availability">
              <select
                value={availability}
                onChange={(event) => updateFilter(setAvailability, event.target.value)}
                className="w-full border border-white/15 bg-[#090b0a] px-3 py-2.5 text-sm text-white"
              >
                <option value="all">All products</option>
                <option value="in-stock">In stock</option>
                <option value="low-stock">Low stock</option>
              </select>
            </FilterSection>

            {(category === "All" || category === "CPU") && (
              <FilterSection title="CPU overclocked">
                <RadioGroup value={overclocked} onChange={(value) => updateFilter(setOverclocked, value)} options={[["all", "All"], ["true", "Yes"], ["false", "No"]]} />
              </FilterSection>
            )}

            {(category === "All" || category === "CPU" || category === "Motherboard") && (
              <FilterSection title="CPU socket">
                <CheckboxGroup options={socketOptions} selected={sockets} onChange={(value) => updateFilter(setSockets, value)} />
              </FilterSection>
            )}

            {(category === "All" || category === "GPU") && (
              <FilterSection title="Video card chipset">
                <CheckboxGroup
                  options={expandedGroups.gpu ? gpuOptions : gpuOptions.slice(0, 5)}
                  selected={gpuModels}
                  onChange={(value) => updateFilter(setGpuModels, value)}
                />
                {gpuOptions.length > 5 && (
                  <button
                    type="button"
                    onClick={() => setExpandedGroups((current) => ({ ...current, gpu: !current.gpu }))}
                    className="mt-3 text-xs font-bold text-[#4ed8cf]"
                  >
                    {expandedGroups.gpu ? "Show less" : "Show more"}
                  </button>
                )}
              </FilterSection>
            )}

            {(category === "All" || category === "Case") && (
              <FilterSection title="Case type">
                <CheckboxGroup options={caseOptions} selected={caseTypes} onChange={(value) => updateFilter(setCaseTypes, value)} />
              </FilterSection>
            )}

            {(category === "All" || category === "Cooling") && (
              <FilterSection title="CPU cooler type">
                <CheckboxGroup options={coolerOptions} selected={coolerTypes} onChange={(value) => updateFilter(setCoolerTypes, value)} />
              </FilterSection>
            )}
          </aside>

          <section className="min-w-0">
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-sm font-bold text-gray-400">
                <span className="text-white">{filteredProducts.length}</span> components
              </p>
              <p className="text-xs font-bold uppercase text-gray-500">{category} results</p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3" : "grid gap-3"}>
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} {...product} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="border border-white/10 bg-[#111412] px-6 py-16 text-center">
                <h2 className="text-2xl font-black text-white">No components found</h2>
                <p className="mt-3 text-gray-400">Try removing a filter or using a shorter search.</p>
                <button type="button" onClick={resetFilters} className="mt-6 bg-[#b7f34a] px-5 py-3 text-sm font-black uppercase text-black">
                  Clear filters
                </button>
              </div>
            )}

            {filteredProducts.length > pageSize && (
              <nav className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row" aria-label="Catalog pagination">
                <p className="text-sm text-gray-400">
                  Page <span className="font-bold text-white">{currentPage}</span> of {pageCount}
                </p>
                <div className="flex w-full gap-2 sm:w-auto">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                    className="min-h-11 flex-1 border border-white/15 px-4 text-sm font-black uppercase text-white disabled:cursor-not-allowed disabled:opacity-35 sm:flex-none"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={currentPage === pageCount}
                    onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
                    className="min-h-11 flex-1 bg-[#b7f34a] px-4 text-sm font-black uppercase text-black disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400 sm:flex-none"
                  >
                    Next
                  </button>
                </div>
              </nav>
            )}
          </section>
        </div>
      </div>
    </>
  )
}

function validOption(value, options, fallback) {
  return options.includes(value) ? value : fallback
}

function validPrice(value, fallback, limits) {
  const number = Number(value)
  return Number.isFinite(number) && number >= limits.min && number <= limits.max ? number : fallback
}

function readList(params, name) {
  return [...new Set(params.getAll(name).map((value) => value.trim()).filter(Boolean))]
}

function appendList(params, name, values) {
  values.forEach((value) => params.append(name, value))
}

function setOptionalParam(params, name, value, defaultValue) {
  if (value !== defaultValue && value !== "") params.set(name, String(value))
}

function FilterSection({ title, children }) {
  return (
    <details open className="border-b border-white/10 py-5">
      <summary className="cursor-pointer list-none text-sm font-black text-white marker:content-none">{title}</summary>
      <div className="mt-4">{children}</div>
    </details>
  )
}

function PriceFilter({ limits, minValue, maxValue, onMinChange, onMaxChange }) {
  const span = limits.max - limits.min
  const left = ((minValue - limits.min) / span) * 100
  const right = 100 - ((maxValue - limits.min) / span) * 100

  return (
    <div>
      <div className="flex justify-between gap-3 text-xs font-bold text-[#4ed8cf]">
        <span>${minValue}</span>
        <span>${maxValue}</span>
      </div>
      <div className="relative mt-4 h-5">
        <div className="absolute left-0 right-0 top-2 h-1 bg-white/15" />
        <div className="absolute top-2 h-1 bg-[#4ed8cf]" style={{ left: `${left}%`, right: `${right}%` }} />
        <input
          type="range"
          min={limits.min}
          max={limits.max}
          value={minValue}
          onChange={(event) => onMinChange(Math.min(Number(event.target.value), maxValue))}
          className="price-range absolute inset-0 w-full"
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={limits.min}
          max={limits.max}
          value={maxValue}
          onChange={(event) => onMaxChange(Math.max(Number(event.target.value), minValue))}
          className="price-range absolute inset-0 w-full"
          aria-label="Maximum price"
        />
      </div>
    </div>
  )
}

function RadioGroup({ value, onChange, options }) {
  return (
    <div className="grid gap-2">
      {options.map(([optionValue, label]) => (
        <label key={optionValue} className="flex cursor-pointer items-center gap-2 text-sm text-gray-300">
          <input
            type="radio"
            name="overclocked"
            value={optionValue}
            checked={value === optionValue}
            onChange={(event) => onChange(event.target.value)}
            className="size-4 accent-[#b7f34a]"
          />
          {label}
        </label>
      ))}
    </div>
  )
}

function CheckboxGroup({ options, selected, onChange }) {
  function toggle(option) {
    onChange(selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option])
  }

  return (
    <div className="grid gap-2">
      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-300">
        <input
          type="checkbox"
          checked={selected.length === 0}
          onChange={() => onChange([])}
          className="size-4 accent-[#b7f34a]"
        />
        All
      </label>
      {options.map((option) => (
        <label key={option} className="flex cursor-pointer items-start gap-2 text-sm leading-5 text-gray-300">
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => toggle(option)}
            className="mt-0.5 size-4 shrink-0 accent-[#b7f34a]"
          />
          {option}
        </label>
      ))}
    </div>
  )
}

function sortProducts(a, b, sort, query) {
  if (sort === "name-asc") return a.name.localeCompare(b.name)
  if (sort === "name-desc") return b.name.localeCompare(a.name)
  if (sort === "price-desc") return Number(b.price) - Number(a.price)
  if (sort === "price-asc") return Number(a.price) - Number(b.price)
  if (sort === "availability") return Number(b.stock) - Number(a.stock)
  if (sort === "newest") return Number(b.id) - Number(a.id)

  if (query) {
    const aStarts = a.name.toLowerCase().startsWith(query) ? 1 : 0
    const bStarts = b.name.toLowerCase().startsWith(query) ? 1 : 0
    if (aStarts !== bStarts) return bStarts - aStarts
  }

  return Number(a.id) - Number(b.id)
}

function getProductSpecs(product) {
  const coolerType = product.radiatorSize
    ? `Liquid Cooler (${product.radiatorSize}mm)`
    : product.category === "Cooling"
      ? "Air Cooler"
      : null

  return {
    socket: product.socket,
    overclocked: product.overclockable,
    caseType: product.formFactor,
    coolerType,
  }
}
