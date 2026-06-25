const productCategories = ["CPU", "Motherboard", "RAM", "GPU", "Storage", "PSU", "Case", "Cooling"]

const nullableStrings = ["brand", "socket", "chipset", "formFactor", "memoryType", "storageType"]
const nullableNumbers = [
  "capacityGb",
  "wattage",
  "tdp",
  "vramGb",
  "lengthMm",
  "coolerHeightMm",
  "radiatorSize",
  "recommendedPsu",
  "maxGpuLengthMm",
  "maxCoolerHeightMm",
]

export function validateProductInput(input) {
  const name = cleanString(input.name)
  const description = cleanString(input.description)
  const category = cleanString(input.category)
  const image = cleanString(input.image)
  const price = Number(input.price)
  const stock = Number(input.stock)

  if (name.length < 2 || name.length > 120) {
    throw new Error("Product name must be between 2 and 120 characters.")
  }
  if (!productCategories.includes(category)) {
    throw new Error("Choose a valid product category.")
  }
  if (!Number.isFinite(price) || price < 0 || price > 100000) {
    throw new Error("Price must be a valid positive number.")
  }
  if (!Number.isInteger(stock) || stock < 0 || stock > 100000) {
    throw new Error("Stock must be a valid whole number.")
  }
  if (image && !image.startsWith("/")) {
    throw new Error("Product images must use a local path beginning with '/'.")
  }

  const data = {
    name,
    description: description || null,
    category,
    image: image || null,
    price,
    stock,
    featured: Boolean(input.featured),
    overclockable: toNullableBoolean(input.overclockable),
    supportedSockets: cleanList(input.supportedSockets),
    supportedFormFactors: cleanList(input.supportedFormFactors),
    supportedRadiatorSizes: cleanNumberList(input.supportedRadiatorSizes),
  }

  for (const field of nullableStrings) {
    data[field] = cleanString(input[field]) || null
  }

  for (const field of nullableNumbers) {
    data[field] = toNullableNumber(input[field], field)
  }

  return data
}

function cleanString(value) {
  return typeof value === "string" ? value.trim() : ""
}

function cleanList(value) {
  const entries = Array.isArray(value) ? value : cleanString(value).split(",")
  return [...new Set(entries.map(cleanString).filter(Boolean))]
}

function cleanNumberList(value) {
  return cleanList(value).map((entry) => {
    const number = Number(entry)
    if (!Number.isInteger(number) || number < 0) {
      throw new Error("Supported radiator sizes must be whole numbers.")
    }
    return number
  })
}

function toNullableNumber(value, field) {
  if (value === "" || value === null || value === undefined) return null
  const number = Number(value)
  if (!Number.isInteger(number) || number < 0) {
    throw new Error(`${field} must be a positive whole number.`)
  }
  return number
}

function toNullableBoolean(value) {
  if (value === "" || value === null || value === undefined) return null
  if (value === true || value === "true") return true
  if (value === false || value === "false") return false
  return null
}
