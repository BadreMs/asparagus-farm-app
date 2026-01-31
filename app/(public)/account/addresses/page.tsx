"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MapPin, Plus, Trash2, Loader2, Star } from "lucide-react"
import { toast } from "sonner"
import { addressSchema, type AddressInput } from "@/lib/validations"
import type { Address } from "@prisma/client"

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: "France",
      isDefault: false,
    },
  })

  const isDefault = watch("isDefault")

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/addresses")
      if (response.ok) {
        const data = await response.json()
        setAddresses(data)
      }
    } catch {
      toast.error("Erreur lors du chargement des adresses")
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: AddressInput) => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement")

      toast.success("Adresse ajoutée")
      setIsDialogOpen(false)
      reset()
      fetchAddresses()
    } catch {
      toast.error("Erreur lors de l'enregistrement de l'adresse")
    } finally {
      setIsSaving(false)
    }
  }

  const deleteAddress = async (addressId: string) => {
    try {
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erreur lors de la suppression")

      toast.success("Adresse supprimée")
      fetchAddresses()
    } catch {
      toast.error("Erreur lors de la suppression de l'adresse")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes adresses</h1>
          <p className="text-muted-foreground">
            Gérez vos adresses de livraison
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une adresse
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle adresse</DialogTitle>
              <DialogDescription>
                Ajoutez une nouvelle adresse de livraison
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="line1">Adresse</Label>
                <Input id="line1" {...register("line1")} />
                {errors.line1 && (
                  <p className="text-sm text-red-600">{errors.line1.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="line2">Complément (optionnel)</Label>
                <Input id="line2" {...register("line2")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input id="city" {...register("city")} />
                  {errors.city && (
                    <p className="text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">Code postal</Label>
                  <Input id="zip" {...register("zip")} />
                  {errors.zip && (
                    <p className="text-sm text-red-600">{errors.zip.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" {...register("phone")} />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDefault"
                  checked={isDefault}
                  onCheckedChange={(checked) => setValue("isDefault", checked === true)}
                />
                <Label htmlFor="isDefault" className="text-sm">
                  Définir comme adresse par défaut
                </Label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enregistrer
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MapPin className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune adresse</h3>
            <p className="text-muted-foreground mb-6">
              Vous n{"'"}avez pas encore enregistré d{"'"}adresse de livraison
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address.id} className={address.isDefault ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Adresse {address.isDefault && "(Par défaut)"}
                  </CardTitle>
                  {address.isDefault && (
                    <Star className="h-4 w-4 text-primary fill-primary" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {address.line1}
                  {address.line2 && <><br />{address.line2}</>}
                  <br />
                  {address.zip} {address.city}
                  <br />
                  {address.country}
                </p>
                <p className="text-sm text-muted-foreground mt-2">{address.phone}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 text-destructive hover:text-destructive"
                  onClick={() => deleteAddress(address.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
