import { prisma } from "@/lib/prisma"
import { SubscriptionPlans } from "@/components/subscription/subscription-plans"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, Calendar, Percent, Pause } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Abonnements",
  description: "Recevez chaque semaine vos asperges fraîches avec nos formules d'abonnement. Livraison gratuite et réductions exclusives.",
}

const benefits = [
  {
    icon: Truck,
    title: "Livraison gratuite",
    description: "Toutes nos livraisons d'abonnement sont offertes.",
  },
  {
    icon: Calendar,
    title: "Livraison hebdomadaire",
    description: "Recevez vos asperges fraîches chaque semaine.",
  },
  {
    icon: Percent,
    title: "Prix avantageux",
    description: "Profitez de tarifs préférentiels sur tous nos produits.",
  },
  {
    icon: Pause,
    title: "Flexible",
    description: "Mettez en pause ou annulez à tout moment.",
  },
]

async function getPlans() {
  return await prisma.subscriptionPlan.findMany({
    where: { active: true },
    orderBy: { priceWeekly: "asc" },
  })
}

export default async function SubscriptionPage() {
  const plans = await getPlans()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4">Économisez jusqu{"'"}à 15%</Badge>
          <h1 className="text-4xl font-bold mb-4">Nos Abonnements</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Recevez chaque semaine vos asperges fraîches directement chez vous. 
            Choisissez la formule qui correspond à vos besoins.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {benefits.map((benefit) => (
            <Card key={benefit.title}>
              <CardContent className="pt-6 text-center">
                <benefit.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-sm">{benefit.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Plans */}
        <SubscriptionPlans plans={plans} />

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Questions fréquentes</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Comment fonctionne l{"'"}abonnement ?</h3>
                <p className="text-sm text-muted-foreground">
                  Après votre inscription, vous recevez automatiquement chaque semaine 
                  la quantité d{"'"}asperges correspondant à votre formule. La livraison 
                  est effectuée le jour de la récolte pour une fraîcheur maximale.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Puis-je modifier mon abonnement ?</h3>
                <p className="text-sm text-muted-foreground">
                  Oui, vous pouvez changer de formule, mettre en pause ou annuler 
                  votre abonnement à tout moment depuis votre espace client.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Quand commence mon abonnement ?</h3>
                <p className="text-sm text-muted-foreground">
                  Votre abonnement débute dès la semaine suivant votre inscription, 
                  pendant la saison des asperges (mars à juin).
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
