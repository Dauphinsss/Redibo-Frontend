import { useEffect, useMemo, useState } from 'react';
import { AutoCard_Interfaces_Recode as Auto } from '@/interface/AutoCard_Interface_Recode';
import { RawAuto_Interface_Recode as RawAuto } from '@/interface/RawAuto_Interface_Recode';
import { getAllCars } from '@/service/services_Recode';
import { transformAuto } from '@/utils/transformAuto_Recode';

export function useAutos(cantidadPorLote = 8) {
    const [autos, setAutos] = useState<Auto[]>([]);
    const [autosFiltrados, setAutosFiltrados] = useState<Auto[]>([]);
    const [autosVisibles, setAutosVisibles] = useState(cantidadPorLote);
    const [cargando, setCargando] = useState(true);
    const [ordenSeleccionado, setOrdenSeleccionado] = useState('Recomendación');

    // Cargar autos desde API
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

    useEffect(() => {
        fetchAutos();
    }, []);

    // Autos visibles actualmente (paginación por lote)
    const autosActuales = useMemo(() => {
        return autosFiltrados.slice(0, autosVisibles);
    }, [autosFiltrados, autosVisibles]);

    const mostrarMasAutos = () => {
        setAutosVisibles((prev) => prev + cantidadPorLote);
    };

    // Búsqueda por texto (marca o modelo)
    const filtrarAutos = (query: string) => {
        if (!query.trim()) {
        setAutosFiltrados(autos);
        return;
        }

        const resultados = autos.filter(auto =>
        auto.modelo.toLowerCase().includes(query.toLowerCase()) ||
        auto.marca.toLowerCase().includes(query.toLowerCase())
        );

        setAutosFiltrados(resultados);
    };

    return {
        autos,
        autosFiltrados,
        autosActuales,
        autosVisibles,
        ordenSeleccionado,
        setOrdenSeleccionado,
        setAutosFiltrados,
        mostrarMasAutos,
        cargando,
        filtrarAutos
    };
}
