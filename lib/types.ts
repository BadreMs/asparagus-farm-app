import type { Product, CartItem, Order, OrderItem, Address, User, FarmPlot, PlantationBatch, InventoryLot, SubscriptionPlan, Subscription, PreorderRequest } from "@prisma/client"

export type ProductWithInventory = Product & {
  inventoryLots: InventoryLot[]
  totalStock?: number
}

export type CartItemWithProduct = CartItem & {
  product: Product
}

export type CartWithItems = {
  id: string
  items: CartItemWithProduct[]
}

export type OrderWithItems = Order & {
  items: (OrderItem & { product: Product | null })[]
  user?: User | null
}

export type PlantationBatchWithPlot = PlantationBatch & {
  plot: FarmPlot
}

export type FarmPlotWithBatches = FarmPlot & {
  plantationBatches: PlantationBatch[]
}

export type SubscriptionWithPlan = Subscription & {
  plan: SubscriptionPlan
  user: User
}

export type UserWithAddresses = User & {
  addresses: Address[]
}

export type DashboardStats = {
  ordersToday: number
  revenueToday: number
  totalOrders: number
  totalRevenue: number
  topProducts: { name: string; quantity: number }[]
  recentOrders: OrderWithItems[]
  ordersByStatus: { status: string; count: number }[]
  revenueByDay: { date: string; revenue: number }[]
}
