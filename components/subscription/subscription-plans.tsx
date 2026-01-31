"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import type { SubscriptionPlan } from "@prisma/client"

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[]
}

export function SubscriptionPlans({ plans }: SubscriptionPlansProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handleSubscribe = async (planId: string) => {
    if (!session) {
      router.push("/auth/login?callbackUrl=/subscription")
      return
    }

    setLoadingPlan(planId)
    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erreur lors de l'inscription")
      }

      toast.success("Abonnement créé avec succès !")
      router.push("/account")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'inscription")
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans.map((plan, index) => {
        const isPopular = index === 1
        return (
          <Card
            key={plan.id}
            className={`relative ${isPopular ? "border-primary shadow-lg scale-105" : ""}`}
          >
            {isPopular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Le plus populaire
              </Badge>
            )}
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.qtyKg} kg / semaine</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.priceWeekly.toFixed(0)}</span>
                <span className="text-muted-foreground"> EUR/semaine</span>
              </div>
              <ul className="space-y-3 text-left">
                {plan.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={isPopular ? "default" : "outline"}
                onClick={() => handleSubscribe(plan.id)}
                disabled={loadingPlan === plan.id}
              >
                {loadingPlan === plan.id && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                S{"'"}abonner
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
