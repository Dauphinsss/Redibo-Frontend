import React, { memo } from 'react';
import { Coverage } from '@/interface/CoberturaForm_Interface_Recode';

interface TablaCoberturaProps {
  coverages: Coverage[];
  onRemove: (index: number) => void;
  onAddClick: () => void;
}

function TablaCobertura({ coverages, onRemove, onAddClick }: TablaCoberturaProps) {
  return (
    <section className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h3 className="text-lg font-semibold text-gray-800">Tipo de cobertura</h3>
        <div className="flex gap-2">
          <button onClick={onAddClick} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            + Añadir cobertura
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Validez</th>
              <th className="px-4 py-3">Cantidad</th>
              <th className="px-4 py-3">Eliminar</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coverages.length > 0 ? (
              coverages.map((coverage, index) => (
                <tr key={index}>
                  <td className="px-4 py-4 text-center">{coverage.name}</td>
                  <td className="px-4 py-4 text-center">{coverage.description}</td>
                  <td className="px-4 py-4 text-center">{coverage.validity}</td>
                  <td className="px-4 py-4 text-center">BOB.{coverage.amount}</td>
                  <td className="px-4 py-4 text-center">
                    <button onClick={() => onRemove(index)} className="text-red-500 hover:underline">
                      – Quitar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No hay coberturas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default memo(TablaCobertura);
