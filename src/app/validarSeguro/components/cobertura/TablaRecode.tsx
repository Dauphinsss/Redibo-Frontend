"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useCoberturasStore } from "@/app/validarSeguro/hooks/useCoberturasStore";
import { deleteCobertura } from "@/app/validarSeguro/services/servicesSeguro";
import ModalEliminar from "./ModalEliminar";

export default function TablaRecode() {
  const { lista, abrirPopup, eliminar } = useCoberturasStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [indexAEliminar, setIndexAEliminar] = useState<number | null>(null);
  const [idCoberturaAEliminar, setIdCoberturaAEliminar] = useState<number | undefined>(undefined);

  const handleClickEliminar = (index: number, id?: number) => {
    setIndexAEliminar(index);
    setIdCoberturaAEliminar(id);
    setModalVisible(true);
  };

  const handleConfirmarEliminar = async () => {
    if (indexAEliminar === null) return;

    try {
      if (idCoberturaAEliminar) {
        await deleteCobertura(idCoberturaAEliminar);
        console.log(`Cobertura ${idCoberturaAEliminar} eliminada del backend.`);
      }
      eliminar(indexAEliminar);
    } catch (error) {
      console.error("Error al eliminar cobertura en backend:", error);
    } finally {
      limpiarEstadoEliminacion();
    }
  };

  const limpiarEstadoEliminacion = () => {
    setIndexAEliminar(null);
    setIdCoberturaAEliminar(undefined);
    setModalVisible(false);
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
                <td className="py-2 px-4">
                  {(() => {
                    const val = c.valides ?? "";
                    const match = val.match(/^(\d+)([BP])$/);
                    if (!match) return val; // muestra el valor tal cual si no es válido

                    const numero = match[1];
                    const sufijo = match[2] === "P" ? "%" : "BOB";
                    return `${numero} ${sufijo}`;
                  })()}
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    onClick={() => abrirPopup(i)}
                    className="text-blue-600 hover:text-blue-800 transition"
                    title="Editar"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleClickEliminar(i, c.id)}
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

      <ModalEliminar
        visible={modalVisible}
        onClose={limpiarEstadoEliminacion}
        onConfirm={handleConfirmarEliminar}
      />
    </section>
  );
}