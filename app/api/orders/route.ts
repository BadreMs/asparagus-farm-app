import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { checkoutSchema } from "@/lib/validations"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()

    const validatedData = checkoutSchema.parse(body)
    const { items, total } = validatedData

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 })
    }

    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id ?? null,
        addressSnapshot: {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          line1: validatedData.line1 || "",
          line2: validatedData.line2 || "",
          city: validatedData.city || "",
          zip: validatedData.zip || "",
          country: "France",
        },
        total,
        status: "PENDING",
        deliveryMethod: validatedData.deliveryMethod,
        deliverySlot: validatedData.deliverySlot || null,
        notes: validatedData.notes || null,
        paymentMethod: "cash_on_delivery",
        items: {
          create: items.map(
            (item: { productId: string; name: string; price: number; quantity: number }) => ({
              productId: item.productId,
              nameSnapshot: item.name,
              priceSnapshot: item.price,
              quantity: item.quantity,
            })
          ),
        },
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error("Order error:", error)
    return NextResponse.json({ error: "Erreur lors de la création de la commande" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des commandes" }, { status: 500 })
  }
}
