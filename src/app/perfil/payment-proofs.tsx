import React, { useState, useEffect } from 'react';
import axios from "axios";
import { API_URL } from "@/utils/bakend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {  Receipt, TrendingDown, TrendingUp, Clock, CheckCircle, XCircle, Calendar, DollarSign, Hash, Car, Download, Loader2, AlertCircle, Mail, CreditCard } from "lucide-react";

type EstadoOrden = "PENDIENTE" | "PROCESANDO" | "COMPLETADO" | "CANCELADO";

interface OrdenPago {
  id: number;
  codigo: string;
  monto_a_pagar: number;
  fecha_de_emision: string;
  estado: EstadoOrden;
  host: {
    id?: number;
    nombre: string;
    foto?: string;
    correo?: string;
  };
  renter: {
    id?: number;
    nombre: string;
    foto?: string;
    correo?: string;
  };
  carro: {
    id?: number;
    marca: string;
    modelo: string;
    año?: number;
    placa?: string;
  };
  ComprobanteDePago: Array<{
    id: number;
    fecha_emision: string;
    numero_transaccion: string;
    monto: number;
  }>;
}

type TipoTransaccion = "RETIRO" | "SUBIDA";
type EstadoTransaccion = "PENDIENTE" | "COMPLETADA" | "RECHAZADA";

interface Transaccion {
  id: string;
  monto: number;
  tipo: TipoTransaccion;
  estado: EstadoTransaccion;
  numeroTransaccion: string | null;
  createdAt: string;
  usuario: {
    id?: number;
    nombre: string;
    foto?: string;
    correo?: string;
  };
}

type TabType = "ordenes" | "retiros" | "ingresos";

export function ComprobantesInfo() {
  const [activeTab, setActiveTab] = useState<TabType>("ordenes");
  const [selectedOrder, setSelectedOrder] = useState<OrdenPago | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaccion | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  
  const [ordenes, setOrdenes] = useState<OrdenPago[]>([]);
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  
  const [loadingOrdenes, setLoadingOrdenes] = useState(false);
  const [loadingTransacciones, setLoadingTransacciones] = useState(false);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const [loadingTransactionDetails, setLoadingTransactionDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrdenes = async () => {
    setLoadingOrdenes(true);
    setError(null);

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("No se encontró token de autenticación");
        return;
      }

      const response = await axios.get(`${API_URL}/api/ordenes-completadas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrdenes(response.data);
    } catch (err) {
      console.error("Error al obtener órdenes de pago:", err);
      setError("Error al cargar las órdenes de pago");
    } finally {
      setLoadingOrdenes(false);
    }
  };

  const fetchTransacciones = async (tipo: 'RETIRO' | 'SUBIDA') => {
    setLoadingTransacciones(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("No se encontró token de autenticación");
        return;
      }

      const response = await axios.get(`${API_URL}/api/transacciones-completadas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          tipo: tipo
        }
      });

      setTransacciones(response.data);
    } catch (err) {
      console.error("Error al obtener transacciones:", err);
      setError("Error al cargar las transacciones");
    } finally {
      setLoadingTransacciones(false);
    }
  };

  const fetchOrderDetails = async (ordenId: number) => {
    setLoadingOrderDetails(true);
    
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        console.error("No se encontró token de autenticación");
        return;
      }

      const response = await axios.get(`${API_URL}/api/orden/${ordenId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectedOrder(response.data);
    } catch (err) {
      console.error("Error al obtener detalles de la orden:", err);
      // Si falla, usamos los datos básicos que ya tenemos
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  const fetchTransactionDetails = async (transaccionId: string) => {
    setLoadingTransactionDetails(true);
    
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        console.error("No se encontró token de autenticación");
        return;
      }

      const response = await axios.get(`${API_URL}/api/transaccion/${transaccionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectedTransaction(response.data);
    } catch (err) {
      console.error("Error al obtener detalles de la transacción:", err);
      // Si falla, usamos los datos básicos que ya tenemos
    } finally {
      setLoadingTransactionDetails(false);
    }
  };

  // Función para descargar PDF desde el backend
  const downloadOrderPDF = async (orden: OrdenPago) => {
    try {
        setLoadingOrderDetails(true);
        const token = localStorage.getItem("auth_token");
        
        const response = await axios.get(`${API_URL}/api/orden/${orden.id}/pdf`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        responseType: 'blob'
        });
        
        // Crear y descargar el archivo
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `comprobante-orden-${orden.codigo}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error('Error al descargar PDF:', error);
        setError('Error al generar el PDF del comprobante');
    } finally {
        setLoadingOrderDetails(false);
    }
  };

  const downloadTransactionPDF = async (transaction: Transaccion) => {
    try {
        setLoadingTransactionDetails(true);
        const token = localStorage.getItem("auth_token");
        
        const response = await axios.get(`${API_URL}/api/transaccion/${transaction.id}/pdf`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        responseType: 'blob'
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `comprobante-transaccion-${transaction.id.slice(-8)}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error('Error al descargar PDF:', error);
        setError('Error al generar el PDF del comprobante');
    } finally {
        setLoadingTransactionDetails(false);
    }
  };

  useEffect(() => {
    if (activeTab === "ordenes") {
      fetchOrdenes();
    } else if (activeTab === "retiros") {
      fetchTransacciones("RETIRO");
    } else if (activeTab === "ingresos") {
      fetchTransacciones("SUBIDA");
    }
  }, [activeTab]);

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

  const getOrderStatusIcon = (estado: EstadoOrden) => {
    switch (estado) {
      case "PENDIENTE":
        return <Clock className="w-4 h-4 text-gray-400" />;
      case "PROCESANDO":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "COMPLETADO":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "CANCELADO":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getOrderStatusBadgeVariant = (estado: EstadoOrden) => {
    switch (estado) {
      case "PENDIENTE":
        return "secondary";
      case "PROCESANDO":
        return "default";
      case "COMPLETADO":
        return "default";
      case "CANCELADO":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getTransactionStatusIcon = (estado: EstadoTransaccion) => {
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

  const getTransactionStatusBadgeVariant = (estado: EstadoTransaccion) => {
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const openOrderModal = async (order: OrdenPago) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
    // Cargar detalles completos de la orden
    await fetchOrderDetails(order.id);
  };

  const openTransactionModal = async (transaction: Transaccion) => {
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
    // Cargar detalles completos de la transacción
    await fetchTransactionDetails(transaction.id);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setError(null);
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="w-6 h-6 animate-spin mr-2" />
      <span className="text-muted-foreground">Cargando...</span>
    </div>
  );

  const ErrorMessage = () => (
    <div className="flex items-center justify-center py-8">
      <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
      <span className="text-red-600">{error}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="border rounded-lg">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Comprobantes de Pago</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona y descarga tus comprobantes de pago
          </p>
        </div>
        <div className="p-6">
          {/* Tabs de navegación */}
          <div className="flex flex-wrap gap-2 mb-6 p-1 bg-muted rounded-lg">
            <button
              onClick={() => handleTabChange("ordenes")}
              className={`flex-1 min-w-[120px] px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === "ordenes"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Pago de Orden
            </button>
            <button
              onClick={() => handleTabChange("retiros")}
              className={`flex-1 min-w-[120px] px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === "retiros"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Retiros Aprobados
            </button>
            <button
              onClick={() => handleTabChange("ingresos")}
              className={`flex-1 min-w-[120px] px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === "ingresos"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Ingreso Aprobados
            </button>
          </div>

          {/* Mostrar error si existe */}
          {error && <ErrorMessage />}

          {/* Contenido según el tab activo */}
          {!error && activeTab === "ordenes" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Órdenes de Pago</h3>
                <span className="text-sm text-muted-foreground">
                  {ordenes.length} comprobantes registrados
                </span>
              </div>
              
              {loadingOrdenes ? (
                <LoadingSpinner />
              ) : ordenes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No hay órdenes de pago completadas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ordenes.map((orden) => (
                    <div
                      key={orden.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => openOrderModal(orden)}
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={orden.renter.foto || "/placeholder.svg"}
                            alt={orden.renter.nombre}
                          />
                          <AvatarFallback>
                            {getInitials(orden.renter.nombre)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{orden.codigo}</p>
                            <Badge variant={getOrderStatusBadgeVariant(orden.estado)} className="text-xs">
                              {orden.estado}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{formatDate(orden.fecha_de_emision)}</span>
                            <div className="flex items-center gap-1">
                              <Car className="w-4 h-4" />
                              <span>{orden.carro.marca} {orden.carro.modelo}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right hidden sm:block">
                        <p className="font-semibold text-blue-600">
                          ${orden.monto_a_pagar.toLocaleString("es-ES", {
                            minimumFractionDigits: 2,
                          })} BOB
                        </p>
                        <div className="flex items-center justify-end gap-1 text-xs">
                          {getOrderStatusIcon(orden.estado)}
                          <span className="text-muted-foreground">
                            {orden.ComprobanteDePago.length > 0 ? 
                              `TXN: ${orden.ComprobanteDePago[0].numero_transaccion.slice(-6)}` :
                              "Sin comprobante"
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!error && (activeTab === "retiros" || activeTab === "ingresos") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {activeTab === "retiros" ? "Retiros Aprobados" : "Ingresos Aprobados"}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {transacciones.length} comprobantes registrados
                </span>
              </div>
              
              {loadingTransacciones ? (
                <LoadingSpinner />
              ) : transacciones.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No hay {activeTab === "retiros" ? "retiros" : "ingresos"} completados
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transacciones.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => openTransactionModal(transaction)}
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={transaction.usuario.foto || "/placeholder.svg"}
                            alt={transaction.usuario.nombre}
                          />
                          <AvatarFallback>
                            {getInitials(transaction.usuario.nombre)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{transaction.usuario.nombre}</p>
                            <Badge variant={getTransactionStatusBadgeVariant(transaction.estado)} className="text-xs">
                              {transaction.estado}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{formatDate(transaction.createdAt)}</span>
                            <div className="flex items-center gap-1">
                              {getTypeIcon(transaction.tipo)}
                              <span>
                                {transaction.tipo === "RETIRO" ? "Retiro" : "Depósito"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right hidden sm:block">
                        <p className={`font-semibold ${getAmountColor(transaction.tipo)}`}>
                          {getAmountPrefix(transaction.tipo)}$
                          {transaction.monto.toLocaleString("es-ES", {
                            minimumFractionDigits: 2,
                          })} BOB
                        </p>
                        <div className="flex items-center justify-end gap-1 text-xs">
                          {getTransactionStatusIcon(transaction.estado)}
                          <span className="text-muted-foreground">
                            ID: {transaction.id.slice(-8)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal para órdenes de pago */}
      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className="md:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de la Orden de Pago</DialogTitle>
            <DialogDescription>
              Información completa del comprobante de pago
            </DialogDescription>
          </DialogHeader>

          {loadingOrderDetails ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span className="text-muted-foreground">Cargando detalles...</span>
            </div>
          ) : selectedOrder ? (
            <div className="space-y-6">
              {/* Información de la orden */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Código de Orden</p>
                    <p className="font-semibold">{selectedOrder.codigo}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Monto</p>
                    <p className="font-semibold text-blue-600">
                      ${selectedOrder.monto_a_pagar.toLocaleString("es-ES", {
                        minimumFractionDigits: 2,
                      })} BOB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha de Emisión</p>
                    <p className="text-sm">{formatDate(selectedOrder.fecha_de_emision)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Vehículo</p>
                    <p className="text-sm">
                      {selectedOrder.carro.marca} {selectedOrder.carro.modelo}
                      {selectedOrder.carro.año && ` (${selectedOrder.carro.año})`}
                    </p>
                    {selectedOrder.carro.placa && (
                      <p className="text-xs text-muted-foreground">Placa: {selectedOrder.carro.placa}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Información de usuarios */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 p-4 border rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Propietario (Host)</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedOrder.host.foto} alt={selectedOrder.host.nombre} />
                      <AvatarFallback>{getInitials(selectedOrder.host.nombre)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{selectedOrder.host.nombre}</p>
                      {selectedOrder.host.correo && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span>{selectedOrder.host.correo}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 p-4 border rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Arrendatario</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedOrder.renter.foto} alt={selectedOrder.renter.nombre} />
                      <AvatarFallback>{getInitials(selectedOrder.renter.nombre)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{selectedOrder.renter.nombre}</p>
                      {selectedOrder.renter.correo && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span>{selectedOrder.renter.correo}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Comprobante de pago */}
              {selectedOrder.ComprobanteDePago.length > 0 && (
                <div className="p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="w-4 h-4" />
                    <h4 className="font-medium">Comprobante de Pago</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Número de Transacción:</span>
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {selectedOrder.ComprobanteDePago[0].numero_transaccion}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fecha de Pago:</span>
                      <span>{formatDate(selectedOrder.ComprobanteDePago[0].fecha_emision)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monto Pagado:</span>
                      <span className="font-semibold text-green-600">
                        ${selectedOrder.ComprobanteDePago[0].monto.toLocaleString("es-ES", {
                          minimumFractionDigits: 2,
                        })} BOB
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsOrderModalOpen(false)}>
                  Cerrar
                </Button>
                <Button 
                  className="flex items-center gap-2" 
                  onClick={() => downloadOrderPDF(selectedOrder)}
                  disabled={loadingOrderDetails}
                  >
                  {loadingOrderDetails ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                    Descargar PDF
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Modal para transacciones */}
      <Dialog open={isTransactionModalOpen} onOpenChange={setIsTransactionModalOpen}>
        <DialogContent className="md:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de la Transacción</DialogTitle>
            <DialogDescription>
              Información completa del comprobante de {selectedTransaction?.tipo === "RETIRO" ? "retiro" : "ingreso"}
            </DialogDescription>
          </DialogHeader>

          {loadingTransactionDetails ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span className="text-muted-foreground">Cargando detalles...</span>
            </div>
          ) : selectedTransaction ? (
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
                  <h3 className="font-semibold">{selectedTransaction.usuario.nombre}</h3>
                  {selectedTransaction.usuario.correo && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      <span>{selectedTransaction.usuario.correo}</span>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {selectedTransaction.tipo === "RETIRO" ? "Retiro de fondos" : "Ingreso de fondos"}
                  </p>
                </div>
                <Badge variant={getTransactionStatusBadgeVariant(selectedTransaction.estado)}>
                  {selectedTransaction.estado}
                </Badge>
              </div>

              {/* Detalles de la transacción */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">ID de Transacción</p>
                    <p className="font-mono text-sm">{selectedTransaction.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Monto</p>
                    <p className={`font-semibold ${getAmountColor(selectedTransaction.tipo)}`}>
                      {getAmountPrefix(selectedTransaction.tipo)}$
                      {selectedTransaction.monto.toLocaleString("es-ES", {
                        minimumFractionDigits: 2,
                      })} BOB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha</p>
                    <p className="text-sm">{formatDate(selectedTransaction.createdAt)}</p>
                  </div>
                </div>

                {selectedTransaction.numeroTransaccion && (
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Número de Transacción</p>
                      <p className="font-mono text-sm">{selectedTransaction.numeroTransaccion}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsTransactionModalOpen(false)}>
                  Cerrar
                </Button>
                <Button 
                  className="flex items-center gap-2" 
                  onClick={() => downloadTransactionPDF(selectedTransaction)}
                  disabled={loadingTransactionDetails}
                  >
                  {loadingTransactionDetails ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Descargar PDF
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}