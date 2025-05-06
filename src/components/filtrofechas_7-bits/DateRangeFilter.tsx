"use client";

interface Props {
    searchTerm: string;
    fechaInicio: string;
    fechaFin: string;
    setFechaInicio: (fecha: string) => void;
    setFechaFin: (fecha: string) => void;
}

const DateRangeFilter: React.FC<Props> = ({
    fechaInicio,
    fechaFin,
    setFechaInicio,
    setFechaFin,
    searchTerm,
}) => {
    const estaVacio = searchTerm.length === 0;

    return (
        <div className="flex flex-col">
            <h2 className="text-sm font-semibold mb-2">Disponibilidad para reserva:</h2>
            <div className="flex gap-2">
                {/* Fecha Inicio */}
                <div className="flex flex-col">
                    <label className="text-xs font-bold">Fecha Inicio</label>
                    <input
                    type="date"
                        min={new Date().toISOString().split("T")[0]}
                        disabled={estaVacio}
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        className="border px-2 py-1 rounded w-[140px] text-sm"
                        title={estaVacio ? "Primero ingrese un término de búsqueda" : ""}
                    />
                </div>
      
                {/* Fecha Fin */}
                <div className="flex flex-col">
                    <label className="text-xs font-bold">Fecha Fin</label>
                    <input
                    type="date"
                    min={fechaInicio || new Date().toISOString().split("T")[0]}
                    disabled={estaVacio}
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="border px-2 py-1 rounded w-[140px] text-sm"
                    title={estaVacio ? "Primero ingrese un término de búsqueda" : ""}
                    />
                </div>
            </div>
                {estaVacio && (
                <div className="text-xs text-gray-500 mb-1">
                    Busque algo para activar el filtro
                </div>
                )}
        </div>
    );
};

export default DateRangeFilter;