"use client";

import Image from "next/image";

interface Props {
    imagenUrl: string;
}

export default function CarCardImg({ imagenUrl }: Props) {
    return (
        <div className="w-[250px] h-[250px] rounded-xl flex items-center justify-center">
            <div className="w-[250px] h-[150px] rounded-[10px] overflow-hidden bg-gray-200 flex items-center justify-center">
                {imagenUrl ? (
                    <Image
                    src={imagenUrl}
                    alt="Imagen del auto"
                    width={250}
                    height={150}
                    className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-sm bg-gray-100 text-black">Sin imagen</span>
                )}
                </div>
        </div>
    );
}
