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
    const [filtrosCombustible, setFiltrosCombustible] = useState<string[]>([]);
    const [filtrosCaracteristicas, setFiltrosCaracteristicas] = useState<{ asientos?: number; puertas?: number }>({});
    const [filtrosTransmision, setFiltrosTransmision] = useState<string[]>([]);
    const [filtrosCaracteristicasAdicionales, setFiltrosCaracteristicasAdicionales] = useState<string[]>([]);

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

    const normalizarTexto = (texto: string) => {
        return texto
            .normalize("NFD") 
            .replace(/[\u0300-\u036f]/g, "") 
            .toLowerCase(); 
    };
  

    const filtrarYOrdenarAutos = useCallback(() => {
        let resultado = [...autos];

        // Filtro por texto de búsqueda (marca o modelo)
        if (textoBusqueda.trim()) {
            console.log("Texto de búsqueda:", textoBusqueda);
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

        // Filtro por tipo de combustible
        if (filtrosCombustible.length > 0) {
            console.log("Aplicando filtro de combustible:", filtrosCombustible);
            resultado = resultado.filter(auto => {
                console.log("Combustibles del auto:", auto.combustibles);
                return auto.combustibles.some(combustible =>
                    filtrosCombustible.includes(combustible)
                );
            });
        }

        // Filtro por características del coche (asientos y puertas)
        if (filtrosCaracteristicas.asientos) {
            console.log("Aplicando filtro de asientos:", filtrosCaracteristicas.asientos);
            resultado = resultado.filter(auto => auto.asientos === filtrosCaracteristicas.asientos);
        }
        if (filtrosCaracteristicas.puertas) {
            console.log("Aplicando filtro de puertas:", filtrosCaracteristicas.puertas);
            resultado = resultado.filter(auto => auto.puertas === filtrosCaracteristicas.puertas);
        }

        // Filtro por transmisión
        if (filtrosTransmision.length > 0) {
            console.log("Aplicando filtro de transmisión:", filtrosTransmision);
            resultado = resultado.filter(auto => {
            console.log("Transmisión del auto:", auto.transmision);
            return filtrosTransmision.some(transmision =>
             auto.transmision.toLowerCase().includes(transmision.toLowerCase())
            );
           });
        }

        // Normalizar las características adicionales antes de la comparación
        if (filtrosCaracteristicasAdicionales.length > 0) {
             //console.log("Aplicando filtro de características adicionales:", filtrosCaracteristicasAdicionales);
             resultado = resultado.filter(auto => {
             //console.log("Revisando auto:", auto.idAuto || auto, "Características:", auto.caracteristicasAdicionales);
             return filtrosCaracteristicasAdicionales.every(caracteristica =>
             (auto.caracteristicasAdicionales || []).some(c => normalizarTexto(c).includes(normalizarTexto(caracteristica)))
           );
        });
}

        // Ordenar resultados
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
    }, [autos, textoBusqueda, filtrosCombustible, filtrosCaracteristicas, ordenSeleccionado, filtrosTransmision, filtrosCaracteristicasAdicionales]);

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
        filtrosCombustible,
        setFiltrosCombustible,
        filtrosCaracteristicas,
        setFiltrosCaracteristicas,
        filtrosTransmision,
        setFiltrosTransmision,
        filtrosCaracteristicasAdicionales,
        setFiltrosCaracteristicasAdicionales,
        obtenerSugerencia,
    };
}