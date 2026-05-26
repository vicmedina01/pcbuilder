import Navbar from "@/components/Navbar.jsx"
import Footer from "@/components/footer.jsx"
import Providers from "@/components/Providers"
import "./globals.css"

export const metadata = {
  title: "PCBuilder",
  description: "PC components ecommerce with an integrated PC Builder",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
