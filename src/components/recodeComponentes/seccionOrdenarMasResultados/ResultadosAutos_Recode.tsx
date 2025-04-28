"use client";

import RecodeCarList from "../carCard/CarListRecode";
import AutoSkeletonList from "../carCard/CarSkeletonListRecode";
import { AutoCard_Interfaces_Recode as Auto } from "@/interface/AutoCard_Interface_Recode";

interface Props {
    cargando: boolean;
    autosActuales: Auto[];
    autosFiltrados: Auto[];
    autosVisibles: number;
    mostrarMasAutos: () => void;
}

export default function ResultadosAutos({
    cargando,
    autosActuales,
    autosFiltrados,
    autosVisibles,
    mostrarMasAutos,
    }: Props) {
    if (cargando) return <AutoSkeletonList />;

    if (autosActuales.length === 0) {
        return (
        <p className="text-center text-gray-500">
            No se encontraron autos con los filtros aplicados.
        </p>
        );
    }

    return (
        <>
        <RecodeCarList carCards={autosActuales} />
        {autosVisibles < autosFiltrados.length && (
            <div className="mt-6 flex justify-center">
            <button
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                onClick={mostrarMasAutos}
            >
                {autosVisibles + 8 < autosFiltrados.length
                ? "Ver más resultados"
                : "Ver todos los resultados"}
            </button>
            </div>
        )}
        </>
    );
}
