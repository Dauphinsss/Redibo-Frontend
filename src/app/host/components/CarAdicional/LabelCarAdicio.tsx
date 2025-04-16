import React from "react";
import { Label } from "@/components/ui/label"; // Importa el componente Label desde la librería

interface LabelCarAdicioProps {
  text?: string; // Texto del label, por defecto será "Características adicionales"
}

const LabelCarAdicio: React.FC<LabelCarAdicioProps> = ({ text = "Características adicionales" }) => {
  return (
    <div className="w-full max-w-5xl flex justify-start">
      <Label className="text-4xl font-bold my-8 pl-9">{text}</Label>
    </div>
  );
};

export default LabelCarAdicio;