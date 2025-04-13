'use client'

import { useState } from "react"
import {
  FaChair,
  FaDoorOpen,
  FaCogs,
  FaGasPump,
  FaUser,
  FaStar,
  FaMapMarkerAlt,
} from "react-icons/fa"

export interface RecodeCarCardProps {
  id: string
  nombre: string
  marca: string
  asientos: number
  puertas: number
  transmision: string
  combustibles: string[]
  estado: string
  nombreHost: string
  calificacion: number
  ubicacion: string
  precioOficial: string
  precioDescuento: string
  precioPorDia: string
}

export default function RecodeCarCard({
  nombre,
  marca,
  asientos,
  puertas,
  transmision,
  combustibles,
  estado,
  nombreHost,
  calificacion,
  ubicacion,
  precioOficial,
  precioDescuento,
  precioPorDia,
}: RecodeCarCardProps) {
  const [combustibleSeleccionado, setCombustibleSeleccionado] = useState(combustibles[0])

  return (
    <div className="w-full max-w-[750px] md:h-[320px] border border-black rounded-[15px] p-6 shadow-sm bg-white flex flex-col md:flex-row gap-4 mx-auto">

      {/* Colum IZQ: Imagen */}
      <div className="w-full md:w-[250px] flex flex-col justify-between gap-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-[230px] h-[150px] bg-gray-200 rounded-[10px] flex items-center justify-center text-5xl hover:text-6xl transition">
            🚗
          </div>
        </div>
      </div>

      {/* Colum CENTRAL: Información */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold">{nombre}</h2>
          <p className="text-sm text-gray-500">{marca}</p>

          <div className="flex flex-wrap gap-4 mt-2 text-sm">
            <span className="flex items-center gap-1"><FaChair /> {asientos} asientos</span>
            <span className="flex items-center gap-1"><FaDoorOpen /> {puertas} puertas</span>
            <span className="flex items-center gap-1"><FaCogs /> {transmision}</span>
          </div>

          {/* Combustible con dropdown dinamico */}
          <div className="flex items-center gap-2 mt-2 text-sm">
            <FaGasPump />
            <span className="font-semibold">Tipos de combustibles:</span>
            <select
              className="border border-black rounded px-3 py-1 hover:bg-gray-200 transition-colors duration-200"
              value={combustibleSeleccionado}
              onChange={(e) => setCombustibleSeleccionado(e.target.value)}
            >
              {combustibles.map((tipo, index) => (
                <option key={index} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm mt-1">
            <strong>Estado:</strong> {estado}
          </p>

          <div className="flex items-center gap-2 text-sm mt-1">
            <FaUser /> {nombreHost}
          </div>

          <div className="flex items-center gap-1 text-lg font-bold text-yellow-500 mt-1">
            <FaStar /> {calificacion}
          </div>

          <div className="flex items-center gap-1 text-sm">
            <FaMapMarkerAlt /> {ubicacion}
          </div>
        </div>
      </div>

      {/* Colum DER: Precio + boton */}
      <div className="w-full md:w-[130px] flex flex-col justify-between items-end">
        <div className="text-right w-full md:w-auto">
          <p className="text-2xl font-bold">{precioOficial}</p>
          <p className="text-gray-400 font-bold">{precioDescuento}</p>
          <p className="text-sm text-gray-500">Por día: {precioPorDia}</p>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 mt-4 md:mt-0">
          Reservar
        </button>
      </div>
    </div>
  )
}