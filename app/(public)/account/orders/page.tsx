import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, ChevronRight } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mes commandes",
  description: "Consultez l'historique de vos commandes",
}

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  PENDING: { label: "En attente", variant: "secondary" },
  CONFIRMED: { label: "Confirmée", variant: "default" },
  SHIPPED: { label: "Expédiée", variant: "default" },
  DELIVERED: { label: "Livrée", variant: "outline" },
  CANCELED: { label: "Annulée", variant: "destructive" },
}

async function getOrders(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const orders = await getOrders(session.user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mes commandes</h1>
        <p className="text-muted-foreground">
          Consultez et suivez toutes vos commandes
        </p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune commande</h3>
            <p className="text-muted-foreground mb-6">
              Vous n{"'"}avez pas encore passé de commande
            </p>
            <Button asChild>
              <Link href="/shop">Découvrir nos produits</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Commande #{order.id.slice(0, 8).toUpperCase()}
                    </CardTitle>
                    <CardDescription>
                      {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </CardDescription>
                  </div>
                  <Badge variant={statusLabels[order.status]?.variant}>
                    {statusLabels[order.status]?.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} article{order.items.length > 1 ? "s" : ""}
                    </p>
                    <p className="font-semibold">{order.total.toFixed(2)} EUR</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/account/orders/${order.id}`}>
                      Détails
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
