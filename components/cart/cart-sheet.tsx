"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"

interface CartSheetProps {
  children: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartSheet({ children, open, onOpenChange }: CartSheetProps) {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore()
  const total = getTotal()

  return (
    <>
      {children}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Votre panier ({items.length})
            </SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium mb-2">Votre panier est vide</p>
              <p className="text-muted-foreground text-sm mb-6">
                Découvrez nos délicieuses asperges fraîches
              </p>
              <Button asChild onClick={() => onOpenChange(false)}>
                <Link href="/shop">Voir la boutique</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0] || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ShoppingBag className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.product.price.toFixed(2)} EUR / {item.product.unit}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 ml-auto text-destructive hover:text-destructive"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{total.toFixed(2)} EUR</span>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-muted-foreground">Livraison</span>
                  <span>Calculée au checkout</span>
                </div>
                <Separator className="mb-4" />
                <div className="flex justify-between font-medium mb-4">
                  <span>Total</span>
                  <span>{total.toFixed(2)} EUR</span>
                </div>
                <SheetFooter className="flex flex-col gap-2 sm:flex-col">
                  <Button asChild className="w-full" onClick={() => onOpenChange(false)}>
                    <Link href="/checkout">Commander</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full bg-transparent" onClick={() => onOpenChange(false)}>
                    <Link href="/cart">Voir le panier</Link>
                  </Button>
                </SheetFooter>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
