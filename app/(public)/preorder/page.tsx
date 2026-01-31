"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Loader2, CheckCircle2, CalendarDays, Truck, Leaf } from "lucide-react"
import { toast } from "sonner"
import { preorderSchema, type PreorderInput } from "@/lib/validations"

const benefits = [
  {
    icon: CalendarDays,
    title: "Réservez en avance",
    description: "Assurez-vous d'avoir vos asperges pendant toute la saison.",
  },
  {
    icon: Truck,
    title: "Livraison prioritaire",
    description: "Les précommandes sont livrées en priorité le jour de la récolte.",
  },
  {
    icon: Leaf,
    title: "Fraîcheur maximale",
    description: "Récoltées selon votre planning, pas avant.",
  },
]

export default function PreorderPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PreorderInput>({
    resolver: zodResolver(preorderSchema),
    defaultValues: {
      qtyKg: 1,
    },
  })

  const onSubmit = async (data: PreorderInput) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/preorders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Erreur lors de la précommande")

      setIsSuccess(true)
      toast.success("Précommande enregistrée avec succès !")
      reset()
    } catch {
      toast.error("Erreur lors de l'envoi de la précommande")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4">Saison Mars - Juin 2026</Badge>
          <h1 className="text-4xl font-bold mb-4">Précommande Saison</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Réservez dès maintenant vos asperges pour la prochaine saison. 
            Garantissez votre approvisionnement et bénéficiez d{"'"}une livraison prioritaire.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit) => (
            <Card key={benefit.title}>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Formulaire de précommande
            </CardTitle>
            <CardDescription>
              Remplissez ce formulaire pour réserver vos asperges. Nous vous 
              contacterons pour confirmer les détails et la livraison.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Précommande enregistrée !</h3>
                <p className="text-muted-foreground mb-6">
                  Nous avons bien reçu votre demande. Nous vous contacterons 
                  très prochainement pour confirmer votre réservation.
                </p>
                <Button onClick={() => setIsSuccess(false)}>
                  Faire une autre précommande
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      placeholder="Jean Dupont"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      placeholder="06 00 00 00 00"
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (optionnel)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jean@exemple.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="qtyKg">Quantité souhaitée (kg) *</Label>
                    <Input
                      id="qtyKg"
                      type="number"
                      min="1"
                      step="0.5"
                      {...register("qtyKg", { valueAsNumber: true })}
                    />
                    {errors.qtyKg && (
                      <p className="text-sm text-red-600">{errors.qtyKg.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">Date de livraison souhaitée</Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      min="2026-03-01"
                      max="2026-06-30"
                      {...register("preferredDate")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes / Commentaires</Label>
                  <Textarea
                    id="notes"
                    placeholder="Précisions sur la livraison, allergies, etc."
                    rows={4}
                    {...register("notes")}
                  />
                </div>

                <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
                  <p>
                    <strong>Important :</strong> Cette précommande n{"'"}est pas un engagement 
                    ferme. Nous vous contacterons pour confirmer les détails et convenir 
                    des modalités de paiement et de livraison.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Envoyer ma précommande
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
