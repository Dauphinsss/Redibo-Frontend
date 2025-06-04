"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface NotificacionGarantiaProps {
  monto: string
  onClose: () => void
  usuario?: string
}

function NotificacionGarantia({ monto, onClose, usuario }: NotificacionGarantiaProps) {
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
      hour12: true,
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
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>

        {/* Icono de campana */}
        <div className="flex justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" className="w-14 h-14 mb-2">
            <path
              fill="#FFAC33"
              d="M28 13c0 11 5 10 5 15 0 0 0 2-2 2H5c-2 0-2-2-2-2 0-5 5-4 5-15C8 7.478 12.477 3 18 3s10 4.478 10 10z"
            />
            <circle fill="#FFAC33" cx="18" cy="3" r="3" />
            <path fill="#FFAC33" d="M18 36c2.209 0 4-1.791 4-4h-8c0 2.209 1.791 4 4 4z" />
          </svg>
        </div>

        {/* Título y mensaje */}
        <h2 className="text-xl font-bold text-center mb-2">¡Depósito de garantía registrado!</h2>
        <p className="text-base text-center text-gray-600 mb-4">Tu depósito ha sido registrado correctamente.</p>

        {/* Detalles */}
        <ul className="space-y-3 text-gray-800 text-center mb-6">
          <li className="flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-green-500"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              Estado: <span className="text-green-600">Pago confirmado</span>
            </span>
          </li>
          <li className="flex items-center justify-center gap-2">
            <span className="text-xl">💳</span>
            <span>Pagado $: {monto}</span>
          </li>
          <li className="flex items-center justify-center gap-2">
            <span className="text-xl">📅</span>
            <span>Fecha: {fecha}</span>
          </li>
          <li className="flex items-center justify-center gap-2">
            <span className="text-xl">⏰</span>
            <span>Hora: {hora}</span>
          </li>
          <li className="flex items-center justify-center gap-2">
            <span className="text-xl">📍</span>
            <span>Ubicación: {ubicacion}</span>
          </li>
          <li className="flex items-center justify-center gap-2">
            <span className="text-xl">👤</span>
            <span>Usuario: {usuario}</span>
          </li>
        </ul>

        {/* Botón */}
        <button
          onClick={onClose}
          className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}

export default NotificacionGarantia;