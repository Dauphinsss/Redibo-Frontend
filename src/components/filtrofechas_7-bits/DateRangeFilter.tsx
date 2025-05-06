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
        <div className="flex gap-2">
            <div className="flex flex-col">
                <label className="text-xs font-bold">Fecha Inicio</label>
                <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    disabled={estaVacio}
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="border px-2 py-1 rounded w-[140px] text-sm"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-xs font-bold">Fecha Fin</label>
                <input
                    type="date"
                    min={fechaInicio || new Date().toISOString().split("T")[0]}
                    disabled={estaVacio}
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="border px-2 py-1 rounded w-[140px] text-sm"
                />
            </div>
        </div>
    );
};

export default DateRangeFilter;