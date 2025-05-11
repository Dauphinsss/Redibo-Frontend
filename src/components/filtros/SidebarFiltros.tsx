'use client';

import { useState, useEffect, useRef } from 'react';

type Props = {
  mostrar: boolean;
  onCerrar: () => void;
  setFiltrosCombustible: React.Dispatch<React.SetStateAction<string[]>>;
  setFiltrosCaracteristicas: React.Dispatch<React.SetStateAction<{ asientos?: number; puertas?: number }>>;
  setFiltrosTransmision: React.Dispatch<React.SetStateAction<string[]>>;
  filtrosTransmision: string[];
  setFiltrosCaracteristicasAdicionales: React.Dispatch<React.SetStateAction<string[]>>;
  filtrosCaracteristicasAdicionales: string[];
};

export default function SidebarFiltros({
  mostrar,
  onCerrar,
  setFiltrosCombustible,
  setFiltrosCaracteristicas,
  setFiltrosTransmision, 
  filtrosTransmision,
  setFiltrosCaracteristicasAdicionales,
  filtrosCaracteristicasAdicionales, 
}: Props) {
  const [abierto, setAbierto] = useState({
    tipoCombustible: false,
    caracteristicasCoche: false,
    transmision: false,
    caracteristicasAdicionales: false,
  });

  // Estado para los errores de validación
  const [errores, setErrores] = useState({
    combustible: ""
  });

  // Estado local para mantener el filtro actual de combustible
  const [filtrosCombustibleLocal, setFiltrosCombustibleLocal] = useState<string[]>([]);

  // Estado local para mantener los filtros de características
  const [caracteristicasLocal, setCaracteristicasLocal] = useState<{
    asientos?: number;
    puertas?: number;
  }>({});

  // Referencia para el contenedor del sidebar
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Cierra el sidebar si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onCerrar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCerrar]);

  const toggle = (key: keyof typeof abierto) => {
    setAbierto((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCheckboxChange = (tipo: string, isChecked: boolean) => {
    const tipoLower = tipo.toLowerCase();
    
    // Si está desmarcando, simplemente quitamos el valor
    if (!isChecked) {
      const nuevosFiltros = filtrosCombustibleLocal.filter(f => f !== tipoLower);
      setFiltrosCombustibleLocal(nuevosFiltros);
      setFiltrosCombustible(nuevosFiltros);
      setErrores(prev => ({ ...prev, combustible: "" }));
      return;
    }
    
    // Si está marcando y ya hay 2 seleccionados, mostramos error
    if (filtrosCombustibleLocal.length >= 2) {
      setErrores(prev => ({ 
        ...prev, 
        combustible: "Solo puedes seleccionar máximo 2 tipos de combustible" 
      }));
      return;
    }
    
    // Si está marcando y hay menos de 2, añadimos el valor
    const nuevosFiltros = [...filtrosCombustibleLocal, tipoLower];
    setFiltrosCombustibleLocal(nuevosFiltros);
    setFiltrosCombustible(nuevosFiltros);
    setErrores(prev => ({ ...prev, combustible: "" }));
  };

  const handleTransmisionChange = (tipo: string) => {
    setFiltrosTransmision((prev) => {
      const tipoLower = tipo.toLowerCase();
      // Si ya está seleccionado, lo deselecciona
      if (prev.includes(tipoLower)) {
        return [];
      }
      // Si no está seleccionado, lo selecciona y deselecciona el otro
      return [tipoLower];
    });
  };

  const handleCaracteristicasChange = (
    key: 'asientos' | 'puertas',
    value: number,
    isChecked: boolean
  ) => {
    // Si está desmarcando, quitamos el valor
    if (!isChecked) {
      setCaracteristicasLocal(prev => ({
        ...prev,
        [key]: undefined
      }));
      
      setFiltrosCaracteristicas(prev => ({
        ...prev,
        [key]: undefined
      }));
      return;
    }
    
    // Si está marcando, reemplazamos el valor existente
    const nuevasCaracteristicas = {
      ...caracteristicasLocal,
      [key]: value
    };
    
    setCaracteristicasLocal(nuevasCaracteristicas);
    setFiltrosCaracteristicas(nuevasCaracteristicas);
  };

  const handleCaracteristicasAdicionalesChange = (caracteristica: string, isChecked: boolean) => {
    setFiltrosCaracteristicasAdicionales((prev) => {
      const nuevoEstado = isChecked
        ? [...prev, caracteristica.toLowerCase()]
        : prev.filter((f) => f !== caracteristica.toLowerCase());
      return [...new Set(nuevoEstado)];
    });
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transition-transform duration-300 transform ${
        mostrar ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h2 className="font-semibold text-lg">Filtros</h2>
        {/* Cambios que se hizo ultimo, boton del reset, que limpia todo lo seleccionado */}
        <button
          onClick={() => {
            setFiltrosCombustible([]);
            setFiltrosCombustibleLocal([]);
            setFiltrosTransmision([]);
            setFiltrosCaracteristicas({});
            setCaracteristicasLocal({});
            setFiltrosCaracteristicasAdicionales([]);
            setErrores({ combustible: "" });
          }}
          className="text-sm bg-black text-white px-3 py-1 rounded hover:bg-black-600 transition"
        >
          Resetear filtros
        </button>
        <button onClick={onCerrar} className="text-xl font-bold hover:text-black-600">
          &times;
        </button>
      </div>

      <div className="space-y-4 p-4 overflow-y-auto h-full">
        {/* Tipo de Combustible */}
        <div className="border rounded shadow-sm">
          <button
            onClick={() => toggle('tipoCombustible')}
            className="w-full text-left px-4 py-2 bg-black text-white font-semibold hover:bg-gray-700"
          >
            Tipo combustible
          </button>
          {abierto.tipoCombustible && (
            <div className="p-4 space-y-2">
              {['Gasolina', 'GNV', 'Eléctrico', 'Diesel'].map((tipo) => (
                <label key={tipo} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={filtrosCombustibleLocal.includes(tipo.toLowerCase())}
                    onChange={(e) => handleCheckboxChange(tipo, e.target.checked)}
                  />
                  {tipo}
                </label>
              ))}
              {errores.combustible && (
                <p className="text-red-500 text-sm mt-2">{errores.combustible}</p>
              )}
            </div>
          )}
        </div>

        {/* Características del coche */}
        <div className="border rounded shadow-sm">
          <button
            onClick={() => toggle('caracteristicasCoche')}
            className="w-full text-left px-4 py-2 bg-black text-white font-semibold hover:bg-gray-700"
          >
            Características del coche
          </button>
          {abierto.caracteristicasCoche && (
            <div className="p-4 space-y-4">
              {/* Asientos */}
              <div>
                <p className="font-semibold">Número de asientos</p>
                <div className="grid grid-cols-2 gap-2">
                  {[2, 4, 5, 7].map((n) => (
                    <label key={n} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={caracteristicasLocal.asientos === n}
                        onChange={(e) => handleCaracteristicasChange('asientos', n, e.target.checked)}
                      />
                      {n}
                    </label>
                  ))}
                </div>
              </div>

              {/* Puertas */}
              <div>
                <p className="font-semibold">Número de puertas</p>
                <div className="grid grid-cols-2 gap-2">
                  {[2, 3, 4, 5].map((n) => (
                    <label key={n} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={caracteristicasLocal.puertas === n}
                        onChange={(e) => handleCaracteristicasChange('puertas', n, e.target.checked)}
                      />
                      {n}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Transmisión */}
        <div className="border rounded shadow-sm">
          <button
            onClick={() => toggle('transmision')}
            className="w-full text-left px-4 py-2 bg-black text-white font-semibold hover:bg-gray-700"
          >
            Transmisión
          </button>
          {abierto.transmision && (
            <div className="p-4 space-y-2">
              {['Manual', 'Automática'].map((tipo) => (
                <label key={tipo} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={filtrosTransmision.includes(tipo.toLowerCase())}
                    onChange={(e) => handleTransmisionChange(tipo)}
                  />
                  {tipo}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Características adicionales */}
        <div className="border rounded shadow-sm">
          <button
            onClick={() => toggle('caracteristicasAdicionales')}
            className="w-full text-left px-4 py-2 bg-black text-white font-semibold hover:bg-gray-700"
          >
            Características adicionales
          </button>
          {abierto.caracteristicasAdicionales && (
            <div className="p-4 space-y-2 max-h-38 overflow-y-auto">
              {["Aire acondicionado", "Bluetooth", "GPS", "Portabicicletas", "Soporte para esquís",
                "Pantalla táctil", "Sillas para bebé", "Cámara de reversa", "Asientos de cuero",
                "Sistema antirrobo", "Toldo o rack de techo", "Vidrios polarizados", "Sistema de sonido"].map((carac) => (
                <label key={carac} className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    className="form-checkbox"
                    checked={filtrosCaracteristicasAdicionales.includes(carac.toLowerCase())}
                    onChange={(e) => handleCaracteristicasAdicionalesChange(carac, e.target.checked)}
                  />
                  {carac}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
