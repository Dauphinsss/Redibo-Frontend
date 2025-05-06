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
    const [fechaFiltroInicio, setFechaFiltroInicio] = useState("");
    const [fechaFiltroFin, setFechaFiltroFin] = useState("");

    const fetchAutos = async () => {
        try {
        setCargando(true);
        const rawData: RawAuto[] = await getAllCars();
        console.log("Raw autos:", rawData);
        
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

        if (textoBusqueda.trim()) {
        const query =normalizarTexto(textoBusqueda.trim());
            resultado = resultado.filter(auto => {
                const autoTexto = `${auto.marca} ${auto.modelo}`;
                const textoNormalizado = normalizarTexto(autoTexto).replace(/[^\p{L}\p{N}\s.\-\/]/gu, "").replace(/\s+/g, " ").trim();
                const palabrasBusqueda = query.split(" ");
                return palabrasBusqueda.every(palabra => textoNormalizado.includes(palabra));
                /*return palabrasBusqueda.every(palabra =>
                  textoNormalizado.split(" ").some(palabraTexto =>
                      palabraTexto.startsWith(palabra)
                  )
              );*/
            });
            resultado.sort((a, b) => a.modelo.localeCompare(b.modelo));
        }

        {/* Filtro de fechas */}
        if (fechaFiltroInicio || fechaFiltroFin) {
          resultado = resultado.filter(auto => {
            const desde = new Date(auto.disponible_desde);
            const hasta = new Date(auto.disponible_hasta);
            console.log("Desde:", desde, "Hasta:", hasta);
            console.log("Fecha Inicio:", fechaFiltroInicio, "Fecha Fin:", fechaFiltroFin);

            if (fechaFiltroInicio && fechaFiltroFin) {
              const inicio = new Date(fechaFiltroInicio);
              const fin = new Date (fechaFiltroFin);
              return desde <= inicio && hasta >= fin;
            } else if (fechaFiltroInicio) {
              const inicio = new Date(fechaFiltroInicio);
              return desde <= inicio;
            } else if (fechaFiltroFin) {
              const fin = new Date(fechaFiltroFin);
              return hasta >= fin;
            }

            return true;
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
    }, [autos, textoBusqueda, ordenSeleccionado, fechaFiltroInicio, fechaFiltroFin]);

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
        filtrarAutos: (termino: string, fechaInicio?: string, fechaFin?: string) => {
          setTextoBusqueda(termino);
          setFechaFiltroInicio(fechaInicio || "");
          setFechaFiltroFin(fechaFin || "");
        },
        obtenerSugerencia
    };
}