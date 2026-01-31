import { notFound } from "next/navigation"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, Truck, MapPin, Phone, Mail } from "lucide-react"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ id: string }>
}

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  PENDING: { label: "En attente", variant: "secondary" },
  CONFIRMED: { label: "Confirmée", variant: "default" },
  SHIPPED: { label: "Expédiée", variant: "default" },
  DELIVERED: { label: "Livrée", variant: "outline" },
  CANCELED: { label: "Annulée", variant: "destructive" },
}

async function getOrder(orderId: string, userId: string) {
  return await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Commande #${id.slice(0, 8).toUpperCase()}`,
  }
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const order = await getOrder(id, session.user.id)

  if (!order) {
    notFound()
  }

  const address = order.addressSnapshot as {
    name: string
    email: string
    phone: string
    line1: string
    line2?: string
    city: string
    zip: string
    country: string
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/account/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux commandes
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">
            Commande #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-muted-foreground">
            Passée le {new Date(order.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <Badge variant={statusLabels[order.status]?.variant} className="text-base px-4 py-1">
          {statusLabels[order.status]?.label}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Delivery Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Truck className="h-5 w-5" />
              Livraison
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Mode de livraison</p>
              <p className="font-medium">
                {order.deliveryMethod === "pickup" ? "Retrait à la ferme" : "Livraison à domicile"}
              </p>
            </div>
            {order.deliverySlot && (
              <div>
                <p className="text-sm text-muted-foreground">Créneau</p>
                <p className="font-medium">{order.deliverySlot}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-5 w-5" />
              Coordonnées
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="font-medium">{address.name}</p>
            {order.deliveryMethod === "delivery" && (
              <p className="text-muted-foreground">
                {address.line1}
                {address.line2 && <><br />{address.line2}</>}
                <br />
                {address.zip} {address.city}
              </p>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              {address.phone}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {address.email}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Articles commandés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{item.nameSnapshot}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.priceSnapshot.toFixed(2)} EUR x {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-medium">
                  {(item.priceSnapshot * item.quantity).toFixed(2)} EUR
                </p>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sous-total</span>
              <span>{order.total.toFixed(2)} EUR</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Livraison</span>
              <span>Incluse</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{order.total.toFixed(2)} EUR</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {order.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{order.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
