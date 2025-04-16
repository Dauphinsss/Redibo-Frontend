import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

const items = [
  { id: "air-conditioning", label: "Aire acondicionado" },
  { id: "bluetooth", label: "Bluetooth" },
  { id: "gps", label: "GPS" },
  { id: "bike-rack", label: "Portabicicletas" },
  { id: "ski-stand", label: "Soporte para esquís" },
  { id: "touch-screen", label: "Pantalla táctil" },
  { id: "baby-seat", label: "Sillas para bebé" },
  { id: "reverse-camera", label: "Cámara de reversa" },
  { id: "leather-seats", label: "Asientos de cuero" },
  { id: "anti-theft", label: "Sistema antirrobo" },
  { id: "roof-rack", label: "Toldo o rack de techo" },
  { id: "polarized-glass", label: "Vidrios polarizados" },
  { id: "sound-system", label: "Sistema de sonido" },
];


const DisposicionCheckBox: React.FC = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-7 w-full max-w-5xl mx-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center">
            <Checkbox id={item.id} />
            <label htmlFor={item.id} className="ml-2 text-base">
              {item.label}
            </label>
          </div>
        ))}
      </div>
    );
  };
export default DisposicionCheckBox;