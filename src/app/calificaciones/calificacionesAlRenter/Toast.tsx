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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black text-white px-6 py-4 rounded-xl shadow-2xl relative animate-in fade-in zoom-in-75 duration-300 max-w-sm w-full text-center">
        <button
          onClick={onCloseAction}
          className="absolute top-2 right-3 text-white text-lg font-bold hover:text-gray-300"
        >
          ×
        </button>
        <span>{message}</span>
      </div>
    </div>
  )
}
