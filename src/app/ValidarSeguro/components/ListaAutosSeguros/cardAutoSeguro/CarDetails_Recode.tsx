import React from "react";

interface CarDetailsProps {
    modelo: string;
    marca: string;
    asientos: number;
    puertas: number;
    transmision: string;
    combustibles: string[];
    host: string;
    ubicacion: string;
}

const CarDetails_Recode: React.FC<CarDetailsProps> = ({
    modelo,
    marca,
    asientos,
    puertas,
    transmision,
    combustibles,
    host,
    ubicacion,
}) => {
    return (
        <div className="flex flex-col justify-center gap-2">
            <h2 className="text-xl font-bold">{modelo}</h2>
            <p className="text-md font-medium">{marca}</p>
            <div className="flex flex-wrap gap-4 text-sm items-center">
                <span>👥 {asientos} asientos</span>
                <span>🚪 {puertas} puertas</span>
                <span>⚙️ {transmision}</span>
            </div>
            <div className="text-sm">
                ⛽ Tipos de combustibles: {combustibles.join(", ")}
            </div>
            <div className="text-sm">👤 {host}</div>
            <div className="text-sm">📍 {ubicacion}</div>
        </div>
    );
};

export default CarDetails_Recode;
