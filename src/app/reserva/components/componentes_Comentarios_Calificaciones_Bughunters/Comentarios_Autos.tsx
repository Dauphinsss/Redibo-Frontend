"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CrearComentarioProps {
  id_carro: number;
  onComentarioCreado?: () => void;
}

export default function CrearComentario({
  id_carro,
  onComentarioCreado,
}: CrearComentarioProps) {
  const [comentario, setComentario] = useState<string>("");
  const [calificacion, setCalificacion] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${API_URL}/api/comentarios-carro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          id_carro,
          comentario,
          calificacion,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al enviar el comentario");
      }

      const data = await res.json();
      console.log("Comentario creado:", data);
      setSuccess(true);
      setComentario("");
      setCalificacion(0);
      if (onComentarioCreado) {
        onComentarioCreado();
      }

    } catch (err: any) {
      setError(err.message || "Hubo un problema al crear el comentario.");
    }
  };

  return (
    <div className="w-full border border-gray-200 rounded-lg p-4">
      {error && <p className="text-red-500">{error}</p>}
      {success && (
        <p className="text-green-500">¡Comentario enviado con éxito!</p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="comentario"
          >
            Comentario
          </label>
          <textarea
            id="comentario"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
            required
            minLength={5}
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1">
            {comentario.length} / 500 caracteres
          </div>
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="calificacion"
          >
            Calificación (0-5)
          </label>
          <input
            type="number"
            id="calificacion"
            min="0"
            max="5"
            step="0.1"
            value={calificacion}
            onChange={(e) => setCalificacion(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-black hover:bg-gray-800 text-white py-2 px-4 rounded"
        >
          Enviar Comentario
        </button>
      </form>
    </div>
  );
}