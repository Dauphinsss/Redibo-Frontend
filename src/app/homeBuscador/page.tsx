'use client'

import { useState } from "react"
import RecodeCarList from "@/components/recodeComponentes/RecodeCarList"
import { cars as allCars } from "@/Datos de prueba/cars"

export default function Home() {
  const CANTIDAD_POR_LOTE = 8
  const [autosVisibles, setAutosVisibles] = useState(CANTIDAD_POR_LOTE)

  const mostrarMasAutos = () => {
    setAutosVisibles(prev => prev + CANTIDAD_POR_LOTE)
  }

  const autosActuales = allCars.slice(0, autosVisibles)

  return (
    <main className="p-4 max-w-[1440px] mx-auto">

      {/* Buscador */}
      <div className="mb-6">{/* Poner aqui el buscador */}</div>

      {/* Carrusel */}
      <div className="mb-6">{/* Poner aqui el carusel de filtros */}</div>

      {/* Filtros */}
      <div className="mb-6">{/* Poner aqui los filtros especificos */}</div>

      {/* Resultados + ordenamiento */}
      <div className="mb-4 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-gray-600">
            Mostrando <span className="font-semibold">{autosActuales.length}</span> de <span className="font-semibold">{allCars.length}</span> resultados
          </p>
          {/* Poner aqui el dropdown de ordenamiento*/}
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
          {/* Poner aqui el mapa */}
        </div>
      </div>
    </main>
  )
}