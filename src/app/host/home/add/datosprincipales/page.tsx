"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function DatosPrincipales() {
  const router = useRouter();
  const [cancelOpen, setCancelOpen] = useState(false);

  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      {/* Botón Volver */}
      <Link href="/host/home/add">
        <Button
          variant="secondary"
          className="flex items-center gap-1 self-start justify-start cursor-pointer w-32 h-10 text-base font-medium transition-all duration-200 hover:bg-gray-100 hover:brightness-90"
        >
          <ChevronLeft className="h-3 w-3" />
          Volver
        </Button>
      </Link>

      {/* Título */}
      <div className="w-full max-w-5xl flex justify-start">
        <h1 className="text-4xl font-bold my-5 pl-7">Datos Principales</h1>
      </div>

      {/* Formulario de Datos Principales */}
      <div className="w-full max-w-5xl pl-9 space-y-6">
        {/* Numero de VIM */}
        <div className="flex flex-col">
          <label className="text-base font-medium mb-1">Numero de VIN:</label>
          <Input
            type="text"
            placeholder="17 Caracteres"
            className="w-full max-w-md"
          />
        </div>

        {/* Año del coche */}
        <div className="flex flex-col">
          <label className="text-base font-medium mb-1">Año del coche</label>
          <Input
            type="text"
            placeholder="xxxx"
            className="w-full max-w-md"
          />
        </div>

        {/* Marca */}
        <div className="flex flex-col">
          <label className="text-base font-medium mb-1">Marca</label>
          <Input
            type="text"
            className="w-full max-w-md"
          />
        </div>

        {/* Modelo */}
        <div className="flex flex-col">
          <label className="text-base font-medium mb-1">Modelo</label>
          <Input
            type="text"
            className="w-full max-w-md"
          />
        </div>

        {/* Placa */}
        <div className="flex flex-col">
          <label className="text-base font-medium mb-1">Placa:</label>
          <Input
            type="text"
            className="w-full max-w-md"
          />
        </div>
      </div>

      {/* Botones de Cancelar y Siguiente */}
      <div className="w-full max-w-5xl flex justify-between mt-10 px-10">
        {/* Botón Cancelar */}
        <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="secondary"
              className="w-[160px] h-12 text-lg font-semibold"
            >
              CANCELAR
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                ¿Está seguro que desea salir del proceso de añadir un carro?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Toda la información no guardada se perderá si abandona esta sección.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => router.push("/host/pages")}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Botón Siguiente */}
        <Button
          variant="default"
          className="w-40 h-12 text-lg font-semibold text-white bg-gray-800"
          onClick={() => router.push("/host/home/add/carcoche")}
        >
          SIGUIENTE
        </Button>
      </div>
    </div>
  );
}