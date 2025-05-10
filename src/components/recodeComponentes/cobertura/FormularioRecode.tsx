'use client';
import { SeguroForm } from '@/interface/CoberturaForm_Interface_Recode';

interface FormularioProps {
  seguro: SeguroForm;
  actualizarSeguro: (datos: Partial<SeguroForm>) => void;
}

export default function FormularioSeguro({ seguro, actualizarSeguro }: FormularioProps) {
  return (
    <section className="p-4 md:p-6 border-b">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Cobertura de uso del auto</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cuenta con un seguro</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="insurance"
                className="h-4 w-4 text-blue-600"
                checked={seguro.tieneSeguro}
                onChange={() => actualizarSeguro({ tieneSeguro: true })}
              />
              <span className="ml-2">Sí</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="insurance"
                className="h-4 w-4 text-blue-600"
                checked={!seguro.tieneSeguro}
                onChange={() => actualizarSeguro({ tieneSeguro: false })}
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Aseguradora</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={seguro.aseguradora || ''}
            onChange={(e) => actualizarSeguro({ aseguradora: e.target.value })}
            disabled={!seguro.tieneSeguro}
          />
        </div>
      </div>
      {seguro.tieneSeguro && (
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Validez</label>
          <input
            type="date"
            className="p-2 border border-gray-300 rounded-md w-full md:w-auto"
            value={seguro.validezSeguro || ''}
            onChange={(e) => actualizarSeguro({ validezSeguro: e.target.value })}
          />
        </div>
      )}
    </section>
  );
}