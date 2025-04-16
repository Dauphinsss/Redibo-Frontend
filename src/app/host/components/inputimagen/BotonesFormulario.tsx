import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface BotonesFormularioProps {
  isFormValid: boolean;
}

const BotonesFormulario: React.FC<BotonesFormularioProps> = ({ isFormValid }) => {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  return (
    <div className="w-full max-w-5xl flex justify-between items-center mt-10 px-200">
      
      {/* Botón Finalizar */}
      <Button
        variant="default"
        className="w-[180px] h-12 text-lg font-semibold text-white bg-gray-800"
        onClick={() => setConfirmOpen(true)}
        disabled={!isFormValid}
      >
        FINALIZAR
      </Button>

      {/* AlertDialog para Confirmación de Finalización */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Confirmar publicación del vehículo?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Al confirmar, su vehículo será publicado y estará disponible para alquiler.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => router.push("/host/pages")}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BotonesFormulario;