export function serializeBuild(build) {
  return {
    ...build,
    items: build.items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        price: Number(item.product.price),
      },
    })),
  }
}
