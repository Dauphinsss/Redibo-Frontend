'use client';

import { useEffect, useState } from 'react';
import { getInsuranceByID } from '@/app/reserva/services/services_reserva';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { TipoCobertura } from "@/app/reserva/interface/CoberturaForm_Interface_Recode";

interface CoberturaItem {
  tipoda_o: string;
  descripcion: string;
  valides: string;
}

interface Props{
  tiposeguro: TipoCobertura[];
  nombreSeguro: string;
}

export default function TablaCoberturas({ tiposeguro,nombreSeguro}:Props) {

  const formatearValor = (valor: string) => {
    if (valor.endsWith('B')) return `${valor.slice(0, -1)} BOB`;
    if (valor.endsWith('P')) return `${valor.slice(0, -1)}%`;
    return valor;
  };

  return (
    <div className="w-full bg-white border border-gray-300 rounded-xl shadow p-6 h-full">
      <div className="flex items-center gap-2 mb-4 text-gray-700">
        <ShieldCheckIcon className="h-5 w-5" />
        <h2 className="text-base font-semibold">Cobertura de la Aseguradora {nombreSeguro}</h2>
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
            {tiposeguro.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="py-3 font-semibold text-black">{item.tipoda_o}</td>
                <td className="py-3 text-gray-700">{item.descripcion}</td>
                <td className="py-3 text-right">
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                    {formatearValor(item.cantidadCobertura)}
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
