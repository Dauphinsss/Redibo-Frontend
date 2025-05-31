"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postCobertura, putCobertura } from "@/service/services_Recode";
import { useCoberturasStore } from "../../hooks/useCoberturasStore";

interface Props {
  idSeguro: number;
}

export default function BotonValidacion({ idSeguro }: Props) {
  const { lista } = useCoberturasStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    const nuevas = lista.filter((c) => c.isNew);
    const existentes = lista.filter((c) => !c.isNew);

    if (nuevas.length === 0 && existentes.length === 0) {
      alert("No hay cambios para guardar.");
      return;
    }

    try {
      setIsSubmitting(true);

      await Promise.all([
        ...nuevas.map((c) =>
          postCobertura({
            id_SeguroCarro: idSeguro,
            tipodaño: c.tipodaño,
            descripcion: c.descripcion ?? "",
            cantidadCobertura: c.valides,
          })
        ),
        ...existentes.map((c) =>
          putCobertura(c.id!, {
            id_seguro: idSeguro,
            tipoda_o: c.tipodaño,
            descripcion: c.descripcion ?? "",
            cantidadCobertura: c.valides,
          })
        ),
      ]);

      router.push("/listadoPrueba");
    } catch (err) {
      console.error("Error al guardar coberturas:", err);
      alert("Hubo un error al guardar las coberturas.");
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