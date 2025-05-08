"use client";

import Image from "next/image";
import { memo } from "react";
import { FaUserCircle, FaStar, FaCar, FaWhatsapp } from 'react-icons/fa';

interface Props {
  imagenUrl: string;
  ancho: number;
  alto: number;
}

function FotoPerfilUsr({ imagenUrl, ancho, alto }: Props) {
  const dimension = Math.min(ancho, alto); // Para mantener proporción circular

  return (
    <div
      className="flex items-center justify-center rounded-full bg-white"
      style={{
        width: dimension,
        height: dimension,
        overflow: "hidden",
      }}
    >
      {imagenUrl ? (
        <Image
          src={imagenUrl}
          alt="Foto de perfil"
          width={dimension}
          height={dimension}
          className="object-cover"
        />
      ) : (
        <FaUserCircle className="w-12 h-12 text-gray-400" />
      )}
    </div>
  );
}

export default memo(FotoPerfilUsr);
