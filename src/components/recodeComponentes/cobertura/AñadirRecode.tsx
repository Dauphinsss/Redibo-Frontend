import { memo } from 'react';
import { Cobertura } from '@/interface/CoberturaForm_Interface_Recode';

interface PopupProps {
  cobertura: Cobertura;
  setCobertura: (c: Cobertura) => void;
  onClose: () => void;
  onSave: () => void;
  isEditing?: boolean;
}

function PopupCobertura({ cobertura, setCobertura, onClose, onSave, isEditing = false }: PopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {isEditing ? 'Editar cobertura' : 'Añadir nueva cobertura'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de daño*</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={cobertura.tipoDaño}
                onChange={(e) => setCobertura({ ...cobertura, tipoDaño: e.target.value })}
                placeholder="Ej: Colisión, Daño parcial"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                value={cobertura.descripcion}
                onChange={(e) => setCobertura({ ...cobertura, descripcion: e.target.value })}
                placeholder="Detalles del daño cubierto"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto/Remuneración*</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={cobertura.monto}
                onChange={(e) => setCobertura({ ...cobertura, monto: e.target.value })}
                placeholder="Ej: 5000 BOB o 10%"
                required
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              onClick={onClose} 
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700"
            >
              Cancelar
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
              disabled={!cobertura.tipoDaño || !cobertura.monto}
            >
              {isEditing ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(PopupCobertura);