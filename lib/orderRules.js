export function normalizeCartItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty.")
  }

  const quantityByProduct = new Map()

  for (const item of items) {
    const id = Number(item.id)
    const quantity = Number(item.quantity)

    if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Cart contains invalid product data.")
    }

    quantityByProduct.set(id, (quantityByProduct.get(id) ?? 0) + quantity)
  }

  return Array.from(quantityByProduct, ([id, quantity]) => ({ id, quantity }))
}

export function calculateOrderTotal(items, productsById) {
  return items.reduce((sum, item) => {
    const product = productsById.get(item.id)
    if (!product) throw new Error(`Product ${item.id} was not found.`)
    return sum + Number(product.price) * item.quantity
  }, 0)
}

export function calculateSnapshotTotal(items) {
  return items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
}

export function paymentMatchesOrder(orderTotal, checkoutSession) {
  const expectedAmount = Math.round(Number(orderTotal) * 100)
  return checkoutSession.currency === "usd" && checkoutSession.amount_total === expectedAmount
}
