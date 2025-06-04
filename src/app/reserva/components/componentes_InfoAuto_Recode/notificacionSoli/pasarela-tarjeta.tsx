"use client"

import type React from "react"

import { useState } from "react"
import { CreditCard, Calendar, Lock, X } from "lucide-react"

interface PasarelaTarjetaProps {
  monto: number
  onSuccess: () => void
  onCancel: () => void
  metodoPago?: string
  porcentaje?: string
  onError?: (mensaje: string) => void
}

export default function PasarelaTarjeta({
  monto,
  onSuccess,
  onCancel,
  metodoPago = "tarjeta",
  porcentaje = "100",
  onError = () => {},
}: PasarelaTarjetaProps) {
  const [formData, setFormData] = useState({
    numeroTarjeta: "",
    nombreTitular: "",
    fechaExpiracion: "",
    cvv: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [procesando, setProcesando] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    // Formatear según el campo
    if (name === "numeroTarjeta") {
      // Eliminar espacios y caracteres no numéricos
      const cleaned = value.replace(/\D/g, "")
      // Limitar a 16 dígitos
      const limited = cleaned.substring(0, 16)
      // Formatear con espacios cada 4 dígitos
      formattedValue = limited.replace(/(\d{4})(?=\d)/g, "$1 ").trim()
    } else if (name === "fechaExpiracion") {
      // Eliminar caracteres no numéricos
      const cleaned = value.replace(/\D/g, "")
      // Limitar a 4 dígitos
      const limited = cleaned.substring(0, 4)
      // Formatear como MM/YY
      if (limited.length > 2) {
        formattedValue = `${limited.substring(0, 2)}/${limited.substring(2)}`
      } else {
        formattedValue = limited
      }
    } else if (name === "cvv") {
      // Limitar a 3-4 dígitos numéricos
      formattedValue = value.replace(/\D/g, "").substring(0, 4)
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validar número de tarjeta
    if (!formData.numeroTarjeta.replace(/\s/g, "").match(/^\d{16}$/)) {
      newErrors.numeroTarjeta = "Ingrese un número de tarjeta válido de 16 dígitos"
    }

    // Validar nombre del titular
    if (formData.nombreTitular.trim().length < 5) {
      newErrors.nombreTitular = "Ingrese el nombre completo del titular"
    }

    // Validar fecha de expiración
    if (!formData.fechaExpiracion.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      newErrors.fechaExpiracion = "Formato inválido. Use MM/YY"
    } else {
      // Verificar que la fecha no esté expirada
      const [month, year] = formData.fechaExpiracion.split("/")
      const expiryDate = new Date(2000 + Number.parseInt(year), Number.parseInt(month) - 1, 1)
      if (expiryDate < new Date()) {
        newErrors.fechaExpiracion = "La tarjeta ha expirado"
      }
    }

    // Validar CVV
    if (!formData.cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = "CVV inválido (3-4 dígitos)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setProcesando(true)

      // Simulamos el procesamiento del pago con posibilidad de error
      setTimeout(() => {
        setProcesando(false)

        // Generar error aleatorio según el porcentaje de pago
        const random = Math.random()
        if (metodoPago === "tarjeta" && random < 0.3) {
          onError("Tarjeta rechazada.")
        } else {
          onSuccess()
        }
      }, 1500)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Pago con Tarjeta</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded-md flex items-center">
          <CreditCard className="text-blue-500 mr-2" />
          <p className="text-sm">
            Monto a pagar: <span className="font-bold">Bs. {monto.toFixed(2)}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="numeroTarjeta" className="block font-medium text-sm">
              Número de Tarjeta
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                id="numeroTarjeta"
                name="numeroTarjeta"
                placeholder="1234 5678 9012 3456"
                className="w-full p-2 pl-10 border border-gray-300 rounded-md"
                value={formData.numeroTarjeta}
                onChange={handleChange}
              />
            </div>
            {errors.numeroTarjeta && <p className="text-red-500 text-xs">{errors.numeroTarjeta}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="nombreTitular" className="block font-medium text-sm">
              Nombre del Titular
            </label>
            <input
              id="nombreTitular"
              name="nombreTitular"
              placeholder="Como aparece en la tarjeta"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.nombreTitular}
              onChange={handleChange}
            />
            {errors.nombreTitular && <p className="text-red-500 text-xs">{errors.nombreTitular}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="fechaExpiracion" className="block font-medium text-sm">
                Fecha de Expiración
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  id="fechaExpiracion"
                  name="fechaExpiracion"
                  placeholder="MM/YY"
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md"
                  value={formData.fechaExpiracion}
                  onChange={handleChange}
                />
              </div>
              {errors.fechaExpiracion && <p className="text-red-500 text-xs">{errors.fechaExpiracion}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="cvv" className="block font-medium text-sm">
                CVV
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  id="cvv"
                  name="cvv"
                  placeholder="123"
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md"
                  value={formData.cvv}
                  onChange={handleChange}
                />
              </div>
              {errors.cvv && <p className="text-red-500 text-xs">{errors.cvv}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition-colors"
            disabled={procesando}
          >
            {procesando ? "Procesando..." : "Pagar Ahora"}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-gray-500">
          <p>Transacción segura y encriptada</p>
          <div className="flex justify-center mt-2 space-x-2">
            <span className="font-bold">Aceptamos:</span>
            <span>Visa</span>
            <span>•</span>
            <span>Mastercard</span>
            <span>•</span>
            <span>American Express</span>
          </div>
        </div>
      </div>
    </div>
  )
}
