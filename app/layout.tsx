import Navbar from "@/components/Navbar.jsx"
import Footer from "@/components/footer.jsx"
import Providers from "@/components/Providers"
import "./globals.css"

export const metadata = {
  metadataBase: new URL("https://pcbuilder-olive.vercel.app"),
  title: "PCBuilder | Build for the way you play",
  description: "Guided PC recommendations for gaming, AI, and creative work.",
  openGraph: {
    title: "PCBuilder | Build for the way you play",
    description: "Create compatible PC builds, compare components, and save configurations for gaming, AI, and work.",
    url: "https://pcbuilder-olive.vercel.app",
    siteName: "PCBuilder",
    images: [{ url: "/products/Case/fractal-design-north.jpg", width: 500, height: 500 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PCBuilder | Build for the way you play",
    description: "Guided, compatible PC builds for gaming, AI, and creative work.",
    images: ["/products/Case/fractal-design-north.jpg"],
  },
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
