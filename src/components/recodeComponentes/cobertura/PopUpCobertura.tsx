"use client";

import { memo, useState } from "react";
import { CoberturaInterface } from "@/interface/CoberturaForm_Interface_Recode";
import { X } from "lucide-react";

interface PopupProps {
  cobertura: CoberturaInterface;
  setCobertura: (c: CoberturaInterface) => void;
  onClose: () => void;
  onSave: () => void;
  isEditing?: boolean;
}

function PopupCobertura({
  cobertura,
  setCobertura,
  onClose,
  onSave,
  isEditing = false,
}: PopupProps) {
  const [tipoMonto, setTipoMonto] = useState(
    cobertura.valides.endsWith("P") ? "%" : "BOB"
  );
  const [valor, setValor] = useState(
    cobertura.valides.replace(/[BP]$/, "")
  );
  const [isSaving, setIsSaving] = useState(false);
  const [tocado, setTocado] = useState({ tipodaño: false, valor: false });

  const actualizarValides = (nuevoValor: string, tipo: string) => {
    const sufijo = tipo === "BOB" ? "B" : "P";
    setCobertura({ ...cobertura, valides: `${nuevoValor}${sufijo}` });
  };

  const tipodañoInvalido = tocado.tipodaño && cobertura.tipodaño.trim().length < 3;
  const valorInvalido = tocado.valor && (
    isNaN(Number(valor)) ||
    Number(valor) <= 0 ||
    (tipoMonto === "%" && Number(valor) > 100)
  );

  const handleGuardar = async () => {
    setTocado({ tipodaño: true, valor: true });

    if (tipodañoInvalido || valorInvalido) return;

    setIsSaving(true);
    setTimeout(() => {
      onSave();
      setIsSaving(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold mb-4">
          {isEditing ? "Editar cobertura" : "Nueva cobertura"}
        </h3>

        <div className="space-y-4">
          {/* Tipo de daño */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tipo de daño *
            </label>
            <input
              type="text"
              placeholder="Ej. Golpe frontal"
              title="Tipo de daño"
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                tipodañoInvalido
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-black"
              }`}
              value={cobertura.tipodaño}
              onChange={(e) =>
                setCobertura({ ...cobertura, tipodaño: e.target.value })
              }
              onBlur={() => setTocado((prev) => ({ ...prev, tipodaño: true }))}
            />
            {tipodañoInvalido && (
              <p className="text-xs text-red-500 mt-1">
                Mínimo 3 caracteres requeridos.
              </p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              placeholder="Describe brevemente el daño"
              title="Descripción del daño"
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-black"
              rows={3}
              value={cobertura.descripcion}
              onChange={(e) =>
                setCobertura({ ...cobertura, descripcion: e.target.value })
              }
            />
          </div>

          {/* Monto */}
          <div>
            <label className="block text-sm font-medium mb-1">Monto *</label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                placeholder={tipoMonto === "%" ? "Ej. 40 (máx. 100)" : "Ej. 1000"}
                title="Monto numérico"
                className={`flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                  valorInvalido
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
                value={valor}
                onChange={(e) => {
                  const val = e.target.value;
                  // solo permitir números y máximo 3 dígitos si es %
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
                title="Tipo de valor"
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

        {/* Botones */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
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
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            )}
            {isSaving ? "Guardando..." : isEditing ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(PopupCobertura);
