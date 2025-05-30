"use client";

import { useCoberturasStore } from "@/app/ValidarSeguro/hooks/useCoberturasStore";
import { Pencil, Trash2 } from "lucide-react";
import { deleteCobertura } from "@/service/services_Recode";

export default function TablaRecode() {
  const { lista, abrirPopup, eliminar } = useCoberturasStore();

  const handleEliminar = async (index: number, id?: number) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta cobertura?");
    if (!confirmar) return;

    try {
      if (id) {
        await deleteCobertura(id);
        console.log(`Cobertura ${id} eliminada del backend.`);
      }
    } catch (error) {
      console.error("Error al eliminar cobertura en backend:", error);
    } finally {
      eliminar(index); // actualizar local
    }
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Coberturas</h2>
        <button
          onClick={() => abrirPopup()}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          + Agregar cobertura
        </button>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead className="bg-black text-white">
          <tr>
            <th className="py-2 px-4 text-left">Tipo de daño</th>
            <th className="py-2 px-4 text-left">Descripción</th>
            <th className="py-2 px-4 text-left">Validez</th>
            <th className="py-2 px-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lista.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-4 text-center text-gray-500">
                No hay coberturas registradas.
              </td>
            </tr>
          ) : (
            lista.map((c, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{c.tipodaño}</td>
                <td className="py-2 px-4">{c.descripcion || "—"}</td>
                <td className="py-2 px-4">{c.valides}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    onClick={() => abrirPopup(i)}
                    className="text-blue-600 hover:text-blue-800 transition"
                    title="Editar"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleEliminar(i, c.id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}