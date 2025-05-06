import { useEffect, useMemo, useState, useCallback } from 'react';
import { AutoCard_Interfaces_Recode as Auto } from '@/interface/AutoCard_Interface_Recode';
import { RawAuto_Interface_Recode as RawAuto } from '@/interface/RawAuto_Interface_Recode';
import { getAllCars } from '@/service/services_Recode';
import { transformAuto } from '@/utils/transformAuto_Recode';
import { 
    filtrarPorPrecio, 
    filtrarPorViajes, 
    filtrarPorCalificacion
} from '@/service/filtrosService_Recode';

export function useAutos(cantidadPorLote = 8) {
    const [autos, setAutos] = useState<Auto[]>([]);
    const [autosFiltrados, setAutosFiltrados] = useState<Auto[]>([]);
    const [autosVisibles, setAutosVisibles] = useState(cantidadPorLote);
    const [cargando, setCargando] = useState(true);
    const [ordenSeleccionado, setOrdenSeleccionado] = useState('Recomendación');
    const [textoBusqueda, setTextoBusqueda] = useState('');
    const [idsCarrosActuales, setIdsCarrosActuales] = useState<number[]>([]);
    const [filtrosAplicados, setFiltrosAplicados] = useState({
        precio: { min: 0, max: Infinity },
        viajes: 0,
        calificacion: 0
    });

    const fetchAutos = async () => {
        try {
            setCargando(true);
            const rawData: RawAuto[] = await getAllCars();
            const transformed = rawData.map(transformAuto);
            setAutos(transformed);
            setAutosFiltrados(transformed);
            setIdsCarrosActuales(transformed.map(auto => Number(auto.idAuto)));
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

    const aplicarFiltroPrecio = async (min: number, max: number) => {
        try {
            setCargando(true);
            const resultado = await filtrarPorPrecio({
                minPrecio: min,
                maxPrecio: max,
                idsCarros: idsCarrosActuales
            });
            setAutosFiltrados(resultado);
            setIdsCarrosActuales(resultado.map((auto: Auto) => Number(auto.idAuto)));
            setFiltrosAplicados(prev => ({
                ...prev,
                precio: { min, max }
            }));
        } catch (error) {
            console.error('Error al aplicar filtro de precio:', error);
        } finally {
            setCargando(false);
        }
    };

    const aplicarFiltroViajes = async (minViajes: number) => {
        try {
            setCargando(true);
            const resultado = await filtrarPorViajes({
                minViajes,
                idsCarros: idsCarrosActuales
            });
            setAutosFiltrados(resultado);
            setIdsCarrosActuales(resultado.map((auto: Auto) => Number(auto.idAuto)));
            setFiltrosAplicados(prev => ({
                ...prev,
                viajes: minViajes
            }));
        } catch (error) {
            console.error('Error al aplicar filtro de viajes:', error);
        } finally {
            setCargando(false);
        }
    };

    const aplicarFiltroCalificacion = async (minCalificacion: number) => {
        try {
            setCargando(true);
            const resultado = await filtrarPorCalificacion({
                minCalificacion,
                idsCarros: idsCarrosActuales
            });
            setAutosFiltrados(resultado);
            setIdsCarrosActuales(resultado.map((auto: Auto) => Number(auto.idAuto)));
            setFiltrosAplicados(prev => ({
                ...prev,
                calificacion: minCalificacion
            }));
        } catch (error) {
            console.error('Error al aplicar filtro de calificación:', error);
        } finally {
            setCargando(false);
        }
    };

    const normalizarTexto = (texto: string) => {
        return texto
            .normalize("NFD") 
            .replace(/[\u0300-\u036f]/g, "") 
            .toLowerCase(); 
    };

    const filtrarYOrdenarAutos = useCallback(() => {
        let resultado = [...autos];

        if (textoBusqueda.trim()) {
            const query = normalizarTexto(textoBusqueda.trim());
            resultado = resultado.filter(auto => {
                const autoTexto = `${auto.marca} ${auto.modelo}`;
                const textoNormalizado = normalizarTexto(autoTexto)
                    .replace(/[^\p{L}\p{N}\s.\-\/]/gu, "")
                    .replace(/\s+/g, " ")
                    .trim();
                const palabrasBusqueda = query.split(" ");
                return palabrasBusqueda.every(palabra => textoNormalizado.includes(palabra));
            });
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
        setAutosVisibles(cantidadPorLote);
    }, [filtrarYOrdenarAutos, cantidadPorLote]);

    const autosActuales = useMemo(() => {
        return autosFiltrados.slice(0, autosVisibles);
    }, [autosFiltrados, autosVisibles]);

    const mostrarMasAutos = () => {
        setAutosVisibles(prev => prev + cantidadPorLote);
    };

    const obtenerSugerencia = (busqueda: string): string => {
        if (!busqueda.trim()) return "";
    
        const normalizar = (t: string) =>
            t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    
        const textoSinEspaciosExtra = busqueda.replace(/\s+/g, " ").trimStart();
        const normalizadoTexto = normalizar(textoSinEspaciosExtra);
    
        const match = autosFiltrados.find((auto) => {
            const combinaciones = [
                `${auto.marca} ${auto.modelo}`,
                `${auto.modelo} ${auto.marca}`,
            ];
    
            return combinaciones.some((combinado) => {
                const combinadoNormalizado = normalizar(combinado)
                    .replace(/[^\p{L}\p{N}\s.\-\/]/gu, "")
                    .replace(/\s+/g, " ")
                    .trim();
                return combinadoNormalizado.startsWith(normalizadoTexto);
            });
        });
    
        if (!match) return "";
    
        const posiblesSugerencias = [
            `${match.marca} ${match.modelo}`,
            `${match.modelo} ${match.marca}`,
        ];
    
        const sugerencia = posiblesSugerencias.find((s) => {
            const sNormal = normalizar(s).replace(/\s+/g, " ").trim();
            return sNormal.startsWith(normalizadoTexto);
        }) || posiblesSugerencias[0];
    
        const diferencia = sugerencia.slice(textoSinEspaciosExtra.length);
    
        return busqueda + diferencia;
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
        obtenerSugerencia,
        aplicarFiltroPrecio,
        aplicarFiltroViajes,
        aplicarFiltroCalificacion,
        filtrosAplicados
    };
}