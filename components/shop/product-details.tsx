"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, ShoppingCart, Truck, Leaf, Clock, ArrowLeft } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { toast } from "sonner"
import type { ProductWithInventory } from "@/lib/types"

interface ProductDetailsProps {
  product: ProductWithInventory
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)
  const isOutOfStock = (product.totalStock ?? 0) <= 0

  const handleAddToCart = () => {
    addItem(product, quantity)
    toast.success(`${quantity}x ${product.name} ajouté au panier`)
    setQuantity(1)
  }

  return (
    <div>
      <Link
        href="/shop"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour à la boutique
      </Link>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
            {product.images?.[0] ? (
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Pas d{"'"}image disponible
              </div>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  Rupture de stock
                </Badge>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1, 5).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden bg-muted"
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} - Image ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-muted-foreground text-lg">{product.description}</p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">
              {product.price.toFixed(2)} EUR
            </span>
            <span className="text-muted-foreground">/ {product.unit}</span>
          </div>

          <Separator />

          {/* Quantity Selector */}
          <div className="space-y-4">
            <label className="text-sm font-medium">Quantité</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-muted-foreground">
                Total: {(product.price * quantity).toFixed(2)} EUR
              </span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {isOutOfStock ? "Rupture de stock" : "Ajouter au panier"}
          </Button>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground">Livraison rapide</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Leaf className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground">Culture raisonnée</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground">Fraîcheur garantie</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
