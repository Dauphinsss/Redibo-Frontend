"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"

interface SuccessDialogProps {
  isOpen: boolean
}

export default function SuccessDialog({ isOpen }: SuccessDialogProps) {
  const router = useRouter()

  const handleGoHome = () => {
    router.push("/")
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8" />
          </div>
          <DialogTitle className="text-2xl font-bold">¡Solicitud Enviada!</DialogTitle>
          <DialogDescription>
            Tu solicitud para convertirte en conductor ha sido enviada correctamente.
          </DialogDescription>
          <div className="text-sm text-muted-foreground mt-2">
            Revisaremos tu información, esto puede tardar entre 24-48 horas. Puedes ver el estado de tu solicitud en la sección de Conductor de tu perfil.
          </div>
        </DialogHeader>
        <div className="flex justify-center pt-4">
          <Button onClick={handleGoHome} className="w-full">
            Volver al Inicio
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
