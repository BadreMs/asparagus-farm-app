import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Leaf, Truck, Clock, Award, Star, ChevronRight } from "lucide-react"

const features = [
  {
    icon: Leaf,
    title: "Culture raisonnée",
    description:
      "Nos asperges sont cultivées avec respect de la terre et sans pesticides chimiques.",
  },
  {
    icon: Clock,
    title: "Fraîcheur garantie",
    description:
      "Récoltées le matin, livrées le jour même. La fraîcheur au rendez-vous.",
  },
  {
    icon: Truck,
    title: "Livraison locale",
    description:
      "Livraison à domicile dans un rayon de 50km ou retrait gratuit à la ferme.",
  },
  {
    icon: Award,
    title: "Qualité premium",
    description: "Sélection rigoureuse pour vous garantir des asperges d'exception.",
  },
]

const testimonials = [
  {
    name: "Hanane L.",
    location: "Avignon",
    rating: 5,
    text: "Les meilleures asperges que j'ai jamais goûtées ! Fraîches, tendres et savoureuses.",
  },
  {
    name: "Kamal D.",
    location: "Carpentras",
    rating: 5,
    text: "Service impeccable et produit d'exception. Je recommande à 100% !",
  },
  {
    name: "Sophie M.",
    location: "Orange",
    rating: 5,
    text: "L'abonnement hebdomadaire est parfait pour notre famille. On ne peut plus s'en passer.",
  },
]

const faqs = [
  {
    question: "Quelle est la saison des asperges ?",
    answer:
      "La saison des asperges s'étend généralement de mars à juin. C'est pendant cette période que vous pouvez profiter de nos asperges les plus fraîches. Nous proposons également des précommandes pour garantir votre approvisionnement.",
  },
  {
    question: "Comment conserver les asperges ?",
    answer:
      "Les asperges se conservent 3 à 4 jours au réfrigérateur. Enveloppez-les dans un linge humide ou placez-les debout dans un verre d'eau. Pour une fraîcheur optimale, consommez-les dans les 24h suivant la récolte.",
  },
  {
    question: "Proposez-vous la livraison ?",
    answer:
      "Oui ! Nous livrons dans un rayon de 50km autour de la ferme. Vous pouvez également opter pour le retrait gratuit directement à la ferme aux horaires indiqués.",
  },
  {
    question: "Comment fonctionne l'abonnement ?",
    answer:
      "Nos abonnements vous permettent de recevoir chaque semaine une quantité d'asperges de votre choix. Vous pouvez mettre en pause ou annuler à tout moment. C'est la garantie de ne jamais manquer de fraîcheur !",
  },
]

// ✅ Mapping des images présentes dans /public/products
const homeImages: Record<string, string> = {
  "500g": "/products/asparagus-500g.jpg",
  "1kg": "/products/asparagus-1kg.jpg",
  "5kg": "/products/asparagus-5kg.jpg",
}

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="text-sm">
                Saison 2026 - Précommandes ouvertes
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                Asperges Vertes{" "}
                <span className="text-primary">Fraîches</span> du Producteur
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Découvrez le goût authentique de nos asperges cultivées avec passion
                depuis 3 générations. Du champ à votre table en quelques heures.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/shop">
                    Commander maintenant
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/about">Découvrir notre ferme</Link>
                </Button>
              </div>
            </div>

            {/* ✅ Hero image corrigée */}
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="/products/asparagus-1kg.jpg"
                alt="Asperges vertes fraîches de notre ferme"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pourquoi choisir notre ferme ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nous mettons tout notre savoir-faire au service de la qualité pour vous
              offrir les meilleures asperges de la région.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Nos produits</h2>
              <p className="text-muted-foreground">
                Des formats adaptés à tous les besoins
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/shop">
                Voir tous les produits
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "500g",
                price: "8,50",
                desc: "Idéal pour 2 personnes",
                tag: "Populaire",
              },
              {
                name: "1kg",
                price: "15,00",
                desc: "Parfait pour la famille",
                tag: "Best-seller",
              },
              {
                name: "5kg",
                price: "65,00",
                desc: "Pour les pros et grandes tablées",
                tag: "Pro",
              },
            ].map((product) => (
              <Card key={product.name} className="group overflow-hidden">
                <div className="relative h-48 bg-muted">
                  {/* ✅ Image corrigée */}
                  <Image
                    src={homeImages[product.name] ?? "/placeholder.jpg"}
                    alt={`Asperges ${product.name}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3">{product.tag}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1">
                    Asperges Vertes - {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{product.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">
                      {product.price} EUR
                    </span>
                    <Button size="sm" asChild>
                      <Link href="/shop">Ajouter</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ce que disent nos clients</h2>
            <p className="text-muted-foreground">
              La satisfaction de nos clients est notre plus belle récompense
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name}>
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">{`"${testimonial.text}"`}</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à goûter la différence ?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Commandez dès maintenant et recevez vos asperges fraîches directement
            chez vous ou venez les chercher à la ferme.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/shop">Commander</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              asChild
            >
              <Link href="/subscription">Découvrir les abonnements</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Questions fréquentes</h2>
              <p className="text-muted-foreground">
                Tout ce que vous devez savoir sur nos asperges
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  )
}
