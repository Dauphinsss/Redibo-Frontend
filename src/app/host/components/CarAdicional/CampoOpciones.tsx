"use client";
import React, { useCallback, ChangeEvent, memo } from "react";
import { useFormContext } from "../../home/add/context/FormContext";

export type FeatureKey = 
  | "airConditioning"
  | "bluetooth"
  | "gps"
  | "bikeRack"
  | "skiStand"
  | "touchScreen"
  | "babySeat"
  | "reverseCamera"
  | "leatherSeats"
  | "antiTheft"
  | "roofRack"
  | "polarizedGlass"
  | "soundSystem"
  | "sunroof";

type Item = { id: FeatureKey; label: string; featureId: number };

const ITEMS: Item[] = [
  { id: "airConditioning", label: "Aire acondicionado", featureId: 1 },
  { id: "bluetooth", label: "Bluetooth", featureId: 2 },
  { id: "gps", label: "GPS", featureId: 3 },
  { id: "bikeRack", label: "Portabicicletas", featureId: 4 },
  //
  { id: "skiStand", label: "Soporte para esquís", featureId: 5 },
  { id: "touchScreen", label: "Pantalla táctil", featureId: 6 },
  { id: "babySeat", label: "Sillas para bebé", featureId: 7 },
  { id: "reverseCamera", label: "Cámara de reversa", featureId: 8 },
  { id: "leatherSeats", label: "Asientos de cuero", featureId: 9 },
  { id: "antiTheft", label: "Sistema antirrobo", featureId: 10 },
  { id: "roofRack", label: "Toldo o rack de techo", featureId: 11 },
  { id: "polarizedGlass", label: "Vidrios polarizados", featureId: 12 },
  { id: "soundSystem", label: "Sistema de sonido", featureId: 13 },
];

interface CaracteristicaCheckboxProps {
  item: Item;
  isChecked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>, featureId: number) => void;
}

const CaracteristicaCheckbox: React.FC<CaracteristicaCheckboxProps> = memo(({ item, isChecked, onChange }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={item.id}
        checked={isChecked}
        onChange={(e) => onChange(e, item.featureId)}
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
      />
      <label htmlFor={item.id} className="ml-2 text-base">
        {item.label}
      </label>
    </div>
  );
});
CaracteristicaCheckbox.displayName = "CaracteristicaCheckbox";

const ListaCaracteristicas: React.FC = () => {
  const { formData, updateCaracteristicasAdicionales } = useFormContext();
  const currentExtraIds = formData.caracteristicasAdicionales.extraIds ?? [];


  const handleCheckboxChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, featureId: number) => {
      const isChecked = e.target.checked;
      let updatedExtraIds: number[];
      if (isChecked) {
        updatedExtraIds = [...currentExtraIds, featureId];
      } else {
        updatedExtraIds = currentExtraIds.filter((fid) => fid !== featureId);
      }
      updateCaracteristicasAdicionales({ extraIds: updatedExtraIds });
    },
    [currentExtraIds, updateCaracteristicasAdicionales]
  );
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-9">
      <div
        className={`
          grid
          grid-cols-2 gap-x-6 gap-y-6        /* ⬅ MOD: 2 columnas en móvil */
          sm:grid-rows-7 sm:grid-flow-col     /* ⬅ MOD: tu layout original en sm+ */
          sm:gap-x-12 sm:gap-y-7
        `}
      >
        {ITEMS.map((item) => (
          <CaracteristicaCheckbox
            key={item.id}
            item={item}
            isChecked={currentExtraIds.includes(item.featureId)}
            onChange={handleCheckboxChange}
          />
        ))}
      </div>
    </div>
  );
};

export default ListaCaracteristicas;