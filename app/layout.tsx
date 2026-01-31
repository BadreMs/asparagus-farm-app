import React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import { SessionProvider } from "@/components/providers/session-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Atlas Greens - Asperges Vertes Fraîches",
    template: "%s | Atlas Greens",
  },
  description:
    "Producteur d'asperges vertes depuis 3 générations. Commandez en ligne nos asperges fraîches, récoltées le matin même. Livraison à domicile ou retrait à la ferme.",
  keywords: [
    "asperges",
    "asperges vertes",
    "producteur",
    "ferme",
    "légumes frais",
    "circuit court",
    "livraison",
  ],
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        <SessionProvider>
          {children}
          <Toaster position="top-right" richColors />
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
