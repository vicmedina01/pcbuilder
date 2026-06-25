import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { isConfiguredAdmin } from "@/lib/permissions"

export async function getAdminSession() {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email?.toLowerCase()

  if (!email) return null
  if (isConfiguredAdmin(email)) return session
  if (!process.env.DATABASE_URL) return null

  try {
    const { prisma } = await import("@/lib/prisma")
    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true },
    })

    return user?.role === "ADMIN" ? session : null
  } catch {
    return null
  }
}

export async function requireAdminResponse() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return Response.json({ error: "You must be signed in." }, { status: 401 })
  }

  const adminSession = await getAdminSession()

  if (!adminSession) {
    return Response.json({ error: "Administrator access is required." }, { status: 403 })
  }

  return null
}
