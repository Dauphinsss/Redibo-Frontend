// src/app/busqueda/components/carCard/CarCardPriceRecode.tsx
import Link from "next/link";
import { memo } from "react";
import { useSearchStore } from "../../store/searchStore";
interface Props {
    precioOficial: number;
    precioDescuento: number;
    precioPorDia: number;
    id: string;
}

function CarCardPrice({ precioOficial, precioDescuento, precioPorDia, id }: Props) {
    // 1. Obtenemos los datos del store de Zustand
    const { ciudad, fechaInicio, fechaFin } = useSearchStore();

    // 2. Creamos los parámetros de consulta (query params)
    const queryParams = new URLSearchParams();

    // Añadimos los parámetros solo si tienen valor
    if (ciudad) queryParams.append('ciudad', ciudad);
    if (fechaInicio) queryParams.append('fechaInicio', fechaInicio);
    if (fechaFin) queryParams.append('fechaFin', fechaFin);

    // 3. Construimos la URL final
    const href = `/reserva/page/infoAuto_Recode/${id}?${queryParams.toString()}`;

    return (
        <div className="flex flex-col justify-between items-end text-right min-w-[130px]">
            <div>
                <p className="text-xl font-bold">BOB. {precioOficial.toFixed(2)}</p>
                <p className="text-gray-400 line-through">BOB. {precioDescuento.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Por día: BOB. {precioPorDia.toFixed(2)}</p>
            </div>
            {/* 4. Usamos la URL construida en el componente Link */}
            <Link href={href} target="_blank">
                <button className="bg-black text-white px-4 py-2 rounded mt-4 hover:bg-gray-800">
                    Ver oferta
                </button>
            </Link>
        </div>
    );
}
export default memo(CarCardPrice);