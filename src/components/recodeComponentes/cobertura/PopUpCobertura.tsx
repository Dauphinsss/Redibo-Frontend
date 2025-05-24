"use client";

import { useEffect, useState } from "react";
import { useCoberturasStore } from "@/hooks/useCoberturasStore";
import { X } from "lucide-react";

export default function PopUpCobertura() {
  const {
    popup,
    draft,
    cerrarPopup,
    agregar,
    editar,
    setDraft,
  } = useCoberturasStore();

  const { abierta, indice } = popup;
  const [tocado, setTocado] = useState({ tipodaño: false, valides: false });

  const tipodañoInvalido = tocado.tipodaño && (draft?.tipodaño.trim().length ?? 0) < 3;
  const validesInvalido = tocado.valides && (draft?.valides.trim().length ?? 0) < 2;

  useEffect(() => {
    setTocado({ tipodaño: false, valides: false });
  }, [abierta]);

  const handleGuardar = () => {
    setTocado({ tipodaño: true, valides: true });
    if (!draft || tipodañoInvalido || validesInvalido) return;

    if (indice !== undefined) {
      editar(indice, draft);
    } else {
      agregar(draft);
    }

    cerrarPopup();
  };

  if (!abierta || !draft) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <button
          onClick={cerrarPopup}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold mb-4">
          {indice !== undefined ? "Editar cobertura" : "Nueva cobertura"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de daño *</label>
            <input
              type="text"
              value={draft.tipodaño}
              onChange={(e) => setDraft({ ...draft, tipodaño: e.target.value })}
              onBlur={() => setTocado((t) => ({ ...t, tipodaño: true }))}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                tipodañoInvalido
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-black"
              }`}
              placeholder="Ej. Daño por colisión"
            />
            {tipodañoInvalido && (
              <p className="text-xs text-red-500 mt-1">Debe tener al menos 3 caracteres.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              value={draft.descripcion}
              onChange={(e) => setDraft({ ...draft, descripcion: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-black"
              rows={3}
              placeholder="Describe el tipo de cobertura"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Validez *</label>
            <input
              type="text"
              value={draft.valides}
              onChange={(e) => setDraft({ ...draft, valides: e.target.value })}
              onBlur={() => setTocado((t) => ({ ...t, valides: true }))}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                validesInvalido
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-black"
              }`}
              placeholder="Ej. 100B / 20P"
            />
            {validesInvalido && (
              <p className="text-xs text-red-500 mt-1">Campo requerido.</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={cerrarPopup}
            className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 transition"
          >
            {indice !== undefined ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}