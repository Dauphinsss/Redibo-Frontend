"use client";

import { useState } from "react";
import axios from "axios";

export default function FormularioSolicitud() {
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const solicitud = {
      fecha: "2025-05-20",
      hostNombre: "Carlos B.",
      renterNombre: "Juan M.",
      modelo: "Corolla",
      marca: "Toyota",
      precio: 120,
      fechaRecogida: "2025-05-20 10:00 AM",
      fechaDevolucion: "2025-05-25 10:00 AM",
      lugarRecogida: "Av. Principal N°123,Cochabamba",
      lugarDevolucion: "Av. Secundaria N°456,Cochabamba",
      renterEmail: "cabamabe1234@gmail.com",
      hostEmail: "cabamabe1234@gmail.com",
      id_renter: 4,
      id_host: 7,
    };

    try {
      const response = await axios.post("https://search-car-backend.vercel.app/insertCondition", solicitud);
      setMensaje("✅ Solicitud enviada correctamente.");
      console.log("Respuesta del servidor:", response.data);
    } catch (error: unknown) {
      setMensaje("❌ Error al enviar la solicitud.");
      if (axios.isAxiosError(error)) {
        console.error("Error en la inserción:", error.response?.data || error.message);
      } else if (error instanceof Error) {
        console.error("Error en la inserción:", error.message);
      } else {
        console.error("Error en la inserción:", error);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-4">Insertar Solicitud</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p>Esta solicitud será enviada a <strong>cabamabe1234@gmail.com</strong></p>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Enviar solicitud
        </button>
        {mensaje && <p className="mt-4 text-center">{mensaje}</p>}
      </form>
    </div>
  );
}
