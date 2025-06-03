"use client";

import ResultadoAutos from "@/app/ValidarSeguro/components/cobertura/ResultadoAutos";
import Header from "@/components/ui/Header";
import { useAutosSimplificado } from "@/hooks/useAutosSimplificado";

export default function Page() {
  const { autos, cargando } = useAutosSimplificado();

  if (cargando) {
    return <p className="text-center text-gray-500">Cargando autos...</p>;
  }

  return (
    <div>
      <div className="sticky top-0 z-50 bg-white shadow overflow-visible">
        <div className="border-b px-4 sm:px-6 lg:px-8 py-7">
          <Header />
        </div>
      </div>

      <main className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Mis autos registrados</h1>
        <ResultadoAutos autos={autos} />
      </main>
    </div>
  );
}
