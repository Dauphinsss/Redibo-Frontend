import { FaUser, FaStar } from "react-icons/fa";

interface Props {
    nombreHost: string;
    calificacion: number;
}

export default function CarCardHost({ nombreHost, calificacion }: Props) {
    return (
        <div className="flex flex-col gap-1 mt-1 text-sm">
        <div className="flex items-center gap-2">
            <FaUser /> {nombreHost}
        </div>
        <div className="flex items-center gap-1 text-yellow-500 font-bold">
            <FaStar /> {calificacion}
        </div>
        </div>
    );
}
