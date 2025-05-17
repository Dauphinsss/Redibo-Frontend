'use client';

import { CoberturaInterface } from "@/interface/CoberturaForm_Interface_Recode";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Props {
  coberturas: CoberturaInterface[];
  onEditar: (index: number) => void;
  onEliminar: (index: number) => void;
  onAgregar: () => void;
}

export default function TablaCoberturas({
  coberturas,
  onEditar,
  onEliminar,
  onAgregar,
}: Props) {
  const formatValor = (valor: string) => {
    if (valor.endsWith("P")) {
      return {
        texto: `${valor.replace("P", "")}%`,
        color: "bg-blue-100 text-blue-800",
      };
    } else if (valor.endsWith("B")) {
      return {
        texto: `${valor.replace("B", "")} BOB`,
        color: "bg-green-100 text-green-800",
      };
    } else {
      return {
        texto: valor,
        color: "bg-gray-200 text-gray-800",
      };
    }
  };

  return (
    <div className="mt-6 w-full space-y-4">
      {/* Header + Añadir */}
      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold text-gray-800">Coberturas agregadas</h3>
        <button
          onClick={onAgregar}
          className="flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded hover:bg-gray-800 transition text-sm"
        >
          <Plus size={16} />
          Añadir
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="min-w-full table-fixed text-sm text-gray-800">
          <thead>
            <tr className="bg-black text-white">
              <th className="w-1/5 px-4 py-3 text-left font-medium">Tipo de daño</th>
              <th className="w-2/5 px-4 py-3 text-left font-medium">Descripción</th>
              <th className="w-1/5 px-4 py-3 text-left font-medium">Valor</th>
              <th className="w-1/5 px-4 py-3 text-center font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {coberturas.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No se han agregado coberturas.
                </td>
              </tr>
            ) : (
              coberturas.map((c, index) => {
                const { texto, color } = formatValor(c.valides);
                return (
                  <tr key={index} className="hover:bg-gray-50 transition border-t">
                    <td className="px-4 py-3 font-medium">{c.tipodaño}</td>
                    <td className="px-4 py-3">{c.descripcion}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${color}`}>
                        {texto}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onEditar(index)}
                        className="text-blue-600 hover:text-blue-800 transition mr-2"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => onEliminar(index)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
