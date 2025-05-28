import { useEffect, useMemo, useState, useCallback } from 'react';
import { AutoCard_Interfaces_Recode as Auto } from '@/app/busqueda/interface/AutoCard_Interface_Recode';
import { RawAuto_Interface_Recode as RawAuto } from '@/app/busqueda/interface/RawAuto_Interface_Recode';
import { getAllCars } from '@/app/busqueda/service/service_auto_recode';
import { transformAuto } from '@/app/busqueda/utils/transformAuto_Recode';
import { autosCercanosOrdenados } from "@/app/busqueda/components/map/filtroGPS"
import * as filtrosAPI from '@/app/busqueda/service/filtrosService_Recode';

export function useAutos(cantidadPorLote = 8, radio: number, punto: { lon: number, alt: number }) {
  const [autos, setAutos] = useState<Auto[]>([]);
  const [autosFiltrados, setAutosFiltrados] = useState<Auto[]>([]);
  const [autosBase, setAutosBase] = useState<Auto[]>([]); // Para mantener el estado original de los autos
  const [autosVisibles, setAutosVisibles] = useState(cantidadPorLote);
  const [cargando, setCargando] = useState(true);
  const [ordenSeleccionado, setOrdenSeleccionado] = useState('Recomendación');
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [fechaFiltroInicio, setFechaFiltroInicio] = useState("");
  const [fechaFiltroFin, setFechaFiltroFin] = useState("");
  const [filtroCiudad, setFiltroCiudad] = useState<string>(''); //editado Sprinteros
  const [filtrosCombustible, setFiltrosCombustible] = useState<string[]>([]);
  const [filtrosCaracteristicas, setFiltrosCaracteristicas] = useState<{ asientos?: number; puertas?: number }>({});
  const [filtrosTransmision, setFiltrosTransmision] = useState<string[]>([]);
  const [filtrosCaracteristicasAdicionales, setFiltrosCaracteristicasAdicionales] = useState<string[]>([]);

  
  const [filtroPrecio, setFiltroPrecio] = useState<{min: number, max: number} | null>(null);
  const [filtroViajes, setFiltroViajes] = useState<number | null>(null);
  const [filtroCalificacion, setFiltroCalificacion] = useState<number | null>(null);
  const [cargandoFiltros, setCargandoFiltros] = useState(false);
  const [autosAntesFiltroViajes, setAutosAntesFiltroViajes] = useState<Auto[]>([]);
  const [autosAntesFiltroPrecio, setAutosAntesFiltroPrecio] = useState<Auto[]>([]);

  
  const fetchAutos = async () => {
    try {
      setCargando(true);
      const rawData: RawAuto[] = await getAllCars();
      const transformed = rawData.map(transformAuto);
      setAutos(transformed);
      setAutosFiltrados(transformed);
      setAutosBase(transformed); // Guardamos el estado original de los autos
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
      const query = normalizarTexto(textoBusqueda.trim());
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
    
    // Filtro por características adicionales 
        if (filtrosCaracteristicasAdicionales.length > 0) {
             //console.log("Aplicando filtro de características adicionales:", filtrosCaracteristicasAdicionales);
             resultado = resultado.filter(auto => {
             //console.log("Revisando auto:", auto.idAuto || auto, "Características:", auto.caracteristicasAdicionales);
             return filtrosCaracteristicasAdicionales.every(caracteristica =>
             (auto.caracteristicasAdicionales || []).some(c => normalizarTexto(c).includes(normalizarTexto(caracteristica)))
           );
        });
        }

    //editado Sprinteros
    if (filtroCiudad && filtroCiudad.trim()) {
        console.log("Aplicando filtro de ciudad:", filtroCiudad);
        resultado = resultado.filter(auto =>
            normalizarTexto(auto.ciudad).includes(normalizarTexto(filtroCiudad))
        );
        }


    if (punto.alt !== 0 && punto.lon !== 0) {
      resultado = autosCercanosOrdenados(resultado, punto, radio * 1000)
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
  }, [autos,textoBusqueda,filtrosCombustible,filtrosCaracteristicas,filtrosTransmision,filtrosCaracteristicasAdicionales,
  filtroCiudad,fechaFiltroInicio,fechaFiltroFin,punto,radio,ordenSeleccionado]);

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

    const aplicarFiltroPrecio = useCallback(async (min: number, max: number) => {
        try {
            setCargandoFiltros(true);
            console.log('Aplicando filtro de precio:', { min, max });
            console.log('Autos antes del filtro:', autosFiltrados.length);
            
            // Guardar el estado actual si es la primera vez que se aplica el filtro
            if (!filtroPrecio) {
                setAutosAntesFiltroPrecio(autosFiltrados);
            }

            // Si min y max son 0 e Infinity respectivamente, restaurar el estado anterior
            if (min === 0 && max === Infinity) {
                setAutosFiltrados(autosAntesFiltroPrecio);
                setFiltroPrecio(null);
                return;
            }
            
            const ids = autosFiltrados.map(a => parseInt(a.idAuto, 10));
            const datos = await filtrosAPI.filtrarPorPrecio({ 
                minPrecio: min, 
                maxPrecio: max, 
                idsCarros: ids 
            });
            
            const idsFiltrados = datos.map((d: { id: number }) => d.id);
            const nuevosFiltrados = autosFiltrados.filter(a => 
                idsFiltrados.includes(parseInt(a.idAuto, 10))
            );
            
            // Ordenar por precio de menor a mayor
            nuevosFiltrados.sort((a, b) => a.precioPorDia - b.precioPorDia);
            
            console.log('Autos después del filtro:', nuevosFiltrados.length);
            setAutosFiltrados(nuevosFiltrados);
            setFiltroPrecio({ min, max });
            setOrdenSeleccionado('Precio bajo a alto');
        } catch (error) {
            console.error('Error al aplicar filtro de precio:', error);
        } finally {
            setCargandoFiltros(false);
        }
    }, [autosFiltrados, filtroPrecio, autosAntesFiltroPrecio]);

    const listaCompleta = useCallback(() => {
        setAutosFiltrados(autosBase);
        setFiltroPrecio(null);
        setFiltroViajes(null);
        setFiltroCalificacion(null);
        setFiltrosCombustible([]);
        setFiltrosCaracteristicas({});
        setFiltrosTransmision([]);
        setFiltrosCaracteristicasAdicionales([]);
        setFiltroCiudad('');
        setTextoBusqueda('');
        setOrdenSeleccionado('Recomendación');
    }, [autosBase]  );

    const aplicarFiltroViajes = useCallback(async (minViajes: number) => {
        try {
            setCargandoFiltros(true);
            console.log('Aplicando filtro de viajes:', { minViajes });
            console.log('Autos antes del filtro:', autosFiltrados.length);
            
            if (!filtroViajes) {
                setAutosAntesFiltroViajes(autosFiltrados);
            }

            if (minViajes === 0) {
                setAutosFiltrados(autosAntesFiltroViajes);
                setFiltroViajes(null);
                return;
            }
            
            const ids = autosFiltrados.map(a => parseInt(a.idAuto, 10));
            const datos = await filtrosAPI.filtrarPorViajes({ 
                minViajes, 
                idsCarros: ids 
            });
            
            const idsFiltrados = datos.map((d: { id: number }) => d.id);
            const nuevosFiltrados = autosFiltrados.filter(a => 
                idsFiltrados.includes(parseInt(a.idAuto, 10))
            );
            
            console.log('Autos después del filtro:', nuevosFiltrados.length);
            setAutosFiltrados(nuevosFiltrados);
            setFiltroViajes(minViajes);
        } catch (error) {
            console.error('Error al aplicar filtro de viajes:', error);
        } finally {
            setCargandoFiltros(false);
        }
    }, [autosFiltrados, filtroViajes, autosAntesFiltroViajes]);

    const aplicarFiltroCalificacion = useCallback(async (minCalificacion: number) => {
        try {
            setCargandoFiltros(true);
            console.log('Aplicando filtro de calificación:', { minCalificacion });
            console.log('Autos antes del filtro:', autosFiltrados.length);
            
            const ids = autosFiltrados.map(a => parseInt(a.idAuto, 10));
            const datos = await filtrosAPI.filtrarPorCalificacion({ 
                minCalificacion, 
                idsCarros: ids 
            });
            
            const idsFiltrados = datos.map((d: { id: number }) => d.id);
            const nuevosFiltrados = autosFiltrados.filter(a => 
                idsFiltrados.includes(parseInt(a.idAuto, 10))
            );
            
            console.log('Autos después del filtro:', nuevosFiltrados.length);
            setAutosFiltrados(nuevosFiltrados);
            setFiltroCalificacion(minCalificacion);
        } catch (error) {
            console.error('Error al aplicar filtro de calificación:', error);
        } finally {
            setCargandoFiltros(false);
        }
    }, [autosFiltrados]);

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
    listaCompleta,
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
  };
}