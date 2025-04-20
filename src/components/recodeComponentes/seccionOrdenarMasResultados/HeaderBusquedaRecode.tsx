'use client';

import OrdenadorBusquedaRecode from './OrdenadorBusquedaRecode';
import { AutoCard_Interfaces_Recode as Auto } from '@/interface/AutoCard_Interface_Recode';

interface Props {
    autosTotales: Auto[];
    autosFiltrados: Auto[];
    autosMostrados: Auto[];
    ordenSeleccionado: string;
    setOrdenSeleccionado: (orden: string) => void;
    setAutosFiltrados: (autos: Auto[]) => void;
}

export default function HeaderBusquedaRecode({
    autosTotales,
    autosFiltrados,
    autosMostrados,
    ordenSeleccionado,
    setOrdenSeleccionado,
    setAutosFiltrados,
    }: Props) {
    return (
        <div className="w-full px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <p className="text-gray-600 text-sm sm:text-base">
            Mostrando <span className="font-semibold">{autosMostrados.length}</span> de{' '}
            <span className="font-semibold">{autosFiltrados.length}</span> resultados
        </p>
        <div className="w-full sm:w-auto">
            <OrdenadorBusquedaRecode
            autos={autosTotales}
            ordenSeleccionado={ordenSeleccionado}
            setOrdenSeleccionado={setOrdenSeleccionado}
            setAutosFiltrados={setAutosFiltrados}
            />
        </div>
        </div>
    );
}
