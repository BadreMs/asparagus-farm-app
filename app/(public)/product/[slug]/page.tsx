import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProductDetails } from "@/components/shop/product-details"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      inventoryLots: {
        where: {
          quantityAvailable: { gt: 0 },
        },
      },
    },
  })

  if (!product) return null

  return {
    ...product,
    totalStock: product.inventoryLots.reduce(
      (sum, lot) => sum + lot.quantityAvailable,
      0
    ),
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return {
      title: "Produit non trouvé",
    }
  }

  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <ProductDetails product={product} />
    </div>
  )
}
