import React from "react";

interface DateRangeFilterProps {
    fechaInicio: string;
    fechaFin: string;
    setFechaInicio: (fecha: string) => void;
    setFechaFin: (fecha: string) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
    fechaInicio,
    fechaFin,
    setFechaInicio,
    setFechaFin,
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div>
                <label className="text-sm font-medium text-gray-600">Fecha Inicio</label>
                <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                />
            </div>

            <div>
                <label className="text-sm font-medium text-gray-600">Fecha Fin</label>
                <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin}
                    className="border border-gray-300 rounded-md p-2 w-full"
                />
            </div>
        </div>
    );
};