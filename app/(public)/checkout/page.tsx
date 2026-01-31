"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Truck, Store, ShoppingBag, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { useCartStore } from "@/lib/cart-store"
import { checkoutSchema, type CheckoutInput } from "@/lib/validations"

const deliverySlots = [
  { value: "morning", label: "Matin (8h - 12h)" },
  { value: "afternoon", label: "Après-midi (14h - 18h)" },
  { value: "evening", label: "Soir (18h - 20h)" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, getTotal, clearCart } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const total = getTotal()
  const shipping = total >= 50 ? 0 : 5.90

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      deliveryMethod: "delivery",
    },
  })

  const deliveryMethod = watch("deliveryMethod")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (session?.user) {
      setValue("name", session.user.name || "")
      setValue("email", session.user.email || "")
    }
  }, [session, setValue])

  const onSubmit = async (data: CheckoutInput) => {
    if (items.length === 0) {
      toast.error("Votre panier est vide")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          })),
          total: total + (deliveryMethod === "delivery" ? shipping : 0),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erreur lors de la commande")
      }

      const result = await response.json()
      setOrderId(result.order.id)
      setOrderComplete(true)
      clearCart()
      toast.success("Commande confirmée !")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la commande")
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground/30 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-2">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-6">
            Ajoutez des produits à votre panier avant de passer commande.
          </p>
          <Button asChild>
            <Link href="/shop">Voir la boutique</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <CheckCircle2 className="h-24 w-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-2">Commande confirmée !</h1>
          <p className="text-muted-foreground mb-2">
            Merci pour votre commande. Vous recevrez bientôt un email de confirmation.
          </p>
          {orderId && (
            <p className="text-sm text-muted-foreground mb-6">
              Numéro de commande : <strong>{orderId.slice(0, 8).toUpperCase()}</strong>
            </p>
          )}
          <div className="flex flex-col gap-2">
            {session ? (
              <Button asChild>
                <Link href="/account/orders">Voir mes commandes</Link>
              </Button>
            ) : null}
            <Button variant="outline" asChild>
              <Link href="/shop">Continuer mes achats</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input id="name" {...register("name")} />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" {...register("phone")} placeholder="06 00 00 00 00" />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Method */}
            <Card>
              <CardHeader>
                <CardTitle>Mode de livraison</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={deliveryMethod}
                  onValueChange={(value) => setValue("deliveryMethod", value as "delivery" | "pickup")}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Livraison à domicile</p>
                          <p className="text-sm text-muted-foreground">
                            {total >= 50 ? "Gratuite" : "5,90 EUR"} - Livré dans la journée
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Store className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Retrait à la ferme</p>
                          <p className="text-sm text-muted-foreground">
                            Gratuit - 123 Chemin des Asperges, Avignon
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Address (only for delivery) */}
            {deliveryMethod === "delivery" && (
              <Card>
                <CardHeader>
                  <CardTitle>Adresse de livraison</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="line1">Adresse</Label>
                    <Input id="line1" {...register("line1")} placeholder="123 Rue Exemple" />
                    {errors.line1 && (
                      <p className="text-sm text-red-600">{errors.line1.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="line2">Complément (optionnel)</Label>
                    <Input id="line2" {...register("line2")} placeholder="Appartement, bâtiment..." />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input id="city" {...register("city")} />
                      {errors.city && (
                        <p className="text-sm text-red-600">{errors.city.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">Code postal</Label>
                      <Input id="zip" {...register("zip")} />
                      {errors.zip && (
                        <p className="text-sm text-red-600">{errors.zip.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliverySlot">Créneau de livraison</Label>
                    <Select onValueChange={(value) => setValue("deliverySlot", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un créneau" />
                      </SelectTrigger>
                      <SelectContent>
                        {deliverySlots.map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions de livraison (optionnel)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  {...register("notes")}
                  placeholder="Instructions particulières pour la livraison..."
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle>Paiement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium mb-1">Paiement à la livraison</p>
                  <p className="text-sm text-muted-foreground">
                    Vous paierez en espèces ou par carte bancaire lors de la livraison 
                    ou du retrait de votre commande.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Votre commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {item.product.images?.[0] ? (
                        <Image
                          src={item.product.images[0] || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ShoppingBag className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qté: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-sm">
                      {(item.product.price * item.quantity).toFixed(2)} EUR
                    </p>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{total.toFixed(2)} EUR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Livraison</span>
                    <span>
                      {deliveryMethod === "pickup" ? (
                        "Gratuite"
                      ) : shipping === 0 ? (
                        <span className="text-green-600">Gratuite</span>
                      ) : (
                        `${shipping.toFixed(2)} EUR`
                      )}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>
                    {(total + (deliveryMethod === "delivery" ? shipping : 0)).toFixed(2)} EUR
                  </span>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirmer la commande
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  En passant commande, vous acceptez nos conditions générales de vente.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
