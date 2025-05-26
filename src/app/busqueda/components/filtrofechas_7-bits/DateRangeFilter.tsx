"use client";
import { useState, useEffect, useRef } from "react";
import { AutoCard_Interfaces_Recode as Auto } from '@/app/busqueda/interface/AutoCard_Interface_Recode';

interface Props {
    searchTerm: string;
    fechaInicio: string;
    fechaFin: string;
    setFechaInicio: (fecha: string) => void;
    setFechaFin: (fecha: string) => void;
    autosActuales: Auto[];
    autosTotales: Auto[];
    onAplicarFiltro: (inicio: string, fin: string) => void;
}

const DateRangeFilter: React.FC<Props> = ({
    fechaInicio,
    fechaFin,
    setFechaInicio,
    setFechaFin,
    searchTerm,
    autosActuales,
    autosTotales,
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
        <div className="flex items-center gap-2" ref={filtroRef}>
            <button
                onClick={() => setMostrarFiltro(!mostrarFiltro)}
                className={`h-10 px-4 py-2 rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 whitespace-nowrap ${
                    mostrarFiltro 
                        ? 'bg-secondary hover:bg-secondary/80 ring-2 ring-black' 
                        : ''
                }`}
                disabled={estaVacio}
            >
                Filtrar por Fechas
                <span className="ml-2">{mostrarFiltro ? '↑' : '↓'}</span>
            </button>

            {mostrarFiltro && (
                <div className="flex items-center gap-3 p-4 border border-border rounded-md bg-card text-card-foreground shadow-sm animate-in slide-in-from-left-2 duration-200">
                    <div className="text-sm font-medium text-foreground whitespace-nowrap">
                        Disponibilidad del Vehículo:
                    </div>
                    
                    {/* Fecha Inicio */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-muted-foreground">Fecha Inicio</label>
                        <input
                            type="date"
                            min={todayLocal}
                            value={fechaInicio}
                            onChange={(e) => {
                                const nuevaFechaInicio = e.target.value;
                                setFechaInicio(nuevaFechaInicio);

                                if (fechaFin && new Date(nuevaFechaInicio) > new Date(fechaFin)) {
                                    setFechaFin("");
                                }
                            }}
                            className="flex h-9 w-[140px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            title={estaVacio ? "Primero ingrese un término de búsqueda" : ""}
                        />
                    </div>

                    {/* Fecha Fin */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-muted-foreground">Fecha Fin</label>
                        <input
                            type="date"
                            min={fechaInicio || todayLocal}
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            className="flex h-9 w-[140px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            title={estaVacio ? "Primero ingrese un término de búsqueda" : ""}
                        />
                    </div>

                    <div className="text-xs text-muted-foreground bg-muted rounded px-2 py-1 whitespace-nowrap">
                        Mostrando {autosActuales.length} de {autosTotales.length} resultados
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangeFilter;