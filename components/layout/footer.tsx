import Link from "next/link"
import { Leaf, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-6 w-6" />
              <span className="text-lg font-bold">Atlas Greens</span>
            </Link>
            <p className="text-sm opacity-90">
              Producteur d{"'"}asperges vertes depuis 3 générations. 
              Qualité et fraîcheur garanties, du champ à votre table.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Boutique</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>
                <Link href="/shop" className="hover:opacity-100 transition-opacity">
                  Nos produits
                </Link>
              </li>
              <li>
                <Link href="/preorder" className="hover:opacity-100 transition-opacity">
                  Précommande saison
                </Link>
              </li>
              <li>
                <Link href="/subscription" className="hover:opacity-100 transition-opacity">
                  Abonnements
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">À propos</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>
                <Link href="/about" className="hover:opacity-100 transition-opacity">
                  Notre histoire
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:opacity-100 transition-opacity">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:opacity-100 transition-opacity">
                  Mon compte
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm opacity-90">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>123 Chemin des Asperges, 84000 Avignon</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+33600000000" className="hover:opacity-100 transition-opacity">
                  06 00 00 00 00
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:contact@Atlas-Greens.fr" className="hover:opacity-100 transition-opacity">
                  contact@Atlas-Greens.fr
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm opacity-75">
          <p>&copy; {new Date().getFullYear()} Atlas Greens. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
