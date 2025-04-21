"use client";

import Image from "next/image";

interface Props {
    imagenUrl: string;
}

export default function CarCardImg({ imagenUrl }: Props) {
    return (
        <div className="w-full h-[180px] flex items-center justify-center">
            <div className="w-[230px] h-[150px] rounded-[10px] overflow-hidden bg-white flex items-center justify-center">
                {imagenUrl ? (
                <Image
                    src={imagenUrl}
                    alt="Imagen del auto"
                    width={230}
                    height={150}
                    className="object-contain"
                    loading="lazy"
                />
                ) : (
                <span className="text-sm bg-gray-100 text-black">Sin imagen</span>
                )}
            </div>
        </div>
    );
}