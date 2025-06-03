"use client";

import { memo, useState } from "react";
import { AutoCard_Interfaces_Recode as Auto } from "@/app/busqueda/interface/AutoCard_Interface_Recode";
import CarCardImage from "./CarCardImgRecode";
import CarCardHeader from "./CarCardHeaderRecode";
import CarCardSpecs from "./CarCardSpecsRecode";
import CarCardHost from "./CarCardHostRecode";
import CarCardUbicacion from "./CarCardUbicacionRecode";
import CarCardPrice from "./CarCardPriceRecode";
import { useCalificaciones } from "@/app/busqueda/hooks/useCalifPromedio";
import CarCardCaractAdicionales from "./CarCardCaractAdicionales";
import { useExpandingCard } from "@/app/busqueda/hooks/useExpandingCard";
import "./CaracAdicionales.css";
import { useCaracAdicionales } from "@/app/busqueda/hooks/useCaracAdicionales";

export type RecodeCarCardProps = Auto;

function RecodeCarCard(props: Auto) {
  const {
    idAuto,
    modelo,
    marca,
    asientos,
    puertas,
    transmision,
    combustibles,
    estadoAlquiler,
    nombreHost,
    ciudad,
    calle,
    precioOficial,
    precioDescuento,
    precioPorDia,
    imagenURL,
    caracteristicasAdicionales,
  } = props;

  const [combustibleSeleccionado, setCombustibleSeleccionado] = useState(
    combustibles[0]
  );
  const { promedioCalificacion } = useCalificaciones(idAuto);
  const { isExpanded } = useExpandingCard();
  const { presentes } = useCaracAdicionales(caracteristicasAdicionales);
  return (
    <div
      className={`w-full max-w-[750px] border border-black rounded-[15px] p-6 shadow-sm bg-white flex flex-col transition-all duration-300 ${
        isExpanded ? "expanded" : ""
      }`}
    >
      <div className="flex flex-wrap md:flex-nowrap gap-4">
        <div className="w-full md:w-[230px] flex flex-col items-center justify-center">
          <CarCardImage imagenUrl={imagenURL} />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <CarCardHeader nombre={modelo} marca={marca} />
            <CarCardSpecs
              asientos={asientos}
              puertas={puertas}
              transmision={transmision}
              combustibles={combustibles}
              estado={estadoAlquiler}
              combustibleSeleccionado={combustibleSeleccionado}
              onCombustibleChange={setCombustibleSeleccionado}
            />
            <CarCardHost
              nombreHost={nombreHost}
              calificacion={parseFloat(promedioCalificacion)}
            />
            <CarCardUbicacion ciudad={ciudad} calle={calle} />
          </div>
        </div>

        <CarCardPrice
          id={idAuto}
          precioOficial={precioOficial}
          precioDescuento={precioDescuento}
          precioPorDia={precioPorDia}
        />
      </div>

      <div className="w-full mt-6">
        <CarCardCaractAdicionales presentes={presentes} />
      </div>
    </div>
  );
}

export default memo(RecodeCarCard);
