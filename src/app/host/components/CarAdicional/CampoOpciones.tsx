"use client";
import React from "react";
import { useFormContext } from "../../home/add/context/FormContext";

const ListaCaracteristicas: React.FC = () => {
  const { formData, updateCaracteristicasAdicionales } = useFormContext();

  const items = [
    { id: "airConditioning", label: "Aire acondicionado" },
    { id: "bluetooth", label: "Bluetooth" },
    { id: "gps", label: "GPS" },
    { id: "bikeRack", label: "Portabicicletas" },
    { id: "skiStand", label: "Soporte para esquís" },
    { id: "touchScreen", label: "Pantalla táctil" },
    { id: "babySeat", label: "Sillas para bebé" },
    { id: "reverseCamera", label: "Cámara de reversa" },
    { id: "leatherSeats", label: "Asientos de cuero" },
    { id: "antiTheft", label: "Sistema antirrobo" },
    { id: "roofRack", label: "Toldo o rack de techo" },
    { id: "polarizedGlass", label: "Vidrios polarizados" },
    { id: "soundSystem", label: "Sistema de sonido" },
    { id: "sunroof", label: "Techo solar" },
  ];

  const handleCheckboxChange = (id: keyof typeof formData.caracteristicasAdicionales) => {
    const currentValue = formData.caracteristicasAdicionales[id];
    updateCaracteristicasAdicionales({
      ...formData.caracteristicasAdicionales,
      [id]: !currentValue
    });
  };

  return (
    <div className="w-full max-w-5xl pl-9">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-7 w-full max-w-5xl mx-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center">
            <input
              type="checkbox"
              id={item.id}
              checked={formData.caracteristicasAdicionales[item.id as keyof typeof formData.caracteristicasAdicionales]}
              onChange={() => 
                handleCheckboxChange(item.id as keyof typeof formData.caracteristicasAdicionales)
              }
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor={item.id} className="ml-2 text-base">
              {item.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaCaracteristicas;