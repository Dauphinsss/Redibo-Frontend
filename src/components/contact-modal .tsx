"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RenterData {
  id: string
  nombres: string
  apellidos: string
  email: string
}

export default function ContactModal({ renter }: { renter: RenterData }) {
  const [open, setOpen] = useState(false)
  const [asunto, setAsunto] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    
    await new Promise((resolve) => setTimeout(resolve, 1000))

    
    console.log("Enviando mensaje a:", renter.id)
    console.log("Asunto:", asunto)
    console.log("Mensaje:", mensaje)

    setIsLoading(false)
    setOpen(false)

    
    toast({
      title: "Mensaje enviado",
      description: `Tu mensaje ha sido enviado a ${renter.nombres} ${renter.apellidos}.`,
    })

   
    setAsunto("")
    setMensaje("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-redibo-orange text-redibo-black hover:bg-redibo-orange/80">
          <MessageCircle className="mr-2 h-4 w-4" />
          Contactar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-redibo-blue">
        <DialogHeader className="bg-redibo-blue text-redibo-white p-4 -mx-6 -mt-6 rounded-t-lg">
          <DialogTitle>
            Contactar a {renter.nombres} {renter.apellidos}
          </DialogTitle>
          <DialogDescription className="text-redibo-bone">
            Envía un mensaje al arrendatario. Recibirás una notificación cuando responda.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="asunto" className="text-right text-redibo-blue">
                Asunto
              </Label>
              <Input
                id="asunto"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                className="col-span-3 border-redibo-blue/30 focus-visible:ring-redibo-orange"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mensaje" className="text-right text-redibo-blue">
                Mensaje
              </Label>
              <Textarea
                id="mensaje"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                className="col-span-3 border-redibo-blue/30 focus-visible:ring-redibo-orange"
                rows={5}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-1"></div>
              <div className="col-span-3 text-sm text-redibo-blue">
                También puedes contactar directamente al email: {renter.email}
              </div>
            </div>
          </div>
          <DialogFooter className="bg-redibo-bone p-4 -mx-6 -mb-6 rounded-b-lg">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-redibo-orange text-redibo-black hover:bg-redibo-orange/80"
            >
              {isLoading ? "Enviando..." : "Enviar mensaje"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
