import { memo } from "react";
import { FaGasPump } from "react-icons/fa";
import { GiCarDoor } from "react-icons/gi";
import { IoPeople } from "react-icons/io5";
import { TbManualGearboxFilled } from "react-icons/tb";

interface Props {
    asientos: number;
    puertas: number;
    transmision: string;
    combustibles: string[];
    estado: string;
}

function CarCardSpecs({
    asientos,
    puertas,
    transmision,
    combustibles,
    estado,
}: Props) {
    return (
        <div className="flex flex-col gap-1 text-sm mt-2">
            <div className="flex gap-4 flex-wrap">
                <span className="flex items-center gap-1"><IoPeople /> {asientos} asientos</span>
                <span className="flex items-center gap-1"><GiCarDoor /> {puertas} puertas</span>
                <span className="flex items-center gap-1"><TbManualGearboxFilled /> {transmision}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-2">
                <FaGasPump />
                <span>Tipo de combustible:</span>
                <span className="font-semibold">
                    {combustibles.join(", ")}
                </span>
            </div>
        <p className="mt-1">Estado: <strong>{estado}</strong></p>
        </div>
    );
}
export default memo(CarCardSpecs);