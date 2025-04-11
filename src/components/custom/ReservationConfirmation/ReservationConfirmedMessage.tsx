import React, { useEffect, useState } from "react"
import {AlertDialog,AlertDialogTrigger,AlertDialogContent,AlertDialogHeader,AlertDialogFooter,AlertDialogTitle,AlertDialogDescription,AlertDialogCancel,} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function ReservationConfirmedMessage() {
  const [timeLeft, setTimeLeft] = useState(48 * 60 * 60 * 1000)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(interval)
          return 0
        }
        return prev - 1000
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (ms: number) => {
    const hours = Math.floor((ms % (1000 * 60 * 60 * 48)) / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)
    return `${hours}h ${minutes}m ${seconds}s`
  }

  const handleClick = () => {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    }

  return (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button 
                variant="outline"
                size="sm"
                onClick={handleClick}
                disabled={loading}
                >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Reservar"
              )}
            </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#1a1a1a] text-white max-w-md w-full">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Reserva confirmada</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-300">
            Su reserva ha sido registrada correctamente.<br />
            <span className="block mt-2">
              <strong>Vehículo:</strong> Toyota Corolla 2021
            </span>
            <span className="block">
              <strong>Fecha de recogida:</strong> 15 de abril, 2025
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-[#111] border border-[#2c2c2c] rounded-lg py-4 mt-4 text-center">
          <p className="text-sm text-gray-400 mb-1">Tiempo restante para pagar</p>
          <p className="text-4xl font-bold">
            {timeLeft > 0 ? formatTime(timeLeft) : "Tiempo expirado"}
          </p>
          <p className="text-sm text-gray-500 mt-1">Reserva válida por 48 horas</p>
        </div>

        <p className="text-xs text-red-500 mt-4">
          Si no realiza el pago en ese plazo, la reserva será cancelada automáticamente.
        </p>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="bg-white text-black hover:bg-gray-200 font-medium">
            Volver al inicio
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
