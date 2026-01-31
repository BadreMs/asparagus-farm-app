import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe minimum 6 caractères"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Nom minimum 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe minimum 6 caractères"),
})

export const addressSchema = z.object({
  line1: z.string().min(1, "Adresse requise"),
  line2: z.string().optional(),
  city: z.string().min(1, "Ville requise"),
  zip: z.string().min(4, "Code postal requis"),
  country: z.string().default("France"),
  phone: z.string().min(10, "Téléphone requis"),
  isDefault: z.boolean().default(false),
})

export const checkoutSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Téléphone requis"),
  line1: z.string().min(1, "Adresse requise"),
  line2: z.string().optional(),
  city: z.string().min(1, "Ville requise"),
  zip: z.string().min(4, "Code postal requis"),
  deliveryMethod: z.enum(["delivery", "pickup"]),
  deliverySlot: z.string().optional(),
  notes: z.string().optional(),
})

export const preorderSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  phone: z.string().min(10, "Téléphone requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  qtyKg: z.number().min(1, "Minimum 1kg"),
  preferredDate: z.string().optional(),
  notes: z.string().optional(),
})

export const contactSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  subject: z.string().min(2, "Sujet requis"),
  message: z.string().min(10, "Message minimum 10 caractères"),
})

export const productSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  slug: z.string().min(2, "Slug requis"),
  description: z.string().min(10, "Description requise"),
  price: z.number().positive("Prix positif requis"),
  unit: z.string().default("kg"),
  images: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  active: z.boolean().default(true),
})

export const inventoryLotSchema = z.object({
  productId: z.string().min(1, "Produit requis"),
  lotCode: z.string().min(1, "Code lot requis"),
  quantityAvailable: z.number().int().min(0, "Quantité positive requise"),
  harvestDate: z.string(),
  expiresAt: z.string().optional(),
})

export const farmPlotSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  location: z.string().optional(),
  area: z.number().optional(),
  notes: z.string().optional(),
})

export const plantationBatchSchema = z.object({
  plotId: z.string().min(1, "Parcelle requise"),
  plantedAt: z.string(),
  variety: z.string().min(1, "Variété requise"),
  status: z.enum(["PLANTED", "GROWING", "HARVESTING", "DONE"]),
  estimatedHarvestStart: z.string().optional(),
  estimatedQtyKg: z.number().optional(),
  notes: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type PreorderInput = z.infer<typeof preorderSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type ProductInput = z.infer<typeof productSchema>
export type InventoryLotInput = z.infer<typeof inventoryLotSchema>
export type FarmPlotInput = z.infer<typeof farmPlotSchema>
export type PlantationBatchInput = z.infer<typeof plantationBatchSchema>
