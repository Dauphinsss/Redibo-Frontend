'use client';

import { useEffect, useState, useRef } from 'react';
import { CalendarDaysIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSearchStore } from '@/app/busqueda/store/searchStore';

// 1. La interfaz de props ahora solo necesita la función de callback
interface FechasAlquilerProps {
  onFechasSeleccionadas: (fechas: { inicio: string; fin: string }) => void;
}

export default function FechasAlquiler({ onFechasSeleccionadas }: FechasAlquilerProps) {
  
  // 2. Leemos los datos directamente desde el store de Zustand
  const { ciudad, fechaInicio, fechaFin, setFechas } = useSearchStore();

  // --- Funciones de Utilidad para Fechas ---
  const parseLocalDate = (dateString: string | null): Date | null => {
    if (!dateString) return null;
    // La fecha viene en formato ISO 8601 (ej: "2025-06-27T04:00:00.000Z")
    // new Date() puede manejar este formato directamente.
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date;
  };

  const formatDateToISO = (date: Date): string => {
    // getISOString corta la parte de la hora, resultando en YYYY-MM-DD
    return date.toISOString().split('T')[0];
  };

  // --- Estados del Componente ---

  // 3. Inicializamos el estado local con los valores del store
  const [seleccion, setSeleccion] = useState({
    inicio: fechaInicio ? formatDateToISO(new Date(fechaInicio)) : '',
    fin: fechaFin ? formatDateToISO(new Date(fechaFin)) : '',
    ciudad: ciudad || "No especificada"
  });

  const [rangoFechas, setRangoFechas] = useState<[Date | null, Date | null]>([
    parseLocalDate(fechaInicio),
    parseLocalDate(fechaFin)
  ]);

  const [mostrandoPicker, setMostrandoPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // 4. Sincronizamos el estado si los valores del store cambian (importante para la primera carga)
  useEffect(() => {
    setSeleccion({
      inicio: fechaInicio ? formatDateToISO(new Date(fechaInicio)) : '',
      fin: fechaFin ? formatDateToISO(new Date(fechaFin)) : '',
      ciudad: ciudad || "No especificada"
    });
    setRangoFechas([
        parseLocalDate(fechaInicio),
        parseLocalDate(fechaFin)
    ]);
  }, [fechaInicio, fechaFin, ciudad]);

  // Maneja el cierre del calendario al hacer clic fuera
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

  // --- Funciones Manejadoras de Eventos ---

  const formatoVisual = (fecha: string) => {
    const localDate = parseLocalDate(fecha);
    if (!localDate) return "Seleccionar fecha";
    return localDate.toLocaleDateString("es-BO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: 'UTC'
    });
  };
  
  // Aplica las fechas seleccionadas en el DatePicker
  const aplicarFechas = (dates: [Date | null, Date | null]) => {
    const [inicio, fin] = dates;
    if (inicio && fin) {
      const nuevoRango = {
        inicio: formatDateToISO(inicio),
        fin: formatDateToISO(fin),
      };
      setSeleccion(prev => ({ ...prev, ...nuevoRango }));
      onFechasSeleccionadas(nuevoRango);
      setFechas(nuevoRango.inicio, nuevoRango.fin); // Actualiza el store global
      setMostrandoPicker(false);
    }
    setRangoFechas(dates);
  };

  return (
    <div className="w-full max-w-[760px] mx-auto bg-white border border-gray-300 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
      {/* Resumen de la selección */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 w-full">
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="h-5 w-5 text-gray-600" />
          <div>
            <p className="text-xs text-gray-500">Desde</p>
            <p className="text-sm font-medium text-black">{formatoVisual(seleccion.inicio)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="h-5 w-5 text-gray-600" />
          <div>
            <p className="text-xs text-gray-500">Hasta</p>
            <p className="text-sm font-medium text-black">{formatoVisual(seleccion.fin)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Ciudad</span>
          <span className="text-sm font-semibold text-black">{seleccion.ciudad}</span>
        </div>
      </div>

      {/* Botón y Calendario */}
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