import { FaUserFriends, FaGasPump, FaStar } from "react-icons/fa";
import { MdPlace } from "react-icons/md";
import { GiCarDoor } from "react-icons/gi";
import { TbManualGearboxFilled } from "react-icons/tb";

interface InfoPrincipalProps {
    asientos: number;
    puertas: number;
    transmision: string;
    combustible: string;
    calificacion: number;
    direccion: string;
}

export default function InfoPrincipal({
    asientos,
    puertas,
    transmision,
    combustible,
    calificacion,
    direccion,
}: InfoPrincipalProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                    <FaUserFriends className="text-gray-600" />{asientos}
                </span>
                <span className="flex items-center gap-1">
                    <GiCarDoor className="text-gray-600" />{puertas}
                </span>
                <span className="flex items-center gap-1">
                    <TbManualGearboxFilled className="text-gray-600" />{transmision}
                </span>
                <span className="flex items-center gap-1">
                    <FaGasPump className="text-gray-600" />{combustible}
                </span>
            </div>
            
            <div className="flex items-center gap-1 text-gray-700">
                <FaStar className="text-gray-300" />
                <span>{calificacion} - 1000 evaluaciones</span>
            </div>
            
            <div className="flex items-center gap-1 text-gray-700">
                <MdPlace className="text-gray-600" />
                <span>
                    {direccion}
                    <br />
                </span>
            </div>
        </div>
    );
}