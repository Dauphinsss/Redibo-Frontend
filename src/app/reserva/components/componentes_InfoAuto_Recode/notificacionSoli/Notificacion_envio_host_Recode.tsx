"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEnviarSolicitudRecode } from "@/app/reserva/hooks/useEnviarNotif_Recode";
import { useObtenerNotif } from "@/app/reserva/hooks/useObtenerNotif_Recode";
import { useReservationData } from "@/app/reserva/hooks/useReservationData";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FechasAlquiler from "../../componentes_MostrarCobertura_Recode/filtroIni";
import PrecioDesglosado from "@/app/reserva/components/componentes_MostrarCobertura_Recode/precioDesglosado";
import TablaCoberturas from "../../componentes_MostrarCobertura_Recode/tablaCoberShow";
import TablaCondicionesVisual_Recode from "@/app/reserva/components/componentes_CondicionesDeUsoAutoVisual/TablaCondicionesVisual_Recode";
import NotificacionEnvioExitoso from "./Notificacion_envio_exitoso_Recode";
import SeleccionarConductores from "../../SeleccionarConductores_7-bits";
import FormularioPago from "./formulario-pago";
import FormularioGarantia from "./formulario-garantia";

import { SolicitudRecodePost } from "@/app/reserva/interface/EnviarGuardarNotif_Recode";
import { Notificacion } from "@/app/reserva/interface/NotificacionSolicitud_Recode";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  id_carro: number;
  onSolicitudExitosa: () => void;
  onNuevaNotificacion?: (notificacion: Notificacion | null) => void;
}

export default function FormularioSolicitud({
  id_carro,
  onSolicitudExitosa,
  onNuevaNotificacion,
}: Props) {
  const router = useRouter();

  const { datosRenter, datosHost, datosAuto, conductores, isLoading: isLoadingData, error: dataError } = useReservationData(id_carro);
  
  const [fechas, setFechas] = useState({ inicio: "", fin: "" });
  const [precioEstimado, setPrecioEstimado] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showGarantiaModal, setShowGarantiaModal] = useState(false);
  const [conductoresSeleccionados, setConductoresSeleccionados] = useState<number[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  const { enviarSolicitud, cargando: isSubmitting, error: submissionError } = useEnviarSolicitudRecode();
  const { fetchNotif } = useObtenerNotif();

  useEffect(() => {
    if (fechas.inicio && fechas.fin && datosAuto?.precio) {
      const start = new Date(fechas.inicio);
      const end = new Date(fechas.fin);
      if (end <= start) {
        toast.error("La fecha de fin debe ser posterior a la de inicio");
        return;
      }
      const dias = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      setPrecioEstimado(dias * datosAuto.precio);
    }
  }, [fechas, datosAuto]);

  const formatFecha = (fecha: string) => new Intl.DateTimeFormat("es-BO", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }).format(new Date(fecha));

  const handleAuthenticatedAction = (action: () => void) => {
    if (!datosRenter) {
      router.push("/login");
    } else {
      action();
    }
  };

  const handleReserveWithoutPayment = async () => {
    handleAuthenticatedAction(async () => {
      // La validación principal ya se hizo en handleReserveClick, pero mantenemos esta por seguridad
      if (!datosRenter || !datosHost || !datosAuto || !fechas.inicio || !fechas.fin || (conductores.length > 0 && conductoresSeleccionados.length === 0)) {
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
          fechaRecogida: formatFecha(fechas.inicio),
          fechaDevolucion: formatFecha(fechas.fin),
          lugarRecogida: "Cochabamba",
          lugarDevolucion: "Cochabamba",
          renterEmail: datosRenter.correo,
          hostEmail: datosHost.correo,
          id_renter: datosRenter.id,
          id_host: datosHost.id,
      };

      try {
        await enviarSolicitud(solicitud);
        if (datosHost.id) {
          const nuevasNotif = await fetchNotif(datosHost.id);
          console.log("Notificaciones del host:", nuevasNotif);
        }
        setShowNotification(true);
        onSolicitudExitosa();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "No se pudo enviar la solicitud");
      }
    });
  };

  // --- LÓGICA DE VALIDACIÓN CENTRALIZADA ---
  const handleReserveClick = () => {
    // 1. Validar si el usuario ha iniciado sesión
    if (!datosRenter) {
      toast.error("Debes iniciar sesión para poder reservar.");
      router.push("/login");
      return;
    }
    
    // 2. Validar si se han seleccionado fechas
    if (!fechas.inicio || !fechas.fin) {
      toast.error("Por favor, selecciona las fechas de tu reserva.");
      return;
    }
    
    // 3. Validar si el usuario TIENE conductores registrados.
    if (conductores.length === 0) {
      toast.error("No tienes conductores asociados para realizar una reserva. Por favor, agrega uno en tu perfil.");
      return;
    }

    // 4. Validar si se ha seleccionado un conductor
    if (conductoresSeleccionados.length === 0) {
      toast.error("Por favor, selecciona un conductor para continuar.");
      return;
    }

    // 5. Si todo está bien, abre el menú
    setShowMenu(true);
  };

  if (isLoadingData) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /><p className="ml-4">Cargando...</p></div>;
  }
  
  const totalError = dataError || submissionError;
  if (totalError) {
      return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md">
                <h4 className="font-bold">Ha ocurrido un error</h4>
                <p>{totalError}</p>
            </div>
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto px-4">
      <section className="bg-white p-4 rounded-lg shadow"><h2 className="text-lg font-semibold mb-4">Selecciona tus fechas</h2><FechasAlquiler onFechasSeleccionadas={setFechas} /></section>
      <section className="bg-white p-4 rounded-lg shadow"><TablaCoberturas id_carro={id_carro} /></section>
      {fechas.inicio && fechas.fin && (<section className="bg-white p-4 rounded-lg shadow"><PrecioDesglosado id_carro={id_carro} fechas={fechas} onPrecioCalculado={setPrecioEstimado} /></section>)}
      <TablaCondicionesVisual_Recode id_carro={id_carro} />
      
      <SeleccionarConductores 
        isLoggedIn={!!datosRenter} 
        conductores={conductores} 
        seleccionados={conductoresSeleccionados} 
        onChange={setConductoresSeleccionados} 
      />
      
      <section className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-semibold">Total estimado: {precioEstimado.toFixed(2)} BOB</p>
            <p className="text-sm text-gray-600">{fechas.inicio && fechas.fin ? `${new Date(fechas.inicio).toLocaleDateString()} - ${new Date(fechas.fin).toLocaleDateString()}` : "Selecciona fechas válidas"}</p>
          </div>
          
          <div className="relative inline-block">
            <Button
              onClick={handleReserveClick}
              disabled={isSubmitting}
              className="bg-black hover:bg-gray-800 text-white px-6 py-2"
            >
              {isSubmitting ? "Procesando..." : "Reservar"}
            </Button>
            
            {showMenu && (
              <div ref={menuRef} className="absolute right-0 bottom-full mb-2 z-50 w-56 bg-white rounded-md shadow-lg border border-gray-200">
                <div className="p-3 hover:bg-gray-100 cursor-pointer" onClick={handleReserveWithoutPayment}>
                  <span className="font-medium">Reservar sin Pago</span>
                </div>
                <Separator />
                <div className="p-3 hover:bg-gray-100 cursor-pointer" onClick={() => { setShowMenu(false); handleAuthenticatedAction(() => setShowPaymentModal(true)); }}>
                  <span className="font-medium">Pago de Reserva</span>
                </div>
                <Separator />
                <div className="p-3 hover:bg-gray-100 cursor-pointer" onClick={() => { setShowMenu(false); handleAuthenticatedAction(() => setShowGarantiaModal(true)); }}>
                  <span className="font-medium">Pago por Garantía</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

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
          fechaInicio={fechas.inicio}
          fechaFin={fechas.fin}
        />
      )}
    </div>
  );
}