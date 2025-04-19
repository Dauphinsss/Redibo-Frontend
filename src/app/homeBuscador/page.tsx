'use client';

import { useState, useEffect } from "react";
import RecodeCarList from "@/components/carCard/RecodeCarList";
import SearchBar from "@/components/recodeComponentes/RecodeSearchBar";
import Filter from "@/components/recodeComponentes/RecodeFilter";
import { AutoCard_Interfaces_Recode as Auto } from "@/interface/AutoCard_Interface_Recode";
import { RawAuto_Interface_Recode as RawAuto} from "@/interface/RawAuto_Interface_Recode";
import { transformAuto } from "@/utils/transformAuto";

export default function Home() {
  const CANTIDAD_POR_LOTE = 8;
  const [autos, setAutos] = useState<Auto[]>([]);
  const [autosFiltrados, setAutosFiltrados] = useState<Auto[]>([]);
  const [autosVisibles, setAutosVisibles] = useState(CANTIDAD_POR_LOTE);
  const [cargando, setCargando] = useState(true);

  const [filtroCiudad, setFiltroCiudad] = useState("");
  const [filtroMarca, setFiltroMarca] = useState("");
  const [filtroCombustible, setFiltroCombustible] = useState("");
  const [ordenSeleccionado, setOrdenSeleccionado] = useState<string>("Recomendación");

  const mostrarMasAutos = () => {
    setAutosVisibles((prev) => prev + CANTIDAD_POR_LOTE);
  };

  const ordenados = ["Precio bajo a alto", "Precio alto a bajo", "Modelo Ascendente", "Modelo Descendente"];
  const ciudades = ["Cochabamba", "Santa Cruz", "La Paz"];
  const marcas = ["Toyota", "Nissan", "Susuki"];
  const combustibles = ["Gasolina", "Diésel", "Eléctrico", "Híbrido"];

  useEffect(() => {
    const fetchAutos = async () => {
      setCargando(true);
      try {
        const res = await fetch("https://search-car-backend.vercel.app/searchCar/autos");
        const rawData: RawAuto[] = await res.json();

        const data: Auto[] = rawData.map(transformAuto);
        setAutos(data);
        setAutosFiltrados(data);
      } catch (error) {
        console.error("Error al cargar los autos:", error);
      }
      setCargando(false);
    };

    fetchAutos();
  }, []);

  useEffect(() => {
    let filtrados = autos;

    if (filtroCiudad) {
      filtrados = filtrados.filter((auto) => auto.ciudad === filtroCiudad);
    }
    if (filtroMarca) {
      filtrados = filtrados.filter((auto) => auto.marca === filtroMarca);
    }
    if (filtroCombustible) {
      filtrados = filtrados.filter((auto) => auto.combustibles.includes(filtroCombustible));
    }

    setAutosFiltrados(filtrados);
    setAutosVisibles(CANTIDAD_POR_LOTE);
  }, [filtroCiudad, filtroMarca, filtroCombustible, autos]);

  const ordenarAutos = (criterio: string) => {
    const autosOrdenados = [...autosFiltrados];

    if (criterio === "Modelo Ascendente") {
      autosOrdenados.sort((a, b) => a.modelo.localeCompare(b.modelo));
    } else if (criterio === "Modelo Descendente") {
      autosOrdenados.sort((a, b) => b.modelo.localeCompare(a.modelo));
    } else if (criterio === "Precio bajo a alto") {
      autosOrdenados.sort(
        (a, b) => parseFloat(a.precioPorDia.replace("Bs. ", "")) - parseFloat(b.precioPorDia.replace("Bs. ", ""))
      );
    } else if (criterio === "Precio alto a bajo") {
      autosOrdenados.sort(
        (a, b) => parseFloat(b.precioPorDia.replace("Bs. ", "")) - parseFloat(a.precioPorDia.replace("Bs. ", ""))
      );
    }

    setAutosFiltrados(autosOrdenados);
  };

  useEffect(() => {
    if (ordenSeleccionado !== "Recomendación") {
      ordenarAutos(ordenSeleccionado);
    }
  }, [ordenSeleccionado]);

  const autosActuales = autosFiltrados.slice(0, autosVisibles);

  return (
    <main className="p-4 max-w-[1440px] mx-auto">
      <div className="mb-6 flex flex-col items-center justify-center">
        <SearchBar
          placeholder="Buscar por nombre, marca"
          autos={autos}
          onFiltrar={setAutosFiltrados}
        />
        <div className="mb-6">{/* RecodeCarousel */}</div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <span className="font-semibold">Filtrar por:</span>
            <Filter lista={ciudades} nombre="Ciudades" onChange={setFiltroCiudad} />
            <Filter lista={marcas} nombre="Marcas" onChange={setFiltroMarca} />
            <Filter lista={combustibles} nombre="Combustibles" onChange={setFiltroCombustible} />
          </div>

          <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <p className="text-gray-600">
              Mostrando <span className="font-semibold">{autosActuales.length}</span> de <span className="font-semibold">{autosFiltrados.length}</span> resultados
            </p>
            <div className="w-full sm:w-[300px] mt-2 sm:mt-0">
              <Filter lista={ordenados} nombre="Ordenados por" onChange={setOrdenSeleccionado} />
            </div>
          </div>

          <div>
            {cargando ? (
              <p className="text-center text-gray-500">Cargando autos...</p>
            ) : (
              <RecodeCarList carCards={autosActuales} />
            )}
          </div>

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

        <div className="md:w-1/3 bg-gray-100 h-[300px] rounded shadow-inner flex items-center justify-center text-gray-500">
          RecodeMapView próximamente
        </div>
      </div>
    </main>
  );
}
