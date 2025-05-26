"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  User,
  CreditCard,
  Calendar,
  Eye,
  Check,
  X,
} from "lucide-react";
import { API_URL } from "@/utils/bakend";
import axios from "axios";
import { toast } from "sonner";

interface DriverRequest {
  id: number;
  usuarioId: number;
  front: string;
  back: string;
  estado: string;
  categoria: string;
  numeroLicencia: string;
  fechaEmision: string;
  fechaVencimiento: string;
  createdAt: string;
  usuario: {
    nombre: string;
    foto: string;
  };
}

export default function DriverRequests() {
  const [selectedRequest, setSelectedRequest] = useState<DriverRequest | null>(
    null
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requests, setRequests] = useState<DriverRequest[]>();
  const [sending, setSending] = useState(false);

  const fetchRequests = async () => {
    try {
      const authToken = localStorage.getItem("auth_token");

      const response = await fetch(`${API_URL}/api/applications`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener solicitudes");
      }

      const data: DriverRequest[] = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
      setRequests([]);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleApprove = async (requestId: number) => {
    setSending(true);
    console.log(`Aprobar solicitud ${requestId}`);
    try {
      await axios.put(`${API_URL}/api/approve/${requestId}`);
      setIsDialogOpen(false);
      toast.success("Solicitud aprobada");
      fetchRequests();
    } catch (error) {
      console.error("Error al aprobar solicitud:", error);
    }
    setSending(false);
  };

  const handleReject = async(requestId: number) => {
    setSending(true);
    console.log(`Aprobar solicitud ${requestId}`);
    try {
      await axios.put(`${API_URL}/api/decline/${requestId}`);
      setIsDialogOpen(false);
      toast.success("Solicitud rechazada");
      fetchRequests();
    } catch (error) {
      console.error("Error al aprobar solicitud:", error);
    }
    setSending(false);
  };

  const openRequestDialog = (request: DriverRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  return (
    <div className=" p-4">
      <div className="mb-6">
        <p className="text-muted-foreground">
          {requests?.length ?? 0} solicitud
          {(requests?.length ?? 0) !== 1 ? "es" : ""} pendiente
          {(requests?.length ?? 0) !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(requests ?? []).map((request) => (
          <Card
            key={request.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => openRequestDialog(request)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={request.usuario.foto || "/placeholder.svg"}
                    alt={request.usuario.nombre}
                  />
                  <AvatarFallback>
                    {request.usuario.nombre
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">
                    {request.usuario.nombre}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    {formatDateShort(request.createdAt)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    Categoría {request.categoria}
                  </Badge>
                </div>
                <Badge variant="outline">{request.estado}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog para mostrar detalles */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className=" max-h-[90vh] overflow-y-auto md:max-w-4xl max-w-sm">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={selectedRequest.usuario.foto || "/placeholder.svg"}
                      alt={selectedRequest.usuario.nombre}
                    />
                    <AvatarFallback>
                      {selectedRequest.usuario.nombre
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  Solicitud de {selectedRequest.usuario.nombre}
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-6">
                {/* Información del usuario */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">Usuario ID:</span>
                      <span>{selectedRequest.usuarioId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="font-medium">Número de Licencia:</span>
                      <span>{selectedRequest.numeroLicencia}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        Categoría {selectedRequest.categoria}
                      </Badge>
                      <Badge variant="outline">{selectedRequest.estado}</Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">Fecha de Emisión:</span>
                      <span>
                        {formatDateShort(selectedRequest.fechaEmision)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">Fecha de Vencimiento:</span>
                      <span>
                        {formatDateShort(selectedRequest.fechaVencimiento)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      <span className="font-medium">Solicitado:</span>
                      <span>{formatDate(selectedRequest.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Imágenes de la licencia */}
                <div>
                  <h3 className="font-semibold mb-3">Documentos de Licencia</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium mb-2">Frente</p>
                      <div
                        className="relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedImage(selectedRequest.front)}
                      >
                        <img
                          src={selectedRequest.front || "/placeholder.svg"}
                          alt="Frente de licencia"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                          <Eye className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Reverso</p>
                      <div
                        className="relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedImage(selectedRequest.back)}
                      >
                        <img
                          src={selectedRequest.back || "/placeholder.svg"}
                          alt="Reverso de licencia"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                          <Eye className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="flex-1"
                    disabled={sending}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Aprobar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleReject(selectedRequest.id)}
                    className="flex-1"
                    disabled={sending}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Rechazar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para imagen completa */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-sm md:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Vista completa del documento</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="flex justify-center">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Documento completo"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
