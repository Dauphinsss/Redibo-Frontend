"use client";

import Image from "next/image";
import { SeguroConCoberturas_Interface_Recode } from "@/app/admin/validarSeguro/interface/SeguroConCoberturas_Interface_Recode";

interface Props {
  initialDataFor: SeguroConCoberturas_Interface_Recode;
}

export default function FormularioRecode({ initialDataFor }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
      <div>
        <h4 className="font-medium text-gray-700">Auto</h4>
        <p>{initialDataFor.marca_carro} {initialDataFor.modelo_carro}</p>
        <div className="relative w-28 h-20 mt-2">
          <Image
            src={initialDataFor.imagenURL_carro}
            alt="Imagen del auto"
            fill
            className="rounded shadow object-contain"
          />
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-700">Propietario</h4>
        <p>{initialDataFor.nombre_propietario}</p>
        <p className="text-gray-500">{initialDataFor.telefono_propietario}</p>
        <div className="relative w-14 h-14 mt-2">
          <Image
            src={initialDataFor.fotoURL_propietario}
            alt="Foto del propietario"
            fill
            className="rounded-full object-cover border"
          />
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-700">Seguro</h4>
        <p className="font-semibold">{initialDataFor.nombre_seguro}</p>
        <p className="text-gray-500">{initialDataFor.nombre_empresa_seguro}</p>
        <p className="text-gray-500">{initialDataFor.tipo_seguro}</p>
        <a
          href={initialDataFor.enlaceSeguroURL ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-xs mt-2 inline-block"
        >
          Ver póliza
        </a>
      </div>
    </div>
  );
}