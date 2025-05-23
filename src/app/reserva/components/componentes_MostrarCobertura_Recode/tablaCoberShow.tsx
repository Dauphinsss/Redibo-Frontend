'use client';

import { useEffect, useState } from 'react';
import { getInsuranceByID } from '@/app/reserva/services/services_reserva';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

interface CoberturaItem {
  tipoda_o: string;
  descripcion: string;
  valides: string;
}

export default function TablaCoberturas({ id_carro }: { id_carro: number }) {
  const [datos, setDatos] = useState<CoberturaItem[]>([]);

  useEffect(() => {
    const cargar = async () => {
      const seguro = await getInsuranceByID(id_carro.toString());
      if (seguro?.tiposeguro) {
        setDatos(seguro.tiposeguro);
      }
    };
    cargar();
  }, [id_carro]);

  const formatearValor = (valides: string) => {
    if (valides.endsWith('B')) return `${valides.slice(0, -1)} BOB`;
    if (valides.endsWith('P')) return `${valides.slice(0, -1)}%`;
    return valides;
  };

  return (
    <div className="w-full bg-white border border-gray-300 rounded-xl shadow p-6 h-full">
      <div className="flex items-center gap-2 mb-4 text-gray-700">
        <ShieldCheckIcon className="h-5 w-5" />
        <h2 className="text-base font-semibold">Cobertura del seguro</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm table-auto">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="py-2 font-medium">Tipo</th>
              <th className="py-2 font-medium">Descripción</th>
              <th className="py-2 font-medium text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="py-3 font-semibold text-black">{item.tipoda_o}</td>
                <td className="py-3 text-gray-700">{item.descripcion}</td>
                <td className="py-3 text-right">
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                    {formatearValor(item.valides)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
