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

  const [errores, setErrores] = useState({
    combustible: "",
  });

  const [filtrosCombustibleLocal, setFiltrosCombustibleLocal] = useState<string[]>([]);

  const [caracteristicasLocal, setCaracteristicasLocal] = useState<{
    asientos?: number;
    puertas?: number;
  }>({});

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onCerrar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onCerrar]);

  const toggle = (key: keyof typeof abierto) => {
    setAbierto((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCheckboxChange = (tipo: string, isChecked: boolean) => {
    const tipoLower = tipo.toLowerCase();

    if (!isChecked) {
      const nuevosFiltros = filtrosCombustibleLocal.filter(f => f !== tipoLower);
      setFiltrosCombustibleLocal(nuevosFiltros);
      setFiltrosCombustible(nuevosFiltros);
      setErrores(prev => ({ ...prev, combustible: "" }));
      return;
    }

    if (filtrosCombustibleLocal.length >= 2) {
      setErrores(prev => ({
        ...prev,
        combustible: "Solo puedes seleccionar máximo 2 tipos de combustible"
      }));
      return;
    }

    const nuevosFiltros = [...filtrosCombustibleLocal, tipoLower];
    setFiltrosCombustibleLocal(nuevosFiltros);
    setFiltrosCombustible(nuevosFiltros);
    setErrores(prev => ({ ...prev, combustible: "" }));
  };

  const handleTransmisionChange = (tipo: string) => {
    setFiltrosTransmision((prev) => {
      const tipoLower = tipo.toLowerCase();
      return prev.includes(tipoLower) ? [] : [tipoLower];
    });
  };

  const handleCaracteristicasChange = (
    key: 'asientos' | 'puertas',
    value: number,
    isChecked: boolean
  ) => {
    if (!isChecked) {
      setCaracteristicasLocal(prev => ({ ...prev, [key]: undefined }));
      setFiltrosCaracteristicas(prev => ({ ...prev, [key]: undefined }));
    } else {
      const nuevasCaracteristicas = { ...caracteristicasLocal, [key]: value };
      setCaracteristicasLocal(nuevasCaracteristicas);
      setFiltrosCaracteristicas(nuevasCaracteristicas);
    }
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
    <>
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-[60] transition-transform duration-300 transform ${
          mostrar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center px-4 py-4 border-b bg-white">
          <h2 className="font-semibold text-lg">Filtros</h2>
          <div className="flex items-center gap-2">
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
              className="text-sm bg-black text-white px-3 py-1 rounded hover:bg-gray-700 transition"
            >
              Resetear
            </button>
            <button onClick={onCerrar} className="text-xl font-bold hover:text-gray-600 w-8 h-8 flex items-center justify-center">
              &times;
            </button>
          </div>
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4 p-4">
            {/* Combustible */}
            <div className="border rounded shadow-sm">
              <button
                onClick={() => toggle('tipoCombustible')}
                className="w-full text-left px-4 py-3 bg-black text-white font-semibold hover:bg-gray-700 transition-colors"
              >
                Tipo combustible
              </button>
              {abierto.tipoCombustible && (
                <div className="p-4 space-y-3">
                  {['Gasolina', 'GNV', 'Eléctrico', 'Diesel'].map((tipo) => (
                    <label key={tipo} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600"
                        checked={filtrosCombustibleLocal.includes(tipo.toLowerCase())}
                        onChange={(e) => handleCheckboxChange(tipo, e.target.checked)}
                      />
                      <span className="text-sm">{tipo}</span>
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
                className="w-full text-left px-4 py-3 bg-black text-white font-semibold hover:bg-gray-700 transition-colors"
              >
                Características del coche
              </button>
              {abierto.caracteristicasCoche && (
                <div className="p-4 space-y-4">
                  <div>
                    <p className="font-semibold mb-2">Número de asientos</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[2, 4, 5, 7].map((n) => (
                        <label key={n} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-blue-600"
                            checked={caracteristicasLocal.asientos === n}
                            onChange={(e) => handleCaracteristicasChange('asientos', n, e.target.checked)}
                          />
                          <span className="text-sm">{n}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">Número de puertas</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[2, 3, 4, 5].map((n) => (
                        <label key={n} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-blue-600"
                            checked={caracteristicasLocal.puertas === n}
                            onChange={(e) => handleCaracteristicasChange('puertas', n, e.target.checked)}
                          />
                          <span className="text-sm">{n}</span>
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
                className="w-full text-left px-4 py-3 bg-black text-white font-semibold hover:bg-gray-700 transition-colors"
              >
                Transmisión
              </button>
              {abierto.transmision && (
                <div className="p-4 space-y-3">
                  {['Manual', 'Automática'].map((tipo) => (
                    <label key={tipo} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600"
                        checked={filtrosTransmision.includes(tipo.toLowerCase())}
                        onChange={() => handleTransmisionChange(tipo)}
                      />
                      <span className="text-sm">{tipo}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Características adicionales */}
            <div className="border rounded shadow-sm">
              <button
                onClick={() => toggle('caracteristicasAdicionales')}
                className="w-full text-left px-4 py-3 bg-black text-white font-semibold hover:bg-gray-700 transition-colors"
              >
                Características adicionales
              </button>
              {abierto.caracteristicasAdicionales && (
                <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                  {[
                    "Aire acondicionado", "Bluetooth", "GPS", "Portabicicletas", "Soporte para esquís",
                    "Pantalla táctil", "Sillas para bebé", "Cámara de reversa", "Asientos de cuero",
                    "Sistema antirrobo", "Toldo o rack de techo", "Vidrios polarizados", "Sistema de sonido"
                  ].map((carac) => (
                    <label key={carac} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600"
                        checked={filtrosCaracteristicasAdicionales.includes(carac.toLowerCase())}
                        onChange={(e) => handleCaracteristicasAdicionalesChange(carac, e.target.checked)}
                      />
                      <span className="text-sm">{carac}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}