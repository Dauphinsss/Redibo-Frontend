"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Plus, TrendingUp } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/utils/bakend";
import { toast } from "sonner";

const BANK_DETAILS = [
  {
    name: "BCP",
    logo: "/banks/bcp-logo.png",
    backgroundColor: "#0033A0",
    qrImage: "/banks/bcp-qr.png"
  },
  {
    name: "YAPE",
    logo: "/banks/yape-logo.png",
    backgroundColor: "#6A1B9A",
    qrImage: "/banks/yape-qr.png"
  },
  {
    name: "Banco Unión",
    logo: "/banks/banco-union-logo.png",
    backgroundColor: "#007DC5",
    qrImage: "/banks/banco-union-qr.png"
  },
];

type AddFundsStep = "amount-input" | "bank-selection" | "qr-display" | "transaction-registration";

interface AddFundsModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function AddFundsModal({ onSuccess, onClose }: AddFundsModalProps) {
  const [currentStep, setCurrentStep] = useState<AddFundsStep>("amount-input");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [transactionIdError, setTransactionIdError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [loadingBalance, setLoadingBalance] = useState(true);

  // Función para obtener el saldo actual
  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        console.error("No se encontró el token de autenticación");
        return;
      }

      const response = await axios.get(`${API_URL}/api/get-saldo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCurrentBalance(response.data.saldo);
    } catch (error) {
      console.error("Error al obtener el saldo del usuario:", error);
    } finally {
      setLoadingBalance(false);
    }
  };

  // Cargar saldo al montar el componente
  useEffect(() => {
    fetchBalance();
  }, []);

  // Calcular nuevo saldo
  const newBalance = currentBalance + (Number.parseFloat(amount) || 0);

  const validateAmount = (amount: string) => {
    const numAmount = Number.parseFloat(amount);
    if (!amount || amount === "") {
      setAmountError("El monto es requerido");
      return false;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setAmountError("El monto debe ser mayor a 0");
      return false;
    }
    if (numAmount < 10) {
      setAmountError("El monto mínimo es de 10 BOB");
      return false;
    }
    if (numAmount > 10000) {
      setAmountError("El monto máximo es de 10,000 BOB");
      return false;
    }
    setAmountError("");
    return true;
  };

  const handleAmountNext = () => {
    if (validateAmount(amount)) {
      setCurrentStep("bank-selection");
    }
  };

  const handleBankSelect = (bank: string) => {
    setSelectedBank(bank);
    setCurrentStep("qr-display");
  };

  const handleQRNext = () => {
    setCurrentStep("transaction-registration");
  };

  const handleTransactionSubmit = async () => {
    if (!transactionId.trim()) {
      setTransactionIdError("ID de transacción obligatorio");
      return;
    }
    if (!/^\d{8,32}$/.test(transactionId)) {
      setTransactionIdError("El ID debe tener entre 8 y 32 dígitos numéricos.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        toast.error("No se encontró el token de autenticación");
        setSubmitting(false);
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/crear-recarga`,
        {
          monto: Number.parseFloat(amount),
          numeroTransaccion: transactionId,
          banco: selectedBank,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.error) {
        toast.error(response.data.error);
        setSubmitting(false);
        return;
      } else {
        toast.success("Solicitud de recarga enviada exitosamente. Espera la aprobación del administrador.");
        onSuccess();
        onClose();
        resetModal();
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
      toast.error("Error al enviar la solicitud de recarga");
    } finally {
      setSubmitting(false);
    }
  };

  const resetModal = () => {
    setCurrentStep("amount-input");
    setAmount("");
    setAmountError("");
    setSelectedBank(null);
    setTransactionId("");
    setTransactionIdError("");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleBack = () => {
    switch (currentStep) {
      case "bank-selection":
        setCurrentStep("amount-input");
        break;
      case "qr-display":
        setCurrentStep("bank-selection");
        setSelectedBank(null);
        break;
      case "transaction-registration":
        setCurrentStep("qr-display");
        setTransactionId("");
        setTransactionIdError("");
        break;
    }
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case "amount-input":
        return 25;
      case "bank-selection":
        return 50;
      case "qr-display":
        return 75;
      case "transaction-registration":
        return 100;
      default:
        return 0;
    }
  };

  const getSelectedBankDetails = () => {
    return BANK_DETAILS.find(bank => bank.name === selectedBank);
  };

  return (
    <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center">
          <Plus className="mr-2 h-5 w-5" />
          Agregar Fondos
        </DialogTitle>
        <DialogDescription>
          Recarga tu saldo mediante transferencia bancaria
        </DialogDescription>
      </DialogHeader>

      {/* Barra de progreso */}
      <div className="relative h-2 bg-gray-200 rounded-full mb-6">
        <div
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 rounded-full"
          style={{ width: `${getStepProgress()}%` }}
        />
      </div>

      {/* Paso 1: Ingreso de monto */}
      {currentStep === "amount-input" && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount-input">Monto a agregar (BOB)</Label>
            <Input
              id="amount-input"
              type="number"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (e.target.value) {
                  validateAmount(e.target.value);
                } else {
                  setAmountError("");
                }
              }}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                e.preventDefault();
                }
              }}
              className="mt-1"
            />
            {amountError && (
              <p className="text-xs text-red-600 mt-1 font-medium">
                {amountError}
              </p>
            )}
            
            {/* Vista previa del saldo */}
            {!loadingBalance && (
              <div className="mt-3 p-3 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Saldo actual:
                  </span>
                  <span className="font-medium">
                    $
                    {currentBalance.toLocaleString("es-ES", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    BOB
                  </span>
                </div>

                {amount && Number.parseFloat(amount) > 0 && !amountError && (
                  <>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-muted-foreground flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                        Monto a agregar:
                      </span>
                      <span className="font-medium text-green-600">
                        +$
                        {Number.parseFloat(amount).toLocaleString("es-ES", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        BOB
                      </span>
                    </div>

                    <div className="border-t pt-2 mt-2">
                      <div className="flex items-center justify-between text-sm font-semibold">
                        <span className="flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                          Saldo después de recarga:
                        </span>
                        <span className="text-green-600">
                          $
                          {newBalance.toLocaleString("es-ES", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          BOB
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            
            <p className="text-xs text-muted-foreground mt-2">
              Monto mínimo: 10 BOB | Monto máximo: 10,000 BOB
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            {/* Botón Continuar */}
            <Button
              className="flex-1 bg-black text-white hover:bg-gray-800"
              onClick={handleAmountNext}
              disabled={!amount || !!amountError}
            >
              Continuar
            </Button>
          </div>
        </div>
      )}

      {/* Paso 2: Selección de banco */}
      {currentStep === "bank-selection" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Selecciona tu banco</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {BANK_DETAILS.map((bank) => (
                <button
                key={bank.name}
                onClick={() => handleBankSelect(bank.name)}
                className="h-32 w-32 flex flex-col items-center justify-center gap-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-white font-medium"
                style={{ backgroundColor: bank.backgroundColor }}
                >
                <img
                    src={bank.logo}
                    alt={bank.name}
                    className="h-16 w-16 object-contain"
                />
                <span className="text-lg">{bank.name}</span>
                </button>
            ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      )}

      {/* Paso 3: Mostrar QR */}
      {currentStep === "qr-display" && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Pago con {selectedBank}</h3>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold text-gray-800">
                Monto a pagar: {Number.parseFloat(amount).toLocaleString("es-ES", {
                  minimumFractionDigits: 2,
                })} BOB
              </p>
            </div>
            
            {selectedBank && (
              <div className="flex justify-center mb-6">
                <img
                  src={getSelectedBankDetails()?.qrImage}
                  alt={`QR de pago ${selectedBank}`}
                  className="w-64 h-64 border border-gray-300 rounded-lg shadow-md object-contain"
                />
              </div>
            )}
            
            <p className="text-sm text-gray-600 mb-4">
              Escanea el código QR con tu aplicación bancaria y realiza el pago por el monto indicado.
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <Button
              className="flex-1 bg-black text-white hover:bg-gray-800"
              onClick={handleQRNext}
            >
              Ya realicé el pago
            </Button>
          </div>
        </div>
      )}

      {/* Paso 4: Registrar transacción */}
      {currentStep === "transaction-registration" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Registrar transacción</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="transactionId" className="text-sm font-medium">
                  ID de transacción
                </Label>
                <Input
                  id="transactionId"
                  type="text"
                  value={transactionId}
                  onChange={(e) => {
                    // Solo números
                    const value = e.target.value.replace(/\D/g, "");
                    setTransactionId(value);

                    // Validación en tiempo real
                    if (value.length > 0 && (value.length < 8 || value.length > 32)) {
                      setTransactionIdError("El ID debe tener entre 8 y 32 dígitos numéricos.");
                    } else {
                      setTransactionIdError("");
                    }
                  }}
                  maxLength={32}
                  placeholder="Ingrese el ID de transacción"
                  className={`mt-1 ${transactionIdError ? "border-red-500" : ""}`}
                />
                {transactionIdError && (
                  <p className="text-xs text-red-600 mt-1 font-medium">
                    {transactionIdError}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Ingresa el número de transacción que aparece en tu comprobante bancario
                </p>
              </div>

              {/* Resumen de la transacción */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Resumen de la transacción</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Banco:</span>
                    <span>{selectedBank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monto:</span>
                    <span className="font-medium">
                      {Number.parseFloat(amount).toLocaleString("es-ES", {
                        minimumFractionDigits: 2,
                      })} BOB
                    </span>
                  </div>
                  {transactionId && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID Transacción:</span>
                      <span className="font-mono">{transactionId}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleBack}
              disabled={submitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            {/* Botón "Registrar y finalizar"*/}
            <Button
              className="flex-1 bg-black text-white hover:bg-gray-800"
              onClick={handleTransactionSubmit}
              disabled={submitting || !transactionId.trim() || !!transactionIdError}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Registrar y finalizar"
              )}
            </Button>
          </div>
        </div>
      )}
    </DialogContent>
  );
}