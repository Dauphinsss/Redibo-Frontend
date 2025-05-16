"use client";
import { useState, useEffect, useRef } from "react";

interface Props {
    searchTerm: string;
    fechaInicio: string;
    fechaFin: string;
    setFechaInicio: (fecha: string) => void;
    setFechaFin: (fecha: string) => void;
    onAplicarFiltro: (inicio: string, fin: string) => void;
}

const DateRangeFilter: React.FC<Props> = ({
    fechaInicio,
    fechaFin,
    setFechaInicio,
    setFechaFin,
    searchTerm,
}) => {
    const [mostrarFiltro, setMostrarFiltro] = useState(false);
    const estaVacio = searchTerm.length === 0;
    const todayLocal = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString().split("T")[0];
    const filtroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filtroRef.current && !filtroRef.current.contains(event.target as Node)) {
                setMostrarFiltro(false);
            }
        };

        if (mostrarFiltro) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }

    }, [mostrarFiltro]);

    return (
        <div className="relative" ref={filtroRef}>
            <button
                onClick={() => setMostrarFiltro(!mostrarFiltro)}
                className="bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-700"
            >
                Filtrar por Fechas
            </button>

            {mostrarFiltro && (
                <div className="absolute mt-2 p-4 border rounded shadow bg-white z-10">
                    <h2 className="text-sm font-semibold mb-2">Disponibilidad del Vehículo:</h2>
                    <div className="flex gap-2">
                        {/* Fecha Inicio */}
                        <div className="flex flex-col">
                            <label className="text-xs font-bold">Fecha Inicio</label>
                            <input
                            type="date"
                                min={todayLocal}
                                value={fechaInicio}
                                onChange={(e) => {
                                    const nuevaFechaInicio = e.target.value;
                                    setFechaInicio(nuevaFechaInicio);

                                    if (fechaFin && new Date(nuevaFechaInicio) > new Date (fechaFin)) {
                                        setFechaFin("");
                                    }
                                }}
                                className="border px-2 py-1 rounded w-[140px] text-sm"
                                title={estaVacio ? "Primero ingrese un término de búsqueda" : ""}
                            />
                        </div>
            
                        {/* Fecha Fin */}
                        <div className="flex flex-col">
                            <label className="text-xs font-bold">Fecha Fin</label>
                            <input
                            type="date"
                            min={fechaInicio || todayLocal}
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            className="border px-2 py-1 rounded w-[140px] text-sm"
                            title={estaVacio ? "Primero ingrese un término de búsqueda" : ""}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangeFilter;