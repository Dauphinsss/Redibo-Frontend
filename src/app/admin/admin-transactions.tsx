"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  TrendingDown,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Check,
  X,
  Calendar,
  DollarSign,
  Hash,
  ImageIcon,
} from "lucide-react";

type TipoTransaccion = "RETIRO" | "SUBIDA";
type EstadoTransaccion = "PENDIENTE" | "COMPLETADA" | "RECHAZADA";

interface Usuario {
  nombre: string;
  foto: string;
  saldo: number;
}

export interface Transaccion {
  id: string;
  monto: number;
  tipo: TipoTransaccion;
  estado: EstadoTransaccion;
  qrUrl: string | null;
  numeroTransaccion: string | null;
  userId: number;
  createdAt: string;
  usuario: Usuario;
}

interface AdminTransactionsProps {
  transactions: Transaccion[];
  onApprove?: (transactionId: string) => void;
  onReject?: (transactionId: string) => void;
}

export default function AdminTransactions({
  transactions,
  onApprove,
  onReject,
}: AdminTransactionsProps) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaccion | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isPaymentConfirmDialogOpen, setIsPaymentConfirmDialogOpen] =
    useState(false);
  const [sending, setSending] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (estado: EstadoTransaccion) => {
    switch (estado) {
      case "PENDIENTE":
        return <Clock className="w-4 h-4 text-gray-400" />;
      case "COMPLETADA":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "RECHAZADA":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
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

  const openDetailModal = (transaction: Transaccion) => {
    setSelectedTransaction(transaction);
    setIsDetailModalOpen(true);
  };

  const handleApprove = async () => {
    if (selectedTransaction && onApprove) {
      console.log(selectedTransaction)
        setSending(true);
      await onApprove(selectedTransaction.id);
      setSending(false);
      setIsDetailModalOpen(false);
      setIsApproveDialogOpen(false);
      setSelectedTransaction(null);
    }
  };

  const handleReject = () => {
    if (selectedTransaction && onReject) {
      onReject(selectedTransaction.id);
      setIsDetailModalOpen(false);
      setIsRejectDialogOpen(false);
      setSelectedTransaction(null);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transacciones Pendientes</CardTitle>
          <CardDescription>
            Gestiona las solicitudes de los usuarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No hay transacciones pendientes
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-none p-0">
        <CardContent className="p-0 sm:px-6">
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4  border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => openDetailModal(transaction)}
              >
                <div className="flex items-center space-x-4">
                  {/* Avatar del usuario */}
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={transaction.usuario.foto || "/placeholder.svg"}
                      alt={transaction.usuario.nombre}
                    />
                    <AvatarFallback>
                      {getInitials(transaction.usuario.nombre)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Información del usuario y transacción */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">
                        {transaction.usuario.nombre}
                      </p>
                      <Badge
                        variant={getStatusBadgeVariant(transaction.estado)}
                        className="text-xs"
                      >
                        {transaction.estado}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatDate(transaction.createdAt)}</span>
                      <div className="flex items-center gap-1">
                        {getTypeIcon(transaction.tipo)}
                        <span>
                          {transaction.tipo === "RETIRO"
                            ? "Retiro"
                            : "Depósito"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monto */}
                <div className="text-right hidden sm:block">
                  <p
                    className={`font-semibold ${getAmountColor(
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
                    <span className="text-muted-foreground">
                      ID: {transaction.id.slice(-8)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de detalles */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="md:max-w-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de la Transacción</DialogTitle>
            <DialogDescription>
              Revisa todos los detalles antes de aprobar o rechazar
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-6">
              {/* Información del usuario */}
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={selectedTransaction.usuario.foto || "/placeholder.svg"}
                    alt={selectedTransaction.usuario.nombre}
                  />
                  <AvatarFallback>
                    {getInitials(selectedTransaction.usuario.nombre)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {selectedTransaction.usuario.nombre}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Saldo actual: $
                    {selectedTransaction.usuario.saldo.toLocaleString("es-ES", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    BOB
                  </p>
                </div>
                <Badge
                  variant={getStatusBadgeVariant(selectedTransaction.estado)}
                >
                  {selectedTransaction.estado}
                </Badge>
              </div>

              {/* Detalles de la transacción */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 sm:p-4">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      ID de Transacción
                    </p>
                    <p className="font-mono text-sm break-all">
                      {selectedTransaction.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Monto</p>
                    <p
                      className={`font-semibold ${getAmountColor(
                        selectedTransaction.tipo
                      )}`}
                    >
                      {getAmountPrefix(selectedTransaction.tipo)}$
                      {selectedTransaction.monto.toLocaleString("es-ES", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      BOB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getTypeIcon(selectedTransaction.tipo)}
                  <div>
                    <p className="text-xs text-muted-foreground">Tipo</p>
                    <p className="text-sm font-medium">
                      {selectedTransaction.tipo === "RETIRO"
                        ? "Retiro de fondos"
                        : "Depósito de fondos"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha</p>
                    <p className="text-sm">
                      {formatDate(selectedTransaction.createdAt)}
                    </p>
                  </div>
                </div>
                {selectedTransaction.numeroTransaccion && (
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Número de Transacción
                      </p>
                      <p className="font-mono text-sm">
                        {selectedTransaction.numeroTransaccion}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Comprobante QR */}
              {selectedTransaction.qrUrl && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      QR de Pago del Usuario
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-center space-y-2">
                      <div className="w-16  h-16 mx-auto bg-muted rounded-lg items-center justify-center hidden sm:flex">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        QR de pago del usuario disponible
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsImageModalOpen(true)}
                        className="w-full"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver QR de Pago
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDetailModalOpen(false)}
            >
              Cerrar
            </Button>
            {selectedTransaction?.estado === "PENDIENTE" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => setIsRejectDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Rechazar
                </Button>
                <Button
                  onClick={() => {
                    if (selectedTransaction?.tipo === "RETIRO") {
                      setIsPaymentConfirmDialogOpen(true);
                    } else {
                      setIsApproveDialogOpen(true);
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Aprobar
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para ver imagen completa */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>QR de Pago del Usuario</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {selectedTransaction?.qrUrl && (
              <img
                src={selectedTransaction.qrUrl || "/placeholder.svg"}
                alt="QR de pago del usuario"
                className="max-w-full max-h-[70vh] object-contain rounded-lg border"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para aprobar */}
      <AlertDialog
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Aprobar transacción?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción aprobará la transacción de{" "}
              <span className="font-semibold">
                $
                {selectedTransaction?.monto.toLocaleString("es-ES", {
                  minimumFractionDigits: 2,
                })}{" "}
                BOB
              </span>{" "}
              para{" "}
              <span className="font-semibold">
                {selectedTransaction?.usuario.nombre}
              </span>
              . Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              className="bg-gray-950 hover:bg-gray-900"
            >
              Aprobar Transacción
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de confirmación para rechazar */}
      <AlertDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Rechazar transacción?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción rechazará la transacción de{" "}
              <span className="font-semibold">
                $
                {selectedTransaction?.monto.toLocaleString("es-ES", {
                  minimumFractionDigits: 2,
                })}{" "}
                BOB
              </span>{" "}
              para{" "}
              <span className="font-semibold">
                {selectedTransaction?.usuario.nombre}
              </span>
              . Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700"
            >
              Rechazar Transacción
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de confirmación de pago para retiros */}
      <AlertDialog
        open={isPaymentConfirmDialogOpen}
        onOpenChange={setIsPaymentConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Ya realizaste el pago?</AlertDialogTitle>
            <AlertDialogDescription>
              Antes de aprobar este retiro de{" "}
              <span className="font-semibold">
                $
                {selectedTransaction?.monto.toLocaleString("es-ES", {
                  minimumFractionDigits: 2,
                })}{" "}
                BOB
              </span>{" "}
              para{" "}
              <span className="font-semibold">
                {selectedTransaction?.usuario.nombre}
              </span>
              , confirma que ya has realizado el pago al usuario.
              <br />
              <br />
              <strong>
                Debes utilizar el QR de pago del usuario para realizar el pago.
              </strong>
              <br />
              <br />
              <strong>¿Ya pagaste al usuario?</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={sending}>
              No, aún no he pagado
            </AlertDialogCancel>
            <Button
              disabled={sending}
              onClick={async () => {
                setSending(true);
                await onApprove?.(selectedTransaction?.id || "");
                setIsPaymentConfirmDialogOpen(false);
                setSending(false);
                setSelectedTransaction(null);
                setIsDetailModalOpen(false);
              }}
              className="bg-gray-900 hover:bg-gray-700"
            >
              Sí, ya pagué al usuario
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
