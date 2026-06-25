import test from "node:test"
import assert from "node:assert/strict"
import { validateProductInput } from "../lib/productValidation.js"

const validProduct = {
  name: "Example GPU",
  description: "A product used by the validation tests.",
  category: "GPU",
  price: "499.99",
  stock: "8",
  image: "/products/gpu/example.jpg",
  vramGb: "16",
  supportedSockets: "",
  supportedFormFactors: "ATX, MicroATX",
  supportedRadiatorSizes: "240, 360",
}

test("normalizes valid admin product data", () => {
  const product = validateProductInput(validProduct)

  assert.equal(product.price, 499.99)
  assert.equal(product.stock, 8)
  assert.equal(product.vramGb, 16)
  assert.deepEqual(product.supportedFormFactors, ["ATX", "MicroATX"])
  assert.deepEqual(product.supportedRadiatorSizes, [240, 360])
})

test("rejects invalid categories and stock", () => {
  assert.throws(
    () => validateProductInput({ ...validProduct, category: "Laptop" }),
    /valid product category/
  )
  assert.throws(
    () => validateProductInput({ ...validProduct, stock: "1.5" }),
    /valid whole number/
  )
})

test("rejects remote image URLs", () => {
  assert.throws(
    () => validateProductInput({ ...validProduct, image: "https://example.com/gpu.jpg" }),
    /local path/
  )
})
