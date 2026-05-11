export default function ProductPage({ params }) {
  return (
    <main className="flex-1 p-6">
      <h1 className="text-white text-2xl font-bold">Product {params.id}</h1>
    </main>
  )
}