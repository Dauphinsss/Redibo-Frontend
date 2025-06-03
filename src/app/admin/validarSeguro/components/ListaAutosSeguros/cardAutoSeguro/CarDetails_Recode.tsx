import { CarDetailsProps } from "@/app/admin/validarSeguro/interface/ListaAutoSeguro_Interface_Recode";
import React, { memo } from "react";
import { FaGasPump, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { GiCarDoor } from "react-icons/gi";
import { IoPeople } from "react-icons/io5";
import { TbManualGearboxFilled } from "react-icons/tb";

function CarDetails_Recode({
    modelo, 
    marca, 
    asientos, 
    puertas, 
    transmision, 
    combustibles, 
    host, 
    ubicacion
}: CarDetailsProps){
    return (
        <div className="flex flex-col justify-center gap-2">
            <h2 className="text-xl font-bold">{modelo}</h2>
            <p className="text-md font-medium">{marca}</p>

            {/* Línea de asientos, puertas y transmisión */}
            <div className="flex flex-wrap gap-4 text-sm items-center">
                <div className="flex items-center gap-1">
                    <IoPeople /> {asientos} asientos
                </div>
                <div className="flex items-center gap-1">
                    <GiCarDoor /> {puertas} puertas
                </div>
                <div className="flex items-center gap-1">
                    <TbManualGearboxFilled /> {transmision}
                </div>
            </div>

            {/* Línea de combustibles */}
            <div className="flex items-center gap-1 text-sm">
                <FaGasPump />
                <span>Tipos de combustibles: {combustibles.join(", ")}</span>
            </div>

            {/* Línea de host */}
            <div className="flex items-center gap-1 text-sm">
                <FaUser />
                <span>{host}</span>
            </div>

            {/* Línea de ubicación */}
            <div className="flex items-center gap-1 text-sm">
                <FaMapMarkerAlt />
                <span>{ubicacion}</span>
            </div>
        </div>
    );
};

export default memo(CarDetails_Recode);