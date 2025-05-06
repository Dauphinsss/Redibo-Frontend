'use client';

import { useState } from 'react';

type Props = {
  mostrar: boolean;
  onCerrar: () => void;
};

export default function SidebarFiltros({ mostrar, onCerrar }: Props) {
  const [abierto, setAbierto] = useState({
    tipoCombustible: false,
    caracteristicasCoche: false,
    transmision: false,
    caracteristicasAdicionales: false,
  });

  const toggle = (key: keyof typeof abierto) => {
    setAbierto((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transition-transform duration-300 transform ${
        mostrar ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h2 className="font-semibold text-lg">Filtros avanzados</h2>
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
                  <input type="checkbox" className="form-checkbox" />
                  {tipo}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
