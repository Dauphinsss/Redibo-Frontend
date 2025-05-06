"use client";

import React from "react";

interface DisponibilidadProps {
    disponible_desde: string;
    disponible_hasta: string;
}

const CarCardDisponibilidad: React.FC<DisponibilidadProps> = ({ 
    disponible_desde,
    disponible_hasta,
}) => {
    if (!disponible_desde || !disponible_hasta) return null;

    const formato = (fecha: string) => {
        const date = new Date(fecha);
        return date.toLocaleDateString("es-BO", { 
            day: "2-digit",
            month: "2-digit", 
            year: "numeric",
        });
    };

    return (
        <div className="text-sm mt-2 flex flex-col justify-between items-end min-w-[130px]">
            Reservable del <strong>{formato(disponible_desde)}</strong> al {" "}
            <strong>{formato(disponible_hasta)}</strong>
        </div>
    );
};

export default CarCardDisponibilidad;
