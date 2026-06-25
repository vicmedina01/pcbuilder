import GoogleProvider from "next-auth/providers/google"
import { isConfiguredAdmin } from "@/lib/permissions"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email || !process.env.DATABASE_URL) return true

      try {
        const { prisma } = await import("@/lib/prisma")
        const configuredRole = isConfiguredAdmin(user.email) ? "ADMIN" : "USER"

        await prisma.user.upsert({
          where: { email: user.email.toLowerCase() },
          update: {
            name: user.name,
            image: user.image,
            ...(configuredRole === "ADMIN" ? { role: "ADMIN" } : {}),
          },
          create: {
            email: user.email.toLowerCase(),
            name: user.name,
            image: user.image,
            role: configuredRole,
          },
        })
      } catch (error) {
        console.error("Could not synchronize the authenticated user.", error)
      }

      return true
    },
    async jwt({ token }) {
      if (!token.email) return token

      token.role = isConfiguredAdmin(token.email) ? "ADMIN" : "USER"

      if (process.env.DATABASE_URL && token.role !== "ADMIN") {
        try {
          const { prisma } = await import("@/lib/prisma")
          const user = await prisma.user.findUnique({
            where: { email: token.email.toLowerCase() },
            select: { role: true },
          })
          token.role = user?.role ?? "USER"
        } catch {
          token.role = "USER"
        }
      }

      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role ?? "USER"
      }
      return session
    },
  },
}
