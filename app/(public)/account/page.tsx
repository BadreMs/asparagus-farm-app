import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, MapPin, RefreshCw, Calendar } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mon compte",
  description: "Gérez votre compte et consultez vos commandes",
}

async function getAccountStats(userId: string) {
  const [ordersCount, addressesCount, subscription] = await Promise.all([
    prisma.order.count({ where: { userId } }),
    prisma.address.count({ where: { userId } }),
    prisma.subscription.findFirst({
      where: { userId, status: "ACTIVE" },
      include: { plan: true },
    }),
  ])

  const recentOrders = await prisma.order.findMany({
    where: { userId },
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  })

  return { ordersCount, addressesCount, subscription, recentOrders }
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const stats = await getAccountStats(session.user.id)

  const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    PENDING: { label: "En attente", variant: "secondary" },
    CONFIRMED: { label: "Confirmée", variant: "default" },
    SHIPPED: { label: "Expédiée", variant: "default" },
    DELIVERED: { label: "Livrée", variant: "outline" },
    CANCELED: { label: "Annulée", variant: "destructive" },
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bonjour, {session.user.name} !</h1>
        <p className="text-muted-foreground">
          Bienvenue dans votre espace client
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/account/orders">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.ordersCount}</p>
                  <p className="text-sm text-muted-foreground">Commandes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/account/addresses">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.addressesCount}</p>
                  <p className="text-sm text-muted-foreground">Adresses</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/account/subscriptions">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <RefreshCw className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {stats.subscription ? "Actif" : "Aucun"}
                  </p>
                  <p className="text-sm text-muted-foreground">Abonnement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Active Subscription */}
      {stats.subscription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Votre abonnement actif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">{stats.subscription.plan.name}</p>
                <p className="text-muted-foreground">
                  {stats.subscription.plan.qtyKg} kg / semaine - {stats.subscription.plan.priceWeekly.toFixed(2)} EUR/sem
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                Actif
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Dernières commandes</CardTitle>
          <CardDescription>
            Vos 3 commandes les plus récentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Vous n{"'"}avez pas encore passé de commande
            </p>
          ) : (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-muted">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">
                        Commande #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={statusLabels[order.status]?.variant}>
                      {statusLabels[order.status]?.label}
                    </Badge>
                    <p className="text-sm font-medium mt-1">{order.total.toFixed(2)} EUR</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
