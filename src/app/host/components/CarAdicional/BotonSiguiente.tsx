"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useFormContext } from "../../home/add/context/FormContext";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const BotonSiguiente: React.FC = () => {
  const router = useRouter();
  const { formData } = useFormContext();
  const extraIds = formData.caracteristicasAdicionales.extraIds ?? [];
  const isDisabled = extraIds.length < 2;
  const [open, setOpen] = useState(false);

  const handleContinue = () => {
    if (isDisabled) {
      setOpen(true);
    } else {
      router.push("/host/home/add/inputimagen");
    }
  };

  return (
    <>
      <Button
        variant="default"
        // ⬇ Botón responsivo con animación y efecto hover visible
        className={`
          w-full sm:w-60 h-14 text-lg font-semibold text-white bg-gray-800
          transition-transform duration-200 ease-in-out transform hover:scale-110 hover:bg-gray-900
          ${isDisabled ? "opacity-50 cursor-not-allowed hover:scale-100 hover:bg-gray-800" : ""}
        `}
        onClick={handleContinue}
      >
        SIGUIENTE
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Características insuficientes</AlertDialogTitle>
            <AlertDialogDescription>
              Por favor selecciona al menos dos características para continuar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setOpen(false)}>
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BotonSiguiente;
