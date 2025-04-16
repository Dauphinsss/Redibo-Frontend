'use client';

import { useState } from "react";
import {
  FaChair,
  FaDoorOpen,
  FaCogs,
  FaGasPump,
  FaUser,
  FaStar,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Link from 'next/link';
import { RecodeAuto } from "@/components/recodeComponentes/RecodeAuto";

export default function RecodeCarCard(props: RecodeAuto) {
  const {
    id,
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
    calle,
    zona,
    precioOficial,
    precioDescuento,
    precioPorDia,
    imagenUrl,
  } = props;

  const [combustibleSeleccionado, setCombustibleSeleccionado] = useState(combustibles[0]);

  return (
    <div className="w-full max-w-[750px] md:h-[320px] border border-black rounded-[15px] p-6 shadow-sm bg-white flex flex-col md:flex-row gap-4 mx-0">

      {/* Columna IZQUIERDA: Imagen */}
      <div className="w-full md:w-[250px] flex flex-col justify-between gap-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-[230px] h-[150px] bg-gray-200 rounded-[10px] overflow-hidden">
            {imagenUrl ? (
              <img
                src={imagenUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm rounded">
                Sin imagen
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Columna CENTRAL: Información */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">{nombre}</h2>
          <p className="text-sm text-gray-500">{marca}</p>

          <div className="flex flex-wrap gap-4 mt-2 text-sm">
            <span className="flex items-center gap-1 text-sm md:text-base"><FaChair /> {asientos} asientos</span>
            <span className="flex items-center gap-1 text-sm md:text-base"><FaDoorOpen /> {puertas} puertas</span>
            <span className="flex items-center gap-1 text-sm md:text-base"><FaCogs /> {transmision}</span>
          </div>

          {/* Combustible con dropdown dinámico */}
          <div className="flex items-center gap-2 mt-2 text-sm md:text-base">
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
            <FaMapMarkerAlt /> {ubicacion}, {zona}, {calle}
          </div>
        </div>
      </div>

      {/* Columna DERECHA: Precio + botón */}
      <div className="w-full md:w-[130px] flex flex-col justify-between items-end">
        <div className="text-right w-full md:w-auto">
          <p className="text-2xl font-bold">{precioOficial}</p>
          <p className="text-gray-400 line-through font-bold">{precioDescuento}</p>
          <p className="text-sm text-gray-500">Por día: {precioPorDia}</p>
        </div>
        <Link
          href={`/infoAuto/${id}`}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 mt-4 md:mt-0 text-sm md:text-base" target="_blank">
          Reservar
        </Link>
      </div>
    </div>
  );
}