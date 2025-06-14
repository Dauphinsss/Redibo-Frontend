"use client";

import React, { useState, useRef, useEffect } from "react";
import { getCarById } from "@/app/reserva/services/services_reserva";
import { Solicitud } from "@/app/reserva/interface/NotificacionSolicitud_Recode";
import { Button } from "@/components/ui/button";
import { Conductor } from "../../SeleccionarConductores_7-bits";
import { API_URL } from "@/utils/bakend";
import FechasAlquiler from "../../componentes_MostrarCobertura_Recode/filtroIni";
import PrecioDesglosado from "@/app/reserva/components/componentes_MostrarCobertura_Recode/precioDesglosado";
import TablaCondicionesVisual_Recode from "@/app/reserva/components/componentes_CondicionesDeUsoAutoVisual/TablaCondicionesVisual_Recode";
import TablaCoberturas from "../../componentes_MostrarCobertura_Recode/tablaCoberShow";
import NotificacionEnvioExitoso_recode from "./Notificacion_envio_exitoso_Recode";
import SeleccionarConductores from "../../SeleccionarConductores_7-bits";
import { set } from "date-fns";
import FormularioPago from "./formulario-pago"
import FormularioGarantia from "./formulario-garantia"
import { useRouter } from 'next/navigation'
import { useVerifyReservation } from "@/app/reserva/hooks/useVififyReservation";
import VehicleUnavailableModal from "../../VehicleUnavailableModal";


interface Props {
  id_carro: number;
  onSolicitudExitosa: () => void;
  onNuevaNotificacion?: (notificacion: {
    id: string;
    tipo: 'host' | 'renter';
    mensaje: string;
    fecha: string;
    datos: {
      nombreUsuario?: string;
      nombreHost?: string;
      marcaVehiculo: string;
      modeloVehiculo: string;
      fechaInicio: string;
      fechaFin: string;
      lugarRecogida: string;
      lugarDevolucion: string;
    };
    estado?: string;
  }) => void;
}

export default function FormularioSolicitud({
  id_carro,
  onSolicitudExitosa,
  onNuevaNotificacion
}: Props) {
  const router = useRouter();
  const verifyReservationMutation = useVerifyReservation();
  const [renterNombre, setRenterNombre] = useState("");
  const [renterEmail, setRenterEmail] = useState("");
  const [hostNombre, setHostNombre] = useState("");
  const [hostEmail, setHostEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fechas, setFechas] = useState<{ inicio: string; fin: string }>({ inicio: "", fin: "" });
  const [precioEstimado, setPrecioEstimado] = useState(0);
  const [datosAuto, setDatosAuto] = useState<{ modelo: string; marca: string; precio_por_dia: number; host: { id: number } } | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showGarantiaModal, setShowGarantiaModal] = useState(false);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [conductoresSeleccionados, setConductoresSeleccionados] = useState<number[]>([]);

  // Cargar todos los datos necesarios
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const autoData = await getCarById(id_carro.toString());
        if (autoData) {
          setDatosAuto({
            modelo: autoData.modelo,
            marca: autoData.marca,
            precio_por_dia: autoData.precio,
            host: { id: autoData.idHost }
          });
          setHostNombre(autoData.nombreHost || "");
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError("Error al cargar información del vehículo");
      }
    };
    cargarDatos();
  }, [id_carro]);

  const handleEnviarSolicitud = async () => {
    setError(null);
    const conductoresSeleccionadosNombres = conductoresSeleccionados.map (id => {
      const conductor = conductores.find(conductor => conductor.id === id);
      return conductor ? conductor.nombre : "";
    })
    
    localStorage.setItem('conductores_seleccionados', JSON.stringify(conductoresSeleccionadosNombres));

    if (!renterNombre || !renterEmail) {
      setError("Por favor completa tus datos de contacto");
      return;
    }

    if (!fechas.inicio || !fechas.fin) {
      setError("Por favor selecciona fechas válidas");
      return;
    }

    if (!datosAuto) {
      setError("No se encontraron datos del vehículo");
      return;
    }

    setLoading(true);

    // Crear notificaciones
    const fechaActual = new Date().toLocaleString();
    const fechaInicioFormatted = new Date(fechas.inicio).toLocaleDateString();
    const fechaFinFormatted = new Date(fechas.fin).toLocaleDateString();

    const notificacionRenter = {
      id: `notif-${Date.now()}`,
      tipo: 'renter' as const,
      mensaje: 'Solicitud enviada con éxito',
      fecha: fechaActual,
      datos: {
        nombreHost: hostNombre,
        marcaVehiculo: datosAuto.marca,
        modeloVehiculo: datosAuto.modelo,
        fechaInicio: fechaInicioFormatted,
        fechaFin: fechaFinFormatted,
        lugarRecogida: "Cochabamba",
        lugarDevolucion: "Cochabamba"
      },
      estado: 'enviado'
    };

    const notificacionHost = {
      id: `notif-${Date.now() + 1}`,
      tipo: 'host' as const,
      mensaje: 'Nueva solicitud de alquiler',
      fecha: fechaActual,
      datos: {
        nombreUsuario: renterNombre,
        marcaVehiculo: datosAuto.marca,
        modeloVehiculo: datosAuto.modelo,
        fechaInicio: fechaInicioFormatted,
        fechaFin: fechaFinFormatted,
        lugarRecogida: "Cochabamba",
        lugarDevolucion: "Cochabamba"
      },
      estado: 'pendiente'
    };


    //Solicitud para insertar
    try {
      const verficationResul = await verifyReservationMutation.mutateAsync({
        carId: id_carro,
        starDate: fechas.inicio,
        endDate: fechas.fin,
      })

      if (!verficationResul.available) {
        setShowUnavailableModal(true);
        return
      }

      const solicitud: Solicitud = {
        fecha: new Date().toISOString(),
        hostNombre,
        renterNombre,
        modelo: datosAuto.modelo,
        marca: datosAuto.marca,
        precio: precioEstimado,
        fechaRecogida: fechas.inicio,
        fechaDevolucion: fechas.fin,
        lugarRecogida: "Cochabamba",
        lugarDevolucion: "Cochabamba",
        renterEmail,
        hostEmail,
        id_renter: 4,
        id_host: datosAuto.host.id,
      };

      const response = await fetch(
        "https://search-car-backend.vercel.app/correoHost",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(solicitud),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        //throw new Error(errorData?.message || `Error HTTP ${response.status}`);
      }

      // Enviar notificaciones a la campana
      if (onNuevaNotificacion) {
        onNuevaNotificacion(notificacionRenter);
        onNuevaNotificacion(notificacionHost);
      }

      setShowNotification(true);
      onSolicitudExitosa();
    } catch (e) {
      console.error("Error al enviar solicitud:", e);
      setError(e instanceof Error ? e.message : "Error desconocido");

      if (onNuevaNotificacion) {
        onNuevaNotificacion({
          id: `notif-err-${Date.now()}`,
          tipo: 'renter',
          mensaje: 'Error al enviar solicitud',
          fecha: new Date().toLocaleString(),
          datos: {
            marcaVehiculo: datosAuto.marca,
            modeloVehiculo: datosAuto.modelo,
            fechaInicio: fechaInicioFormatted,
            fechaFin: fechaFinFormatted,
            lugarRecogida: "Cochabamba",
            lugarDevolucion: "Cochabamba"
          },
          estado: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fechas.inicio && fechas.fin && datosAuto?.precio_por_dia) {
      try {
        const fechaInicio = new Date(fechas.inicio);
        const fechaFin = new Date(fechas.fin);

        if (fechaFin <= fechaInicio) {
          setError("La fecha de fin debe ser posterior a la de inicio");
          return;
        }

        const diffTime = Math.abs(fechaFin.getTime() - fechaInicio.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const total = diffDays * datosAuto.precio_por_dia;

        setPrecioEstimado(total);
        setError(null);
      } catch (error) {
        console.error("Error al calcular precio:", error);
        setError("Error al calcular el precio. Verifica las fechas.");
      }
    }
  }, [fechas, datosAuto]);

  useEffect(() => {
    const fetchConductores = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(`${API_URL}/api/conductores-asociados`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setConductores(data.conductores || []);

      } catch (error) {
        setError("Error al cargar la lista de conductores");
        console.error("Error al cargar conductores:", error);
        setConductores([]);
      }
    };
    fetchConductores();
  }, []);

  const handleRedirect = () => {
    const searchParams = new URLSearchParams({
      fechaInicio: fechas.inicio,
      fechaFin: fechas.fin,
      precio: precioEstimado.toString()
    });
    
    
    router.push(`/vistaPago/${id_carro}?${searchParams.toString()}`);
    () => setShowNotification(false)
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* 1. Sección de Fechas */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Selecciona tus fechas</h2>
        <FechasAlquiler onFechasSeleccionadas={setFechas} />
      </div>

      {/* 2. Sección de Coberturas */}
      <div className="bg-white p-4 rounded-lg shadow">
        <TablaCoberturas id_carro={id_carro} />
      </div>

      {/* 3. Precio Desglosado */}
      {fechas.inicio && fechas.fin && (
        <div className="bg-white p-4 rounded-lg shadow">
          <PrecioDesglosado
            id_carro={id_carro}
            fechas={fechas}
            onPrecioCalculado={(precio) => setPrecioEstimado(precio)}
          />
        </div>
      )}

      {/* 4. Tabla de Condiciones */}
      <TablaCondicionesVisual_Recode
        id_carro={id_carro}
      />

      {/* 4.1. Seleccionar Conductor - 7-bits */}
      <SeleccionarConductores
        conductores={conductores}
        seleccionados={conductoresSeleccionados}
        onChange={setConductoresSeleccionados}
      />

      {/* 5. Formulario de contacto */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Información de contacto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tu nombre*</label>
            <input
              type="text"
              title="Tu nombre completo"
              placeholder="Ej. Juan Pérez"
              value={renterNombre}
              onChange={(e) => setRenterNombre(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tu email*</label>
            <input
              type="email"
              title="Tu correo electrónico"
              placeholder="Ej. juan@email.com"
              value={renterEmail}
              onChange={(e) => setRenterEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nombre del dueño</label>
            <input
              type="text"
              title="Nombre del dueño"
              placeholder="Ej. Ana López"
              value={hostNombre}
              onChange={(e) => setHostNombre(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email del dueño</label>
            <input
              type="email"
              title="Correo del dueño"
              placeholder="Ej. ana@email.com"
              value={hostEmail}
              onChange={(e) => setHostEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* 6. Resumen y botón */}
      <div className="bg-white p-4 rounded-lg shadow">
        {error && <div className="text-black mb-4">{error}</div>}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-semibold">Total estimado: {precioEstimado.toFixed(2)} BOB</p>
            <p className="text-sm text-gray-600">
              {fechas.inicio && fechas.fin
                ? `${new Date(fechas.inicio).toLocaleDateString()} - ${new Date(
                  fechas.fin
                ).toLocaleDateString()}`
                : "Selecciona fechas válidas"}
            </p>
          </div>
          
          {/* Mensaje de advertencia si no se seleccionaron conductores */}
          {conductoresSeleccionados.length === 0 && (
            <div className="text-yellow-600 text-sm mb-2">
            ⚠️ No ha seleccionado ningún conductor, ¿desea continuar?
            </div>
          )}

          {/* Botón de menú de reserva */}
          <div className="relative inline-block" ref={containerRef}>
            <Button
              onClick={handleEnviarSolicitud}
              //onClick={() => setShowMenu(!showMenu)}
              disabled={
                loading ||
                !fechas.inicio ||
                !fechas.fin ||
                !renterNombre ||
                !renterEmail ||
                verifyReservationMutation.isPending
              }
              className="bg-black hover:bg-gray-800 text-white px-6 py-2"
            >
              {loading || verifyReservationMutation.isPending ? "Enviando..." : "Reservar"}
            </Button>
            {/**showMenu && (
              <div
                ref={menuRef}
                className="absolute mt-2 z-50 w-48 bg-white rounded-md shadow-lg border border-gray-200"
              >
                <div
                  className="p-3 hover:bg-gray-100 cursor-pointer transition-colors rounded-t-md"
                  onClick={() => {
                    setShowMenu(false);
                    setShowPaymentModal(true);
                  }}
                >
                  <span className="font-medium">Pago de Reserva</span>
                </div>
                <div
                  className="p-3 hover:bg-gray-100 cursor-pointer transition-colors rounded-b-md"
                  onClick={() => {
                    setShowMenu(false);
                    setShowGarantiaModal(true);
                  }}
                >
                  <span className="font-medium">Pago por Garantía</span>
                </div>
              </div>
            )**/}
            {/* Modales */}
            {showPaymentModal && (
              <FormularioPago
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                carModel={datosAuto?.modelo ?? ""}
                carPrice={precioEstimado ?? 0}
                nombreUsuario={renterNombre}
              />
            )}

            {showGarantiaModal && (
              <FormularioGarantia
                isOpen={showGarantiaModal}
                usuario={renterNombre}
                onClose={() => setShowGarantiaModal(false)}
                carModel={datosAuto?.modelo ?? ""}
                garantiaPrice={precioEstimado ?? 0}
              />
            )}
          </div>
        </div>
      </div>
      <VehicleUnavailableModal
        isOpen={showUnavailableModal}
        onClose={() => setShowUnavailableModal(false)}
      />
      {/* Notificación de envío exitoso */}
      {showNotification && (
        <NotificacionEnvioExitoso_recode
          onClose={handleRedirect}
          hostNombre={hostNombre}
          fechaInicio={fechas.inicio}
          fechaFin={fechas.fin}
        />
      )}
    </div>
  );
}