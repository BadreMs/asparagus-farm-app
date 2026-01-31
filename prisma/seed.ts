import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin123!", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@farm.local" },
    update: {},
    create: {
      email: "admin@farm.local",
      name: "Administrateur",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  })
  console.log("Created admin:", admin.email)

  // Create test user
  const userPassword = await bcrypt.hash("User123!", 10)
  const user = await prisma.user.upsert({
    where: { email: "user@farm.local" },
    update: {},
    create: {
      email: "user@farm.local",
      name: "Client Test",
      passwordHash: userPassword,
      role: "USER",
    },
  })
  console.log("Created user:", user.email)

  // Create products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: "asperges-vertes-500g" },
      update: {},
      create: {
        name: "Asperges Vertes - 500g",
        slug: "asperges-vertes-500g",
        description:
          "Botte de 500g d'asperges vertes fraîches, récoltées le matin même. Idéal pour 2 personnes.",
        price: 8.5,
        unit: "botte",
        images: ["/images/asperges-500g.jpg"],
        tags: ["populaire", "frais"],
        active: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: "asperges-vertes-1kg" },
      update: {},
      create: {
        name: "Asperges Vertes - 1kg",
        slug: "asperges-vertes-1kg",
        description:
          "Botte de 1kg d'asperges vertes fraîches. Parfait pour une famille ou un repas entre amis.",
        price: 15.0,
        unit: "kg",
        images: ["/images/asperges-1kg.jpg"],
        tags: ["famille", "frais"],
        active: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: "asperges-vertes-5kg" },
      update: {},
      create: {
        name: "Caisse Asperges Vertes - 5kg",
        slug: "asperges-vertes-5kg",
        description:
          "Caisse de 5kg d'asperges vertes fraîches. Idéal pour les restaurateurs ou grandes tablées.",
        price: 65.0,
        unit: "caisse",
        images: ["/images/asperges-5kg.jpg"],
        tags: ["pro", "gros volume"],
        active: true,
      },
    }),
  ])
  console.log("Created products:", products.length)

  // Create inventory lots
  const lots = await Promise.all([
    prisma.inventoryLot.create({
      data: {
        productId: products[0].id,
        lotCode: "LOT-2024-001",
        quantityAvailable: 50,
        harvestDate: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.inventoryLot.create({
      data: {
        productId: products[1].id,
        lotCode: "LOT-2024-002",
        quantityAvailable: 30,
        harvestDate: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    }),
  ])
  console.log("Created inventory lots:", lots.length)

  // Create farm plots
  const plots = await Promise.all([
    prisma.farmPlot.create({
      data: {
        name: "Parcelle Nord",
        location: "Côté nord de la ferme",
        area: 2.5,
        notes: "Sol sablonneux, excellent drainage",
      },
    }),
    prisma.farmPlot.create({
      data: {
        name: "Parcelle Sud",
        location: "Côté sud de la ferme",
        area: 3.0,
        notes: "Sol plus argileux, irrigation nécessaire",
      },
    }),
  ])
  console.log("Created farm plots:", plots.length)

  // Create plantation batches
  const batches = await Promise.all([
    prisma.plantationBatch.create({
      data: {
        plotId: plots[0].id,
        plantedAt: new Date("2024-03-01"),
        variety: "Gijnlim",
        status: "HARVESTING",
        estimatedHarvestStart: new Date("2024-04-15"),
        estimatedQtyKg: 500,
        notes: "Première récolte de la saison",
      },
    }),
    prisma.plantationBatch.create({
      data: {
        plotId: plots[1].id,
        plantedAt: new Date("2024-03-15"),
        variety: "Backlim",
        status: "GROWING",
        estimatedHarvestStart: new Date("2024-05-01"),
        estimatedQtyKg: 600,
        notes: "Variété tardive",
      },
    }),
  ])
  console.log("Created plantation batches:", batches.length)

  // Create subscription plans
  const plans = await Promise.all([
    prisma.subscriptionPlan.create({
      data: {
        name: "Mini",
        qtyKg: 0.5,
        priceWeekly: 8.5,
        benefits: [
          "500g d'asperges fraîches par semaine",
          "Livraison gratuite",
          "Recettes exclusives",
        ],
        active: true,
      },
    }),
    prisma.subscriptionPlan.create({
      data: {
        name: "Famille",
        qtyKg: 1.5,
        priceWeekly: 22.0,
        benefits: [
          "1.5kg d'asperges fraîches par semaine",
          "Livraison gratuite",
          "Recettes exclusives",
          "10% de réduction sur la boutique",
        ],
        active: true,
      },
    }),
    prisma.subscriptionPlan.create({
      data: {
        name: "Pro",
        qtyKg: 5.0,
        priceWeekly: 60.0,
        benefits: [
          "5kg d'asperges fraîches par semaine",
          "Livraison prioritaire",
          "Support dédié",
          "15% de réduction sur la boutique",
          "Accès early à la précommande",
        ],
        active: true,
      },
    }),
  ])
  console.log("Created subscription plans:", plans.length)

  console.log("Seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
