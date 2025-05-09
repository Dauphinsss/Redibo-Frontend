'use client';

import { useState } from 'react';

type Props = {
  mostrar: boolean;
  onCerrar: () => void;
  setFiltrosCombustible: React.Dispatch<React.SetStateAction<string[]>>;
  setFiltrosCaracteristicas: React.Dispatch<React.SetStateAction<{ asientos?: number; puertas?: number }>>;
  setFiltrosTransmision: React.Dispatch<React.SetStateAction<string[]>>; // NUEVO
};

export default function SidebarFiltros({
  mostrar,
  onCerrar,
  setFiltrosCombustible,
  setFiltrosCaracteristicas,
  setFiltrosTransmision, // NUEVO
}: Props) {
  const [abierto, setAbierto] = useState({
    tipoCombustible: false,
    caracteristicasCoche: false,
    transmision: false,
    caracteristicasAdicionales: false,
  });

  const toggle = (key: keyof typeof abierto) => {
    setAbierto((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCheckboxChange = (tipo: string, isChecked: boolean) => {
    setFiltrosCombustible((prev) => {
      const nuevoEstado = isChecked
        ? [...prev, tipo.toLowerCase()]
        : prev.filter((f) => f !== tipo.toLowerCase());
      return [...new Set(nuevoEstado)];
    });
  };

  const handleTransmisionChange = (tipo: string, isChecked: boolean) => {
    setFiltrosTransmision((prev) => {
      const nuevoEstado = isChecked
        ? [...prev, tipo.toLowerCase()]
        : prev.filter((f) => f !== tipo.toLowerCase());
      return [...new Set(nuevoEstado)];
    });
  };

  const handleCaracteristicasChange = (
    key: 'asientos' | 'puertas',
    value: number,
    isChecked: boolean
  ) => {
    setFiltrosCaracteristicas((prev) => ({
      ...prev,
      [key]: isChecked ? value : undefined,
    }));
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transition-transform duration-300 transform ${
        mostrar ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h2 className="font-semibold text-lg">Filtros</h2>
        <button onClick={onCerrar} className="text-xl font-bold hover:text-red-600">
          &times;
        </button>
      </div>

      <div className="space-y-4 p-4 overflow-y-auto h-full">
        {/* Tipo de Combustible */}
        <div className="border rounded shadow-sm">
          <button
            onClick={() => toggle('tipoCombustible')}
            className="w-full text-left px-4 py-2 bg-gray-100 font-semibold hover:bg-gray-200"
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
                    onChange={(e) => handleCheckboxChange(tipo, e.target.checked)}
                  />
                  {tipo}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Características del coche */}
        <div className="border rounded shadow-sm">
          <button
            onClick={() => toggle('caracteristicasCoche')}
            className="w-full text-left px-4 py-2 bg-gray-100 font-semibold hover:bg-gray-200"
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
            className="w-full text-left px-4 py-2 bg-gray-100 font-semibold hover:bg-gray-200"
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
                    onChange={(e) => handleTransmisionChange(tipo, e.target.checked)}
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
            className="w-full text-left px-4 py-2 bg-gray-100 font-semibold hover:bg-gray-200"
          >
            Características adicionales
          </button>
          {abierto.caracteristicasAdicionales && (
            <div className="p-4 space-y-2">
              {['GPS', 'Aire acondicionado'].map((carac) => (
                <label key={carac} className="flex items-center gap-2">
                  <input type="checkbox" className="form-checkbox" />
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
