"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEnviarSolicitudRecode } from "@/app/reserva/hooks/useEnviarNotif_Recode";
import { useObtenerNotif } from "@/app/reserva/hooks/useObtenerNotif_Recode";
import { useReservationData } from "@/app/reserva/hooks/useReservationData";
import { useSearchStore } from "@/app/busqueda/store/searchStore";

// Componentes UI
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FechasAlquiler from "../../componentes_MostrarCobertura_Recode/filtroIni";
import PrecioDesglosado from "@/app/reserva/components/componentes_MostrarCobertura_Recode/precioDesglosado";
import TablaCoberturas from "../../componentes_MostrarCobertura_Recode/tablaCoberShow";
import TablaCondicionesVisual_Recode from "@/app/reserva/components/componentes_CondicionesDeUsoAutoVisual/TablaCondicionesVisual_Recode";
import NotificacionEnvioExitoso from "./Notificacion_envio_exitoso_Recode";
import SeleccionarConductores, { Conductor } from "../../SeleccionarConductores_7-bits";
import FormularioPago from "./formulario-pago";
import FormularioGarantia from "./formulario-garantia";
import { Loader2 } from "lucide-react";

// Interfaces y Servicios
import { SolicitudRecodePost } from "@/app/reserva/interface/EnviarGuardarNotif_Recode";
import { toast } from "sonner";
import { getInsuranceByID } from "@/app/reserva/services/services_reserva";
import { SeguroEstructurado } from "@/app/reserva/interface/CoberturaForm_Interface_Recode";
import { Notificacion } from "@/app/reserva/interface/NotificacionSolicitud_Recode";

interface Props {
  id_carro: number;
  onSolicitudExitosa: () => void;
  onNuevaNotificacion: (notificacion: Notificacion | null) => void;
}

export default function FormularioSolicitud({
  id_carro,
  onSolicitudExitosa,
  
}: Props) {
  const router = useRouter();

  // --- HOOKS ---
  const { datosRenter, datosHost, datosAuto, conductores, isLoading: isLoadingData, error: dataError } = useReservationData(id_carro);
  const { enviarSolicitud, cargando: isSubmitting, error: submissionError } = useEnviarSolicitudRecode();
  const { fetchNotif } = useObtenerNotif();
  
  // Leemos el estado global de la búsqueda desde Zustand
  const { ciudad, fechaInicio, fechaFin, setFechas } = useSearchStore();

  // --- ESTADOS LOCALES ---
  const [precioEstimado, setPrecioEstimado] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showGarantiaModal, setShowGarantiaModal] = useState(false);
  const [conductoresSeleccionados, setConductoresSeleccionados] = useState<number[]>([]);
  const [segurosArray, setSegurosArray] = useState<SeguroEstructurado[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  // --- EFECTOS ---

  // Carga los seguros del vehículo
  useEffect(() => {
    const cargarSeguros = async () => {
      const seguros = await getInsuranceByID(id_carro.toString());
      if (seguros) {
        const segurosData = Array.isArray(seguros) ? seguros : [seguros];
        setSegurosArray(segurosData);
      }
    };
    cargarSeguros();
  }, [id_carro]);

  // Calcula el precio estimado cuando las fechas del store o los datos del auto cambian
  useEffect(() => {
    if (fechaInicio && fechaFin && datosAuto?.precio) {
      const start = new Date(fechaInicio);
      const end = new Date(fechaFin);
      if (end <= start) {
        toast.error("La fecha de fin debe ser posterior a la de inicio");
        return;
      }
      const dias = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      setPrecioEstimado(dias * datosAuto.precio);
    }
  }, [fechaInicio, fechaFin, datosAuto]);

  // --- MANEJADORES DE EVENTOS ---
  
  // Esta función se pasa a FechasAlquiler para que pueda actualizar el store global
  const handleFechasChange = (nuevasFechas: { inicio: string, fin: string }) => {
    setFechas(nuevasFechas.inicio, nuevasFechas.fin);
  };

  const formatFecha = (fecha: string) => new Intl.DateTimeFormat("es-BO", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }).format(new Date(fecha));

  const handleAuthenticatedAction = (action: () => void) => {
    if (!datosRenter) router.push("/login");
    else action();
  };

  const handleReserveWithoutPayment = async () => {
    handleAuthenticatedAction(async () => {
      if (!datosRenter || !datosHost || !datosAuto || !fechaInicio || !fechaFin || (conductores.length > 0 && conductoresSeleccionados.length === 0)) {
        toast.error("Faltan datos o selecciones para completar la reserva.");
        return;
      }
      setShowMenu(false);
      const solicitud: SolicitudRecodePost = {
        fecha: new Date().toLocaleDateString('es-ES'),
        hostNombre: datosHost.nombre,
        renterNombre: datosRenter.nombre,
        modelo: datosAuto.modelo,
        marca: datosAuto.marca,
        precio: precioEstimado.toString(),
        fechaRecogida: formatFecha(fechaInicio),
        fechaDevolucion: formatFecha(fechaFin),
        lugarRecogida: ciudad || "Cochabamba",
        lugarDevolucion: ciudad || "Cochabamba",
        renterEmail: datosRenter.correo,
        hostEmail: datosHost.correo,
        id_renter: datosRenter.id,
        id_host: datosHost.id,
      };
      try {
        await enviarSolicitud(solicitud);
        if (datosHost.id) await fetchNotif(datosHost.id);
        setShowNotification(true);
        onSolicitudExitosa();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "No se pudo enviar la solicitud");
      }
    });
  };

  const handleReserveClick = () => {
    if (!datosRenter) {
      toast.error("Debes iniciar sesión para poder reservar.");
      router.push("/login");
      return;
    }
    if (!fechaInicio || !fechaFin) {
      toast.error("Por favor, selecciona las fechas de tu reserva.");
      return;
    }
    if (conductores.length > 0 && conductoresSeleccionados.length === 0) {
      toast.error("Por favor, selecciona un conductor para continuar.");
      return;
    }
    setShowMenu(true);
  };

  if (isLoadingData) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /><p className="ml-4">Cargando...</p></div>;
  }
  
  const totalError = dataError || submissionError;
  if (totalError) {
    return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md"><h4 className="font-bold">Ha ocurrido un error</h4><p>{totalError}</p></div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto px-4">
      
      {/* Columna Izquierda: Contenido principal y botón */}
      <div className="flex-grow flex flex-col gap-6">
        <div className="space-y-6">
          <section className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Fechas de tu Reserva</h2>
            {/* Pasamos las props correctas a FechasAlquiler */}
            <FechasAlquiler
              onFechasSeleccionadas={handleFechasChange}
              initialStartDate={fechaInicio || null}
              initialEndDate={fechaFin || null}
              ciudad={ciudad || null}
            />
          </section>
          
          <section className="bg-white p-4 rounded-lg shadow">
            <TablaCondicionesVisual_Recode id_carro={id_carro} />
          </section>
          
          <section className="bg-white p-4 rounded-lg shadow">
            <SeleccionarConductores 
              isLoggedIn={!!datosRenter} 
              conductores={conductores} 
              seleccionados={conductoresSeleccionados} 
              onChange={setConductoresSeleccionados} 
            />
          </section>
        </div>

        <section className="bg-white p-4 rounded-lg shadow mt-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="font-semibold">Total estimado: {precioEstimado.toFixed(2)} BOB</p>
              <p className="text-sm text-gray-600">{fechaInicio && fechaFin ? `${new Date(fechaInicio).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} - ${new Date(fechaFin).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}` : "Selecciona fechas válidas"}</p>
            </div>
            
            <div className="relative inline-block">
              <Button onClick={handleReserveClick} disabled={isSubmitting} className="bg-black hover:bg-gray-800 text-white px-6 py-2">
                {isSubmitting ? "Procesando..." : "Reservar"}
              </Button>
              
              {showMenu && (
                <div ref={menuRef} className="absolute right-0 bottom-full mb-2 z-50 w-56 bg-white rounded-md shadow-lg border border-gray-200">
                    <div className="p-3 hover:bg-gray-100 cursor-pointer" onClick={handleReserveWithoutPayment}><span className="font-medium">Reservar sin Pago</span></div>
                    <Separator />
                    <div className="p-3 hover:bg-gray-100 cursor-pointer" onClick={() => { setShowMenu(false); handleAuthenticatedAction(() => setShowPaymentModal(true)); }}><span className="font-medium">Pago de Reserva</span></div>
                    <Separator />
                    <div className="p-3 hover:bg-gray-100 cursor-pointer" onClick={() => { setShowMenu(false); handleAuthenticatedAction(() => setShowGarantiaModal(true)); }}><span className="font-medium">Pago por Garantía</span></div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Columna Derecha: Resúmenes fijos */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="sticky top-8 space-y-6">
          {fechaInicio && fechaFin && (
            <section className="bg-white p-4 rounded-lg shadow">
              <PrecioDesglosado 
                id_carro={id_carro} 
                fechas={{ inicio: fechaInicio, fin: fechaFin }} 
                onPrecioCalculado={setPrecioEstimado} 
              />
            </section>
          )}
          <section className="bg-white p-4 rounded-lg shadow">
            {segurosArray.length > 0 && segurosArray.map((seguro) => (
              <TablaCoberturas
                key={seguro.id}
                tiposeguro={seguro.tiposeguro}
                nombreSeguro={seguro.Seguro.empresa}
              />
            ))}
          </section>
        </div>
      </div>
      
      {/* Modales */}
      {showPaymentModal && datosRenter && datosAuto && (
        <FormularioPago isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} carModel={datosAuto.modelo} carPrice={precioEstimado} nombreUsuario={datosRenter.nombre} />
      )}
      {showGarantiaModal && datosRenter && datosAuto && (
        <FormularioGarantia isOpen={showGarantiaModal} usuario={datosRenter.nombre} onClose={() => setShowGarantiaModal(false)} carModel={datosAuto.modelo} garantiaPrice={precioEstimado} />
      )}
      {showNotification && datosHost && (
        <NotificacionEnvioExitoso
          onClose={() => setShowNotification(false)}
          hostNombre={datosHost.nombre}
          fechaInicio={fechaInicio || ""}
          fechaFin={fechaFin || ""}
        />
      )}
    </div>
  );
}