import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: { id: string } };

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    // Guards : évitent un crash au build si les env ne sont pas définies
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });
    }
    if (!process.env.NEXTAUTH_SECRET) {
      return NextResponse.json({ error: "NEXTAUTH_SECRET not set" }, { status: 500 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const id = params.id;

    const address = await prisma.address.findFirst({
      where: { id, userId: session.user.id },
      select: { id: true },
    });

    if (!address) {
      return NextResponse.json({ error: "Adresse non trouvée" }, { status: 404 });
    }

    await prisma.address.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'adresse" },
      { status: 500 }
    );
  }
}
