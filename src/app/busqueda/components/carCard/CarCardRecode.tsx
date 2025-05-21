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
  } = props;

  const [combustibleSeleccionado, setCombustibleSeleccionado] = useState(combustibles[0]);
  const {promedioCalificacion } = useCalificaciones(idAuto);

  return (
    <div className="w-full max-w-[750px] md:h-[320px] border border-black rounded-[15px] p-6 shadow-sm bg-white flex flex-col md:flex-row gap-4">
      {/* Imagen del auto */}
      <div className="w-full md:w-[230px] flex items-center justify-center">
        <CarCardImage imagenUrl={imagenURL} />
      </div>

      {/* Info del auto */}
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
          <CarCardHost nombreHost={nombreHost} calificacion={parseFloat(promedioCalificacion)} />
          <CarCardUbicacion ciudad={ciudad} calle={calle} />
        </div>
      </div>

      {/* Precio */}
      <CarCardPrice
        id={idAuto}
        precioOficial={precioOficial}
        precioDescuento={precioDescuento}
        precioPorDia={precioPorDia}
      />
    </div>
  );
}

export default memo(RecodeCarCard);
