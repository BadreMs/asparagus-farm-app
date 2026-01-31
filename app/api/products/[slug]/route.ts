import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        inventoryLots: {
          where: {
            quantityAvailable: { gt: 0 },
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      )
    }

    const totalStock = product.inventoryLots.reduce(
      (sum, lot) => sum + lot.quantityAvailable,
      0
    )

    return NextResponse.json({ ...product, totalStock })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération du produit" },
      { status: 500 }
    )
  }
}
