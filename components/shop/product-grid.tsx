"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Eye } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { toast } from "sonner"
import type { ProductWithInventory } from "@/lib/types"

interface ProductGridProps {
  products: ProductWithInventory[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (product: ProductWithInventory) => {
    addItem(product)
    toast.success(`${product.name} ajouté au panier`)
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucun produit disponible pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => {
        const isOutOfStock = (product.totalStock ?? 0) <= 0

        return (
          <Card key={product.id} className="group overflow-hidden">
            <Link href={`/product/${product.slug}`}>
              <div className="relative h-48 bg-muted overflow-hidden">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Pas d{"'"}image
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <Badge variant="destructive">Rupture de stock</Badge>
                  </div>
                )}
              </div>
            </Link>
            <CardContent className="p-4">
              <Link href={`/product/${product.slug}`}>
                <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-primary">
                    {product.price.toFixed(2)} EUR
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    / {product.unit}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  className="flex-1"
                  disabled={isOutOfStock}
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/product/${product.slug}`}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Voir le produit</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
