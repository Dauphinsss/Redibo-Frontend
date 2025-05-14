'use client';
import { useEffect, useState } from 'react';
import { getInsuranceByID } from '@/service/services_Recode';

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
    if (valides.endsWith('P')) return `${valides.slice(0, -1)} %`;
    return valides;
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Cobertura del Seguro</h2>
      <table className="w-full text-left border-t">
        <tbody>
          {datos.map((item, idx) => (
            <tr key={idx} className="border-b">
              <td className="py-2 font-semibold">&lt;{item.tipoda_o}&gt;</td>
              <td className="py-2">{item.descripcion}</td>
              <td className="py-2 text-right font-bold">{formatearValor(item.valides)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
