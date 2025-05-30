"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Wallet, Upload} from "lucide-react"

export default function Saldo() {
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [qrFile, setQrFile] = useState<File | null>(null)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [userBalance, setUserBalance] = useState(0) // Default balance or prop

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setQrFile(file)
    }
  }

  useEffect(() => {
    // Simulate fetching user balance from an API
    const fetchUserBalance = async () => {
      // Replace with actual API call
      const balance = 1500.00; // Example balance
      setUserBalance(balance)
    }

    fetchUserBalance()
  },[])

  const handleWithdrawSubmit = () => {
    console.log("Withdrawal request:", { amount: withdrawAmount, qrFile })
    setIsWithdrawModalOpen(false)
    setWithdrawAmount("")
    setQrFile(null)
  }


  return (
    <div>
      

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          
        <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Saldo</h3>
                <p className="text-gray-600">Gestiona tu saldo disponible y realiza retiros</p>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wallet className="mr-2 h-5 w-5" />
                    Saldo Disponible
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-4">
                    ${userBalance.toLocaleString("es-ES", { minimumFractionDigits: 2 })} BOB
                  </div>

                  <Dialog open={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen}>
                    <DialogTrigger asChild>
                      <Button>Retirar fondos</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Retirar Fondos</DialogTitle>
                        <DialogDescription>Ingresa el monto a retirar y sube tu código QR de pago</DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="amount">Monto a retirar (BOB)</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Saldo disponible: ${userBalance.toLocaleString("es-ES", { minimumFractionDigits: 2 })} BOB
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="qr-upload">Código QR de Pago</Label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                            <div className="space-y-1 text-center">
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="qr-upload"
                                  className="relative cursor-pointer bg-white rounded-md font-medium focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 "
                                >
                                  <span>Subir archivo</span>
                                  <input
                                    id="qr-upload"
                                    name="qr-upload"
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={handleFileUpload}
                                  />
                                </label>
                                <p className="pl-1">o arrastra y suelta</p>
                              </div>
                              <p className="text-xs text-gray-500">PNG, JPG hasta 10MB</p>
                              {qrFile && (
                                <p className="text-sm text-green-600 font-medium">
                                  Archivo seleccionado: {qrFile.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-3 pt-4">
                          <Button variant="outline" className="flex-1" onClick={() => setIsWithdrawModalOpen(false)}>
                            Cancelar
                          </Button>
                          <Button
                            className="flex-1 "
                            onClick={handleWithdrawSubmit}
                            disabled={!withdrawAmount || !qrFile}
                          >
                            Enviar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Transacciones Recientes</CardTitle>
                  <CardDescription>Historial de movimientos de tu saldo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium">Retiro solicitado</p>
                        <p className="text-sm text-gray-500">15 de Enero, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-red-600">-$500.00 BOB</p>
                        <p className="text-xs text-yellow-600">Pendiente</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium">Pago recibido</p>
                        <p className="text-sm text-gray-500">12 de Enero, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">+$150.00 BOB</p>
                        <p className="text-xs text-green-600">Completado</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium">Pago recibido</p>
                        <p className="text-sm text-gray-500">10 de Enero, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">+$75.50 BOB</p>
                        <p className="text-xs text-green-600">Completado</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>


         
        </div>
      </div>
    </div>
  )
}
