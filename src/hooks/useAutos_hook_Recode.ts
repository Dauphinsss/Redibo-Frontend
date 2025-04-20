import { useEffect, useMemo, useState, useCallback } from 'react';
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
    const [textoBusqueda, setTextoBusqueda] = useState('');

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

    const filtrarYOrdenarAutos = useCallback(() => {
        let resultado = [...autos];

        if (textoBusqueda.trim()) {
        const query = textoBusqueda.trim().toLowerCase();
        resultado = resultado.filter(auto =>
            `${auto.modelo} ${auto.marca}`.toLowerCase().includes(query)
        );
        }

        switch (ordenSeleccionado) {
        case 'Modelo Ascendente':
            resultado.sort((a, b) => a.modelo.localeCompare(b.modelo));
            break;
        case 'Modelo Descendente':
            resultado.sort((a, b) => b.modelo.localeCompare(a.modelo));
            break;
        case 'Precio bajo a alto':
            resultado.sort((a, b) => a.precioPorDia - b.precioPorDia);
            break;
        case 'Precio alto a bajo':
            resultado.sort((a, b) => b.precioPorDia - a.precioPorDia);
            break;
        }

        setAutosFiltrados(resultado);
    }, [autos, textoBusqueda, ordenSeleccionado]);

    useEffect(() => {
        filtrarYOrdenarAutos();
    }, [filtrarYOrdenarAutos]);

    const autosActuales = useMemo(() => {
        return autosFiltrados.slice(0, autosVisibles);
    }, [autosFiltrados, autosVisibles]);

    const mostrarMasAutos = () => {
        setAutosVisibles(prev => prev + cantidadPorLote);
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
        filtrarAutos: setTextoBusqueda,
    };
}