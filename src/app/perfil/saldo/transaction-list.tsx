"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TrendingDown,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState } from "react";

type TipoTransaccion = "RETIRO" | "SUBIDA";
type EstadoTransaccion = "PENDIENTE" | "COMPLETADA" | "RECHAZADA";

export interface Transaccion {
  id: string;
  monto: number;
  tipo: TipoTransaccion;
  estado: EstadoTransaccion;
  qrUrl: string;
  createdAt: string;
}

export default function TransactionList({
  transactions,
}: {
  transactions: Transaccion[];
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (estado: EstadoTransaccion) => {
    switch (estado) {
      case "PENDIENTE":
        return <Clock className="w-4 h-4 text-gray-500" />;
      case "COMPLETADA":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "RECHAZADA":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (estado: EstadoTransaccion) => {
    switch (estado) {
      case "PENDIENTE":
        return "text-gray-600";
      case "COMPLETADA":
        return "text-green-600";
      case "RECHAZADA":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBadgeVariant = (estado: EstadoTransaccion) => {
    switch (estado) {
      case "PENDIENTE":
        return "secondary";
      case "COMPLETADA":
        return "default";
      case "RECHAZADA":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getTypeIcon = (tipo: TipoTransaccion) => {
    return tipo === "RETIRO" ? (
      <TrendingDown className="w-4 h-4 text-red-500" />
    ) : (
      <TrendingUp className="w-4 h-4 text-green-500" />
    );
  };

  const getAmountColor = (tipo: TipoTransaccion) => {
    return tipo === "RETIRO" ? "text-red-600" : "text-green-600";
  };

  const getAmountPrefix = (tipo: TipoTransaccion) => {
    return tipo === "RETIRO" ? "-" : "+";
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transacciones Recientes</CardTitle>
          <CardDescription>
            Historial de movimientos de tu saldo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No hay transacciones disponibles
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Transacciones Recientes</CardTitle>
          <CardDescription>
            Historial de movimientos de tu saldo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {/* Información de la transacción */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getTypeIcon(transaction.tipo)}
                      <p className="font-medium">
                        {transaction.tipo === "RETIRO"
                          ? "Retiro solicitado"
                          : "Depósito recibido"}
                      </p>
                      <Badge
                        variant={getStatusBadgeVariant(transaction.estado)}
                        className="text-xs"
                      >
                        {transaction.estado}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Monto y acciones */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p
                      className={`font-medium ${getAmountColor(
                        transaction.tipo
                      )}`}
                    >
                      {getAmountPrefix(transaction.tipo)}$
                      {transaction.monto.toLocaleString("es-ES", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      BOB
                    </p>
                    <div className="flex items-center justify-end gap-1 text-xs">
                      {getStatusIcon(transaction.estado)}
                      <span className={getStatusColor(transaction.estado)}>
                        {transaction.estado}
                      </span>
                    </div>
                  </div>

                  {/* Botón para ver QR */}
                  {transaction.tipo === "RETIRO" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openImageModal(transaction.qrUrl)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      QR
                    </Button>
                  ) : (
                    <div className="w-[61px] h-8"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal para ver imagen del QR */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Comprobante de Pago</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {selectedImage && (
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Comprobante QR"
                className="max-w-full max-h-[60vh] object-contain rounded-lg border"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}