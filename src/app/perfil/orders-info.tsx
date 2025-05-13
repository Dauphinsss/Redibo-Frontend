"use client";

import { useState, useEffect } from "react";
import axios from "axios";
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

interface PaymentOrder {
  codigo: string;
  monto_a_pagar: number;
  estado: string;
  nombre: string;
  placa: string;
}

interface PaymentOrderDetail {
  codigo: string;
  monto_a_pagar: number;
  estado: string;
  nombre: string;
  telefono: string;
  correo: string;
  placa: string;
  marca: string;
  modelo: string;
}

export function ReservationsList() {
  const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<PaymentOrderDetail | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPaymentOrders = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setError("No se encontró token de autenticación");
          return;
        }

        // En producción, esta sería la llamada real a la API
        const response = await axios.get("http://localhost:4000/api/list-paymentOrder", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        setPaymentOrders(response.data);
      } catch (err) {
        console.error("Error al obtener órdenes de pago:", err);
        setError("Error al cargar las órdenes de pago");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentOrders();
  }, []);

  const handleOrderClick = async (orderCode: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("No se encontró token de autenticación");
        return;
      }

      const response = await axios.post("http://localhost:4000/api/paymentOrderbyCode", 
        { codigo: orderCode },  // Enviamos el código en el cuerpo
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      
      setSelectedOrder(response.data);
      setDialogOpen(true);
    } catch (err) {
      console.error("Error al obtener detalles de la orden:", err);
      setError("Error al cargar los detalles de la orden");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(amount);
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
          <CardTitle className="text-2xl">Órdenes de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre Propietario</TableHead>
                  <TableHead>Placa Vehículo</TableHead>
                  <TableHead>Monto de Reserva</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentOrders.length > 0 ? (
                  paymentOrders.map((order) => (
                    <TableRow 
                      key={order.codigo} 
                      className="border-b cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleOrderClick(order.codigo)}
                    >
                      <TableCell className="font-medium text-black-600">{order.codigo}</TableCell>
                      <TableCell>{order.nombre}</TableCell>
                      <TableCell>{order.placa}</TableCell>
                      <TableCell>{formatCurrency(order.monto_a_pagar)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                          order.estado === "CANCELADO" ? "bg-red-600" : 
                          order.estado === "PENDIENTE" ? "bg-yellow-600" : 
                          order.estado === "COMPLETADO" ? "bg-green-600" :
                          order.estado === "PROCESANDO" ? "bg-purple-600" : ""
                        }`}>
                          {order.estado}
                        </span>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button 
                          className="bg-black hover:bg-gray-800 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrderClick(order.codigo);
                          }}
                        >
                          Abrir Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                      No hay órdenes de pago disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de detalles */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles de la Orden de Pago</DialogTitle>
            <DialogDescription>
              Información detallada de la orden {selectedOrder?.codigo}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="font-medium">Información del Código</h3>
                <p className="text-gray-700">Código: <span className="font-bold">{selectedOrder.codigo}</span></p>
                <p className="text-gray-700">Estado: 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium text-white ${
                    selectedOrder.estado === "PAGADO" ? "bg-green-600" : 
                    selectedOrder.estado === "PENDIENTE" ? "bg-yellow-600" : "bg-red-600"
                  }`}>
                    {selectedOrder.estado}
                  </span>
                </p>
                <p className="text-gray-700">Monto a pagar: <span className="font-bold">{formatCurrency(selectedOrder.monto_a_pagar)}</span></p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Información del Propietario</h3>
                <p className="text-gray-700">Nombre: {selectedOrder.nombre}</p>
                <p className="text-gray-700">Correo: {selectedOrder.correo}</p>
                <p className="text-gray-700">Teléfono: {selectedOrder.telefono}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Información del Vehículo</h3>
                <p className="text-gray-700">Placa: {selectedOrder.placa}</p>
                <p className="text-gray-700">Marca: {selectedOrder.marca}</p>
                <p className="text-gray-700">Modelo: {selectedOrder.modelo}</p>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
            >
              Atrás
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={selectedOrder?.estado === "PAGADO"}
            >
              {selectedOrder?.estado === "PAGADO" ? "Pagado" : "Pagar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}