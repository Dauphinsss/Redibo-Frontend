"use client";

import { memo, useState, useEffect } from "react";
import { X } from "lucide-react";
import { useCoberturasStore } from "@/app/validarSeguro/hooks/useCoberturasStore";
import { postCobertura, putCobertura } from "@/app/validarSeguro/services/servicesSeguro";

function PopUpCobertura() {
  const {
    popup,
    draft,
    setDraft,
    cerrarPopup,
    agregar,
    editar,
  } = useCoberturasStore();

  const { abierta, indice } = popup;

  const [tipoMonto, setTipoMonto] = useState("BOB");
  const [valor, setValor] = useState("0");
  const [isSaving, setIsSaving] = useState(false);
  const [tocado, setTocado] = useState({ tipodaño: false, valor: false });

  useEffect(() => {
    if (draft?.valides) {
      const isP = draft.valides.endsWith("P");
      const val = draft.valides.replace(/[BP]$/, "");
      setTipoMonto(isP ? "%" : "BOB");
      setValor(val);
    }
  }, [draft]);

  useEffect(() => {
    if (abierta) {
      setTocado({ tipodaño: false, valor: false });
    }
  }, [abierta]);

  const actualizarValides = (nuevoValor: string, tipo: string) => {
    const sufijo = tipo === "BOB" ? "B" : "P";
    if (draft) setDraft({ ...draft, valides: `${nuevoValor}${sufijo}` });
  };

  const tipodañoInvalido = tocado.tipodaño && (draft?.tipodaño.trim().length ?? 0) < 3;
  const valorInvalido = tocado.valor && (
    isNaN(Number(valor)) ||
    Number(valor) <= 0 ||
    (tipoMonto === "%" && Number(valor) > 100)
  );

  const handleGuardar = async () => {
    setTocado({ tipodaño: true, valor: true });
    if (!draft || tipodañoInvalido || valorInvalido) return;

    setIsSaving(true);

    try {
      if (indice !== undefined) {
        await putCobertura(draft.id, {
          id_seguro: draft.id_carro,
          tipoda_o: draft.tipodaño,
          descripcion: draft.descripcion,
          cantidadCobertura: draft.valides,
        });
        editar(indice, draft);
      } else {
        const nuevaCobertura = await postCobertura({
          id_SeguroCarro: draft.id_carro,
          tipodaño: draft.tipodaño,
          descripcion: draft.descripcion ?? "",
          cantidadCobertura: draft.valides,
        });
        agregar(nuevaCobertura);
      }

      cerrarPopup();
    } catch (error) {
      console.error("Error al guardar cobertura:", error);
      alert("No se pudo guardar la cobertura.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!abierta || !draft) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <button
          onClick={cerrarPopup}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
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
              placeholder="Ej. Golpe frontal"
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                tipodañoInvalido
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-black"
              }`}
              value={draft.tipodaño}
              onChange={(e) => setDraft({ ...draft, tipodaño: e.target.value })}
              onBlur={() => setTocado((prev) => ({ ...prev, tipodaño: true }))}
            />
            {tipodañoInvalido && (
              <p className="text-xs text-red-500 mt-1">Mínimo 3 caracteres requeridos.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              placeholder="Describe brevemente el daño"
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-black"
              rows={3}
              value={draft.descripcion}
              onChange={(e) => setDraft({ ...draft, descripcion: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Monto *</label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                placeholder={tipoMonto === "%" ? "Ej. 40 (máx. 100)" : "Ej. 1000"}
                className={`flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                  valorInvalido
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
                value={valor}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) {
                    if (tipoMonto === "%" && val.length > 3) return;
                    setValor(val);
                    actualizarValides(val, tipoMonto);
                  }
                }}
                onBlur={() => setTocado((prev) => ({ ...prev, valor: true }))}
              />
              <select
                value={tipoMonto}
                onChange={(e) => {
                  setTipoMonto(e.target.value);
                  actualizarValides(valor, e.target.value);
                }}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="BOB">BOB</option>
                <option value="%">%</option>
              </select>
            </div>
            {valorInvalido && (
              <p className="text-xs text-red-500 mt-1">
                {isNaN(Number(valor)) || Number(valor) <= 0
                  ? "Ingresa un valor numérico mayor a 0."
                  : tipoMonto === "%" && Number(valor) > 100
                  ? "El porcentaje no puede ser mayor a 100%."
                  : ""}
              </p>
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
            disabled={isSaving}
            className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 transition flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            {isSaving ? "Guardando..." : indice !== undefined ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(PopUpCobertura);
