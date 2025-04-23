"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
  onNext?: () => void;
}

export default function BotonesFormulario({
  isFormValid,
  onNext,
}: BotonesFormularioProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row justify-between w-full max-w-5xl mx-auto mt-10 px-4 sm:px-10 gap-4">
      {/* Botón Cancelar */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="secondary"
            className="w-full sm:w-60 h-14 text-lg font-semibold transition-transform duration-200 ease-in-out transform hover:scale-110 hover:bg-gray-200 hover:text-drab-300"
          >
            CANCELAR
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro que desea salir?</AlertDialogTitle>
            <AlertDialogDescription>
              Los datos no guardados se perderán si abandona esta sección.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => router.push("/host/pages")}
              className="bg-red-600 hover:bg-red-700 transition-transform duration-200 ease-in-out transform hover:scale-105"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Botón Siguiente */}
      <Button
        variant="default"
        className="w-full sm:w-48 h-12 text-lg font-semibold text-white bg-gray-800 transition-transform duration-200 ease-in-out transform hover:scale-105 hover:bg-gray-900"
        onClick={onNext}
        disabled={!isFormValid}
      >
        SIGUIENTE
      </Button>
    </div>
  );
}
