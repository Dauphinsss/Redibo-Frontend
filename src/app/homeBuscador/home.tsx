'use client';

import { useEffect, useState } from 'react';
import RecodeCarList from '@/components/recodeComponentes/carCard/CarListRecode';
import SearchBar from '@/components/recodeComponentes/RecodeSearchBar';
import Filter from '@/components/recodeComponentes/RecodeFilter';
import { AutoCard_Interfaces_Recode as Auto } from '@/interface/AutoCard_Interface_Recode';
import { RawAuto_Interface_Recode as RawAuto } from '@/interface/RawAuto_Interface_Recode';
import { transformAuto } from '@/utils/transformAuto_Recode';
import { getAllCars } from '@/service/services_Recode';

export default function Home() {
    const CANTIDAD_POR_LOTE = 8;

    const [autos, setAutos] = useState<Auto[]>([]);
    const [autosFiltrados, setAutosFiltrados] = useState<Auto[]>([]);
    const [autosVisibles, setAutosVisibles] = useState(CANTIDAD_POR_LOTE);
    const [cargando, setCargando] = useState(true);

    const [ordenSeleccionado, setOrdenSeleccionado] = useState("Ordenados por");

    const ordenados = [
        'Precio bajo a alto',
        'Precio alto a bajo',
        'Modelo Ascendente',
        'Modelo Descendente'
    ];

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

    const ordenarAutos = (lista: Auto[]) => {
        const ordenadosLista = [...lista];
    
        switch (ordenSeleccionado) {
            case 'Modelo Ascendente':
                ordenadosLista.sort((a, b) => a.modelo.localeCompare(b.modelo));
                break;
            case 'Modelo Descendente':
                ordenadosLista.sort((a, b) => b.modelo.localeCompare(a.modelo));
                break;
            case 'Precio bajo a alto':
                ordenadosLista.sort(
                    (a, b) =>
                        parseFloat(a.precioPorDia.replace("Bs. ", "")) -
                        parseFloat(b.precioPorDia.replace("Bs. ", ""))
                );
                break;
            case 'Precio alto a bajo':
                ordenadosLista.sort(
                    (a, b) =>
                        parseFloat(b.precioPorDia.replace("Bs. ", "")) -
                        parseFloat(a.precioPorDia.replace("Bs. ", ""))
                );
                break;
        }
    
        return ordenadosLista;
    };
    

    useEffect(()=> {
        const nuevaLista = ordenarAutos(autosFiltrados);
        setAutosFiltrados(nuevaLista);
    },[ordenSeleccionado])

    const autosActuales = autosFiltrados.slice(0, autosVisibles);

    return (
        <main className="p-4 max-w-[1440px] mx-auto">
        <div className="mb-6 flex flex-col items-center justify-center">
            <SearchBar
            placeholder="Buscar por nombre, marca"
            autos={autos}
            onFiltrar={(resultadosFiltrados) => {
                setAutosFiltrados(ordenarAutos(resultadosFiltrados));
            }}
            />
            <div className="mb-6">{/* RecodeCarousel */}</div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
            <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <p className="text-gray-600">
                Mostrando <span className="font-semibold">{autosActuales.length}</span> de{' '}
                <span className="font-semibold">{autosFiltrados.length}</span> resultados
                </p>
                <div className="w-full sm:w-[300px] mt-2 sm:mt-0">
                <Filter lista={ordenados} nombre="Ordenados por" onChange={setOrdenSeleccionado} />
                </div>
            </div>

            <div>
                {cargando ? (
                <p className="text-center text-gray-500">Cargando autos...</p>
                ) : (
                <RecodeCarList carCards={autosActuales} />
                )}
            </div>

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

            <div className="md:w-1/3 bg-gray-100 h-[300px] rounded shadow-inner flex items-center justify-center text-gray-500">
            RecodeMapView próximamente
            </div>
        </div>
        </main>
    );
}
