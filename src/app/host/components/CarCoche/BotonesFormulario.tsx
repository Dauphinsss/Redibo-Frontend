"use client";

import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

interface BotonesFormularioProps {
  isFormValid: boolean;
  onNext?: () => void;
}

export default function BotonesFormulario({ 
  isFormValid,
  onNext 
}: BotonesFormularioProps) {
  const router = useRouter();

  return (
    <div className="w-full max-w-5xl flex justify-between mt-10 px-80">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="secondary"
            className="w-50 h-12 text-lg font-semibold"
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
              className="bg-red-600 hover:bg-red-700"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        variant="default"
        className="w-50 h-12 text-lg font-semibold text-white bg-gray-800"
        onClick={onNext}
        disabled={!isFormValid}
      >
        SIGUIENTE
      </Button>
    </div>
  );
}