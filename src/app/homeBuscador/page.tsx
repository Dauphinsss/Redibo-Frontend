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

  const ciudades = ["Cochabamba","Santa Cruz","La Paz"]
  const marcas = ["Toyota","Nissan","Susuki"]

  const autosActuales = allCars.slice(0, autosVisibles)

  return (
    <main className="p-4 max-w-[1440px] mx-auto">

      {/* Buscador */}
      <div className="mb-6">
        <SearchBar name="Buscar por nombre, marca "/>
      </div>

      {/*Carrusel */}
      <div className="mb-6">{/* RecodeCarousel */}</div>

      {/*Filtros */}
      <div className="mb-6">
      <Filter lista={ciudades} nombre="Ciudades"/>
      <Filter lista={marcas} nombre="Marcas"/>
      </div>

      {/* Resultados + ordenamiento */}
      <div className="mb-4 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-gray-600">
            Mostrando <span className="font-semibold">{autosActuales.length}</span> de <span className="font-semibold">{allCars.length}</span> resultados
          </p>
          {/* Aquí podés poner el selector de ordenamiento si tenés uno */}
        </div>
      </div>

      {/* Resultados + Mapa */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* Lista de autos */}
        <div className="flex-1">
          <RecodeCarList
            carCards={autosActuales}
            total={allCars.length}
            visibles={autosVisibles}
            onLoadMore={mostrarMasAutos}
            lote={CANTIDAD_POR_LOTE}
          />
        </div>

        {/* Mapa */}
        <div className="w-full md:w-[40%] lg:w-[35%]">
          {/* RecodeMapView */}
        </div>
      </div>
    </main>
  )
}