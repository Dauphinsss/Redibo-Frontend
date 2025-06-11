"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEnviarSolicitudRecode } from "@/app/reserva/hooks/useEnviarNotif_Recode";
import { useObtenerNotif } from "@/app/reserva/hooks/useObtenerNotif_Recode";
import { getCarById, getUsuarioById, getHostByCarId } from "@/app/reserva/services/services_reserva";

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

import { API_URL } from "@/utils/bakend";
import { UsuarioInterfazRecode } from "@/app/reserva/interface/Ususario_Interfaz_Recode";
import { SolicitudRecodePost } from "@/app/reserva/interface/EnviarGuardarNotif_Recode";
import { Notificacion } from "@/app/reserva/interface/NotificacionSolicitud_Recode";
import { Conductor } from "../../SeleccionarConductores_7-bits";
import { Loader2 } from "lucide-react";

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

  // Estados para los datos automáticos
  const [datosRenter, setDatosRenter] = useState<UsuarioInterfazRecode | null>(null);
  const [datosHost, setDatosHost] = useState<UsuarioInterfazRecode | null>(null);
  const [datosAuto, setDatosAuto] = useState<{ modelo: string; marca: string; precio: number } | null>(null);
  
  // Estados para el formulario y la UI
  const [fechas, setFechas] = useState({ inicio: "", fin: "" });
  const [precioEstimado, setPrecioEstimado] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Estados para la UI que te gusta
  const [showMenu, setShowMenu] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showGarantiaModal, setShowGarantiaModal] = useState(false);
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [conductoresSeleccionados, setConductoresSeleccionados] = useState<number[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  // Mantenemos tus hooks que ya funcionaban para enviar la solicitud
  const { enviarSolicitud, cargando: isSubmitting, error: submissionError } = useEnviarSolicitudRecode();
  const { fetchNotif } = useObtenerNotif();

  // Carga de datos automáticos (lógica que ya funciona)
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      setIsLoadingData(true);
      setFormError(null);
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setIsLoadingData(false);
        return;
      }
      try {
        const perfilResponse = await fetch(`${API_URL}/api/perfil`, { headers: { Authorization: `Bearer ${token}` } });
        if (!perfilResponse.ok) throw new Error("No se pudo verificar la sesión");
        const perfilData = await perfilResponse.json();
        const renterDetails = await getUsuarioById(perfilData.id);
        if (!renterDetails) throw new Error("No se pudo cargar tu perfil");
        setDatosRenter(renterDetails);

        const autoData = await getCarById(id_carro.toString());
        if (!autoData) throw new Error("No se encontró el vehículo.");
        setDatosAuto({ modelo: autoData.modelo, marca: autoData.marca, precio: autoData.precio });
        
        const hostData = await getHostByCarId(id_carro);
        if (!hostData) throw new Error("No se pudo obtener la información del propietario.");
        setDatosHost(hostData);
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "Error al cargar datos de la reserva");
      } finally {
        setIsLoadingData(false);
      }
    };
    cargarDatosIniciales();
  }, [id_carro]);

  // Cálculo del precio estimado (sin cambios)
  useEffect(() => {
    if (fechas.inicio && fechas.fin && datosAuto?.precio) {
      const start = new Date(fechas.inicio);
      const end = new Date(fechas.fin);
      if (end <= start) {
        setFormError("La fecha de fin debe ser posterior a la de inicio");
        return;
      }
      const dias = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      setPrecioEstimado(dias * datosAuto.precio);
      setFormError(null);
    }
  }, [fechas, datosAuto]);
  
  // Carga de conductores (sin cambios)
  useEffect(() => {
    const fetchConductores = async () => {
        const token = localStorage.getItem("auth_token");
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/api/conductores-asociados`, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setConductores(data.conductores || []);
        } catch (error) {
            setFormError("Error al cargar la lista de conductores");
        }
    };
    fetchConductores();
  }, []);

  const formatFecha = (fecha: string) => new Intl.DateTimeFormat("es-BO", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }).format(new Date(fecha));

  // Función para manejar la acción "Reservar sin Pago"
  const handleReserveWithoutPayment = async () => {
    setShowMenu(false); // Cierra el menú
    if (!datosRenter || !datosHost || !datosAuto || !fechas.inicio || !fechas.fin) {
      setFormError("Faltan datos para la reserva. Asegúrate de haber iniciado sesión y seleccionado fechas.");
      return;
    }

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

    await enviarSolicitud(solicitud);
    if (datosHost.id) {
        const nuevasNotif = await fetchNotif(datosHost.id);
        console.log("Notificaciones del host:", nuevasNotif);
        setShowNotification(true);
        onSolicitudExitosa();
    }
  };

  // Función para manejar el clic en el botón principal "Reservar"
  const handleToggleMenu = () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
    } else {
      setShowMenu(prev => !prev);
    }
  };

  if (isLoadingData) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /><p className="ml-4">Cargando...</p></div>;
  }
  
  if (formError || submissionError) {
      return <div className="text-red-600 p-4 bg-red-100 rounded-md">Error: {formError || submissionError}</div>
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* ... (Otras secciones del formulario se mantienen igual) ... */}
      <section className="bg-white p-4 rounded-lg shadow"><h2 className="text-lg font-semibold mb-4">Selecciona tus fechas</h2><FechasAlquiler onFechasSeleccionadas={setFechas} /></section>
      <section className="bg-white p-4 rounded-lg shadow"><TablaCoberturas id_carro={id_carro} /></section>
      {fechas.inicio && fechas.fin && (<section className="bg-white p-4 rounded-lg shadow"><PrecioDesglosado id_carro={id_carro} fechas={fechas} onPrecioCalculado={setPrecioEstimado} /></section>)}
      <TablaCondicionesVisual_Recode id_carro={id_carro} />
      <SeleccionarConductores conductores={conductores} seleccionados={conductoresSeleccionados} onChange={setConductoresSeleccionados} />
      
      {/* --- CAMBIO: Se restaura la sección del botón con menú desplegable --- */}
      <section className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-semibold">Total estimado: {precioEstimado.toFixed(2)} BOB</p>
            <p className="text-sm text-gray-600">{fechas.inicio && fechas.fin ? `${new Date(fechas.inicio).toLocaleDateString()} - ${new Date(fechas.fin).toLocaleDateString()}` : "Selecciona fechas válidas"}</p>
          </div>
          
          <div className="relative inline-block">
            <Button
              onClick={handleToggleMenu}
              disabled={isSubmitting || !fechas.inicio || !fechas.fin}
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
                <div className="p-3 hover:bg-gray-100 cursor-pointer" onClick={() => { setShowMenu(false); setShowPaymentModal(true); }}>
                  <span className="font-medium">Pago de Reserva</span>
                </div>
                <Separator />
                <div className="p-3 hover:bg-gray-100 cursor-pointer" onClick={() => { setShowMenu(false); setShowGarantiaModal(true); }}>
                  <span className="font-medium">Pago por Garantía</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Se mantienen los modales de pago */}
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