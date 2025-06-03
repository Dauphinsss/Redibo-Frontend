import { useEffect, useMemo, useState, useCallback } from 'react';
import { AutoCard_Interfaces_Recode as Auto } from '@/app/busqueda/interface/AutoCard_Interface_Recode';
import { RawAuto_Interface_Recode as RawAuto } from '@/app/busqueda/interface/RawAuto_Interface_Recode';
import { getAllCars } from '@/app/busqueda/service/service_auto_recode';
import { transformAuto } from '@/app/busqueda/utils/transformAuto_Recode';
import { autosCercanosOrdenados } from "@/app/busqueda/components/map/filtroGPS"
import * as filtrosAPI from '@/app/busqueda/service/filtrosService_Recode';

export function useAutos(cantidadPorLote = 8, radio: number, punto: { lon: number, alt: number }, fechaInicio?: string, fechaFin?: string, ciudad?: string) {
  // ======== ESTADOS PRINCIPALES ========
  const [autos, setAutos] = useState<Auto[]>([]);
  const [autosFiltrados, setAutosFiltrados] = useState<Auto[]>([]);
  const [autosVisibles, setAutosVisibles] = useState(cantidadPorLote);
  const [cargando, setCargando] = useState(true);
  const [ordenSeleccionado, setOrdenSeleccionado] = useState('Recomendación');

  // ======== ESTADOS DE FILTROS EN MEMORIA (mantener igual) ========
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [fechaFiltroInicio, setFechaFiltroInicio] = useState("");
  const [fechaFiltroFin, setFechaFiltroFin] = useState("");
  const [filtroCiudad, setFiltroCiudad] = useState<string>('');
  const [filtrosCombustible, setFiltrosCombustible] = useState<string[]>([]);
  const [filtrosCaracteristicas, setFiltrosCaracteristicas] = useState<{ asientos?: number; puertas?: number }>({});
  const [filtrosTransmision, setFiltrosTransmision] = useState<string[]>([]);
  const [filtrosCaracteristicasAdicionales, setFiltrosCaracteristicasAdicionales] = useState<string[]>([]);
  const [filtroHost, setFiltroHost] = useState<string>('');

  // ======== ESTADOS PARA FILTROS DE BACKEND (mejorados) ========
  const [filtroPrecio, setFiltroPrecio] = useState<{min: number, max: number} | null>(null);
  const [filtroViajes, setFiltroViajes] = useState<number | null>(null);
  const [filtroCalificacion, setFiltroCalificacion] = useState<number | null>(null);
  const [cargandoFiltros, setCargandoFiltros] = useState(false);
  
  // Estados para manejar la restauración de filtros
  const [autosBaseParaBackend, setAutosBaseParaBackend] = useState<Auto[]>([]);
  const [hayFiltrosBackendActivos, setHayFiltrosBackendActivos] = useState(false);

  // ======== CARGA INICIAL (mantener igual) ========
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

  // Efecto para aplicar filtros iniciales desde URL
useEffect(() => {
  if (fechaInicio) {
    setFechaFiltroInicio(fechaInicio);
  }
  if (fechaFin) {
    setFechaFiltroFin(fechaFin);
  }
  if (ciudad) {
    setFiltroCiudad(ciudad);
  }
}, [fechaInicio, fechaFin, ciudad]);
  useEffect(() => {
    fetchAutos();
  }, []);

  // ======== UTILIDADES (mantener igual) ========
  const normalizarTexto = (texto: string) => {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // ======== LÓGICA DE FILTRADO EN MEMORIA (mantener la lógica original) ========
  const filtrarYOrdenarAutos = useCallback(() => {
    let resultado = [...autos];

    // Filtro por búsqueda de texto (marca/modelo)
    if (textoBusqueda.trim()) {
      const query = normalizarTexto(textoBusqueda.trim());
      resultado = resultado.filter(auto => {
        const autoTexto = `${auto.marca} ${auto.modelo}`;
        const textoNormalizado = normalizarTexto(autoTexto).replace(/[^\p{L}\p{N}\s.\-\/]/gu, "").replace(/\s+/g, " ").trim();
        const palabrasBusqueda = query.split(" ");
        return palabrasBusqueda.every(palabra => textoNormalizado.includes(palabra));
      });
      resultado.sort((a, b) => a.modelo.localeCompare(b.modelo));
    }

    // FILTRO POR HOST
    if (filtroHost && filtroHost.trim()) {
        console.log("Aplicando filtro de host:", filtroHost);
        const hostNormalizado = normalizarTexto(filtroHost.trim());
        resultado = resultado.filter(auto => {
            if (!auto.nombreHost || auto.nombreHost === "Sin nombre") {
                return false;
            }
            const nombreHostNormalizado = normalizarTexto(auto.nombreHost);
            return nombreHostNormalizado.includes(hostNormalizado);
        });
        console.log(`Autos filtrados por host "${filtroHost}":`, resultado.length);
    }

    // Filtro por fechas de disponibilidad
    resultado = resultado.filter(auto => {
      if (!auto.reservas || auto.reservas.length === 0) return true;

      const filtroInicio = fechaFiltroInicio ? new Date(fechaFiltroInicio) : null;
      const filtroFin = fechaFiltroFin ? new Date(fechaFiltroFin) : null;

      return !auto.reservas.some(reserva => {
        if (!['pendiente', 'confirmado'].includes(reserva.estado)) return false;

        const inicioReserva = new Date(reserva.fecha_inicio);
        const finReserva = new Date(reserva.fecha_fin);

        if (filtroInicio && !filtroFin) {
          return finReserva >= filtroInicio;
        }

        if (!filtroInicio && filtroFin) {
          return inicioReserva <= filtroFin;
        }

        if (filtroInicio && filtroFin) {
          return (
            inicioReserva <= filtroFin &&
            finReserva >= filtroInicio
          );
        }
        return false;
      });
    });

    // Filtro por tipo de combustible
    if (filtrosCombustible.length > 0) {
        console.log("Aplicando filtro de combustible:", filtrosCombustible);
        resultado = resultado.filter(auto => {
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
            return filtrosTransmision.some(transmision =>
                auto.transmision.toLowerCase().includes(transmision.toLowerCase())
            );
        });
    }

    // Filtro por características adicionales 
    if (filtrosCaracteristicasAdicionales.length > 0) {
        resultado = resultado.filter(auto => {
            return filtrosCaracteristicasAdicionales.every(caracteristica =>
                (auto.caracteristicasAdicionales || []).some(c => 
                    normalizarTexto(c).includes(normalizarTexto(caracteristica))
                )
            );
        });
    }

    // Filtro por ciudad
    if (filtroCiudad && filtroCiudad.trim()) {
        console.log("Aplicando filtro de ciudad:", filtroCiudad);
        resultado = resultado.filter(auto =>
            normalizarTexto(auto.ciudad).includes(normalizarTexto(filtroCiudad))
        );
    }

    // Filtro por GPS (proximidad)
    if (punto.alt !== 0 && punto.lon !== 0) {
      resultado = autosCercanosOrdenados(resultado, punto, radio * 1000)
    }

    // Guardar resultado base para filtros de backend
    setAutosBaseParaBackend(resultado);

    // Si no hay filtros de backend activos, aplicar ordenamiento normal
    if (!hayFiltrosBackendActivos) {
      // Ordenamiento
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
    }

    // Solo actualizar si no hay filtros de backend activos
    if (!hayFiltrosBackendActivos) {
      setAutosFiltrados(resultado);
    }
  }, [
    autos,
    textoBusqueda,
    filtroHost,
    filtrosCombustible,
    filtrosCaracteristicas,
    filtrosTransmision,
    filtrosCaracteristicasAdicionales,
    filtroCiudad,
    fechaFiltroInicio,
    fechaFiltroFin,
    punto,
    radio,
    ordenSeleccionado,
    hayFiltrosBackendActivos
  ]);

  useEffect(() => {
    filtrarYOrdenarAutos();
    setAutosVisibles(cantidadPorLote);
  }, [filtrarYOrdenarAutos, cantidadPorLote]);

  // ======== LÓGICA DE VISUALIZACIÓN ========
  const autosActuales = useMemo(() => {
    return autosFiltrados.slice(0, autosVisibles);
  }, [autosFiltrados, autosVisibles]);

  const mostrarMasAutos = () => {
    setAutosVisibles(prev => prev + cantidadPorLote);
  };

  // ======== LÓGICA DE SUGERENCIAS (mantener igual) ========
  const aplicarFormatoOriginal = (base: string, sugerenciaCompleta: string): string => {
    if (base === base.toLowerCase()) {
      return sugerenciaCompleta.toLowerCase();
    } else if (base === base.toUpperCase()) {
      return sugerenciaCompleta.toUpperCase();
    } else {
      return sugerenciaCompleta.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
      );
    }
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

    return aplicarFormatoOriginal(busqueda, busqueda + diferencia);
  };

  // ======== FILTROS DE BACKEND MEJORADOS ========
  const aplicarFiltroPrecio = useCallback(async (min: number, max: number) => {
    try {
        setCargandoFiltros(true);
        console.log('Aplicando filtro de precio:', { min, max });
        console.log('Base para filtro:', autosBaseParaBackend.length);
        
        // Si se desactiva el filtro
        if (min === 0 && max === Infinity) {
            setAutosFiltrados(autosBaseParaBackend);
            setFiltroPrecio(null);
            setHayFiltrosBackendActivos(false);
            setOrdenSeleccionado('Recomendación');
            return;
        }
        
        // Usar la base filtrada por los filtros en memoria
        const baseParaFiltro = autosBaseParaBackend.length > 0 ? autosBaseParaBackend : autosFiltrados;
        const ids = baseParaFiltro.map(a => parseInt(a.idAuto, 10));
        
        const datos = await filtrosAPI.filtrarPorPrecio({ 
            minPrecio: min, 
            maxPrecio: max, 
            idsCarros: ids 
        });
        
        const idsFiltrados = datos.map((d: { id: number }) => d.id);
        const nuevosFiltrados = baseParaFiltro.filter(a => 
            idsFiltrados.includes(parseInt(a.idAuto, 10))
        );
        
        nuevosFiltrados.sort((a, b) => a.precioPorDia - b.precioPorDia);
        
        console.log('Autos después del filtro:', nuevosFiltrados.length);
        setAutosFiltrados(nuevosFiltrados);
        setFiltroPrecio({ min, max });
        setHayFiltrosBackendActivos(true);
        setOrdenSeleccionado('Precio bajo a alto');
    } catch (error) {
        console.error('Error al aplicar filtro de precio:', error);
    } finally {
        setCargandoFiltros(false);
    }
  }, [autosBaseParaBackend, autosFiltrados]);

  const aplicarFiltroViajes = useCallback(async (minViajes: number) => {
    try {
        setCargandoFiltros(true);
        console.log('Aplicando filtro de viajes:', { minViajes });
        console.log('Base para filtro:', autosBaseParaBackend.length);
        
        if (minViajes === 0) {
            setAutosFiltrados(autosBaseParaBackend);
            setFiltroViajes(null);
            setHayFiltrosBackendActivos(false);
            return;
        }
        
        const baseParaFiltro = autosBaseParaBackend.length > 0 ? autosBaseParaBackend : autosFiltrados;
        const ids = baseParaFiltro.map(a => parseInt(a.idAuto, 10));
        
        const datos = await filtrosAPI.filtrarPorViajes({ 
            minViajes, 
            idsCarros: ids 
        });
        
        const idsFiltrados = datos.map((d: { id: number }) => d.id);
        const nuevosFiltrados = baseParaFiltro.filter(a => 
            idsFiltrados.includes(parseInt(a.idAuto, 10))
        );
        
        console.log('Autos después del filtro:', nuevosFiltrados.length);
        setAutosFiltrados(nuevosFiltrados);
        setFiltroViajes(minViajes);
        setHayFiltrosBackendActivos(true);
    } catch (error) {
        console.error('Error al aplicar filtro de viajes:', error);
    } finally {
        setCargandoFiltros(false);
    }
  }, [autosBaseParaBackend, autosFiltrados]);

  const aplicarFiltroCalificacion = useCallback(async (minCalificacion: number) => {
    try {
        setCargandoFiltros(true);
        console.log('Aplicando filtro de calificación:', { minCalificacion });
        console.log('Base para filtro:', autosBaseParaBackend.length);
        
        if (minCalificacion === 0) {
            setAutosFiltrados(autosBaseParaBackend);
            setFiltroCalificacion(null);
            setHayFiltrosBackendActivos(false);
            return;
        }
        
        const baseParaFiltro = autosBaseParaBackend.length > 0 ? autosBaseParaBackend : autosFiltrados;
        const ids = baseParaFiltro.map(a => parseInt(a.idAuto, 10));
        
        const datos = await filtrosAPI.filtrarPorCalificacion({ 
            minCalificacion, 
            idsCarros: ids 
        });
        
        const idsFiltrados = datos.map((d: { id: number }) => d.id);
        const nuevosFiltrados = baseParaFiltro.filter(a => 
            idsFiltrados.includes(parseInt(a.idAuto, 10))
        );
        
        console.log('Autos después del filtro:', nuevosFiltrados.length);
        setAutosFiltrados(nuevosFiltrados);
        setFiltroCalificacion(minCalificacion);
        setHayFiltrosBackendActivos(true);
    } catch (error) {
        console.error('Error al aplicar filtro de calificación:', error);
    } finally {
        setCargandoFiltros(false);
    }
  }, [autosBaseParaBackend, autosFiltrados]);

  // ======== FUNCIÓN PARA LIMPIAR TODOS LOS FILTROS ========
  const limpiarFiltros = useCallback(() => {
    setTextoBusqueda('');
    setFiltroHost('');
    setFechaFiltroInicio('');
    setFechaFiltroFin('');
    setFiltroCiudad('');
    setFiltrosCombustible([]);
    setFiltrosCaracteristicas({});
    setFiltrosTransmision([]);
    setFiltrosCaracteristicasAdicionales([]);
    setFiltroPrecio(null);
    setFiltroViajes(null);
    setFiltroCalificacion(null);
    setHayFiltrosBackendActivos(false);
    setAutosFiltrados(autos);
    setOrdenSeleccionado('Recomendación');
  }, [autos]);

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
    obtenerSugerencia,
    filtroCiudad,
    setFiltroCiudad,
    cargandoFiltros,
    aplicarFiltroPrecio,
    aplicarFiltroViajes,
    aplicarFiltroCalificacion,
    filtroPrecio,
    filtroViajes,
    filtroCalificacion,
    filtrosCombustible,
    setFiltrosCombustible,
    filtrosCaracteristicas,
    setFiltrosCaracteristicas,
    filtrosTransmision,
    setFiltrosTransmision,
    filtrosCaracteristicasAdicionales,
    setFiltrosCaracteristicasAdicionales,
    filtroHost,
    setFiltroHost,
    limpiarFiltros
  };
}