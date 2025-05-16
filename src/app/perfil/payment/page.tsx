"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/utils/bakend";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const BANK_DETAILS = [
  {
    name: "BCP",
    logo: "/banks/bcp-logo.png",
    backgroundColor: "#0033A0",
  },
  {
    name: "YAPE",
    logo: "/banks/yape-logo.png",
    backgroundColor: "#6A1B9A",
  },
  {
    name: "Banco Unión",
    logo: "/banks/banco-union-logo.png",
    backgroundColor: "#007DC5",
  },
];

type PaymentStep = "bank-selection" | "qr-generation" | "transaction-registration";
export default function PaymentPageWrapper() {
  return (
    <Suspense fallback={<div>Cargando datos de pago...</div>}>
      <PaymentPage />
    </Suspense>
  );
}
function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [currentStep, setCurrentStep] = useState<PaymentStep>("bank-selection");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [transactionIdError, setTransactionIdError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{
    monto_a_pagar: number;
    estado: string;
  } | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!code) {
        console.log("No se encontró el código en la URL");
        router.replace("/perfil");
        return;
      }
      try {
        const response = await axios.post(
          `${API_URL}/api/paymentOrderbyCode`,
          { codigo: code },
        );
        setOrderDetails(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
        router.replace("/perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [code, router]);

  const handleBankSelect = (bank: string) => {
    setSelectedBank(bank);
    setCurrentStep("qr-generation");
  };

  const handleTransactionSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/paymentOrder/RegisterTransactionNumber`,
        {
          codigo_orden_pago: code,
          numero_transaccion: transactionId,
        }
      );

      if (response.status === 201) {
        router.replace("/perfil");
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="relative h-2 bg-gray-200 rounded-full w-full max-w-lg mb-8">
        <div
          className={`absolute top-0 left-0 h-full bg-primary transition-all duration-300 ${currentStep === "bank-selection"
            ? "w-1/3"
            : currentStep === "qr-generation"
              ? "w-2/3"
              : "w-full"
            }`}
        />
      </div>

      {/* Paso 1: Selección de banco */}
      <div
        className={`transition-transform duration-300 ${currentStep !== "bank-selection"
          ? "-translate-x-full opacity-0 absolute"
          : "opacity-100"
          }`}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Selecciona tu banco</h2>
        <div className="flex flex-col items-center w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {BANK_DETAILS.map((bank) => (
              <Button
                key={bank.name}
                variant="outline"
                className="h-32 w-32 flex flex-col items-center justify-center gap-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                style={{ backgroundColor: bank.backgroundColor }}
                onClick={() => handleBankSelect(bank.name)}
              >
                <img
                  src={bank.logo}
                  alt={bank.name}
                  className="h-16 w-16 object-contain"
                />
                <span className="text-lg font-medium text-white">{bank.name}</span>
              </Button>
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            className="px-6 py-2 rounded-lg hover:bg-gray-200"
            onClick={() => router.replace("/perfil")}
          >
            Volver
          </Button>
        </div>
      </div>

      {/* Paso 2: Generación de QR */}
      <div
        className={`transition-transform duration-300 ${currentStep !== "qr-generation"
          ? "translate-x-full opacity-0 absolute"
          : "opacity-100"
          }`}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Pago con {selectedBank}</h2>
        <div className="text-center">
          <div className="mb-4 p-6">
            <p className="text-lg font-semibold text-gray-800">Monto a pagar: {orderDetails?.monto_a_pagar} BOB</p>
            <p className="text-sm text-gray-500">Código de orden: {code}</p>
          </div>
          {selectedBank && orderDetails ? (
            <img
              src={`/banks/${selectedBank === "Banco Unión" ? "banco-union" : selectedBank.toLowerCase()}-qr.png`}
              alt="QR de pago"
              className="mx-auto mb-6 w-64 h-64 border border-gray-300 rounded-lg shadow-md"
            />
          ) : null}
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              className="px-6 py-2 rounded-lg hover:bg-gray-200"
              onClick={() => setCurrentStep("bank-selection")}
            >
              Volver
            </Button>
            <Button
              className="px-6 py-2 text-white rounded-lg hover:opacity-90 flex items-center justify-center"
              style={{
                backgroundColor: selectedBank
                  ? BANK_DETAILS.find((bank) => bank.name === selectedBank)?.backgroundColor
                  : "#007bff",
              }}
              onClick={() => setCurrentStep("transaction-registration")}
            >
              {submitting ? <Loader2 className="animate-spin" /> : "Ya realicé el pago"}
            </Button>
          </div>
        </div>
      </div>

      {/* Paso 3: Registro de transacción */}
      <div
        className={`transition-transform duration-300 ${currentStep !== "transaction-registration"
          ? "translate-x-full opacity-0 absolute"
          : "opacity-100"
          }`}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Registrar transacción</h2>
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
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
              className={`h-10 px-4 ${transactionIdError ? "border border-red-500" : ""}`}
            />
            {transactionIdError && (
              <p className="text-red-500 text-sm mt-1">{transactionIdError}</p>
            )}
          </div>
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              className="px-6 py-2 rounded-lg hover:bg-gray-200"
              onClick={() => setCurrentStep("qr-generation")}
            >
              Volver
            </Button>
            <Button
              className="px-6 py-2 text-white rounded-lg hover:opacity-90 flex items-center justify-center"
              style={{
                backgroundColor: selectedBank
                  ? BANK_DETAILS.find((bank) => bank.name === selectedBank)?.backgroundColor
                  : "#28a745",
              }}
              onClick={() => {
                if (!transactionId.trim()) {
                  setTransactionIdError("ID de transacción obligatorio");
                  return;
                }
                if (!/^\d{8,32}$/.test(transactionId)) {
                  setTransactionIdError("El ID debe tener entre 8 y 32 dígitos numéricos.");
                  return;
                }
                handleTransactionSubmit();
              }}
              disabled={submitting}
            >
              {submitting ? <Loader2 className="animate-spin" /> : "Registrar y finalizar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}