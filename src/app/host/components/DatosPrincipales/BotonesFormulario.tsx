"use client";

import { Button } from "@/components/ui/button";

interface BotonesFormularioProps {
  isFormValid: boolean;
  onNext?: () => void;
}

export default function BotonesFormulario({ isFormValid, onNext }: BotonesFormularioProps) {

  return (
    // ⬇ Contenedor ajustado para mover el botón más a la derecha
    <div className="flex justify-end w-full max-w-5xl mx-auto mt-10 px-4 sm:px-10">
      <Button
        variant="default"
        className="w-full sm:w-60 h-14 text-lg font-semibold text-white bg-gray-800 transition-transform duration-200 ease-in-out transform hover:scale-110 hover:bg-gray-900"
        onClick={onNext}
        disabled={!isFormValid}
      >
        SIGUIENTE
      </Button>
    </div>
  );
}