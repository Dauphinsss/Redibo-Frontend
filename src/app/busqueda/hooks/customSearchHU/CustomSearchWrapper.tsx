//Componente que usa el hook y se conecta con SearchBar
// app/busqueda/components/customSearchHU/CustomSearchWrapper.tsx
"use client";

import ResultadosAutos from "@/app/busqueda/components/seccionOrdenarMasResultados/ResultadosAutos_Recode";
import { useCustomSearch } from "@/app/busqueda/hooks/customSearchHU/useCustomSearch";
import { AutoCard_Interfaces_Recode as Auto } from "@/app/busqueda/interface/AutoCard_Interface_Recode";

interface Props {
  autosFiltrados: Auto[];
  autosVisibles: number;
  mostrarMasAutos: () => void;
  busqueda: string;
  cargando: boolean;
  onFiltrar?: (query: string) => void; // 👈 necesario para sugerencias
}

export default function CustomSearchWrapper({
  autosFiltrados,
  autosVisibles,
  mostrarMasAutos,
  busqueda,
  cargando,
}: Props) {
  const autosBuscados = useCustomSearch(autosFiltrados, busqueda);
  const autosActuales = autosBuscados.slice(0, autosVisibles);
  console.log("Autos Buscados", autosBuscados);

  return (
    <>
    {autosBuscados.length === 0 && busqueda.trim() !== "" ? (
      <>
        <p className="text-center text-gray-500 mt-4 text-base">
          No se encontraron resultados para <span className="font-semibold">"{busqueda}"</span>.
        </p>

        {/* 🔽 NUEVO BLOQUE DE SUGERENCIAS */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 mb-2">Tal vez quieras intentar con:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Toyota", "Honda", "Eléctrico", "Sedán", "SUV"].map((sugerencia, i) => (
              <button
                key={i}
                className="px-3 py-1 border border-gray-300 rounded-full hover:bg-gray-100 text-sm text-gray-700"
                onClick={() => {
                  ///onFiltrar?.(sugerencia.toLowerCase());
                }}
              >
                {sugerencia}
              </button>
            ))}
          </div>
        </div>
      </>
    ) : (
      <ResultadosAutos
        cargando={cargando}
        autosActuales={autosActuales}
        autosFiltrados={autosBuscados}
        autosVisibles={autosVisibles}
        mostrarMasAutos={mostrarMasAutos}
      />
    )}
  </>
  );
}
