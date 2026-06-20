import test from "node:test"
import assert from "node:assert/strict"
import {
  calculateOrderTotal,
  calculateSnapshotTotal,
  normalizeCartItems,
  paymentMatchesOrder,
} from "../lib/orderRules.js"

test("normalizes duplicate cart entries", () => {
  assert.deepEqual(
    normalizeCartItems([{ id: 1, quantity: 2 }, { id: 1, quantity: 1 }, { id: 2, quantity: 1 }]),
    [{ id: 1, quantity: 3 }, { id: 2, quantity: 1 }]
  )
})

test("rejects invalid cart quantities", () => {
  assert.throws(() => normalizeCartItems([{ id: 1, quantity: 0 }]), /invalid product data/)
})

test("calculates totals from server product prices", () => {
  const products = new Map([[1, { price: 199.99 }], [2, { price: 50 }]])
  const total = calculateOrderTotal([{ id: 1, quantity: 2 }, { id: 2, quantity: 1 }], products)
  assert.equal(total, 449.98)
})

test("calculates stored order snapshot totals", () => {
  assert.equal(calculateSnapshotTotal([{ price: 100, quantity: 2 }, { price: 49.5, quantity: 1 }]), 249.5)
})

test("validates Stripe currency and amount", () => {
  assert.equal(paymentMatchesOrder(129.99, { currency: "usd", amount_total: 12999 }), true)
  assert.equal(paymentMatchesOrder(129.99, { currency: "usd", amount_total: 100 }), false)
  assert.equal(paymentMatchesOrder(129.99, { currency: "mxn", amount_total: 12999 }), false)
})
