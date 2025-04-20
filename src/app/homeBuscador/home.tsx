'use client';

import { useEffect, useState } from 'react';
import RecodeCarList from '@/components/recodeComponentes/carCard/CarListRecode';
import SearchBar from '@/components/recodeComponentes/RecodeSearchBar';
import { AutoCard_Interfaces_Recode as Auto } from '@/interface/AutoCard_Interface_Recode';
import { RawAuto_Interface_Recode as RawAuto } from '@/interface/RawAuto_Interface_Recode';
import { transformAuto } from '@/utils/transformAuto_Recode';
import { getAllCars } from '@/service/services_Recode';
import HeaderBusquedaRecode from '@/components/recodeComponentes/seccionOrdenarMasResultados/HeaderBusquedaRecode';

export default function Home() {
    const CANTIDAD_POR_LOTE = 8;

    const [autos, setAutos] = useState<Auto[]>([]);
    const [autosFiltrados, setAutosFiltrados] = useState<Auto[]>([]);
    const [autosVisibles, setAutosVisibles] = useState(CANTIDAD_POR_LOTE);
    const [cargando, setCargando] = useState(true);

    const [ordenSeleccionado, setOrdenSeleccionado] = useState('Recomendación');

    const mostrarMasAutos = () => {
        setAutosVisibles((prev) => prev + CANTIDAD_POR_LOTE);
    };

    useEffect(() => {
        const fetchAutos = async () => {
            try {
                setCargando(true);
                const rawData: RawAuto[] = await getAllCars();
                const transformed = rawData.map(transformAuto);
                setAutos(transformed);
                setAutosFiltrados(transformed);
            } catch (error) {
                console.error('Error al cargar los autos:', error);
                alert('No se pudo cargar los autos. Intenta de nuevo más tarde.');
            } finally {
                setCargando(false);
            }
        };

        fetchAutos();
    }, []);

    const autosActuales = autosFiltrados.slice(0, autosVisibles);

    return (
        <main className="p-4 max-w-[1440px] mx-auto">
            <div className="mb-6 flex flex-col items-center justify-center">
                <SearchBar
                    placeholder="Buscar por nombre, marca"
                    autos={autos}
                    onFiltrar={setAutosFiltrados}
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
                            <p className="text-center text-gray-500">Cargando autos...</p>
                        ) : (
                            <RecodeCarList carCards={autosActuales} />
                        )}

                        {!cargando && autosVisibles < autosFiltrados.length && (
                            <div className="mt-6 flex justify-center">
                                <button
                                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                                    onClick={mostrarMasAutos}
                                >
                                    Ver más resultados
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="md:w-1/3 bg-gray-100 h-[300px] rounded shadow-inner flex items-center justify-center text-gray-500">
                    RecodeMapView próximamente
                </div>
            </div>
        </main>
    );
}