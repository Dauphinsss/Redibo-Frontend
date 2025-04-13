"use client"

import RecodeCarList from "@/components/recodeComponentes/RecodeCarList"
import { cars } from "@/Datos de prueba/cars"

export default function Home() {
  return (
    <main className="p-4 max-w-[1440px] mx-auto">
      {/* Buscador */}
      <div className="mb-6">
        
      </div>

      {/* Carrusel */}
      <div className="mb-6">
        
      </div>

      {/* Filtros específicos */}
      <div className="mb-6">
      </div>

      {/* Total resultados + Ordenamiento */}
      <div className="mb-4 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-gray-600">9999 resultados</p>
        </div>
      </div>

      {/* Resultados + Mapa */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* Lista de tarjetas de autos */}
        <div className="flex-1">
          
          <RecodeCarList carCards={cars} />
          <div className="mt-6">
            
          </div>
        </div>

        {/* Mapa */}
        <div className="w-full md:w-[40%] lg:w-[35%]">
        </div>
      </div>
    </main>
  )
}