"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useFormContext } from "../../home/add/context/FormContext";

const BotonSiguiente: React.FC = () => {
  const router = useRouter();
  const { formData } = useFormContext();

  const handleContinue = () => {
    const featuresSelected = Object.values(formData.caracteristicasAdicionales)
      .some(value => value === true);

    if (!featuresSelected) {
      alert("Por favor selecciona al menos una característica");
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