import React, { memo } from "react";
import CarImage_Recode from "./CarImage_Recode";
import CarButton_Recode from "./CarButton_Recode";
import CarDetails_Recode from "./CarDetails_Recode";
import { CarCardProps } from "@/app/admin/validarSeguro/interface/ListaAutoSeguro_Interface_Recode";

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
        <div className="border p-4 rounded-xl flex flex-col sm:flex-row gap-4 sm:gap-6 shadow-sm items-center bg-white w-full sm:w-[750px] mx-auto">
            <CarImage_Recode
                src={src}
                alt={alt}
            />
            {/* Contenedor para detalles y botón, permitiendo que el botón se alinee abajo en móvil */}
            <div className="flex-1 flex flex-col justify-between self-stretch"> 
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