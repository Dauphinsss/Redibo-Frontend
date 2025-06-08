"use client"

import { useState, useEffect } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import NotificacionGarantia from "./notificacion-garantia"
import NotificacionError from "./notificacion-error"

interface FormularioGarantiaProps {
  isOpen: boolean
  onClose: () => void
  carModel: string
  garantiaPrice?: number
  usuario?: string
}

export default function FormularioGarantia({
  isOpen,
  onClose,
  carModel,
  garantiaPrice = 500,
  usuario

}: FormularioGarantiaProps) {
  const [precioGarantia, setPrecioGarantia] = useState(garantiaPrice)
  const [metodoPago, setMetodoPago] = useState("tarjeta")
  const [procesando, setProcesando] = useState(false)

  // Estados para las notificaciones
  const [mostrarNotificacionExito, setMostrarNotificacionExito] = useState(false)
  const [mostrarNotificacionError, setMostrarNotificacionError] = useState(false)
  const [tipoError, setTipoError] = useState("")
  const [mensajeError, setMensajeError] = useState("")

  // Resetear estados cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      setPrecioGarantia(garantiaPrice)
    }
    if (!isOpen) {
      setMetodoPago("tarjeta")
      setProcesando(false)
      setMostrarNotificacionExito(false)
      setMostrarNotificacionError(false)
    }
  }, [isOpen, garantiaPrice])

  const handleMetodoPagoChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setMetodoPago(e.target.value)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setProcesando(true)

    // Simulamos el procesamiento del pago
    setTimeout(() => {
      setProcesando(false)

      // Generamos un error aleatorio según el método de pago
      const random = Math.random()

      if (metodoPago === "tarjeta" && random < 0.3) {
        setTipoError("Garantía")
        setMensajeError("Tarjeta rechazada.")
        setMostrarNotificacionError(true)
      } else if (metodoPago === "transferencia" && random < 0.3) {
        setTipoError("Garantía")
        setMensajeError("Timeout en la transacción.")
        setMostrarNotificacionError(true)
      } else {
        setMostrarNotificacionExito(true)
      }
    }, 1500)
  }

  return (
    <>
      {/* Formulario principal */}
      {isOpen && !mostrarNotificacionExito && !mostrarNotificacionError && (
        <Dialog open={true} onOpenChange={onClose}>
          <DialogContent className="p-0 border-0 max-w-md z-[9999]">
            <div className="p-6 bg-white rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#11295B]">Pago de Garantía</h1>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Precio de la garantía */}
                <div className="mb-4">
                  <label htmlFor="precioGarantia" className="block font-medium mb-2">
                    Precio de la garantía:
                  </label>
                  <input
                    id="precioGarantia"
                    type="number"
                    value={precioGarantia}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>

                {/* Método de pago */}
                <div className="mb-6">
                  <label htmlFor="metodoPago" className="block font-medium mb-2">
                    Método de pago:
                  </label>
                  <select
                    id="metodoPago"
                    value={metodoPago}
                    onChange={handleMetodoPagoChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  >
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                  </select>
                </div>

                {/* Total a pagar */}
                <div className="bg-[#FCA31120] p-4 rounded-md mb-6">
                  <h2 className="text-xl font-semibold text-[#11295B] mb-3">Total a pagar hoy</h2>
                  <p className="font-medium">Bs. {precioGarantia.toFixed(2)}</p>
                </div>

                {/* Botón de pago */}
                <button
                  type="submit"
                  className="w-full py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition-colors"
                  disabled={procesando}
                >
                  {procesando ? "Procesando..." : "Pagar"}
                </button>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Notificaciones */}
      {mostrarNotificacionExito && (
        <NotificacionGarantia
          usuario={usuario || "Usuario"}
          monto={precioGarantia.toString()}
          onClose={() => {
            setMostrarNotificacionExito(false)
            onClose()
          }}
        />
      )}

      {mostrarNotificacionError && (
        <NotificacionError
          tipo={tipoError}
          mensaje={mensajeError}
          onClose={() => {
            setMostrarNotificacionError(false)
            onClose()
          }}
        />
      )}
    </>
  )
}
