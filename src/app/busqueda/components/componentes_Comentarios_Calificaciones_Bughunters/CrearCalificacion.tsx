"use client";

import { useEffect, useState } from "react";

interface CrearCalificacionProps {
  id_carro: number;
  onCalificacionActualizada?: () => void;
}

export default function CrearCalificacion({ id_carro, onCalificacionActualizada }: CrearCalificacionProps) {
  const [calificacion, setCalificacion] = useState(0);
  const [yaCalificado, setYaCalificado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    const verificar = async () => {
      try {
        const res = await fetch(`${API_URL}/api/calificaciones?id_carro=${id_carro}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });
        const data = await res.json();
        if (data.existe) {
          setYaCalificado(true);
          setCalificacion(data.valor || 0); // Recupera la calificación
          localStorage.setItem(`calificado_${id_carro}`, "true"); // Marca que ya calificó este auto
        }
      } catch {
        // ignora error
      }
    };

    const yaCalifico = localStorage.getItem(`calificado_${id_carro}`);
    if (yaCalifico === "true") {
      setYaCalificado(true); // Bloquea el sistema si ya calificó
    } else {
      verificar();
    }
  }, [id_carro]);

  const handleSeleccion = async (valor: number) => {
    if (yaCalificado) return;
    setCalificacion(valor);
    try {
      const res = await fetch(`${API_URL}/api/comentarios-carro/solo-calificacion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ id_carro, calificacion: valor }),
      });

      if (!res.ok) throw new Error((await res.json()).error || "Error");
      setSuccess(true);
      setYaCalificado(true);
      localStorage.setItem(`calificado_${id_carro}`, "true"); // Persistir que ya calificó
      if (onCalificacionActualizada) onCalificacionActualizada(); // Refetch después de calificar
    } catch (err: any) {
      setError(err.message || "Error al calificar");
    }
  };

  return (
    <div className="mt-6 border p-4 rounded-md">
      <h2 className="text-xl font-bold">Califica este auto</h2>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => handleSeleccion(n)}
            disabled={yaCalificado}
            className={`text-3xl ${n <= calificacion ? "text-black" : "text-gray-300"}`}
          >
            ★
          </button>
        ))}
      </div>
      {yaCalificado && (
        <p className="text-sm text-gray-500 mt-1">Ya calificaste este auto</p>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">Calificación registrada</p>}
    </div>
  );
}