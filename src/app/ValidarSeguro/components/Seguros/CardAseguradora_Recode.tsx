import { memo } from "react";
import { FaListUl } from "react-icons/fa";

interface Props {
    empresa: string;
    fechaInicio: string;
    fechaFin: string;
}

function CardAseguradora_Recode({ empresa, fechaInicio, fechaFin }: Props) {
    return (
        <div className="border rounded-xl p-4 w-full flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{empresa}</h3>
                <FaListUl className="text-xl" />
            </div>
            <div className="flex justify-between text-sm font-medium">
                <div>
                    <p className="text-gray-600">Fecha inicio</p>
                    <p>{fechaInicio}</p>
                </div>
                <div>
                    <p className="text-gray-600">Fecha fin</p>
                    <p>{fechaFin}</p>
                </div>
            </div>
        </div>
    );
}

export default memo(CardAseguradora_Recode);