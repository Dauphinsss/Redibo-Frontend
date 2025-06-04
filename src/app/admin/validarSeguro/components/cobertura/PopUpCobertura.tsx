"use client";

import { memo, useState, useEffect } from "react";
import { X } from "lucide-react";
import { useCoberturasStore } from "@/app/admin/validarSeguro/hooks/useCoberturasStore";
import { postCobertura, putCobertura } from "@/app/admin/validarSeguro/services/servicesSeguro";
import { mutate } from "swr";

function PopUpCobertura() {
  const {
    popup,
    draft,
    setDraft,
    cerrarPopup,
    agregar,
    editar,
    id_poliza_actual,
  } = useCoberturasStore();

  const { abierta, indice } = popup;

  const [tipoMonto, setTipoMonto] = useState("BOB");
  const [valor, setValor] = useState("0");
  const [isSaving, setIsSaving] = useState(false);
  
  const [touchedFields, setTouchedFields] = useState({ 
    tipodaño: false, 
    valor: false, 
    descripcion: false 
  });

  useEffect(() => {
    if (draft) {
      if (draft.valides) {
        const esPorcentaje = draft.valides.endsWith("P");
        const valorNumerico = draft.valides.replace(/[BP]$/, "");
        setTipoMonto(esPorcentaje ? "%" : "BOB");
        setValor(valorNumerico);
      } else {
        setTipoMonto("BOB");
        setValor("0");
      }
      setTouchedFields({ tipodaño: false, valor: false, descripcion: false });
    } else {
        setTipoMonto("BOB");
        setValor("0");
        setTouchedFields({ tipodaño: false, valor: false, descripcion: false });
    }
  }, [draft, abierta]);

  const actualizarValidesEnDraft = (nuevoValor: string, tipoActual: string) => {
    if (draft) {
      const sufijo = tipoActual === "BOB" ? "B" : "P";
      setDraft({ ...draft, valides: `${nuevoValor}${sufijo}` });
    }
  };

  const esTipodañoInvalido = touchedFields.tipodaño && (!draft?.tipodaño || draft.tipodaño.trim().length < 3);
  const esValorInvalido = touchedFields.valor && (
    isNaN(Number(valor)) ||
    Number(valor) <= 0 ||
    (tipoMonto === "%" && Number(valor) > 100)
  );
  const esDescripcionInvalida = touchedFields.descripcion && draft?.descripcion !== undefined && draft.descripcion !== null && draft.descripcion.length > 200;

  const handleGuardar = async () => {
    setTouchedFields({ tipodaño: true, valor: true, descripcion: true });

    const tipodañoInvalidoAhora = !draft?.tipodaño || draft.tipodaño.trim().length < 3;
    const valorInvalidoAhora = isNaN(Number(valor)) || Number(valor) <= 0 || (tipoMonto === "%" && Number(valor) > 100);
    const descripcionInvalidaAhora = draft?.descripcion !== undefined && draft.descripcion !== null && draft.descripcion.length > 200;

    if (!draft || tipodañoInvalidoAhora || valorInvalidoAhora || descripcionInvalidaAhora) {
        return; 
    }

    setIsSaving(true);

    try {
      const valorFinalParaValides = valor || "0";
      const sufijo = tipoMonto === "BOB" ? "B" : "P";
      const validesFinal = `${valorFinalParaValides}${sufijo}`;
      
      const coberturaParaEnviar = {
          ...draft,
          valides: validesFinal,
          descripcion: draft.descripcion || "" 
      };

      if (indice !== undefined && draft.id) {
        await putCobertura(draft.id, { 
          id_seguro: coberturaParaEnviar.id_poliza,  
          tipoda_o: coberturaParaEnviar.tipodaño,
          descripcion: coberturaParaEnviar.descripcion,
          cantidadCobertura: coberturaParaEnviar.valides,
        });
        editar(indice, coberturaParaEnviar);
      } else { 
        const nuevaCoberturaDesdeBackend = await postCobertura({
          id_SeguroCarro: coberturaParaEnviar.id_poliza, 
          tipodaño: coberturaParaEnviar.tipodaño,
          descripcion: coberturaParaEnviar.descripcion,
          cantidadCobertura: coberturaParaEnviar.valides,
        });
        
        agregar({ 
            ...nuevaCoberturaDesdeBackend, // Asume que tiene id, tipodaño, descripcion, valides
            id_poliza: coberturaParaEnviar.id_poliza // Aseguramos que id_poliza esté presente
        });
      }
      
      // Mutar la clave de SWR para forzar la recarga de datos en useSeguroCoberturas
      // La clave debe coincidir con la usada en useSWR en useSeguroCoberturas.ts
      mutate(["seguroCompleto", id_poliza_actual]); // <--- NUEVO: Mutar SWR
      
      cerrarPopup();
    } catch (error) {
      console.error("Error al guardar cobertura:", error);
      alert("No se pudo guardar la cobertura. Verifique los datos e inténtelo de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!abierta || !draft) return null;

  const isSaveDisabled = Boolean(
    isSaving || 
    esTipodañoInvalido || 
    esValorInvalido || 
    esDescripcionInvalida ||
    (!draft?.tipodaño || draft.tipodaño.trim().length < 3) ||
    (isNaN(Number(valor)) || Number(valor) <= 0 || (tipoMonto === "%" && Number(valor) > 100))
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <button
          onClick={cerrarPopup}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          aria-label="Cerrar popup"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold mb-4">
          {indice !== undefined ? "Editar Cobertura" : "Nueva Cobertura"}
        </h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="tipodanio" className="block text-sm font-medium mb-1">Tipo de daño <span className="text-red-500">*</span></label>
            <input
              id="tipodanio"
              type="text"
              placeholder="Ej. Golpe frontal, Robo de accesorios"
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                esTipodañoInvalido
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-black"
              }`}
              value={draft.tipodaño}
              onChange={(e) => {
                setDraft({ ...draft, tipodaño: e.target.value });
              }}
              onBlur={() => setTouchedFields((prev) => ({ ...prev, tipodaño: true }))}
            />
            {esTipodañoInvalido && (
              <p className="text-xs text-red-500 mt-1">Mínimo 3 caracteres requeridos.</p>
            )}
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              id="descripcion"
              placeholder="Detalles de la cobertura (opcional, máx 200 caracteres)"
              className={`w-full border rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 ${
                esDescripcionInvalida
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-black"
              }`}
              rows={3}
              value={draft.descripcion || ""} 
              onChange={(e) => {
                  setDraft({ ...draft, descripcion: e.target.value })
                }
              }
              onBlur={() => setTouchedFields((prev) => ({...prev, descripcion: true}))}
              maxLength={200}
            />
             {esDescripcionInvalida && (
              <p className="text-xs text-red-500 mt-1">La descripción no puede exceder los 200 caracteres.</p>
            )}
          </div>

          <div>
            <label htmlFor="monto" className="block text-sm font-medium mb-1">Monto de cobertura <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <input
                id="monto"
                type="text" 
                inputMode="numeric" 
                placeholder={tipoMonto === "%" ? "Ej. 40 (máx. 100)" : "Ej. 1000"}
                className={`flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                  esValorInvalido
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
                value={valor}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*\.?\d*$/.test(val)) {
                     if (tipoMonto === "%" && parseFloat(val) > 100 && val.length <=3 && !val.includes('.')) {
                        setValor("100"); 
                        actualizarValidesEnDraft("100", tipoMonto);
                     } else if (tipoMonto === "BOB" && val.length > 7) {
                        setValor(val.slice(0,7));
                        actualizarValidesEnDraft(val.slice(0,7), tipoMonto);
                     }
                     else {
                        setValor(val);
                        actualizarValidesEnDraft(val, tipoMonto);
                     }
                  }
                }}
                onBlur={() => setTouchedFields((prev) => ({ ...prev, valor: true }))}
              />
              <select
                value={tipoMonto}
                onChange={(e) => {
                  const nuevoTipo = e.target.value;
                  setTipoMonto(nuevoTipo);
                  if (nuevoTipo === "%" && parseFloat(valor) > 100) {
                    setValor("100");
                    actualizarValidesEnDraft("100", nuevoTipo);
                  } else {
                    actualizarValidesEnDraft(valor, nuevoTipo);
                  }
                }}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="BOB">BOB</option>
                <option value="%">%</option>
              </select>
            </div>
            {esValorInvalido && (
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
            type="button" 
            className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            type="button" 
            disabled={isSaveDisabled}
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