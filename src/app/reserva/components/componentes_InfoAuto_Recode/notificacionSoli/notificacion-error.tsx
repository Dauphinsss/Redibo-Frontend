"use client"
import { useEffect } from "react"
import { X } from "lucide-react"

interface NotificacionErrorProps {
  tipo: string
  mensaje: string
  onClose: () => void
}

export default function NotificacionError({ tipo, mensaje, onClose }: NotificacionErrorProps) {
  useEffect(() => {
    // Bloquear interacciones con elementos subyacentes
    document.body.style.overflow = "hidden"

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
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        {/* Botón X para cerrar */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>

        {/* Icono de error */}
        <div className="flex justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#E74C3C" className="w-16 h-16 mb-2">
            <path
              fillRule="evenodd"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
            />
          </svg>
        </div>

        {/* Título y mensaje */}
        <h2 className="text-xl font-bold text-center text-[#11295B] mb-4">ERROR</h2>
        <div className="text-center mb-6">
          <p className="text-gray-700 mb-2">Error en el depósito de {tipo}.</p>
          <p className="text-gray-700">No se pudo procesar su pago:</p>
          <p className="font-semibold text-gray-800">{mensaje}</p>
        </div>

        {/* Botón */}
        <button
          onClick={onClose}
          className="w-full py-2 bg-white text-[#11295B] border-2 border-[#11295B] rounded-lg hover:bg-black hover:text-white transition-colors font-medium"
        >
          Aceptar
        </button>
      </div>
    </div>
  )
}
