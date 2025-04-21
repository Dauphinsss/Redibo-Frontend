'use client';

import { useAutos } from '@/hooks/useAutos_hook_Recode';
import RecodeCarList from '@/components/recodeComponentes/carCard/CarListRecode';
import SearchBar from '@/components/recodeComponentes/seccionOrdenarMasResultados/RecodeSearchBar';
import HeaderBusquedaRecode from '@/components/recodeComponentes/seccionOrdenarMasResultados/HeaderBusquedaRecode';
import AutoSkeletonList from '@/components/recodeComponentes/carCard/CarSkeletonListRecode' 

export default function Home() {
    const {
        autos,
        autosFiltrados,
        autosActuales,
        autosVisibles,
        ordenSeleccionado,
        setOrdenSeleccionado,
        setAutosFiltrados,
        mostrarMasAutos,
        cargando,
        filtrarAutos,
    } = useAutos(8);

    return (
        <main className="p-4 max-w-[1440px] mx-auto">
        <div className="mb-6 flex flex-col items-center justify-center px-4">
            <SearchBar
            placeholder="Buscar por modelo, marca"
            onFiltrar={filtrarAutos}
            />
            <div className="mb-6">{/* RecodeCarousel */}</div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
            <div className="max-w-[750px] mx-auto w-full">
                <HeaderBusquedaRecode
                autosTotales={autos}
                autosFiltrados={autosFiltrados}
                autosMostrados={autosActuales}
                ordenSeleccionado={ordenSeleccionado}
                setOrdenSeleccionado={setOrdenSeleccionado}
                setAutosFiltrados={setAutosFiltrados}
                />

                {cargando ? (
                <AutoSkeletonList />
                ) : autosActuales.length === 0 ? (
                <p className="text-center text-gray-500">
                    No se encontraron autos con los filtros aplicados.
                </p>
                ) : (
                <RecodeCarList carCards={autosActuales} />
                )}

                {!cargando && autosVisibles < autosFiltrados.length && (
                <div className="mt-6 flex justify-center">
                    <button
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                    onClick={mostrarMasAutos}
                    >
                    {autosVisibles + 8 < autosFiltrados.length
                        ? 'Ver más resultados'
                        : 'Ver todos los resultados'}
                    </button>
                </div>
                )}
            </div>
            </div>

            <div className="hidden lg:flex lg:w-1/3 bg-gray-100 h-[300px] rounded shadow-inner items-center justify-center text-gray-500">
                RecodeMapView próximamente
            </div>
        </div>
        </main>
    );
}