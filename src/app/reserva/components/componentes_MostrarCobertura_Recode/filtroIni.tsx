'use client';

import { useEffect, useState, useRef } from 'react';
import { CalendarDaysIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const opcionesFechas = [
  { inicio: '2025-06-19', fin: '2025-06-24', ciudad: 'Cochabamba' },
  { inicio: '2025-06-20', fin: '2025-06-22', ciudad: 'Cochabamba' },
  { inicio: '2025-06-24', fin: '2025-06-27', ciudad: 'Cochabamba' },
];

export default function FechasAlquiler({
  onFechasSeleccionadas,
}: {
  onFechasSeleccionadas: (fechas: { inicio: string; fin: string }) => void;
}) {
  const [seleccion, setSeleccion] = useState(opcionesFechas[0]);
  const [mostrandoPicker, setMostrandoPicker] = useState(false);
  const [rangoFechas, setRangoFechas] = useState<[Date | null, Date | null]>([
    null, null
  ]);
  const pickerRef = useRef<HTMLDivElement>(null);

  const parseLocalDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDateToISO = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const random = Math.floor(Math.random() * opcionesFechas.length);
    const fecha = opcionesFechas[random];
    setSeleccion(fecha);
    setRangoFechas([parseLocalDate(fecha.inicio), parseLocalDate(fecha.fin)]);
    onFechasSeleccionadas(fecha);
  }, [onFechasSeleccionadas]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setMostrandoPicker(false);
      }
    };
    if (mostrandoPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mostrandoPicker]);

  const formato = (fecha: string) => {
    const localDate = parseLocalDate(fecha);
    return localDate.toLocaleDateString("es-BO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const aplicarFechas = (dates: [Date | null, Date | null]) => {
    setRangoFechas(dates);
    const [inicio, fin] = dates;
    if (inicio && fin) {
      const nuevo = {
        inicio: formatDateToISO(inicio),
        fin: formatDateToISO(fin),
        ciudad: seleccion.ciudad,
      };
      setSeleccion(nuevo);
      onFechasSeleccionadas(nuevo);
      setMostrandoPicker(false);
    }
  };

  return (
    <div className="w-full max-w-[760px] mx-auto bg-white border border-gray-300 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
      {/* Resumen */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 w-full">
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="h-5 w-5 text-gray-600" />
          <div>
            <p className="text-xs text-gray-500">Desde</p>
            <p className="text-sm font-medium text-black">{formato(seleccion.inicio)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="h-5 w-5 text-gray-600" />
          <div>
            <p className="text-xs text-gray-500">Hasta</p>
            <p className="text-sm font-medium text-black">{formato(seleccion.fin)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Ciudad</span>
          <span className="text-sm font-semibold text-black">{seleccion.ciudad}</span>
        </div>
      </div>

      {/* Botón + Calendario */}
      <div className="relative" ref={pickerRef}>
        <button
          className="flex items-center gap-1 text-sm font-medium bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          onClick={() => setMostrandoPicker((prev) => !prev)}
        >
          <PencilSquareIcon className="h-4 w-4" />
          Editar
        </button>

        {mostrandoPicker && (
          <div className="absolute top-full left-0 mt-2 z-50 bg-white p-4 rounded shadow border border-gray-300">
            <DatePicker
              selected={rangoFechas[0]}
              onChange={(update) => aplicarFechas(update as [Date, Date])}
              startDate={rangoFechas[0]}
              endDate={rangoFechas[1]}
              selectsRange
              inline
              calendarClassName="bg-white border border-gray-300 text-black rounded"
              dayClassName={(date) => {
                const [start, end] = rangoFechas;
                const isSelected =
                  start && end && date >= start && date <= end;
                const isStart = start && date.toDateString() === start.toDateString();
                const isEnd = end && date.toDateString() === end.toDateString();

                if (isStart || isEnd) {
                  return "bg-black text-white rounded-full font-semibold";
                } else if (isSelected) {
                  return "bg-neutral-800 text-white rounded-md";
                }
                return "text-black hover:bg-black hover:text-white transition rounded-md";
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}