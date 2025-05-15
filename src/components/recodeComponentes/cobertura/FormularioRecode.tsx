'use client';

import { ValidarInterface } from '@/interface/CoberturaForm_Interface_Recode';

interface FormularioCoberturaProps {
  initialData: ValidarInterface;
}

export default function FormularioCobertura({ initialData }: FormularioCoberturaProps) {
  if (!initialData) {
    return <div className="p-4 text-red-500">No se encontraron datos del seguro.</div>;
  }

  return (
    <div className="space-y-4 p-4 max-w-xl mx-auto">
      <div>
        <label className="block text-sm font-medium mb-1">Aseguradora:</label>
        <input
          type="text"
          value={initialData.Seguro?.empresa || ''}
          readOnly
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Inicio:</label>
          <input
            type="date"
            value={initialData.fechaInicio?.slice(0, 10) || ''}
            readOnly
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fin:</label>
          <input
            type="date"
            value={initialData.fechaFin?.slice(0, 10) || ''}
            readOnly
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
}
