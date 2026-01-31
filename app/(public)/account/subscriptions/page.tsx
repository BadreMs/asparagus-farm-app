import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Calendar, Check, ExternalLink } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mes abonnements",
  description: "Gérez vos abonnements",
}

const statusLabels: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Actif", color: "bg-green-100 text-green-800" },
  PAUSED: { label: "En pause", color: "bg-yellow-100 text-yellow-800" },
  CANCELED: { label: "Annulé", color: "bg-red-100 text-red-800" },
}

async function getSubscriptions(userId: string) {
  return await prisma.subscription.findMany({
    where: { userId },
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  })
}

export default async function SubscriptionsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const subscriptions = await getSubscriptions(session.user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes abonnements</h1>
          <p className="text-muted-foreground">
            Gérez vos abonnements hebdomadaires
          </p>
        </div>
        <Button asChild>
          <Link href="/subscription">
            <ExternalLink className="mr-2 h-4 w-4" />
            Voir les offres
          </Link>
        </Button>
      </div>

      {subscriptions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <RefreshCw className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun abonnement</h3>
            <p className="text-muted-foreground mb-6">
              Vous n{"'"}avez pas encore souscrit à un abonnement
            </p>
            <Button asChild>
              <Link href="/subscription">Découvrir nos abonnements</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((subscription) => (
            <Card key={subscription.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5" />
                      Abonnement {subscription.plan.name}
                    </CardTitle>
                    <CardDescription>
                      {subscription.plan.qtyKg} kg / semaine
                    </CardDescription>
                  </div>
                  <Badge className={statusLabels[subscription.status]?.color}>
                    {statusLabels[subscription.status]?.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Prix hebdomadaire</p>
                    <p className="font-semibold">{subscription.plan.priceWeekly.toFixed(2)} EUR / semaine</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date de début</p>
                    <p className="font-semibold flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(subscription.startDate).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {subscription.plan.benefits.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Avantages inclus</p>
                    <ul className="space-y-1">
                      {subscription.plan.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
