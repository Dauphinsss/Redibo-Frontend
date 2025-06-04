"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface NotificacionPago50Props {
  monto: string
  total: string
  onClose: () => void
  onCompletarPago: () => void
  pagoCompletado?: boolean
  usuario: string
}

export default function NotificacionPago50({
  monto,
  total,
  onClose,
  onCompletarPago,
  pagoCompletado = false,
  usuario
}: NotificacionPago50Props) {
  const [fecha, setFecha] = useState("")
  const [hora, setHora] = useState("")
  const [ubicacion] = useState("Av. Principal 123")

  useEffect(() => {
    // Bloquear interacciones con elementos subyacentes
    document.body.style.overflow = "hidden"

    const now = new Date()

    // Formatear fecha
    const opcionesFecha: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
    setFecha(now.toLocaleDateString("es-ES", opcionesFecha))

    // Formatear hora
    const opcionesHora: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
    setHora(now.toLocaleTimeString("es-ES", opcionesHora))

    return () => {
      // Restaurar scroll al cerrar
      document.body.style.overflow = ""
    }
  }, [])

  // Calcular montos
  const montoPagado = Number.parseFloat(monto)
  const montoTotal = Number.parseFloat(total)
  const montoPendiente = pagoCompletado ? 0 : montoTotal - montoPagado

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-white rounded-xl shadow-xl px-6 py-6 w-full max-w-md">
        {/* Botón X para cerrar */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>

        {/* Icono de campana */}
        <div className="flex justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" className="w-12 h-12 sm:w-14 sm:h-14 mb-2">
            <path
              fill="#FFAC33"
              d="M28 13c0 11 5 10 5 15 0 0 0 2-2 2H5c-2 0-2-2-2-2 0-5 5-4 5-15C8 7.478 12.477 3 18 3s10 4.478 10 10z"
            />
            <circle fill="#FFAC33" cx="18" cy="3" r="3" />
            <path fill="#FFAC33" d="M18 36c2.209 0 4-1.791 4-4h-8c0 2.209 1.791 4 4 4z" />
          </svg>
        </div>

        {/* Título y mensaje */}
        <h2 className="text-lg font-semibold text-center mb-2">
          {pagoCompletado ? "¡Pago completado al 100%!" : "¡Reserva confirmada con el 50%!"}
        </h2>
        <p className="text-sm text-center text-gray-600 mb-4">
          {pagoCompletado
            ? `Has completado el pago total de Bs. ${montoTotal.toFixed(2)}`
            : `Tu reserva ha sido confirmada con el pago del 50% (Bs. ${montoPagado.toFixed(2)})`}
        </p>

        {/* Detalles */}
        <ul className="space-y-2 text-gray-800 text-sm text-center mb-6">
          <li>
            <span>📅 Fecha: {fecha}</span>
          </li>
          <li>
            <span>⏰ Hora: {hora}</span>
          </li>
          <li>
            <span>📍 Ubicación: {ubicacion}</span>
          </li>
          <li>
            <span>👤 Usuario: {usuario}</span>
          </li>
          <li>
            <span>💰 Pagado: Bs. {montoPagado.toFixed(2)}</span>
          </li>
          {!pagoCompletado && (
            <li>
              <span>⏳ Pendiente: Bs. {montoPendiente.toFixed(2)}</span>
            </li>
          )}
        </ul>

        {/* Botón */}
        <button
          onClick={pagoCompletado ? onClose : onCompletarPago}
          className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-base font-medium"
        >
          {pagoCompletado ? "Cerrar" : "Completar Pago"}
        </button>
      </div>
    </div>
  )
}
