"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/utils/bakend";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Interfaces para los tipos de datos
interface ProcessingOrder {
  codigo: string;
  monto_a_pagar: number;
  renter: string;
  host: string;
  fecha_emision: string | null;
}

// Actualizada para la estructura original que devuelve el backend
interface OrderDetail {
  id: number;
  codigo: string;
  id_usuario_host: number;
  id_usuario_renter: number;
  id_carro: number;
  fecha_de_emision: string;
  monto_a_pagar: number;
  estado: string;
  renter: {
    nombre: string;
    id: number;
  };
  host: {
    nombre: string;
    id: number;
  };
  ComprobanteDePago: Array<{
    id: number;
    numero_transaccion: string;
    fecha_emision: string;
  }>;
}

export function OrdersManagement() {
  const [processingOrders, setProcessingOrders] = useState<ProcessingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProcessingOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setError("No se encontró token de autenticación");
          return;
        }

        const response = await axios.get(`${API_URL}/api/processing-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProcessingOrders(response.data);
      } catch (err) {
        console.error("Error al obtener órdenes en procesamiento:", err);
        setError("Error al cargar las órdenes en procesamiento");
      } finally {
        setLoading(false);
      }
    };

    fetchProcessingOrders();
  }, []);

  const handleOrderClick = async (orderCode: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("No se encontró token de autenticación");
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/processing-order-details`, 
        { codigo: orderCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      
      console.log("Detalles recibidos:", response.data);
      setSelectedOrder(response.data);
      setDialogOpen(true);
    } catch (err) {
      console.error("Error al obtener detalles de la orden:", err);
      setError("Error al cargar los detalles de la orden");
    }
  };

  const handleAcceptOrder = async () => {
    if (!selectedOrder) return;

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("No se encontró token de autenticación");
        return;
      }

      await axios.post(
        `${API_URL}/api/admin/updatePaymentOrder`,
        { codigo_orden_pago: selectedOrder.codigo,
          estado: "COMPLETADO"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      // Cerrar el diálogo y actualizar la lista
      setDialogOpen(false);
      const updatedOrders = processingOrders.filter(
        order => order.codigo !== selectedOrder.codigo
      );
      setProcessingOrders(updatedOrders);
    } catch (err) {
      console.error("Error al aceptar la orden:", err);
      setError("Error al aceptar la orden");
    }
  };

  const handleRejectOrder = async () => {
    if (!selectedOrder) return;

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("No se encontró token de autenticación");
        return;
      }

      await axios.post(
        `${API_URL}/api/admin/updatePaymentOrder`,
        { codigo_orden_pago: selectedOrder.codigo,
          estado: "CANCELADO"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      // Cerrar el diálogo y actualizar la lista
      setDialogOpen(false);
      const updatedOrders = processingOrders.filter(
        order => order.codigo !== selectedOrder.codigo
      );
      setProcessingOrders(updatedOrders);
    } catch (err) {
      console.error("Error al rechazar la orden:", err);
      setError("Error al rechazar la orden");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";

    return new Date(dateString).toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Cargando órdenes de pago...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Gestión de Órdenes de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Código</TableHead>
                  <TableHead>Renter</TableHead>
                  <TableHead>Host</TableHead>
                  <TableHead>Monto a Pagar</TableHead>
                  <TableHead>Fecha de Emisión</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processingOrders.length > 0 ? (
                  processingOrders.map((order) => (
                    <TableRow
                      key={order.codigo}
                      className="border-b cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleOrderClick(order.codigo)}
                    >
                      <TableCell className="font-medium">{order.codigo}</TableCell>
                      <TableCell>{order.renter}</TableCell>
                      <TableCell>{order.host}</TableCell>
                      <TableCell>{formatCurrency(order.monto_a_pagar)}</TableCell>
                      <TableCell>{formatDate(order.fecha_emision)}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrderClick(order.codigo);
                          }}
                        >
                          Revisar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                      No hay órdenes de pago en procesamiento
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de detalles con la estructura original de la respuesta del backend */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Revisión de Orden de Pago</DialogTitle>
            <DialogDescription>
              Información detallada de la orden {selectedOrder?.codigo}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Código</h3>
                  <p className="text-gray-700">{selectedOrder.codigo}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Estado</h3>
                  <span className="px-2 py-1 rounded-full text-xs font-medium text-white bg-purple-600">
                    {selectedOrder.estado}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Monto Total</h3>
                  <p className="text-gray-700 font-bold">{formatCurrency(selectedOrder.monto_a_pagar)}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Fecha de Emisión</h3>
                  <p className="text-gray-700">{formatDate(selectedOrder.fecha_de_emision)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Cliente (Renter)</h3>
                  <p className="text-gray-700">
                    {selectedOrder.renter?.nombre} (ID: {selectedOrder.renter?.id})
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Propietario (Host)</h3>
                  <p className="text-gray-700">
                    {selectedOrder.host?.nombre} (ID: {selectedOrder.host?.id})
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">ID del Carro</h3>
                <p className="text-gray-700">{selectedOrder.id_carro}</p>
              </div>
              
              {selectedOrder.ComprobanteDePago && selectedOrder.ComprobanteDePago.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="font-medium">Comprobantes de Pago</h3>
                  <ul className="list-disc pl-5">
                    {selectedOrder.ComprobanteDePago.map((comprobante) => (
                      <li key={comprobante.id} className="text-gray-700">
                        #{comprobante.numero_transaccion} - {formatDate(comprobante.fecha_emision)}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="font-medium">Comprobantes de Pago</h3>
                  <p className="text-gray-500 italic">No hay comprobantes registrados</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button 
              variant="destructive"
              onClick={handleRejectOrder}
            >
              Rechazar
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleAcceptOrder}
            >
              Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}