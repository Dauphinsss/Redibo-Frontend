import React, { memo } from "react";
import CarImage_Recode from "./CarImage_Recode";
import CarButton_Recode from "./CarButton_Recode";
import CarDetails_Recode from "./CarDetails_Recode";
import { CarCardProps } from "@/app/validarSeguro/interface/ListaAutoSeguro_Interface_Recode";


function CarCard_Recode({
    idAuto,
    modelo, 
    marca, 
    asientos,
    puertas, 
    transmision, 
    combustibles, 
    host, 
    ubicacion, 
    src, 
    alt,
    onVerAseguradoras,
}: CarCardProps) {
    return (
        <div className="border p-4 rounded-xl flex gap-6 max-w-4xl shadow-sm items-center">
            <CarImage_Recode
                src={src}
                alt={alt}
            />
            <div className="flex flex-col justify-between h-full">
                <CarDetails_Recode
                    modelo={modelo}
                    marca={marca}
                    asientos={asientos}
                    puertas={puertas}
                    transmision={transmision}
                    combustibles={combustibles}
                    host={host}
                    ubicacion={ubicacion}
                />
                <CarButton_Recode onClick={() => onVerAseguradoras?.(idAuto)} />
            </div>
        </div>
    );
};

export default memo(CarCard_Recode);
