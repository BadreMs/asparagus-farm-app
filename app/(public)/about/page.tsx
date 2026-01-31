import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Sun, Droplets, Heart } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notre Ferme",
  description: "Découvrez l'histoire de notre ferme familiale et notre passion pour la culture des asperges vertes depuis 3 générations.",
}

const values = [
  {
    icon: Leaf,
    title: "Agriculture Raisonnée",
    description: "Nous cultivons nos asperges dans le respect de l'environnement, sans pesticides chimiques.",
  },
  {
    icon: Sun,
    title: "Savoir-faire Familial",
    description: "Trois générations de passion transmises pour vous offrir les meilleures asperges.",
  },
  {
    icon: Droplets,
    title: "Irrigation Optimisée",
    description: "Un système d'irrigation goutte à goutte pour préserver la ressource en eau.",
  },
  {
    icon: Heart,
    title: "Qualité Avant Tout",
    description: "Chaque asperge est sélectionnée à la main pour garantir une qualité irréprochable.",
  },
]

const timeline = [
  {
    year: "1970",
    title: "Les débuts",
    description: "Grand-père Jean plante ses premières griffes d'asperges sur 1 hectare.",
  },
  {
    year: "1995",
    title: "La transmission",
    description: "Pierre reprend l'exploitation et développe la vente directe.",
  },
  {
    year: "2015",
    title: "Nouvelle génération",
    description: "Marie et Thomas rejoignent la ferme avec de nouvelles idées.",
  },
  {
    year: "2024",
    title: "Aujourd'hui",
    description: "5 hectares de culture et des milliers de clients satisfaits.",
  },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Notre Histoire</h1>
            <p className="text-lg text-muted-foreground">
              Depuis trois générations, notre famille cultive avec passion des asperges 
              vertes d{"'"}exception. Découvrez notre histoire, nos valeurs et notre 
              engagement pour la qualité.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/products/image-ferme.jpg"
                alt="Notre ferme familiale"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Une passion qui se transmet</h2>
              <p className="text-muted-foreground">
                Tout a commencé en 1970 lorsque Jean, notre grand-père, a décidé de 
                planter ses premières griffes d{"'"}asperges sur un petit hectare de 
                terre en Provence. Fasciné par ce légume délicat qui demande patience 
                et savoir-faire, il a développé des techniques de culture qui font 
                encore aujourd{"'"}hui la réputation de notre ferme.
              </p>
              <p className="text-muted-foreground">
                En 1995, Pierre, son fils, a repris le flambeau. Il a modernisé 
                l{"'"}exploitation tout en préservant les méthodes traditionnelles qui 
                font la différence. C{"'"}est lui qui a initié la vente directe, 
                convaincu que le meilleur moyen d{"'"}apprécier nos asperges était 
                de les manger le jour même de leur récolte.
              </p>
              <p className="text-muted-foreground">
                Aujourd{"'"}hui, c{"'"}est Marie et Thomas, la troisième génération, 
                qui perpétuent cette tradition. Ils ont développé la vente en ligne 
                et les abonnements pour permettre à plus de personnes de découvrir 
                nos asperges d{"'"}exception.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Notre parcours</h2>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-primary/30 transform md:-translate-x-1/2" />
              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <div
                    key={item.year}
                    className={`relative flex items-center gap-8 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"} pl-12 md:pl-0`}>
                      <Card>
                        <CardContent className="p-6">
                          <span className="text-2xl font-bold text-primary">{item.year}</span>
                          <h3 className="text-lg font-semibold mt-2">{item.title}</h3>
                          <p className="text-muted-foreground mt-1">{item.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary transform md:-translate-x-1/2" />
                    <div className="flex-1 hidden md:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos Valeurs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ces principes guident notre travail au quotidien et garantissent 
              la qualité de nos produits.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Envie de goûter nos asperges ?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Découvrez la différence que fait une asperge fraîche, cultivée avec 
            passion et récoltée le matin même.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/shop">Voir nos produits</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent" asChild>
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
