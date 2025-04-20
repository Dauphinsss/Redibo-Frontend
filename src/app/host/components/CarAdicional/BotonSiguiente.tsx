"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useFormContext } from "../../home/add/context/FormContext";

const BotonSiguiente: React.FC = () => {
  const router = useRouter();
  const { formData } = useFormContext();

  const handleContinue = () => {
    const extraIds = formData.caracteristicasAdicionales.extraIds ?? [];
    if (extraIds.length < 2) {
      alert("Por favor selecciona al menos dos características");
      return;
    }
    
    router.push("/host/home/add/inputimagen");
  };

  return (
    <Button
      variant="default"
      className="w-50 h-12 text-lg font-semibold text-white bg-gray-800"
      onClick={handleContinue}
    >
      SIGUIENTE
    </Button>
  );
};

export default BotonSiguiente;