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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Flag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ReportRenterProps {
  renterId: string
}

export default function ReportRenter({ renterId }: ReportRenterProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [details, setDetails] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    
    await new Promise((resolve) => setTimeout(resolve, 1000))

    
    console.log("Reportando arrendatario:", renterId)
    console.log("Razón:", reason)
    console.log("Detalles:", details)

    setIsLoading(false)
    setOpen(false)

   
    toast({
      title: "Reporte enviado",
      description: "Tu reporte ha sido enviado y será revisado por nuestro equipo.",
    })

    
    setReason("")
    setDetails("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full border-redibo-blue text-redibo-blue hover:bg-redibo-blue hover:text-redibo-white"
        >
          <Flag className="mr-2 h-4 w-4" />
          Reportar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-redibo-blue">
        <DialogHeader className="bg-redibo-blue text-redibo-white p-4 -mx-6 -mt-6 rounded-t-lg">
          <DialogTitle>Reportar arrendatario</DialogTitle>
          <DialogDescription className="text-redibo-bone">
            Si has tenido problemas con este arrendatario, puedes reportarlo a nuestro equipo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label className="text-redibo-blue">Motivo del reporte</Label>
              <RadioGroup value={reason} onValueChange={setReason} required className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="comportamiento"
                    id="comportamiento"
                    className="border-redibo-blue text-redibo-orange"
                  />
                  <Label htmlFor="comportamiento" className="text-redibo-black">
                    Comportamiento inapropiado
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daños" id="daños" className="border-redibo-blue text-redibo-orange" />
                  <Label htmlFor="daños" className="text-redibo-black">
                    Daños al vehículo
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pago" id="pago" className="border-redibo-blue text-redibo-orange" />
                  <Label htmlFor="pago" className="text-redibo-black">
                    Problemas de pago
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="otro" id="otro" className="border-redibo-blue text-redibo-orange" />
                  <Label htmlFor="otro" className="text-redibo-black">
                    Otro
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="detalles" className="text-redibo-blue">
                Detalles
              </Label>
              <Textarea
                id="detalles"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe el problema con detalle..."
                rows={4}
                required
                className="border-redibo-blue/30 focus-visible:ring-redibo-orange"
              />
            </div>
          </div>
          <DialogFooter className="bg-redibo-bone p-4 -mx-6 -mb-6 rounded-b-lg">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-redibo-orange text-redibo-black hover:bg-redibo-orange/80"
            >
              {isLoading ? "Enviando..." : "Enviar reporte"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
