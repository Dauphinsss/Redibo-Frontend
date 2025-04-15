"use client";

import { useState } from "react"
import RecodeCarList from "@/components/recodeComponentes/RecodeCarList"
import Header from "@/components/ui/Header"
import SearchBar from "@/components/recodeComponentes/SearchBar"
import Filter from "@/components/recodeComponentes/Filter"

import { cars as allCars } from "@/Datos de prueba/cars"
import SearchBar from "@/components/recodeComponentes/SearchBar"
import Filter from "@/components/recodeComponentes/Filter"

const ciudades = ["Cochabamba","Santa Cruz","La Paz"]
const marcas = ["Toyota","Ford","Chevrolet"]
const orden=["Ascendente","Descendente"]

export default function Home() {

  const ciudades = ["Cochabamba","Santa Cruz","La Paz"]
  const marcas = ["Toyota", "Susuki"]
  const CANTIDAD_POR_LOTE = 8
  const [autosVisibles, setAutosVisibles] = useState(CANTIDAD_POR_LOTE)


  

  const mostrarMasAutos = () => {
    setAutosVisibles(prev => prev + CANTIDAD_POR_LOTE)
  }

  const autosActuales = allCars.slice(0, autosVisibles)

  return (
    <main className="p-4 max-w-[1440px] mx-auto">

      {/* Buscador */}
<<<<<<< HEAD
      <div className="mb-6">
        <SearchBar name="Buscar precio, marca y ubicacion"></SearchBar>
=======
      <div className="flex mb-6 flex-col items-center justify-center w-full h-20">
        <div className=" w-full max-w-md">
          <SearchBar name="Buscar por nombre, marca,modelo de auto..."/>
        </div>
>>>>>>> 1b616a84019ec79549bd01b319f4a2a56cb6469a
      </div>

      {/* Carrusel */}
      <div className="mb-6">{/* Poner aqui el carusel de filtros */}</div>

<<<<<<< HEAD
      {/* Filtros */}
      <div className="mb-6">
        <Filter lista={ciudades} nombre="Ciudades"/>
        <Filter lista={marcas} nombre="Marcas"/>

      </div>

=======
>>>>>>> 1b616a84019ec79549bd01b319f4a2a56cb6469a
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
      <div className="grid grid-flow-col grid-rows-3  flex-col md:flex-row gap-6">
        {/* Filtros */}
        <div className="bg-stone-300 rounded-2xl col-span-1 row-span-1 w-full max-w-[750px] h-20 items-center justify-center">{/** px-4 py-3  flex flex-wrap items-center gap-4  */}
          <label htmlFor="ciudad-seleccionada" className="text-black text-sm font-medium">
            Filtrar por:
          </label>
          <Filter lista={ciudades} nombre="Ciudad" />
          <Filter lista={marcas} nombre="Marca" />
          <Filter lista={orden} nombre="Filtro" />
        </div>

       {/* Tarjetas de autos  */}
       <div className="flex-1 col-span-1 row-span-2">
         <RecodeCarList
           carCards={autosActuales}
           total={allCars.length}
           visibles={autosVisibles}
           onLoadMore={mostrarMasAutos}
           lote={CANTIDAD_POR_LOTE}
          />
       </div>

       {/* Mapa */}
       <div className="w-full md:w-[40%] lg:w-[35%] col-span-2 row-span-2 ">
         {/* Aquí va el mapa */}
       </div>
      </div>
    </main>
  )
}
