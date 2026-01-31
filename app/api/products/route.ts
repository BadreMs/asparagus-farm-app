import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("active") !== "false"

    const products = await prisma.product.findMany({
      where: activeOnly ? { active: true } : {},
      include: {
        inventoryLots: {
          where: {
            quantityAvailable: { gt: 0 },
          },
        },
      },
      orderBy: { price: "asc" },
    })

    const productsWithStock = products.map((product) => ({
      ...product,
      totalStock: product.inventoryLots.reduce(
        (sum, lot) => sum + lot.quantityAvailable,
        0
      ),
    }))

    return NextResponse.json(productsWithStock)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des produits" },
      { status: 500 }
    )
  }
}
