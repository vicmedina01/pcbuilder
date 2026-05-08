export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <span className="text-xl font-bold">PCBuilder</span>
      <div className="flex gap-6">
        <a href="#">Productos</a>
        <a href="#">PC Builder</a>
        <a href="#">Carrito</a>
      </div>
    </nav>
  )
}