"use client";

import { Button } from "@/components/ui/button";
//import { useRouter } from "next/navigation";
interface BotonesFormularioProps {
  isFormValid: boolean;
  onNext?: () => void;
}

export default function BotonesFormulario({
  isFormValid,
  onNext,
}: BotonesFormularioProps) {
  //const router = useRouter();
  return (
    // ⬇ Contenedor ajustado para mover el botón más a la derecha
    <div className="flex flex-col sm:flex-row justify-between w-full max-w-5xl mx-auto mt-10 px-4 sm:px-10 gap-4">
      
      {/* Botón Siguiente */}
      <div className="w-full sm:w-auto sm:ml-auto">
        <Button
          variant="default"
          className="w-full sm:w-48 h-12 text-lg font-semibold text-white bg-gray-800 transition-transform duration-200 ease-in-out transform hover:scale-105 hover:bg-gray-900"
          onClick={onNext}
          disabled={!isFormValid}
        >
          SIGUIENTE
        </Button>
      </div>
    </div>
  );
}
