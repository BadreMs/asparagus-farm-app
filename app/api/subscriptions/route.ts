import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const { planId } = body

    if (!planId) {
      return NextResponse.json({ error: "Plan requis" }, { status: 400 })
    }

    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
    })

    if (existingSubscription) {
      return NextResponse.json({ error: "Vous avez déjà un abonnement actif" }, { status: 400 })
    }

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    })

    if (!plan || !plan.active) {
      return NextResponse.json({ error: "Plan non trouvé ou inactif" }, { status: 404 })
    }

    const subscription = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        planId,
        status: "ACTIVE",
        startDate: new Date(),
      },
      include: {
        plan: true,
      },
    })

    return NextResponse.json({ success: true, subscription })
  } catch (error) {
    console.error("Subscription error:", error)
    return NextResponse.json({ error: "Erreur lors de la création de l'abonnement" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: session.user.id },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des abonnements" }, { status: 500 })
  }
}
