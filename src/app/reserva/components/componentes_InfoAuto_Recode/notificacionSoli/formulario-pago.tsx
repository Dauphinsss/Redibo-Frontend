"use client"

import { useState, useEffect } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import NotificacionSinPago from "./notificacion-sin-pago"
import NotificacionPago50 from "./notificacion-pago-50"
import NotificacionPago100 from "./notificacion-pago-100"
import NotificacionError from "./notificacion-error"
import PasarelaTarjeta from "./pasarela-tarjeta"
import PasarelaTransferencia from "./pasarela-transferencia"

interface FormularioPagoProps {
  isOpen: boolean
  onClose: () => void
  carModel: string
  carPrice: number
  nombreUsuario?: string
}

export default function FormularioPago({ isOpen, onClose, carModel, carPrice,nombreUsuario }: FormularioPagoProps) {
  const [porcentajeReserva, setPorcentajeReserva] = useState("0")
  const [metodoPago, setMetodoPago] = useState("tarjeta")
  const [procesando, setProcesando] = useState(false)

  // Estados para las notificaciones
  const [mostrarNotificacionSinPago, setMostrarNotificacionSinPago] = useState(false)
  const [mostrarNotificacionPago50, setMostrarNotificacionPago50] = useState(false)
  const [mostrarNotificacionPago100, setMostrarNotificacionPago100] = useState(false)
  const [mostrarNotificacionError, setMostrarNotificacionError] = useState(false)
  const [tipoError, setTipoError] = useState("")
  const [mensajeError, setMensajeError] = useState("")

  // Estados para las pasarelas
  const [mostrarPasarelaTarjeta, setMostrarPasarelaTarjeta] = useState(false)
  const [mostrarPasarelaTransferencia, setMostrarPasarelaTransferencia] = useState(false)

  // Estado para completar pago del 50%
  const [completandoPago, setCompletandoPago] = useState(false)
  const [pagoCompletado, setPagoCompletado] = useState(false)

  // Resetear estados cuando se abre/cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setPorcentajeReserva("0")
      setMetodoPago("tarjeta")
      setProcesando(false)
      setMostrarNotificacionSinPago(false)
      setMostrarNotificacionPago50(false)
      setMostrarNotificacionPago100(false)
      setMostrarNotificacionError(false)
      setMostrarPasarelaTarjeta(false)
      setMostrarPasarelaTransferencia(false)
      setCompletandoPago(false)
      setPagoCompletado(false)
    }
  }, [isOpen])

  const handlePorcentajeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPorcentajeReserva(e.target.value)
  }

  const handleMetodoPagoChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setMetodoPago(e.target.value)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setProcesando(true)

    // Si es sin pago, mostrar notificación directamente
    if (porcentajeReserva === "0") {
      setTimeout(() => {
        setProcesando(false)

        // Generar error aleatorio para "sin pago" (menos probable)
        const random = Math.random()
        if (random < 0.1) {
          setTipoError("Reserva")
          setMensajeError("Error de red.")
          setMostrarNotificacionError(true)
        } else {
          setMostrarNotificacionSinPago(true)
        }
      }, 500)
      return
    }

    // Si es con pago, mostrar la pasarela correspondiente
    setTimeout(() => {
      setProcesando(false)
      if (metodoPago === "tarjeta") {
        setMostrarPasarelaTarjeta(true)
      } else {
        setMostrarPasarelaTransferencia(true)
      }
    }, 500)
  }

  // Modificar la función handlePagoExitoso para manejar correctamente los errores
  const handlePagoExitoso = () => {
    // Cerrar pasarelas
    setMostrarPasarelaTarjeta(false)
    setMostrarPasarelaTransferencia(false)

    // Mostrar notificación según el porcentaje
    if (completandoPago || porcentajeReserva === "100") {
      setMostrarNotificacionPago100(true)
      setPagoCompletado(true)
    } else if (porcentajeReserva === "50") {
      setMostrarNotificacionPago50(true)
    }
  }

  const handleCancelarPago = () => {
    setMostrarPasarelaTarjeta(false)
    setMostrarPasarelaTransferencia(false)
  }

  const handleCompletarPago = () => {
    setMostrarNotificacionPago50(false)
    setCompletandoPago(true)

    // Mostrar la pasarela correspondiente para completar el pago
    if (metodoPago === "tarjeta") {
      setMostrarPasarelaTarjeta(true)
    } else {
      setMostrarPasarelaTransferencia(true)
    }
  }

  const handleCerrarTodo = () => {
    setMostrarNotificacionSinPago(false)
    setMostrarNotificacionPago50(false)
    setMostrarNotificacionPago100(false)
    setMostrarNotificacionError(false)
    onClose()
  }

  // Calcular monto a pagar
  const porcentaje = Number.parseInt(porcentajeReserva) || 0
  const montoPagar = completandoPago ? carPrice * 0.5 : carPrice * (porcentaje / 100)

  return (
    <>
      {/* Formulario principal */}
      {isOpen &&
        !mostrarPasarelaTarjeta &&
        !mostrarPasarelaTransferencia &&
        !mostrarNotificacionSinPago &&
        !mostrarNotificacionPago50 &&
        !mostrarNotificacionPago100 &&
        !mostrarNotificacionError && (
          <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="p-0 border-0 max-w-md z-[9999]">
              <div className="p-6 bg-white rounded-lg">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-[#11295B]">Formulario de Pago de Reserva</h1>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Datos de la reserva */}
                  <div className="bg-[#FFF8E8] p-4 rounded-md mb-6">
                    <h2 className="text-xl font-semibold text-[#11295B] mb-3">Datos de la Reserva</h2>
                    <div className="space-y-2">
                      <p>
                        <span className="font-semibold">Usuario:</span> {nombreUsuario}
                      </p>
                      <p>
                        <span className="font-semibold">Vehículo:</span> {carModel}
                      </p>
                      <p>
                        <span className="font-semibold">Precio del servicio:</span> Bs. {carPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Porcentaje de reserva */}
                  <div className="mb-4">
                    <label htmlFor="porcentajeReserva" className="block font-medium mb-2">
                      Porcentaje de reserva:
                    </label>
                    <select
                      id="porcentajeReserva"
                      value={porcentajeReserva}
                      onChange={handlePorcentajeChange}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      disabled={completandoPago}
                    >
                      <option value="0">Sin pago</option>
                      <option value="50">50%</option>
                      <option value="100">100%</option>
                    </select>
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
                  <div className="bg-[#FFF8E8] p-4 rounded-md mb-6">
                    <h2 className="text-xl font-semibold text-[#11295B] mb-3">Total a Pagar</h2>
                    <p>
                      <span className="font-semibold">Total a pagar hoy:</span> Bs. {montoPagar.toFixed(2)}
                    </p>
                  </div>

                  {/* Botón de reserva */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition-colors"
                    disabled={procesando}
                  >
                    {procesando ? "Procesando..." : completandoPago ? "Completar Pago" : "Reservar"}
                  </button>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        )}

      {/* Pasarelas de pago */}
      {mostrarPasarelaTarjeta && (
        <PasarelaTarjeta
          monto={montoPagar}
          onSuccess={handlePagoExitoso}
          onCancel={handleCancelarPago}
          metodoPago={metodoPago}
          porcentaje={porcentajeReserva}
          onError={(mensaje) => {
            setMostrarPasarelaTarjeta(false)
            setTipoError("Reserva")
            setMensajeError(mensaje)
            setMostrarNotificacionError(true)
          }}
        />
      )}

      {mostrarPasarelaTransferencia && (
        <PasarelaTransferencia
          monto={montoPagar}
          onSuccess={handlePagoExitoso}
          onCancel={handleCancelarPago}
          metodoPago={metodoPago}
          porcentaje={porcentajeReserva}
          onError={(mensaje) => {
            setMostrarPasarelaTransferencia(false)
            setTipoError("Reserva")
            setMensajeError(mensaje)
            setMostrarNotificacionError(true)
          }}
        />
      )}

      {/* Notificaciones */}
      {mostrarNotificacionSinPago && <NotificacionSinPago usuario={nombreUsuario || "Usuario"} onClose={handleCerrarTodo} />}

      {mostrarNotificacionPago50 && (
        <NotificacionPago50
          monto={montoPagar.toFixed(2)}
          total={carPrice.toFixed(2)}
          onClose={handleCerrarTodo}
          onCompletarPago={handleCompletarPago}
          pagoCompletado={pagoCompletado}
          usuario={nombreUsuario || "Usuario"}
        />
      )}

      {mostrarNotificacionPago100 && <NotificacionPago100 usuario= {nombreUsuario || "Usuario"} monto={montoPagar.toFixed(2)} onClose={handleCerrarTodo} />}

      {mostrarNotificacionError && (
        <NotificacionError tipo={tipoError} mensaje={mensajeError} onClose={handleCerrarTodo} />
      )}
    </>
  )
}
