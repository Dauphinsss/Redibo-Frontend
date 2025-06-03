"use client"
import { useEffect } from "react"

interface ToastProps {
  message: string
  onCloseAction: () => void
}

export default function Toast({ message, onCloseAction }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onCloseAction()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onCloseAction])

  return (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
    <div className="bg-white text-black px-6 py-5 rounded-xl shadow-2xl relative animate-in fade-in zoom-in-75 duration-300 max-w-sm w-full text-center border border-black">
      {/* Encabezado */}
      <h2 className="text-lg font-semibold mb-2 border-b border-black pb-2">Mensaje del sistema</h2>

      {/* Botón cerrar */}
      <button
        onClick={onCloseAction}
        className="absolute top-2 right-3 text-black text-xl font-bold hover:text-white hover:bg-black rounded-full w-7 h-7 flex items-center justify-center transition-colors duration-200"
        aria-label="Cerrar"
      >
        ×
      </button>

      {/* Contenido del mensaje */}
      <span className="text-sm">{message}</span>
    </div>
  </div>
)

}

