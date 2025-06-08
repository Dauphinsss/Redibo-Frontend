"use client";

import Image from "next/image";
import { SeguroConCoberturas_Interface_Recode } from "@/app/admin/validarSeguro/interface/SeguroConCoberturas_Interface_Recode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CarIcon, UserCircle, ShieldCheck, LinkIcon } from "lucide-react";
import { useState } from "react";

interface Props {
  initialDataFor: SeguroConCoberturas_Interface_Recode;
}

const getInitials = (name: string) => {
  if (!name) return "?";
  const words = name.split(" ");
  if (words.length > 1) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default function FormularioRecode({ initialDataFor }: Props) {
  const [imgAutoError, setImgAutoError] = useState(false);
  const [imgPropietarioError, setImgPropietarioError] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm mb-6">
      {/* Sección del Auto */}
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <CarIcon className="mr-2 h-5 w-5 text-gray-600" />
            Información del Vehículo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="font-semibold text-gray-800">
            {initialDataFor.marca_carro} {initialDataFor.modelo_carro}
          </p>
          <div className="relative w-full aspect-[16/10] rounded-md overflow-hidden bg-gray-100 mt-2">
            {initialDataFor.imagenURL_carro && !imgAutoError ? (
              <Image
                src={initialDataFor.imagenURL_carro}
                alt={`Imagen de ${initialDataFor.marca_carro} ${initialDataFor.modelo_carro}`}
                layout="fill"
                objectFit="cover"
                onError={() => setImgAutoError(true)}
                unoptimized={initialDataFor.imagenURL_carro.startsWith('http')}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <CarIcon className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sección del Propietario */}
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <UserCircle className="mr-2 h-5 w-5 text-gray-600" />
            Propietario
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16 border">
              <AvatarImage
                src={initialDataFor.fotoURL_propietario}
                alt={`Foto de ${initialDataFor.nombre_propietario}`}
                onError={() => setImgPropietarioError(true)}
              />
              <AvatarFallback className="text-xl bg-gray-200">
                {getInitials(initialDataFor.nombre_propietario)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-800">
                {initialDataFor.nombre_propietario}
              </p>
              <p className="text-gray-600">
                {initialDataFor.telefono_propietario || "Teléfono no disponible"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección del Seguro */}
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <ShieldCheck className="mr-2 h-5 w-5 text-gray-600" />
            Detalles del Seguro
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="font-semibold text-gray-800">{initialDataFor.nombre_seguro}</p>
          <p className="text-gray-600">{initialDataFor.nombre_empresa_seguro}</p>
          <p className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block my-1">
            Tipo: {initialDataFor.tipo_seguro}
          </p>
          <div className="text-xs text-gray-500">
            <span>Vigencia: {initialDataFor.fecha_inicio}</span>
            <span className="mx-1">-</span>
            <span>{initialDataFor.fecha_fin}</span>
          </div>
          {initialDataFor.enlaceSeguroURL && initialDataFor.enlaceSeguroURL !== "#" ? (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="mt-3 text-blue-600 border-blue-500 hover:bg-blue-50 hover:text-blue-700 w-full"
            >
              <a
                href={initialDataFor.enlaceSeguroURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                Ver Póliza Completa
              </a>
            </Button>
          ) : (
            <p className="text-xs text-gray-400 mt-3 italic">Enlace a póliza no disponible.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}