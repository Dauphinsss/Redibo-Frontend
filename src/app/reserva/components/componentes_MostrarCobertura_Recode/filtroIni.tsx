'use client';

import { useEffect, useState, useRef } from 'react';
import { CalendarDaysIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// 1. La interfaz define las props que el componente espera recibir
interface FechasAlquilerProps {
  onFechasSeleccionadas: (fechas: { inicio: string; fin: string }) => void;
  initialStartDate: string | null;
  initialEndDate: string | null;
  ciudad: string | null;
}

export default function FechasAlquiler({
  onFechasSeleccionadas,
  initialStartDate,
  initialEndDate,
  ciudad,
}: FechasAlquilerProps) {

  const parseLocalDate = (dateString: string | null): Date | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const formatDateToISO = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // 2. Los estados locales se inicializan a partir de las props recibidas
  const [rangoFechas, setRangoFechas] = useState<[Date | null, Date | null]>([
    parseLocalDate(initialStartDate),
    parseLocalDate(initialEndDate)
  ]);

  const [mostrandoPicker, setMostrandoPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // 3. Sincroniza el estado si las props cambian
  useEffect(() => {
    setRangoFechas([
      parseLocalDate(initialStartDate),
      parseLocalDate(initialEndDate)
    ]);
  }, [initialStartDate, initialEndDate]);

  useEffect(() => {
    // ... (lógica para cerrar el picker)
  }, [mostrandoPicker]);

  const formatoVisual = (date: Date | null) => {
    if (!date) return "Seleccionar fecha";
    return date.toLocaleDateString("es-BO", { /* ... */ timeZone: 'UTC' });
  };

  const aplicarFechas = (dates: [Date | null, Date | null]) => {
    const [inicio, fin] = dates;
    setRangoFechas(dates);
    if (inicio && fin) {
      const nuevoRango = {
        inicio: formatDateToISO(inicio),
        fin: formatDateToISO(fin),
      };
      onFechasSeleccionadas(nuevoRango); // Notifica al padre
      setMostrandoPicker(false);
    }
  };

  return (
    <div className="w-full max-w-[760px] mx-auto bg-white border border-gray-300 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 w-full">
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="h-5 w-5 text-gray-600" />
          <div>
            <p className="text-xs text-gray-500">Desde</p>
            <p className="text-sm font-medium text-black">{formatoVisual(rangoFechas[0])}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="h-5 w-5 text-gray-600" />
          <div>
            <p className="text-xs text-gray-500">Hasta</p>
            <p className="text-sm font-medium text-black">{formatoVisual(rangoFechas[1])}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Ciudad</span>
          <span className="text-sm font-semibold text-black">{ciudad || "No especificada"}</span>
        </div>
      </div>
      <div className="relative" ref={pickerRef}>
        <button
          className="flex items-center gap-1 text-sm font-medium bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          onClick={() => setMostrandoPicker((prev) => !prev)}
        >
          <PencilSquareIcon className="h-4 w-4" />
          Editar
        </button>
        {mostrandoPicker && (
          <div className="absolute top-full right-0 mt-2 z-50 bg-white p-4 rounded shadow-lg border border-gray-200">
            <DatePicker
              selected={rangoFechas[0]}
              onChange={(update) => aplicarFechas(update as [Date, Date])}
              startDate={rangoFechas[0]}
              endDate={rangoFechas[1]}
              selectsRange
              inline
              monthsShown={2}
              minDate={new Date()}
            />
          </div>
        )}
      </div>
    </div>
  );
}