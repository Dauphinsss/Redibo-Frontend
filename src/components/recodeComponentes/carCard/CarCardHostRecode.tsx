import { memo } from "react";
import { FaUser, FaStar } from "react-icons/fa";

interface Props {
    nombreHost: string;
    calificacion: number;
}

function CarCardHost({ nombreHost, calificacion }: Props) {
    return (
        <div className="flex flex-col gap-1 mt-1 text-sm">
        <div className="flex items-center gap-2">
            <FaUser /> {nombreHost}
        </div>
        <div className="flex items-center gap-1 text-gray-300 font-bold">
            <FaStar /> {calificacion}
        </div>
        </div>
    );
}
export default memo(CarCardHost);

