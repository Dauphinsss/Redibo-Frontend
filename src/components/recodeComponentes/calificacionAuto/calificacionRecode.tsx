"use client";
import React from "react";

interface CalificacionProps {
  calificaciones: number[];
  numComentarios: number;
  comentariosConCalificacion: number[];
  onBarClick?: (index: number | null) => void;
}

// Función para calcular el promedio de calificación
const calcularPromedio = (calificaciones: number[], total: number) =>
  total ? Number((calificaciones.reduce((sum, val) => sum + val, 0) / total).toFixed(1)) : 0;

// Función para calcular porcentajes de cada estrella
const calcularPorcentajes = (calificaciones: number[], total: number) =>
  Array.from({ length: 5 }, (_, i) =>
    total ? (calificaciones.filter((c) => c === i + 1).length / total) * 100 : 0
  );

const CalificacionRecode: React.FC<CalificacionProps> = ({ calificaciones, numComentarios, comentariosConCalificacion, onBarClick }) => {
  const total = calificaciones.length;
  const promedio = calcularPromedio(calificaciones, total);
  const porcentajes = calcularPorcentajes(calificaciones, total);

  return (
    <div className="p-4 border rounded-lg bg-white w-full flex flex-col justify-between h-full cursor-pointer">
      <div className="flex justify-between items-center">
        <InfoPromedio total={total} promedio={promedio} numComentarios={numComentarios} onBarClick={onBarClick} />
        <BarraCalificacion porcentajes={porcentajes} comentariosConCalificacion={comentariosConCalificacion} onBarClick={onBarClick} />
      </div>
      {total === 0 && <p className="mt-auto text-right text-gray-600 text-sm">Este auto aún no tiene calificaciones ni comentarios</p>}
    </div>
  );
};

export default CalificacionRecode;

