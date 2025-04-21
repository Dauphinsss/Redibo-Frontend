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
    combustibleSeleccionado: string;
    onCombustibleChange: (val: string) => void;
}

export default function CarCardSpecs({
    asientos,
    puertas,
    transmision,
    combustibles,
    estado,
    combustibleSeleccionado,
    onCombustibleChange,
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
            <select
            value={combustibleSeleccionado}
            onChange={(e) => onCombustibleChange(e.target.value)}
            className="border px-2 py-1 rounded"
            >
            {combustibles.map((c, i) => (
                <option key={i}>{c}</option>
            ))}
            </select>
        </div>
        <p className="mt-1">Estado: <strong>{estado}</strong></p>
        </div>
    );
}
