"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ValidarInterface } from "@/interface/CoberturaForm_Interface_Recode";
import { getCarById } from "@/service/services_Recode";
import {
  CalendarDaysIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";

interface Props {
  initialDataFor: ValidarInterface;
}

export default function FormularioCobertura({ initialDataFor }: Props) {
  const { id_carro, fecha_inicio, fecha_fin, Seguro } = initialDataFor;

  const [auto, setAuto] = useState<{
    modelo: string;
    marca: string;
    imagenURL: string;
    usuario: {
      nombre: string;
      foto: string;
    };
  } | null>(null);

  useEffect(() => {
    const fetchAuto = async () => {
      try {
        const data = await getCarById(id_carro.toString());

        const imagenPrincipal =
          data?.Imagen && Array.isArray(data.Imagen) && data.Imagen[0]?.data
            ? data.Imagen[0].data
            : "/placeholder.jpg";

        setAuto({
          modelo: data?.modelo || "No definido",
          marca: data?.marca || "No definido",
          imagenURL: imagenPrincipal,
          usuario: {
            nombre: data?.Usuario?.nombre || "Sin nombre",
            foto: data?.Usuario?.foto || "",
          },
        });
      } catch (error) {
        console.error("Error al obtener datos del auto:", error);
      }
    };
    fetchAuto();
  }, [id_carro]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-gray-300 rounded-xl shadow-md p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Información del seguro</h2>

      {/* Imagen + Marca + Modelo + Usuario */}
      {auto && (
        <div className="flex flex-col sm:flex-row gap-4 border p-4 rounded-lg bg-gray-50 items-center sm:items-start">
          {/* Imagen del auto */}
          <div className="relative w-36 h-24">
            <Image
              src={auto.imagenURL}
              alt={`Imagen de ${auto.modelo}`}
              fill
              className="object-cover rounded border"
              sizes="(max-width: 640px) 100vw, 144px"
              priority
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-1">
            <p className="text-sm text-gray-600">Modelo</p>
            <h3 className="text-lg font-bold text-black">{auto.modelo}</h3>
            <p className="text-sm text-gray-600">Marca</p>
            <h4 className="text-md text-black">{auto.marca}</h4>

            {/* Usuario */}
            <div className="flex items-center gap-3 mt-4">
              <Image
                src={auto.usuario.foto}
                alt={`Foto de ${auto.usuario.nombre}`}
                width={36}
                height={36}
                className="rounded-full border"
              />
              <span className="text-sm font-medium text-gray-800">
                {auto.usuario.nombre}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Datos del seguro */}
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <ShieldCheckIcon className="h-5 w-5 text-black" />
        <span>ID del carro:</span>
        <strong className="text-black">{id_carro ?? "-"}</strong>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-700">
        <BuildingOffice2Icon className="h-5 w-5 text-black" />
        <span>Empresa aseguradora:</span>
        <strong className="text-black">{Seguro?.empresa ?? "No disponible"}</strong>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 pt-2">
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="h-5 w-5 text-black" />
          <span>Inicio:</span>
          <strong className="text-black">
            {fecha_inicio ? new Date(fecha_inicio).toLocaleDateString() : "-"}
          </strong>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="h-5 w-5 text-black" />
          <span>Fin:</span>
          <strong className="text-black">
            {fecha_fin ? new Date(fecha_fin).toLocaleDateString() : "-"}
          </strong>
        </div>
      </div>
    </div>
  );
}
