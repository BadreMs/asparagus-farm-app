import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id } = await params

    const address = await prisma.address.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!address) {
      return NextResponse.json({ error: "Adresse non trouvée" }, { status: 404 })
    }

    await prisma.address.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting address:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression de l'adresse" }, { status: 500 })
  }
}
