import { memo } from 'react';
import { Coverage } from '@/interface/CoberturaForm_Interface_Recode';

interface PopupProps {
  newCoverage: Coverage;
  setNewCoverage: (c: Coverage) => void;
  onClose: () => void;
  onSave: () => void;
}

function PopupCobertura({ newCoverage, setNewCoverage, onClose, onSave }: PopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Añadir nueva cobertura</h3>
          <div className="space-y-4">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={newCoverage.name}
              onChange={(e) => setNewCoverage({ ...newCoverage, name: e.target.value })}
              placeholder="Nombre"
            />
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              value={newCoverage.description}
              onChange={(e) => setNewCoverage({ ...newCoverage, description: e.target.value })}
              placeholder="Descripción"
            />
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={newCoverage.amount}
              onChange={(e) => setNewCoverage({ ...newCoverage, amount: e.target.value })}
              placeholder="Cantidad"
            />
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700">
              Cancelar
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
              disabled={!newCoverage.name || !newCoverage.amount}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(PopupCobertura);
