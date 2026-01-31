import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { ProductGrid } from "@/components/shop/product-grid"
import { Skeleton } from "@/components/ui/skeleton"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Boutique",
  description: "Découvrez notre sélection d'asperges vertes fraîches. Différents formats disponibles pour tous les besoins.",
}

async function getProducts() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: {
      inventoryLots: {
        where: {
          quantityAvailable: { gt: 0 },
        },
      },
    },
    orderBy: { price: "asc" },
  })

  return products.map((product) => ({
    ...product,
    totalStock: product.inventoryLots.reduce(
      (sum, lot) => sum + lot.quantityAvailable,
      0
    ),
  }))
}

function ProductsSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  )
}

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Notre Boutique</h1>
        <p className="text-muted-foreground">
          Asperges vertes fraîches, récoltées le matin même et livrées chez vous.
        </p>
      </div>

      <Suspense fallback={<ProductsSkeleton />}>
        <ProductGrid products={products} />
      </Suspense>
    </div>
  )
}
