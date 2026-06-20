import "dotenv/config"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"
import pg from "pg"

const { Pool } = pg
const currentDir = path.dirname(fileURLToPath(import.meta.url))
const productsPath = path.join(currentDir, "..", "lib", "products.json")
const products = JSON.parse(await readFile(productsPath, "utf8"))
const productColumns = [
  "id",
  "name",
  "description",
  "price",
  "category",
  "image",
  "stock",
  "brand",
  "socket",
  "chipset",
  "formFactor",
  "memoryType",
  "capacityGb",
  "storageType",
  "wattage",
  "tdp",
  "vramGb",
  "lengthMm",
  "coolerHeightMm",
  "radiatorSize",
  "recommendedPsu",
  "overclockable",
  "maxGpuLengthMm",
  "maxCoolerHeightMm",
  "supportedSockets",
  "supportedFormFactors",
  "supportedRadiatorSizes",
  "featured",
]

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to seed products")
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

try {
  for (const product of products) {
    const quotedColumns = productColumns.map((column) => `"${column}"`).join(", ")
    const placeholders = productColumns.map((_, index) => `$${index + 1}`).join(", ")
    const updates = productColumns
      .filter((column) => column !== "id")
      .map((column) => `"${column}" = EXCLUDED."${column}"`)
      .join(",\n          ")

    await pool.query(
      `
        INSERT INTO "Product" (${quotedColumns}, "updatedAt")
        VALUES (${placeholders}, NOW())
        ON CONFLICT ("id") DO UPDATE SET
          ${updates},
          "updatedAt" = NOW()
      `,
      productColumns.map((column) => product[column])
    )
  }

  await pool.query(`SELECT setval('"Product_id_seq"', (SELECT MAX("id") FROM "Product"))`)
  console.log(`Seeded ${products.length} products`)
} finally {
  await pool.end()
}
