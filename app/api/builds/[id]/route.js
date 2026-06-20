import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { serializeBuild } from "@/lib/builds"

export async function GET(_request, context) {
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: "Database is not configured." }, { status: 503 })
  }

  const { id } = await context.params
  const session = await getServerSession(authOptions)
  const { prisma } = await import("@/lib/prisma")
  const build = await prisma.build.findFirst({
    where: {
      id,
      OR: [
        { isPublic: true },
        ...(session?.user?.email ? [{ user: { email: session.user.email } }] : []),
      ],
    },
    include: { items: { include: { product: true } }, user: { select: { name: true } } },
  })

  if (!build) {
    return Response.json({ error: "Build not found." }, { status: 404 })
  }

  return Response.json({ build: serializeBuild(build) })
}

export async function PATCH(request, context) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return Response.json({ error: "You must be signed in to update a build." }, { status: 401 })
  }

  const { id } = await context.params
  const body = await request.json()
  const data = {}

  if (typeof body.name === "string") {
    const name = body.name.trim()
    if (name.length < 2 || name.length > 80) {
      return Response.json({ error: "Build name must be between 2 and 80 characters." }, { status: 400 })
    }
    data.name = name
  }

  if (typeof body.isPublic === "boolean") {
    data.isPublic = body.isPublic
  }

  if (!Object.keys(data).length) {
    return Response.json({ error: "No valid changes were provided." }, { status: 400 })
  }

  const { prisma } = await import("@/lib/prisma")
  const existingBuild = await prisma.build.findFirst({
    where: { id, user: { email: session.user.email } },
  })

  if (!existingBuild) {
    return Response.json({ error: "Build not found." }, { status: 404 })
  }

  const build = await prisma.build.update({
    where: { id },
    data,
    include: { items: { include: { product: true } } },
  })

  return Response.json({ build: serializeBuild(build) })
}

export async function DELETE(_request, context) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return Response.json({ error: "You must be signed in to delete a build." }, { status: 401 })
  }

  const { id } = await context.params
  const { prisma } = await import("@/lib/prisma")
  const result = await prisma.build.deleteMany({
    where: { id, user: { email: session.user.email } },
  })

  if (!result.count) {
    return Response.json({ error: "Build not found." }, { status: 404 })
  }

  return Response.json({ deleted: true })
}
