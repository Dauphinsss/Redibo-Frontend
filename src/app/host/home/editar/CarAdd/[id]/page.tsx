import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

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
{ id: "checkbox", label: "Checkbox" },
{ id: "sound-system", label: "Sistema de sonido" },
];

const CheckboxList: React.FC = () => {
return (
    <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-5xl mx-auto">
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

const SprinterosPage: React.FC = () => {
return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      {/* Título */}
    <div className="w-full max-w-5xl flex justify-start">
        <h1 className="text-4xl font-bold my-5 pl-7">Características Adicionales</h1>
    </div>

      {/* Lista de Checkbox - Centrada */}
    <div className="w-full h-120 flex items-center justify-center">
        <CheckboxList />
    </div>

      {/* Sección de Botones */}
    <div className="w-full max-w-5xl flex justify-between items-center mt-10 px-10">
        <Button 
        variant="secondary"
        className="w-[160px] h-12 text-lg font-semibold transition-all duration-200 hover:bg-gray-100 hover:brightness-90"
        >
        CANCELAR
        </Button>
        
        <Button 
        variant="default"
        className="h-12 text-lg font-semibold text-white px-6"
        >
        FINALIZAR EDICIÓN Y GUARDAR
        </Button>
    </div>
    </div>
);
};

export default SprinterosPage;