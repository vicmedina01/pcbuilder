import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://pcbuilder-olive.vercel.app"

  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/builder`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/products`, changeFrequency: "weekly", priority: 0.8 },
  ]
}
