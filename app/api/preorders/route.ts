import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { preorderSchema } from "@/lib/validations"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = preorderSchema.parse(body)

    const preorder = await prisma.preorderRequest.create({
      data: {
        name: validatedData.name,
        phone: validatedData.phone,
        email: validatedData.email || null,
        qtyKg: validatedData.qtyKg,
        preferredDate: validatedData.preferredDate
          ? new Date(validatedData.preferredDate)
          : null,
        notes: validatedData.notes || null,
      },
    })

    return NextResponse.json({ success: true, preorder })
  } catch (error) {
    console.error("Preorder error:", error)
    return NextResponse.json(
      { error: "Erreur lors de la précommande" },
      { status: 500 }
    )
  }
}
