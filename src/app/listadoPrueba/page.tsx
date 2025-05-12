"use client";

import ResultadoAutos from "@/components/recodeComponentes/cobertura/ResultadoAutos";
import { useAutosSimplificado } from "@/hooks/useAutosSimplificado";

export default function Page() {
  const { autos, cargando } = useAutosSimplificado();

  if (cargando) {
    return <p className="text-center text-gray-500">Cargando autos...</p>;
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mis autos registrados</h1>
      <ResultadoAutos autos={autos} />
    </main>
  );
}
