'use client';

import { useEffect, useState } from 'react';
import { getInsuranceByID } from '@/service/services_Recode';
import { ValidarInterface } from '@/interface/CoberturaForm_Interface_Recode';

interface FormularioCoberturaProps {
  id: number;
}

export default function FormularioCobertura({ id }: FormularioCoberturaProps) {
  const [datos, setDatos] = useState<ValidarInterface | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDatos() {
      try {
        const data = await getInsuranceByID(String(id));
        setDatos(data);
      } catch (error) {
        console.error('Error al obtener datos del seguro:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDatos();
  }, [id]);

  if (loading) return <div className="p-4">Cargando datos...</div>;

  if (!datos) return <div className="p-4 text-red-500">No se encontraron datos del seguro.</div>;

  return (
    <div className="space-y-4 p-4 max-w-xl mx-auto">
      <div>
        <label className="block text-sm font-medium mb-1">Aseguradora:</label>
        <input
          type="text"
          value={datos.Seguro?.empresa || ''}
          readOnly
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Inicio:</label>
          <input
            type="date"
            value={datos.fechaInicio?.slice(0, 10) || ''}
            readOnly
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fin:</label>
          <input
            type="date"
            value={datos.fechaFin?.slice(0, 10) || ''}
            readOnly
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
}
