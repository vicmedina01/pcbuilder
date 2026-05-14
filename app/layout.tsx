import Navbar from "@/components/Navbar.jsx"
import Footer from "@/components/footer.jsx"
import Providers from "@/components/Providers"
import "./globals.css"

export const metadata = {
  title: "PCBuilder",
  description: "PC components ecommerce with an integrated PC Builder",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}