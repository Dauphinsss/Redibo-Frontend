"use client"
import React from "react";

export interface Conductor {
    id: number | string;
    nombre: string;
}

interface SeleccionarConductoresProps {
    conductores: Conductor[];
    seleccionados: (number | string)[];
    setSeleccionados: (ids: (number | string)[]) => void;
    label?: string;
}