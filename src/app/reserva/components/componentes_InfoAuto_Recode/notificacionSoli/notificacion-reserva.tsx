"use client"

import { X } from "lucide-react"

interface NotificacionReservaProps {
  reserva: {
    coche: string
    fechaNotificacion: string
    fechaRetiro: string
    fechaDevolucion: string
    montoInicial: number
    montoTotal: number
    tipoReserva: string
    pendiente: number
    arrendatario: string
    idReserva: string
  }
  onClose: () => void
}

export default function NotificacionReserva({ reserva, onClose }: NotificacionReservaProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        {/* Botón X para cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold text-center mb-4">¡Nueva reserva confirmada!</h2>

        <ul className="space-y-3 list-disc pl-6">
          <li>Coche reservado: "{reserva.coche}"</li>
          <li>Fecha Notificación: "{reserva.fechaNotificacion}"</li>
          <li>Fecha de retiro: {reserva.fechaRetiro}</li>
          <li>Fecha de devolución: {reserva.fechaDevolucion}</li>
          <li>Monto Inicial: Bs. {reserva.montoInicial}</li>
          <li>Monto Total: Bs. {reserva.montoTotal}</li>
          <li>Tipo de reserva: {reserva.tipoReserva}</li>
          <li>Pendiente: Bs. {reserva.pendiente}</li>
          <li>Arrendatario: "{reserva.arrendatario}"</li>
          <li>ID de reserva: "{reserva.idReserva}"</li>
        </ul>

        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="bg-[#11295B] hover:bg-[#0a1c3d] text-white px-8 py-2 rounded-md font-medium"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}
