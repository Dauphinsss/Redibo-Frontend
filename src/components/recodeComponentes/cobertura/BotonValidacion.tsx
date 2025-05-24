"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCoberturasStore } from "@/hooks/useCoberturasStore";
import { postCobertura } from "@/service/services_Recode";

export default function BotonValidacion() {
  const router = useRouter();
  const { lista } = useCoberturasStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (lista.length === 0) {
      alert("Debes registrar al menos una cobertura.");
      return;
    }

    try {
      setIsSubmitting(true);
      await Promise.all(lista.map(c => postCobertura(c)));
      router.push("/listadoPrueba");
    } catch (error) {
      console.error("Error al guardar coberturas:", error);
      alert("Hubo un error. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={isSubmitting}
      className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
    >
      {isSubmitting ? "Guardando..." : "Guardar condiciones"}
    </button>
  );
}