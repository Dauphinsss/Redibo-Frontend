"use client";

import React, { useEffect, useState } from "react";
import { getCarById } from "@/app/reserva/services/services_reserva";
import { useEnviarSolicitudRecode } from "@/app/reserva/hooks/useEnviarNotif_Recode";

import { Button } from "@/components/ui/button";
import FechasAlquiler from "../../componentes_MostrarCobertura_Recode/filtroIni";
import PrecioDesglosado from "@/app/reserva/components/componentes_MostrarCobertura_Recode/precioDesglosado";
import TablaCoberturas from "../../componentes_MostrarCobertura_Recode/tablaCoberShow";
import TablaCondicionesVisual_Recode from "@/app/reserva/components/componentes_CondicionesDeUsoAutoVisual/TablaCondicionesVisual_Recode";
import NotificacionEnvioExitoso from "./Notificacion_envio_exitoso_Recode";

import { AutoDetails_interface_Recode } from "@/app/reserva/interface/AutoDetails_interface_Recode";
import { SolicitudRecodePost } from "@/app/reserva/interface/EnviarGuardarNotif_Recode";
import { transformAutoDetails_Recode } from "@/app/reserva/utils/transformAutoDetails_Recode";

import { useObtenerNotif } from "@/app/reserva/hooks/useObtenerNotif_Recode";


interface Props {
  id_carro: number;
  onSolicitudExitosa: () => void;
  onNuevaNotificacion?: (notificacion: any) => void;
}

export default function FormularioSolicitud({
  id_carro,
  onSolicitudExitosa,
  onNuevaNotificacion,
}: Props) {
  const [auto, setAuto] = useState<AutoDetails_interface_Recode | null>(null);
  const [fechas, setFechas] = useState({ inicio: "", fin: "" });
  const [precioEstimado, setPrecioEstimado] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [renterNombre, setRenterNombre] = useState("");
  const [renterEmail, setRenterEmail] = useState("");
  const [hostNombre, setHostNombre] = useState("");
  const [hostEmail, setHostEmail] = useState("");

  const { enviarSolicitud, cargando, error } = useEnviarSolicitudRecode();
  const { fetchNotif } = useObtenerNotif();

  // Carga los datos del auto
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const carData = await getCarById(id_carro.toString());
        if (carData) {
          setAuto(carData);
          setHostNombre(carData.nombreHost || "");
        }
        const autoTransformado = transformAutoDetails_Recode(carData);
        setAuto(autoTransformado);
      } catch {
        setFormError("Error al cargar información del vehículo");
      }
    };
    fetchCarData();
  }, [id_carro]);
  
  

  // Cálculo del precio estimado
  useEffect(() => {
    if (fechas.inicio && fechas.fin && auto?.precio) {
      const start = new Date(fechas.inicio);
      const end = new Date(fechas.fin);
      if (end <= start) {
        setFormError("La fecha de fin debe ser posterior a la de inicio");
        return;
      }

      const dias = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      setPrecioEstimado(dias * auto.precio);
      setFormError(null);
    }
  }, [fechas, auto]);

  const formatFecha = (fecha: string) =>
    new Intl.DateTimeFormat("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(fecha));

  const handleEnviar = async () => {
    if (!renterNombre || !renterEmail || !fechas.inicio || !fechas.fin || !auto) {
      setFormError("Por favor completa todos los campos requeridos");
      return;
    }

    const solicitud: SolicitudRecodePost = {
      fecha: new Date().toISOString(),
      hostNombre,
      renterNombre,
      modelo: auto.modelo,
      marca: auto.marca,
      precio: precioEstimado.toString(),
      fechaRecogida: formatFecha(fechas.inicio),
      fechaDevolucion: formatFecha(fechas.fin),
      lugarRecogida: "Cochabamba",
      lugarDevolucion: "Cochabamba",
      renterEmail,
      hostEmail,
      id_renter: 4,
      id_host: auto.idHost, 
    };

    console.log(auto);
    await enviarSolicitud(solicitud);
    console.log("Solicitud enviada:", solicitud);
    const nuevasNotif = await fetchNotif(auto.idHost);
    console.log("Notificaciones reales del host:", nuevasNotif);

    if (onNuevaNotificacion) {
      const now = new Date().toLocaleString();
      const fechaInicio = new Date(fechas.inicio).toLocaleDateString();
      const fechaFin = new Date(fechas.fin).toLocaleDateString();

      onNuevaNotificacion({
        id: `notif-${Date.now()}`,
        tipo: "renter",
        mensaje: "Solicitud enviada con éxito",
        fecha: now,
        datos: {
          nombreHost: auto.nombreHost,
          marcaVehiculo: auto.marca,
          modeloVehiculo: auto.modelo,
          fechaInicio,
          fechaFin,
          lugarRecogida: "Cochabamba",
          lugarDevolucion: "Cochabamba",
        },
        estado: "enviado",
      });

      if (onNuevaNotificacion && nuevasNotif.length > 0) {
        onNuevaNotificacion({
          id: nuevasNotif[0].id,
          tipo: "host",
          mensaje: "Nueva solicitud de alquiler",
          fecha: nuevasNotif[0].fecha,
          datos: {
            nombreUsuario: renterNombre,
            marcaVehiculo: auto.marca,
            modeloVehiculo: auto.modelo,
            fechaInicio,
            fechaFin,
            lugarRecogida: "Cochabamba",
            lugarDevolucion: "Cochabamba",
          },
          estado: nuevasNotif[0].estado ? "enviado" : "pendiente",
        });
      }
    }

    if (!error) {
      setShowNotification(true);
      onSolicitudExitosa();
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <section className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Selecciona tus fechas</h2>
        <FechasAlquiler onFechasSeleccionadas={setFechas} />
      </section>

      <section className="bg-white p-4 rounded-lg shadow">
        <TablaCoberturas id_carro={id_carro} />
      </section>

      {fechas.inicio && fechas.fin && (
        <section className="bg-white p-4 rounded-lg shadow">
          <PrecioDesglosado
            id_carro={id_carro}
            fechas={fechas}
            onPrecioCalculado={setPrecioEstimado}
          />
        </section>
      )}

      <TablaCondicionesVisual_Recode id_carro={id_carro} />

      <section className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Información de contacto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Tu nombre*" value={renterNombre} onChange={(e) => setRenterNombre(e.target.value)} className="w-full p-2 border rounded" />
          <input type="email" placeholder="Tu email*" value={renterEmail} onChange={(e) => setRenterEmail(e.target.value)} className="w-full p-2 border rounded" />
          <input type="text" placeholder="Nombre del dueño" value={hostNombre} onChange={(e) => setHostNombre(e.target.value)} className="w-full p-2 border rounded" />
          <input type="email" placeholder="Email del dueño" value={hostEmail} onChange={(e) => setHostEmail(e.target.value)} className="w-full p-2 border rounded" />
        </div>
      </section>

      <section className="bg-white p-4 rounded-lg shadow">
        {(formError || error) && (
          <div className="text-red-600 mb-4">{formError || error}</div>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-semibold">Total estimado: {precioEstimado.toFixed(2)} BOB</p>
            <p className="text-sm text-gray-600">
              {fechas.inicio && fechas.fin
                ? `${new Date(fechas.inicio).toLocaleDateString()} - ${new Date(fechas.fin).toLocaleDateString()}`
                : "Selecciona fechas válidas"}
            </p>
          </div>
          <Button
            onClick={handleEnviar}
            disabled={cargando || !fechas.inicio || !fechas.fin || !renterNombre || !renterEmail}
            className="bg-black hover:bg-gray-800 text-white px-6 py-2"
          >
            {cargando ? "Enviando..." : "Confirmar reserva"}
          </Button>
        </div>
      </section>

      {showNotification && (
        <NotificacionEnvioExitoso
          onClose={() => setShowNotification(false)}
          hostNombre={hostNombre}
          fechaInicio={fechas.inicio}
          fechaFin={fechas.fin}
        />
      )}
    </div>
  );
}
