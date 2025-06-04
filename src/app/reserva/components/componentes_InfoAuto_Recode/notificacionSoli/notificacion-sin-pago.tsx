"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface NotificacionSinPagoProps {
  onClose: () => void
  usuario?: string
}

export default function NotificacionSinPago({ onClose, usuario }: NotificacionSinPagoProps) {
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

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        {/* Botón X para cerrar */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>

        {/* Icono de campana */}
        <div className="flex justify-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" className="w-12 h-12 mb-1">
            <path
              fill="#FFAC33"
              d="M28 13c0 11 5 10 5 15 0 0 0 2-2 2H5c-2 0-2-2-2-2 0-5 5-4 5-15C8 7.478 12.477 3 18 3s10 4.478 10 10z"
            />
            <circle fill="#FFAC33" cx="18" cy="3" r="3" />
            <path fill="#FFAC33" d="M18 36c2.209 0 4-1.791 4-4h-8c0 2.209 1.791 4 4 4z" />
          </svg>
        </div>

        {/* Título y mensaje */}
        <h2 className="text-lg font-semibold text-center mb-1">¡Reserva registrada!</h2>
        <p className="text-sm text-center text-gray-600 mb-4 whitespace-nowrap overflow-hidden overflow-ellipsis">
          Tu reserva ha sido registrada, pero aún no ha sido pagada.
        </p>

        {/* Detalles */}
        <ul className="text-sm space-y-1 mb-4 text-center">
          <li className="flex items-center gap-2 justify-center">
            <span className="text-lg">⚠️</span>
            <span className="font-bold text-gray-800">Pendiente de pago</span>
          </li>
          <li className="flex items-center gap-2 justify-center">
            <span className="text-lg">📅</span>
            <span>Fecha: {fecha}</span>
          </li>
          <li className="flex items-center gap-2 justify-center">
            <span className="text-lg">⏰</span>
            <span>Hora: {hora}</span>
          </li>
          <li className="flex items-center gap-2 justify-center">
            <span className="text-lg">📍</span>
            <span>Ubicación: {ubicacion}</span>
          </li>
          <li className="flex items-center gap-2 justify-center">
            <span className="text-lg">🧍‍♂️</span>
            <span>Usuario: {usuario}</span>
          </li>
        </ul>

        {/* Botón */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="py-2 px-10 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
