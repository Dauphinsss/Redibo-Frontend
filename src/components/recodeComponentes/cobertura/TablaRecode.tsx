// components/TablaCoberturas.tsx
'use client';
import { Cobertura } from '@/interface/CoberturaForm_Interface_Recode';

interface TablaCoberturasProps {
  coberturas: Cobertura[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
}

export default function TablaCoberturas({ coberturas, onEdit, onRemove, onAdd }: TablaCoberturasProps) {
  return (
    <section className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h3 className="text-lg font-semibold text-gray-800">Tipo de cobertura</h3>
        <div className="flex gap-2">
          <button 
            onClick={onAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + Añadir cobertura
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">Tipo de daño</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Monto/Remuneración</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coberturas.length > 0 ? (
              coberturas.map((cobertura, index) => (
                <tr key={index}>
                  <td className="px-4 py-4 text-center">{cobertura.tipoDaño}</td>
                  <td className="px-4 py-4 text-center">{cobertura.descripcion}</td>
                  <td className="px-4 py-4 text-center">
                    {cobertura.monto.includes('%') ? cobertura.monto : `BOB ${cobertura.monto}`}
                  </td>
                  <td className="px-4 py-4 text-center flex justify-center space-x-2">
                    <button 
                      onClick={() => onEdit(index)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => onRemove(index)}
                      className="text-red-500 hover:text-red-700"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
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