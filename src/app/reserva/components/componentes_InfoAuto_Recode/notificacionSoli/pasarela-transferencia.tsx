"use client"

import { useState } from "react"
import { Copy, CheckCircle2, X } from "lucide-react"

interface PasarelaTransferenciaProps {
  monto: number
  onSuccess: () => void
  onCancel: () => void
  metodoPago?: string
  porcentaje?: string
  onError?: (mensaje: string) => void
}

export default function PasarelaTransferencia({
  monto,
  onSuccess,
  onCancel,
  metodoPago = "transferencia",
  porcentaje = "100",
  onError = () => {},
}: PasarelaTransferenciaProps) {
  const [copied, setCopied] = useState(false)
  const [procesando, setProcesando] = useState(false)

  const cuentaBancaria = "1000-123456-789"
  const beneficiario = "REDIBO S.A."

  const handleCopy = () => {
    navigator.clipboard.writeText(cuentaBancaria)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConfirm = () => {
    setProcesando(true)

    // Simulamos el procesamiento del pago con posibilidad de error
    setTimeout(() => {
      setProcesando(false)

      // Generar error aleatorio según el porcentaje de pago
      const random = Math.random()
      if (metodoPago === "transferencia" && random < 0.3) {
        onError("Timeout en la transacción.")
      } else {
        onSuccess()
      }
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Transferencia Bancaria</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 p-3 bg-blue-50 rounded-md">
          <p className="text-sm mb-1">
            Monto a transferir: <span className="font-bold">Bs. {monto.toFixed(2)}</span>
          </p>
          <p className="text-sm">
            Por favor realice una transferencia bancaria con el monto exacto a la siguiente cuenta:
          </p>
        </div>

        <div className="space-y-4">
          <div className="border rounded-md p-4">
            <p className="text-sm font-semibold mb-1">Banco Nacional de Bolivia</p>
            <p className="text-sm mb-1">Beneficiario: {beneficiario}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm">Cuenta: {cuentaBancaria}</p>
              <button onClick={handleCopy} className="text-blue-500 hover:text-blue-700 flex items-center text-xs">
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-sm font-semibold mb-2">Escanea el código QR para pagar</p>
            <div className="bg-white p-2 border rounded-md mb-2">
              <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs font-bold">QR Banco Nacional</p>
                  <p className="text-xs text-gray-500 mt-1">Código QR simulado</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mb-4">
              Abre la app de tu banco, escanea el código QR y confirma el pago
            </p>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition-colors"
            disabled={procesando}
          >
            {procesando ? "Verificando..." : "Ya realicé la transferencia"}
          </button>
        </div>
      </div>
    </div>
  )
}
