'use client';

import { useState, useEffect } from "react";
import RecodeCarList from "@/components/recodeComponentes/RecodeCarList";
import SearchBar from "@/components/recodeComponentes/RecodeSearchBar";
import Filter from "@/components/recodeComponentes/RecodeFilter";
import { RecodeAuto } from "@/components/recodeComponentes/RecodeAuto";

export default function Home() {
  const CANTIDAD_POR_LOTE = 8;
  const [autos, setAutos] = useState<RecodeAuto[]>([]);
  const [autosFiltrados, setAutosFiltrados] = useState<RecodeAuto[]>([]);
  const [autosVisibles, setAutosVisibles] = useState(CANTIDAD_POR_LOTE);
  const [cargando, setCargando] = useState(true);

  const mostrarMasAutos = () => {
    setAutosVisibles((prev) => prev + CANTIDAD_POR_LOTE);
  };

  const ordenados = ["Recomendación", "Precio bajo a alto", "Precio alto a bajo"];
  const ciudades = ["Cochabamba", "Santa Cruz", "La Paz"];
  const marcas = ["Toyota", "Nissan", "Susuki"];
  const combustibles = ["Gasolina", "Diésel", "Eléctrico", "Híbrido"];

  useEffect(() => {
    const fetchAutos = async () => {
      setCargando(true);
      try {
        const res = await fetch("/data/autos.json");
        const data = await res.json();
        setAutos(data);
        setAutosFiltrados(data);
      } catch (error) {
        console.error("Error al cargar los autos:", error);
      }
      setCargando(false);
    };

    fetchAutos();
  }, []);

  const autosActuales = autosFiltrados.slice(0, autosVisibles);

  return (
    <main className="p-4 max-w-[1440px] mx-auto">
      {/* Fila 1: Buscador y Carrusel */}
      <div className="mb-6 flex flex-col items-center justify-center">
        <SearchBar
          placeholder="Buscar por nombre, marca"
          autos={autos}
          onFiltrar={setAutosFiltrados}
        />
        <div className="mb-6">{/* RecodeCarousel */}</div>
      </div>

      {/* Fila 2: Contenido Principal */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          {/* Filtros */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <span className="font-semibold">Filtrar por:</span>
            <Filter lista={ciudades} nombre="Ciudades" />
            <Filter lista={marcas} nombre="Marcas" />
            <Filter lista={combustibles} nombre="Combustibles" />
          </div>

          {/* Resultados + Ordenamiento */}
          <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <p className="text-gray-600">
              Mostrando <span className="font-semibold">{autosActuales.length}</span> de <span className="font-semibold">{autosFiltrados.length}</span> resultados
            </p>
            <div className="w-full sm:w-[300px] mt-2 sm:mt-0">
              <Filter lista={ordenados} nombre="Ordenados por" />
            </div>
          </div>

          {/* Lista de Autos o Loader */}
          <div>
            {cargando ? (
              <p className="text-center text-gray-500">Cargando autos...</p>
            ) : (
              <RecodeCarList carCards={autosActuales} />
            )}
          </div>

          {/* Botón "Ver más resultados" */}
          {!cargando && autosVisibles < autosFiltrados.length && (
            <div className="mt-6 flex justify-center">
              <button
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                onClick={mostrarMasAutos}
              >
                Ver más resultados
              </button>
            </div>
          )}
        </div>

        {/* Columna 2: Mapa */}
        <div className="md:w-1/3 bg-gray-100 h-[300px] rounded shadow-inner flex items-center justify-center text-gray-500">
          RecodeMapView próximamente
        </div>
      </div>
    </main>
  );
}
