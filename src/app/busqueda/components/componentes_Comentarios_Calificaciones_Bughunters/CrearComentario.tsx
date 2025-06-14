"use client";

import { useState } from "react";

interface CrearComentarioProps {
  id_carro: number;
  onComentarioCreado?: () => void;
}

export default function CrearComentario({
  id_carro,
  onComentarioCreado,
}: CrearComentarioProps) {
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${API_URL}/api/comentarios-carro/solo-comentario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ id_carro, comentario }),
      });

      if (!res.ok) throw new Error((await res.json()).error || "Error");

      setComentario("");
      setSuccess(true);
      if (onComentarioCreado) onComentarioCreado();
    } catch (err: any) {
      setError(err.message || "Error inesperado");
    }
  };

  return (
    <div className="w-full border p-4 rounded-md">
    <h2 className="text-xl font-bold">Escribe tu comentario</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">Comentario enviado</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border rounded"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          required
          minLength={5}
          maxLength={500}
        />
        <div className="text-xs text-gray-500">{comentario.length} / 500</div>
        <button type="submit" className="mt-2 bg-black text-white px-4 py-2 rounded">
          Enviar Comentario
        </button>
      </form>
    </div>
  );
}