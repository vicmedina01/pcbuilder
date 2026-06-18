import Navbar from "@/components/Navbar.jsx"
import Footer from "@/components/footer.jsx"
import Providers from "@/components/Providers"
import "./globals.css"

export const metadata = {
  title: "PCBuilder | Build for the way you play",
  description: "Guided PC recommendations for gaming, AI, and creative work.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
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
