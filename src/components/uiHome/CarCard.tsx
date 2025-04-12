"use client";

import { FaChair, FaDoorOpen, FaCogs, FaGasPump, FaUser, FaStar, FaMapMarkerAlt} from "react-icons/fa";

interface CarCardProps {
  nombre: string,
  marca: string,
  asientos: number,
  puertas: number,
  transmision: string,
  combustible: string,
  estado: string,
  nombreHost: string,
  calificacion: number,
  ubicacion: string,
  precioOficial: string,
  precioDescuento: string,
  precioPorDia: string,

}

export default function CarCard({ 
  nombre,
  marca,
  asientos,
  puertas,
  transmision,
  combustible,
  estado,
  nombreHost,
  calificacion,
  ubicacion,
  precioOficial,
  precioDescuento,
  precioPorDia
}: CarCardProps) {
  return (
    <div className="w-[750px] h-[320px] border border-black rounded-[15px] p-6 shadow-sm bg-white flex gap-4 mx-auto">
      
      {/* 1. COLUMNA IZQUIERDA */}
      <div className="w-[250px] h-full flex flex-col justify-between gap-4">

        {/* 🔹 Fila 1: Botones con íconos */}
        <div className="flex justify-between">
          {/*<button className="flex items-center gap-1 px-3 py-1 bg-white border border-black rounded-full text-sm hover:scale-105 transition">
            <FaHeart className="text-base" /> Guardar
          </button>
          <button className="flex items-center gap-1 px-3 py-1 bg-white border border-black rounded-full text-sm hover:scale-105 transition">
            <FaShareAlt className="text-base" /> Compartir
          </button>*/}
        </div>

        {/* 🔹 Fila 2: Imagen centrada */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-[230px] h-[150px] bg-gray-200 rounded-[10px] flex items-center justify-center text-5xl hover:text-6xl transition">
            🚗
          </div>
        </div>

        {/* 🔹 Fila 3: Algo más */}
        <div className="text-sm text-gray-700 text-center">
          📄 Condiciones de uso
        </div>
      </div>


      {/*2. COLUMNA CENTRAL */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold">{nombre}</h2>
          <p className="text-sm text-gray-500">{marca}</p>

          <div className="flex flex-wrap gap-4 mt-2 text-sm">
            <span className="flex items-center gap-1"><FaChair /> {asientos} asientos</span>
            <span className="flex items-center gap-1"><FaDoorOpen /> {puertas} puertas</span>
            <span className="flex items-center gap-1"><FaCogs /> {transmision}</span>
          </div>

          <div className="flex items-center gap-2 mt-2 text-sm">
            <FaGasPump /> Tipo de combustible: {combustible}
          </div>

          <p className="text-sm mt-1"><strong>Estado:</strong> {estado}</p>
          <div className="flex items-center gap-2 text-sm mt-1"><FaUser /> {nombreHost}</div>
          <div className="flex items-center gap-1 text-lg font-bold text-yellow-500 mt-1"><FaStar /> {calificacion}</div>
          <div className="flex items-center gap-1 text-sm"><FaMapMarkerAlt /> {ubicacion}</div>
        </div>
      </div>

      {/*3. COLUMNA DERECHA */}
      <div className="w-[130px] flex flex-col justify-between items-end">
        <div className="text-right">
          <p className="text-2xl font-bold">{precioOficial}</p>
          <p className="text-secondary-foreground font-bold">{precioDescuento}</p>
          <p className="text-sm text-gray-500">Precio por día: {precioPorDia}</p>
        </div>
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Reservar
        </button>
      </div>
    </div>
  );
}
