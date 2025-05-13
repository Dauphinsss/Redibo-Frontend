import { memo, useState } from "react";
import { CoberturaInterface } from "@/interface/CoberturaForm_Interface_Recode";

interface PopupProps {
  cobertura: CoberturaInterface;
  setCobertura: (c: CoberturaInterface) => void;
  onClose: () => void;
  onSave: () => void;
  isEditing?: boolean;
}

function PopupCobertura({ cobertura, setCobertura, onClose, onSave, isEditing = false }: PopupProps) {
  const [tipoMonto, setTipoMonto] = useState(cobertura.valides.endsWith("P") ? "%" : "BOB");
  const [valor, setValor] = useState(cobertura.valides.replace(/[BP]$/, ""));

  const actualizarValides = (nuevoValor: string, tipo: string) => {
    setValor(nuevoValor);
    const sufijo = tipo === "BOB" ? "B" : "P";
    setCobertura({ ...cobertura, valides: `${nuevoValor}${sufijo}` });
  };

  return (
    <div className="fixed top-0 right-0 h-full bg-white shadow-lg w-full max-w-md md:w-[400px] z-50 overflow-y-auto transition-transform duration-300">
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">{isEditing ? "Editar cobertura" : "Añadir nueva cobertura"}</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Tipo de daño*</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={cobertura.tipodaño}
              onChange={(e) => setCobertura({ ...cobertura, tipodaño: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Descripción</label>
            <textarea
              className="w-full p-2 border rounded"
              rows={3}
              value={cobertura.descripcion}
              onChange={(e) => setCobertura({ ...cobertura, descripcion: e.target.value })}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Monto*</label>
            <div className="flex gap-2">
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={valor}
                onChange={(e) => actualizarValides(e.target.value, tipoMonto)}
              />
              <select
                value={tipoMonto}
                onChange={(e) => {
                  setTipoMonto(e.target.value);
                  actualizarValides(valor, e.target.value);
                }}
                className="p-2 border rounded"
              >
                <option value="BOB">BOB</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={!cobertura.tipodaño || !cobertura.valides}
          >
            {isEditing ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(PopupCobertura);
