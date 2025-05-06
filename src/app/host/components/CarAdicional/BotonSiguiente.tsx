"use client";

import React, { useState } from "react";
import { useFormContext } from "../../home/add/context/FormContext";
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

      {/* Botón Cancelar */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="secondary"
            className="w-full sm:w-48 h-12 text-lg font-semibold transition-transform duration-200 ease-in-out transform hover:scale-110 hover:bg-gray-200 hover:text-drab-300"
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

      
    </>
  );
};

export default BotonSiguiente;
