"use client";

import * as React from "react"
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

export default function AddDireccion() {
  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      <Link href="/host/pages">
        <Button
          variant="secondary"
          className="flex items-center gap-2 self-start w-full justify-start cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver
        </Button>
      </Link>
      <div className="w-full max-w-5xl flex justify-start">
        <h1 className="text-4xl font-bold my-8 pl-9">Dirección</h1>
      </div>
      <span className="text-lg font-medium pl-9">Ingrese una ubicación especifica</span>
      <div className="w-full max-w-5xl flex flex-col justify-start mt-4 pl-13">
      <h3 className="text-lg font-semibold ">Pais</h3>
      <Select>
      <SelectTrigger className="w-[600px] mt-2">
        <SelectValue placeholder="Seleccione un pais (Bolivia)" defaultValue="Bolivia"/>
      </SelectTrigger >
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Paises</SelectLabel>
          <SelectItem value="Brasil">Brasil</SelectItem>
          <SelectItem value="Peru">Peru</SelectItem>
          <SelectItem value="Argentina">Argentina</SelectItem>
          <SelectItem value="Colombia">Colombia</SelectItem>
          <SelectItem value="Chile">Chile</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
      </div>
      <div className="w-full max-w-5xl flex flex-col justify-start mt-4 pl-13">
      <h3 className="text-lg font-semibold ">Departamento</h3>
      <Select>
      <SelectTrigger className="w-[600px] mt-2">
        <SelectValue placeholder="Seleccione un departamento (Cochabamba)" defaultValue="Cochabamba"/>
      </SelectTrigger >
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Departamentos</SelectLabel>
          <SelectItem value="Pando">Pando</SelectItem>
          <SelectItem value="Beni">Beni</SelectItem>
          <SelectItem value="Oruro">Oruro</SelectItem>
          <SelectItem value="Potosi">Potosi</SelectItem>
          <SelectItem value="Tarija">Tarija</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
      </div>
      <div className="w-full max-w-5xl flex flex-col justify-start mt-4 pl-13">
      <h3 className="text-lg font-semibold ">Provincia</h3>
      <Select>
      <SelectTrigger className="w-[600px] mt-2">
        <SelectValue placeholder="Seleccione una provincia (Cercado)" defaultValue="Cercado"/>
      </SelectTrigger >
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Provincias</SelectLabel>
          <SelectItem value="Quillacollo">Quillacollo</SelectItem>
          <SelectItem value="Chapare">Chapare</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
      </div>
    </div>
  );
}