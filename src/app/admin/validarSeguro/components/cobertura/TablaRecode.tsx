"use client";

import { useState } from "react";
import { Pencil, Trash2, PlusCircle, ShieldX } from "lucide-react";
import { useCoberturasStore } from "@/app/admin/validarSeguro/hooks/useCoberturasStore";
import { deleteCobertura } from "@/app/admin/validarSeguro/services/servicesSeguro";
import ModalEliminar from "./ModalEliminar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TablaRecode() {
  const { lista, abrirPopup, eliminar: eliminarDelStore } = useCoberturasStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [indexAEliminar, setIndexAEliminar] = useState<number | null>(null);
  const [idCoberturaAEliminar, setIdCoberturaAEliminar] = useState<number | undefined>(undefined);

  const handleClickEliminar = (index: number, idDb?: number) => {
    setIndexAEliminar(index);
    const cobertura = lista[index];
    if (cobertura && !cobertura.isNew && cobertura.id) {
        setIdCoberturaAEliminar(cobertura.id);
    } else {
        setIdCoberturaAEliminar(undefined);
    }
    setModalVisible(true);
  };

  const handleConfirmarEliminar = async () => {
    if (indexAEliminar === null) return;
    try {
      if (idCoberturaAEliminar) {
        await deleteCobertura(idCoberturaAEliminar);
        console.log(`Cobertura ID ${idCoberturaAEliminar} eliminada del backend.`);
      }
      eliminarDelStore(indexAEliminar);
    } catch (error) {
      console.error("Error al eliminar cobertura:", error);
      alert("Error al eliminar la cobertura.");
    } finally {
      limpiarEstadoEliminacion();
    }
  };

  const limpiarEstadoEliminacion = () => {
    setIndexAEliminar(null);
    setIdCoberturaAEliminar(undefined);
    setModalVisible(false);
  };

  const formatearValides = (valides?: string) => {
    if (!valides) return <Badge variant="outline">N/A</Badge>;
    const match = valides.match(/^(\d+\.?\d*)\s*([BP])$/i);
    if (!match) return <Badge variant="outline">{valides}</Badge>;
    const numero = parseFloat(match[1]);
    const esPorcentaje = match[2].toUpperCase() === "P";
    return (
      <Badge variant={esPorcentaje ? "secondary" : "default"} className="whitespace-nowrap">
        {numero.toLocaleString(undefined, { minimumFractionDigits: esPorcentaje ? 0 : 2, maximumFractionDigits: 2 })} {esPorcentaje ? "%" : "BOB"}
      </Badge>
    );
  };

  return (
    <section className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Coberturas de la Póliza</h2>
        <Button onClick={() => abrirPopup()} variant="default" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar cobertura
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-100/50">
              <TableHead className="py-3 px-4 text-left font-semibold text-gray-600">Tipo de daño</TableHead>
              <TableHead className="py-3 px-4 text-left font-semibold text-gray-600">Descripción</TableHead>
              <TableHead className="py-3 px-4 text-left font-semibold text-gray-600">Monto/Porcentaje Cubierto</TableHead>
              <TableHead className="py-3 px-4 text-center font-semibold text-gray-600">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lista.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                      <ShieldX className="w-12 h-12 text-gray-400 mb-3" />
                      <p className="font-medium">No hay coberturas registradas.</p>
                      <p className="text-sm mt-1">Puedes agregar una haciendo clic en el botón de arriba.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              lista.map((cobertura, i) => (
                <TableRow key={cobertura.id || i} className="border-t hover:bg-gray-50/50 transition-colors">
                  <TableCell className="py-3 px-4 font-medium text-gray-700">{cobertura.tipodaño}</TableCell>
                  <TableCell className="py-3 px-4 text-gray-600 text-sm">{cobertura.descripcion || "—"}</TableCell>
                  <TableCell className="py-3 px-4">{formatearValides(cobertura.valides)}</TableCell>
                  <TableCell className="py-3 px-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => abrirPopup(i)}
                        title="Editar Cobertura"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100/50 h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleClickEliminar(i, cobertura.id)}
                        title="Eliminar Cobertura"
                        className="text-red-600 hover:text-red-800 hover:bg-red-100/50 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ModalEliminar
        visible={modalVisible}
        onClose={limpiarEstadoEliminacion}
        onConfirm={handleConfirmarEliminar}
      />
    </section>
  );
}