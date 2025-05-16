'use client';
import { useEffect, useState } from 'react';
import { getCarById } from '@/service/services_Recode';

interface Props {
  id_carro: number;
  fechas: { inicio: string; fin: string };
}

export default function PrecioDesglosado({ id_carro, fechas }: Props) {
  const [precioDiario, setPrecioDiario] = useState<number>(0);

  useEffect(() => {
    const cargar = async () => {
      const datos = await getCarById(id_carro.toString());
      if (datos?.precio_por_dia) setPrecioDiario(datos.precio_por_dia);
    };
    cargar();
  }, [id_carro]);

  const dias = fechas && fechas.inicio && fechas.fin
    ? (new Date(fechas.fin).getTime() - new Date(fechas.inicio).getTime()) / (1000 * 60 * 60 * 24)
    : 0;

  const estimado = dias * precioDiario;

  return (
    <div className="border p-4 w-full sm:w-72 mt-4 sm:mt-0">
      <h2 className="font-bold mb-2">PRECIO DESGLOSADO</h2>
      <div className="flex justify-between"><span>Precio Diario</span><span>{precioDiario} BOB</span></div>
      <div className="flex justify-between"><span>Precio Estimado</span><span>{estimado.toFixed(2)} BOB</span></div>
      <div className="flex justify-between font-bold border-t mt-2 pt-2"><span>Total</span><span>{estimado.toFixed(2)} BOB</span></div>
    </div>
  );
}
