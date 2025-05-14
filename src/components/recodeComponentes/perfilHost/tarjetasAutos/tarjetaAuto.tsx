import Image from "next/image";
import { memo } from "react";

interface Props {
    fotoAuto: string | null;
    modeloAuto: string;
    marcaAuto: string;
}

function TarjetaCar({ fotoAuto, modeloAuto, marcaAuto }: Props) {
    const esImagenValida = fotoAuto && (fotoAuto.startsWith("http") || fotoAuto.startsWith("/"));

    return (
        <div className="border rounded-lg p-4 flex flex-row items-center shadow-md">
            <div className="w-30 h-30 bg-gray-300 rounded mb-2 flex items-center justify-center">
                {esImagenValida ? (
                <Image
                    src={fotoAuto as string}
                    alt="Imagen del auto"
                    width={100}
                    height={60}
                    className="object-contain"
                    loading="lazy"
                />
                ) : (
                <span className="text-sm text-black">Sin imagen</span>
                )}
            </div>

            <div className="text-sm ml-4">
                <h2>Modelo: {modeloAuto}</h2>
                <h2>Marca: {marcaAuto}</h2>
            </div>
        </div>
    );
}

export default memo(TarjetaCar);