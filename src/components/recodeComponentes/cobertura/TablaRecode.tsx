import { CoberturaInterface } from "@/interface/CoberturaForm_Interface_Recode";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Props {
  coberturas: CoberturaInterface[];
  onEditar: (index: number) => void;
  onEliminar: (index: number) => void;
  onAgregar: () => void;
}

export default function TablaCoberturas({ coberturas, onEditar, onEliminar, onAgregar }: Props) {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Tipo de cobertura</h3>
        <button onClick={onAgregar} className="p-2 bg-black text-white rounded">
          <Plus size={16} />
        </button>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Descripción</th>
            <th className="p-2 border">Monto</th>
            <th className="p-2 border text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {coberturas.map((c, index) => (
            <tr key={index}>
              <td className="p-2 border">{c.tipodaño}</td>
              <td className="p-2 border">{c.descripcion}</td>
              <td className="p-2 border">{c.valides}</td>
              <td className="p-2 border text-center space-x-2">
                <button onClick={() => onEditar(index)}><Pencil size={16} /></button>
                <button onClick={() => onEliminar(index)}><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
