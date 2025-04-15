'use client'

import { useState } from "react"
import RecodeCarList from "@/components/recodeComponentes/RecodeCarList"
import { cars as allCars } from "@/Datos de prueba/cars"
import SearchBar from "@/components/recodeComponentes/RecodeSearchBar"
import Filter from "@/components/recodeComponentes/RecodeFilter"

export default function Home() {
  const CANTIDAD_POR_LOTE = 8
  const [autosVisibles, setAutosVisibles] = useState(CANTIDAD_POR_LOTE)

  const mostrarMasAutos = () => {
    setAutosVisibles(prev => prev + CANTIDAD_POR_LOTE)
  }

  const ordenados = ["Recomendación", "Precio bajo a alto", "Precio alto a bajo"]
  const ciudades = ["Cochabamba", "Santa Cruz", "La Paz"]
  const marcas = ["Toyota", "Nissan", "Susuki"]
  const combustibles = ["Gasolina", "Diésel", "Eléctrico", "Híbrido"]

  const autosActuales = allCars.slice(0, autosVisibles)

  return (
    <main className="p-4 max-w-[1440px] mx-auto">
      {/* Fila 1: Buscador y Carrusel */}
      <div className="mb-6 flex flex-col items-center justify-center">
        <SearchBar name="Buscar por nombre, marca "/>
        {/* Carrusel (puedes agregar aquí un carrusel de imágenes o elementos) */}
        <div className="mb-6">
          {/* RecodeCarousel */}
        </div>
      </div>

      {/* Fila 2: Contenido Principal */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* Columna 1: Filtros y Lista de Autos */}
        <div className="flex-1">

          {/* Fila 1: Filtros */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">Filtrar por:
            <Filter lista={ciudades} nombre="Ciudades" />
            <Filter lista={marcas} nombre="Marcas" />
            <Filter lista={combustibles} nombre="Combustibles" />
          </div>

          {/* Fila 2: Resultados + Ordenamiento */}
          <div className="w-[750px] flex justify-between items-center mb-6"> {/* Agregado el ancho de 750px */}
            <p className="text-gray-600">
              Mostrando <span className="font-semibold">{autosActuales.length}</span> de <span className="font-semibold">{allCars.length}</span> resultados
            </p>
            <div className="w-[300px]"> {/* Ajustado el ancho para que el dropdown no se desborde */}
              <Filter lista={ordenados} nombre="Ordenados por" />
            </div>
          </div>

          {/* Fila 3: Lista de Autos */}
          <div className="flex-1">
            <RecodeCarList
              carCards={autosActuales}
            />
          </div>

          {/* Fila 4: Botón "Ver más resultados" */}
          {autosVisibles < allCars.length && (
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
        <div >
          {/* RecodeMapView */}
        </div>

      </div>
    </main>
  )
}