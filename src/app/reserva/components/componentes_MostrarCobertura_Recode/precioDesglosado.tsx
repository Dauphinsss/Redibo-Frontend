'use client';

import { useEffect, useState } from 'react';
import { getCarById } from '@/app/reserva/services/services_reserva';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface PrecioDesglosadoProps {
  id_carro: number;
  fechas: { inicio: string; fin: string };
  onPrecioCalculado?: (precio: number) => void;
}

export default function PrecioDesglosado({
  id_carro,
  fechas,
  onPrecioCalculado,
}: PrecioDesglosadoProps) {
  const [precioDiario, setPrecioDiario] = useState<number>(0);

  useEffect(() => {
    const cargar = async () => {
      const datos = await getCarById(id_carro.toString());
      if (datos?.precio_por_dia) setPrecioDiario(datos.precio_por_dia);
    };
    cargar();
  }, [id_carro]);

  const dias = fechas.inicio && fechas.fin 
    ? (new Date(fechas.fin).getTime() - new Date(fechas.inicio).getTime()) / 
      (1000 * 60 * 60 * 24)
    : 0;
  
  const estimado = dias * precioDiario;

  // Notificar al padre cuando cambie el precio estimado
  useEffect(() => {
    if (onPrecioCalculado && estimado > 0) {
      onPrecioCalculado(estimado);
    }
  }, [estimado, onPrecioCalculado]);

  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow p-6 w-full sm:w-80 h-50 space-y-4">
      <div className="flex items-center gap-2 text-gray-700">
        <CurrencyDollarIcon className="h-5 w-5" />
        <h2 className="text-base font-semibold">Precio desglosado</h2>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Precio diario</span>
        <span className="font-medium text-black">{precioDiario} BOB</span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Precio estimado</span>
        <span className="font-medium text-black">{estimado.toFixed(2)} BOB</span>
      </div>

      <div className="border-t pt-3 flex justify-between text-sm font-semibold">
        <span className="text-black">Total</span>
        <span className="text-green-600">{estimado.toFixed(2)} BOB</span>
      </div>
    </div>
  );
}