"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface Conductor {
    id: number;
    nombre: string;
}

interface SeleccionarConductoresProps {
    isLoggedIn: boolean; //para saber si el usuario inicio sesion
    conductores: Conductor[];
    seleccionados: number[];
    onChange: (ids: number[]) => void;
    label?: string;
}

const SeleccionarConductores: React.FC<SeleccionarConductoresProps> = ({
    isLoggedIn,
    conductores,
    seleccionados,
    onChange,
    label = "Selecciona uno o más conductores",
}: SeleccionarConductoresProps) => {

    const handleCheckboxChange = (id: number) => {
        const nuevosSeleccionados = seleccionados.includes(id)
            ? seleccionados.filter((selectedId) => selectedId !== id)
            : [...seleccionados, id];
        onChange(nuevosSeleccionados);
    };

    // logica condicional para mostrar el contenido correcto
    const renderContent = () => {
        if (!isLoggedIn) {
            return (
                <div className="text-center text-sm text-gray-500 border rounded-lg p-4 bg-gray-50 flex flex-col items-center gap-2">
                    <p>Debes iniciar sesión para ver y seleccionar tus conductores.</p>
                    <Link href="/login">
                        <Button size="sm" variant="outline">Iniciar Sesión</Button>
                    </Link>
                </div>
            );
        }

        if (conductores.length === 0) {
            return (
                <div className="text-center text-sm text-gray-500 border rounded-lg p-4 bg-gray-50">
                    Usted no tiene conductores asociados a su cuenta.
                </div>
            );
        }

        return (
            <div className="w-full max-w-md border rounded-lg p-2 bg-gray-50">
                <ul className="max-h-20 overflow-y-auto space-y-1">
                    {conductores.map((c) => (
                        <li key={c.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id={`conductor-${c.id}`}
                                checked={seleccionados.includes(c.id)}
                                onChange={() => handleCheckboxChange(c.id)}
                                className="accent-black h-4 w-4"
                            />
                            <label
                                htmlFor={`conductor-${c.id}`}
                                className="select-none cursor-pointer text-sm"
                            >
                                {c.nombre}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <section className="bg-white p-4 rounded-lg shadow">
            <label className="font-bold block mb-2">{label}</label>
            {renderContent()}
        </section>
    );
}

export default SeleccionarConductores;