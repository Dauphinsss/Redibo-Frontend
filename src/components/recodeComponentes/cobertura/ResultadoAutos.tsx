"use client";

import ListCar from "../cobertura/ListCar";
import { AutoCard_Interfaces_Recode as Auto } from "@/interface/AutoCard_Interface_Recode";

interface Props {
  autos: Auto[];
}

export default function ResultadoAutos({ autos }: Props) {
  if (!autos || autos.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No hay autos disponibles en este momento.
      </p>
    );
  }

  return <ListCar carCards={autos} />;
}
