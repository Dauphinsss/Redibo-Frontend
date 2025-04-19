import Link from "next/link";

interface Props {
    precioOficial: string;
    precioDescuento: string;
    precioPorDia: string;
    id: string;
}

export default function CarCardPrice({ precioOficial, precioDescuento, precioPorDia, id }: Props) {
    return (
        <div className="flex flex-col justify-between items-end text-right min-w-[130px]">
        <div>
            <p className="text-xl font-bold">{precioOficial}</p>
            <p className="text-gray-400 line-through">{precioDescuento}</p>
            <p className="text-sm text-gray-600">Por día: {precioPorDia}</p>
        </div>
        <Link href={`/infoAuto/${id}`} target="_blank">
            <button className="bg-black text-white px-4 py-2 rounded mt-4 hover:bg-gray-800">
            Ver oferta
            </button>
        </Link>
        </div>
    );
}
