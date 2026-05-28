import "dotenv/config"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"
import pg from "pg"

const { Pool } = pg
const currentDir = path.dirname(fileURLToPath(import.meta.url))
const productsPath = path.join(currentDir, "..", "lib", "products.json")
const products = JSON.parse(await readFile(productsPath, "utf8"))

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to seed products")
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

try {
  for (const product of products) {
    await pool.query(
      `
        INSERT INTO "Product" ("id", "name", "description", "price", "category", "image", "stock", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        ON CONFLICT ("id") DO UPDATE SET
          "name" = EXCLUDED."name",
          "description" = EXCLUDED."description",
          "price" = EXCLUDED."price",
          "category" = EXCLUDED."category",
          "image" = EXCLUDED."image",
          "stock" = EXCLUDED."stock",
          "updatedAt" = NOW()
      `,
      [product.id, product.name, product.description, product.price, product.category, product.image, product.stock]
    )
  }

  await pool.query(`SELECT setval('"Product_id_seq"', (SELECT MAX("id") FROM "Product"))`)
  console.log(`Seeded ${products.length} products`)
} finally {
  await pool.end()
}
