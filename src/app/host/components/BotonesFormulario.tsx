"use client";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BotonesFormularioProps {
  isFormValid: boolean;
}

export default function BotonesFormulario({ isFormValid }: BotonesFormularioProps) {
  const router = useRouter();
  const [cancelOpen, setCancelOpen] = useState(false);

  return (
    <div className="flex justify-between w-full max-w-5xl mt-10 px-10">
      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="secondary" className="w-[160px] h-12 text-lg font-semibold">
            CANCELAR
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro que desea salir del proceso?</AlertDialogTitle>
            <AlertDialogDescription>Perderá la información no guardada.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" onClick={() => router.push("/host/pages")}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        variant="default"
        className="w-40 h-12 text-lg font-semibold text-white bg-gray-800"
        onClick={() => router.push("/host/home/add/carcoche")}
        disabled={!isFormValid}
      >
        SIGUIENTE
      </Button>
    </div>
  );
}
