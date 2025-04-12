"use client";
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
Select,
SelectTrigger,
SelectValue,
SelectContent,
SelectGroup,
SelectItem,
} from "@/components/ui/select";
import {
Popover,
PopoverContent,
PopoverTrigger,
} from "@/components/ui/popover";
import {
Command,
CommandEmpty,
CommandGroup,
CommandItem,
CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const years = [
{ label: "2025", value: "2025" },
];
const cars = [
    { label: "Susuki", value: "Susuki" },
    ];

const models = [
{ label: "CX-5", value: "CX-5" },
];

export default function DatosPrincipales() {
return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      {/* Título */}
    <div className="w-full max-w-5xl flex justify-start">
        <h1 className="text-4xl font-bold my-5 pl-7">Datos principales</h1>
    </div>
      {/* Formulario */}
    <div className="w-full max-w-5xl pl-13">
        {/* Número de VIM */}
        <div className="w-full flex flex-col mt-4">
        <label className="text-lg font-semibold mb-1">Número de VIM</label>
        <Input
            type="text"
            placeholder="Introducir Número VIM"
            className="w-[600px] mt-2 border-2 rounded-md"
        />
        </div>

        {/* Año del coche */}
        <div className="w-full flex flex-col mt-6">
        <label className="text-lg font-semibold mb-1">Año del coche</label>
        <Select>
            <SelectTrigger className="w-[600px] mt-2 border-2 rounded-md">
            <SelectValue placeholder="Seleccione el año" />
            </SelectTrigger>
            <SelectContent>
            <SelectGroup>
                {years.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                    {year.label}
                </SelectItem>
                ))}
            </SelectGroup>
            </SelectContent>
        </Select>
        </div>

        {/* Marca */}
        <div className="w-full flex flex-col mt-6">
        <label className="text-lg font-semibold mb-1">Marca</label>
        <Input
            type="text"
            placeholder="Ingrese la marca"
            className="w-[600px] mt-2 border-2 rounded-md"
        />
        </div>

        {/* Modelo */}
        <div className="w-full flex flex-col mt-6">
        <label className="text-lg font-semibold mb-1">Modelo</label>
        <Input
            type="text"
            placeholder="Ingrese la marca"
            className="w-[600px] mt-2 border-2 rounded-md"
        />
        </div>

        {/* Placa */}
        <div className="w-full flex flex-col mt-6">
        <label className="text-lg font-semibold mb-1">Placa</label>
        <Input
            type="text"
            placeholder="Introducir placa"
            className="w-[600px] mt-2 border-2 rounded-md"
        />
        </div>
    </div>

      {/* Sección de Botones */}
    <div className="w-full max-w-5xl flex justify-between items-center mt-10 px-10">
        <Button 
        variant="secondary"
        className="w-[160px] h-12 text-lg font-semibold transition-all duration-200 hover:bg-gray-100 hover:brightness-90"
        >
        CANCELAR
        </Button>
        
        <Button 
        variant="default"
        className="h-12 text-lg font-semibold text-white px-6"
        >
        FINALIZAR EDICIÓN Y GUARDAR
        </Button>
    </div>
    </div>
);
};
