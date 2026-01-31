"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, MessageCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { contactSchema, type ContactInput } from "@/lib/validations"

const contactInfo = [
  {
    icon: MapPin,
    title: "Adresse",
    content: "123 Chemin des Asperges\n84000 Avignon, France",
  },
  {
    icon: Phone,
    title: "Téléphone",
    content: "06 00 00 00 00",
    href: "tel:+33600000000",
  },
  {
    icon: Mail,
    title: "Email",
    content: "contact@ferme-asperges.fr",
    href: "mailto:contact@ferme-asperges.fr",
  },
  {
    icon: Clock,
    title: "Horaires",
    content: "Lun - Sam: 8h - 18h\nDimanche: Fermé",
  },
]

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactInput) => {
    setIsLoading(true)
    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Contact form:", data)
    toast.success("Message envoyé ! Nous vous répondrons rapidement.")
    reset()
    setIsLoading(false)
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+33600000000"
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une question sur nos produits, nos livraisons ou simplement envie de 
            nous dire bonjour ? N{"'"}hésitez pas à nous contacter !
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info) => (
              <Card key={info.title}>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <info.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{info.title}</h3>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {info.content}
                      </a>
                    ) : (
                      <p className="text-muted-foreground whitespace-pre-line">
                        {info.content}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* WhatsApp Button */}
            <Button asChild className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5 mr-2" />
                Nous contacter sur WhatsApp
              </a>
            </Button>
          </div>

          {/* Contact Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Envoyez-nous un message</CardTitle>
              <CardDescription>
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      placeholder="Jean Dupont"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jean@exemple.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet</Label>
                  <Input
                    id="subject"
                    placeholder="Votre sujet"
                    {...register("subject")}
                  />
                  {errors.subject && (
                    <p className="text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Votre message..."
                    rows={5}
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Envoyer le message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Map placeholder */}
        <Card className="mt-8">
          <CardContent className="p-0">
            <div className="h-[300px] bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Carte interactive</p>
                <p className="text-sm">123 Chemin des Asperges, 84000 Avignon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
