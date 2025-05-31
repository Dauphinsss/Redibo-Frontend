"use client";

import type React from "react";
import { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Wallet,
  Upload,
  X,
  Eye,
  Download,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "@/utils/bakend";
import { toast } from "sonner";
import TransactionList, { Transaccion } from "./transaction-list";

export default function SaldoImproved() {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [balance, setBalance] = useState<number>(2547.85);
  const [loading, setLoading] = useState(true);
  const [amountError, setAmountError] = useState("");
  const [sending, setSending] = useState(false);
  const [transactions, setTransactions] = useState<Transaccion[]>([]);

  // Calcular saldo restante
  const remainingBalance = useMemo(() => {
    const amount = Number.parseFloat(withdrawAmount) || 0;
    return balance - amount;
  }, [balance, withdrawAmount]);

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

      setBalance(response.data.saldo);
    } catch (error) {
      console.error("Error al obtener el saldo del usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    const authToken = localStorage.getItem("auth_token");
    if (!authToken) {
      console.error("No se encontró el token de autenticación");
      return;
    }
    try {
      const response = await axios.get<Transaccion[]>(
        `${API_URL}/api/transacciones`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status === 200) {
        setTransactions(response.data);
      } else {
        console.error(
          "Error al obtener las transacciones:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error al obtener las transacciones:", error);
      setTransactions([]);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  // Drag and Drop handlers
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));

    if (imageFile) {
      handleFileSelection(imageFile);
    }
  }, []);

  const handleFileSelection = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      alert("El archivo es demasiado grande. Máximo 10MB.");
      return;
    }

    setQrFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setQrPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const removeFile = () => {
    setQrFile(null);
    setQrPreview(null);
  };

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
    if (numAmount > balance) {
      setAmountError(
        `El monto no puede ser mayor a tu saldo disponible ($${balance.toLocaleString(
          "es-ES",
          { minimumFractionDigits: 2 }
        )} BOB)`
      );
      return false;
    }
    setAmountError("");
    return true;
  };

  const handleWithdrawSubmit = async () => {
    setSending(true);
    if (!validateAmount(withdrawAmount)) {
      return;
    }
    toast.info("Enviando solicitud de retiro");

    try {
      const formData = new FormData();
      const monto = Number.parseFloat(withdrawAmount);

      formData.append("transaccion", JSON.stringify({ monto }));
      formData.append("qr", qrFile as File);

      const token = localStorage.getItem("auth_token");
      if (!token) {
        console.error("No se encontró el token de autenticación");
        return;
      }

      await axios.post(`${API_URL}/api/upload-qr`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Solicitud de retiro enviada exitosamente");
      setIsWithdrawModalOpen(false);
      setWithdrawAmount("");
      setQrFile(null);
      setQrPreview(null);
      setAmountError("");
      fetchTransactions(); 
    } catch (error) {
      toast.error("Error al enviar la solicitud de retiro");
      console.error("Error al enviar la solicitud de retiro:", error);
    }
    setSending(false);
  };

  return (
    <>
      {loading ? (
        <div className="flex flex-col justify-center items-center text-muted-foreground">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-primary m-4"></div>
          Cargando...
        </div>
      ) : (
        <div>
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Wallet className="mr-2 h-5 w-5" />
                      Saldo Disponible
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">
                      $
                      {balance.toLocaleString("es-ES", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      BOB
                    </div>

                    <Dialog
                      open={isWithdrawModalOpen}
                      onOpenChange={setIsWithdrawModalOpen}
                    >
                      <DialogTrigger asChild>
                        <Button>Retirar fondos</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Retirar Fondos</DialogTitle>
                          <DialogDescription>
                            Ingresa el monto a retirar y sube tu código QR de
                            pago
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                          <div>
                            <Label htmlFor="amount">
                              Monto a retirar (BOB)
                            </Label>
                            <Input
                              id="amount"
                              type="number"
                              placeholder="0.00"
                              value={withdrawAmount}
                              onChange={(e) => {
                                setWithdrawAmount(e.target.value);
                                if (e.target.value) {
                                  validateAmount(e.target.value);
                                } else {
                                  setAmountError("");
                                }
                              }}
                              className="mt-1"
                            />
                            {amountError && (
                              <p className="text-xs text-red-600 mt-1 font-medium">
                                {amountError}
                              </p>
                            )}

                            {/* Preview del saldo */}
                            <div className="mt-3 p-3 border rounded-lg bg-muted/30">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Saldo actual:
                                </span>
                                <span className="font-medium">
                                  $
                                  {balance.toLocaleString("es-ES", {
                                    minimumFractionDigits: 2,
                                  })}{" "}
                                  BOB
                                </span>
                              </div>

                              {withdrawAmount &&
                                Number.parseFloat(withdrawAmount) > 0 && (
                                  <>
                                    <div className="flex items-center justify-between text-sm mt-1">
                                      <span className="text-muted-foreground flex items-center">
                                        <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                                        Monto a retirar:
                                      </span>
                                      <span className="font-medium text-red-600">
                                        -$
                                        {Number.parseFloat(
                                          withdrawAmount
                                        ).toLocaleString("es-ES", {
                                          minimumFractionDigits: 2,
                                        })}{" "}
                                        BOB
                                      </span>
                                    </div>

                                    <div className="border-t pt-2 mt-2">
                                      <div className="flex items-center justify-between text-sm font-semibold">
                                        <span className="flex items-center">
                                          <TrendingUp
                                            className={`w-3 h-3 mr-1 ${
                                              remainingBalance >= 0
                                                ? "text-green-500"
                                                : "text-red-500"
                                            }`}
                                          />
                                          Saldo restante:
                                        </span>
                                        <span
                                          className={`${
                                            remainingBalance >= 0
                                              ? "text-green-600"
                                              : "text-red-600"
                                          }`}
                                        >
                                          $
                                          {remainingBalance.toLocaleString(
                                            "es-ES",
                                            { minimumFractionDigits: 2 }
                                          )}{" "}
                                          BOB
                                        </span>
                                      </div>
                                    </div>
                                  </>
                                )}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="qr-upload">Código QR de Pago</Label>

                            {!qrFile ? (
                              <div
                                className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer ${
                                  isDragOver
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                }`}
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop}
                                onClick={() =>
                                  document.getElementById("qr-upload")?.click()
                                }
                              >
                                <div className="space-y-2 text-center">
                                  <Upload
                                    className={`mx-auto h-12 w-12 transition-colors ${
                                      isDragOver
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                  <div className="text-sm">
                                    <span className="font-medium text-primary">
                                      Haz clic para subir
                                    </span>
                                    <span className="text-muted-foreground">
                                      {" "}
                                      o arrastra y suelta
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    PNG, JPG, JPEG hasta 10MB
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Recomendado: Código QR de tu cuenta bancaria
                                  </p>
                                </div>
                                <input
                                  id="qr-upload"
                                  name="qr-upload"
                                  type="file"
                                  accept="image/*"
                                  className="sr-only"
                                  onChange={handleFileUpload}
                                />
                              </div>
                            ) : (
                              <div className="mt-2 space-y-3">
                                {/* File info */}
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                      <Upload className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">
                                        {qrFile.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {(qrFile.size / 1024 / 1024).toFixed(2)}{" "}
                                        MB
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setIsImageModalOpen(true)}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={removeFile}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Image preview */}
                                {qrPreview && (
                                  <div className="relative">
                                    <img
                                      src={qrPreview || "/placeholder.svg"}
                                      alt="Vista previa del QR"
                                      className="w-full h-32 object-cover rounded-lg border cursor-pointer"
                                      onClick={() => setIsImageModalOpen(true)}
                                    />
                                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
                                      <Eye className="w-6 h-6 text-white" />
                                    </div>
                                  </div>
                                )}

                                {/* Replace file button */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={() =>
                                    document
                                      .getElementById("qr-upload-replace")
                                      ?.click()
                                  }
                                >
                                  <Upload className="w-4 h-4 mr-2" />
                                  Cambiar archivo
                                </Button>
                                <input
                                  id="qr-upload-replace"
                                  type="file"
                                  accept="image/*"
                                  className="sr-only"
                                  onChange={handleFileUpload}
                                />
                              </div>
                            )}
                          </div>

                          <div className="flex space-x-3 pt-4">
                            <Button
                              variant="outline"
                              className={`flex-1`}
                              disabled={sending}
                              onClick={() => {
                                setIsWithdrawModalOpen(false);
                                setQrFile(null);
                                setQrPreview(null);
                                setAmountError("");
                                setWithdrawAmount("");
                              }}
                            >
                              Cancelar
                            </Button>
                            <Button
                              className="flex-1"
                              onClick={handleWithdrawSubmit}
                              disabled={
                                !withdrawAmount ||
                                !qrFile ||
                                !!amountError ||
                                sending
                              }
                            >
                              Enviar Solicitud
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>

                {/* Recent Transactions */}
                <TransactionList transactions={transactions} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver imagen completa */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>Vista Completa del Comprobante</DialogTitle>
            <DialogDescription>
              {qrFile?.name} -{" "}
              {qrFile && (qrFile.size / 1024 / 1024).toFixed(2)} MB
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6">
            {qrPreview && (
              <div className="relative">
                <img
                  src={qrPreview || "/placeholder.svg"}
                  alt="Comprobante de pago completo"
                  className="w-full h-auto max-h-[60vh] object-contain rounded-lg border"
                />
                <div className="flex justify-center mt-4 space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = qrPreview;
                      link.download = qrFile?.name || "comprobante.jpg";
                      link.click();
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                  <Button onClick={() => setIsImageModalOpen(false)}>
                    Cerrar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
