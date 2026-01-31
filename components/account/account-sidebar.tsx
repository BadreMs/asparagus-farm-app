"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Package, MapPin, RefreshCw, LogOut, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccountSidebarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
}

const menuItems = [
  { href: "/account", label: "Mon compte", icon: User },
  { href: "/account/orders", label: "Mes commandes", icon: Package },
  { href: "/account/addresses", label: "Mes adresses", icon: MapPin },
  { href: "/account/subscriptions", label: "Mes abonnements", icon: RefreshCw },
]

export function AccountSidebar({ user }: AccountSidebarProps) {
  const pathname = usePathname()

  return (
    <Card>
      <CardHeader className="text-center">
        <Avatar className="h-20 w-20 mx-auto mb-4">
          <AvatarImage src={user.image || undefined} alt={user.name || "Avatar"} />
          <AvatarFallback className="text-2xl">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-lg">{user.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </CardHeader>
      <CardContent className="p-0">
        <nav className="flex flex-col">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors hover:bg-muted",
                  isActive && "bg-muted text-primary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors hover:bg-muted text-primary"
            >
              <Settings className="h-4 w-4" />
              Administration
            </Link>
          )}
          <Button
            variant="ghost"
            className="justify-start gap-3 px-6 py-3 h-auto text-sm font-medium text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </nav>
      </CardContent>
    </Card>
  )
}
