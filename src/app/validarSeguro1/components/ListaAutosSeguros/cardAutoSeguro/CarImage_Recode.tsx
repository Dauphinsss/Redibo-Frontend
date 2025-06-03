import React from "react";
import Image from "next/image";
import { CarImageProps } from "@/app/validarSeguro1/interface/ListaAutoSeguro_Interface_Recode";

function CarImage_Recode({
  src,
  alt,
}: CarImageProps) {
  return (
    <div className="w-40 h-32 rounded-xl overflow-hidden shadow-md bg-gray-100 flex items-center justify-center">
      {src ? (
        <div className="relative w-[180px] h-full flex items-center justify-center">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            sizes="160px"
            loading="lazy"
          />
        </div>
      ) : (
        <span className="text-sm bg-gray-200 text-black flex items-center justify-center h-full w-full">
          Sin imagen
        </span>
      )}
    </div>
  );
};

export default CarImage_Recode;