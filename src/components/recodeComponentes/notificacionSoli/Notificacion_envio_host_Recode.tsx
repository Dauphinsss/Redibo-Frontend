// src/components/recodeComponentes/condicionesDeUsoAutoVisual/FormularioSolicitud.tsx

"use client";

import React, { useState } from "react";
import { getCarById } from "@/service/services_Recode";
import { Solicitud } from "@/interface/NotificacionSolicitud_Recode";
import { Button } from "@/components/ui/button";

interface Props {
  id_carro: number;
  fechas: { inicio: string; fin: string };
  precioEstimado: number;
  onSolicitudExitosa: () => void;
}

export default function FormularioSolicitud({
  id_carro,
  fechas,
  precioEstimado,
  onSolicitudExitosa,
}: Props) {
  const [renterNombre, setRenterNombre] = useState("");
  const [renterEmail, setRenterEmail] = useState("");
  const [hostNombre, setHostNombre] = useState("");
  const [hostEmail, setHostEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnviarSolicitud = async () => {
    setError(null);
    if (!renterNombre || !renterEmail || !hostNombre || !hostEmail) {
      setError("Por favor completa todos los campos.");
      return;
    }
    if (!fechas.inicio || !fechas.fin) {
      setError("Fechas inválidas.");
      return;
    }

    setLoading(true);
    try {
      const datosAuto = await getCarById(id_carro.toString());
      if (!datosAuto) {
        setError("No se pudo obtener datos del auto.");
        setLoading(false);
        return;
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
        "https://search-car-backend.vercel.app/insertCondition",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(solicitud),
        }
      );

      if (response.status === 201) {
        onSolicitudExitosa();
      } else {
        const text = await response.text();
        setError("Error en el envío: " + text);
      }
    } catch (e) {
      console.error(e);
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-6">
      <input
        type="text"
        placeholder="Nombre del Renter"
        value={renterNombre}
        onChange={(e) => setRenterNombre(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="email"
        placeholder="Email del Renter"
        value={renterEmail}
        onChange={(e) => setRenterEmail(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Nombre del Host"
        value={hostNombre}
        onChange={(e) => setHostNombre(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="email"
        placeholder="Email del Host"
        value={hostEmail}
        onChange={(e) => setHostEmail(e.target.value)}
        className="p-2 border rounded"
      />

      {error && <p className="text-red-600">{error}</p>}

      <Button onClick={handleEnviarSolicitud} disabled={loading}>
        {loading ? "Enviando..." : "Enviar Solicitud"}
      </Button>
    </div>
  );
}
