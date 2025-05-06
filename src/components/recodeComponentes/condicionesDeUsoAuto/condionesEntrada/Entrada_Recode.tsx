"use client";

import React, { useState, memo } from 'react';
import RadioGroup_Recode from '@/components/recodeComponentes/condicionesDeUsoAuto/condicioneGenerales/RadioGroup_Recode';

function Entrada_Recode(){
    const [estadoCombustible, setEstadoCombustible] = useState("");
    const [respuestas, setRespuestas] = useState({
        exteriorLimpio: "no",
        interiorLimpio: "no",
        rayones: "no",
        llantas: "no",
        interiorSinDanios: "no",
        herramientas: "no",
    });

    const handleChange = (campo: keyof typeof respuestas, valor: string) => {
        setRespuestas((prev) => ({ ...prev, [campo]: valor }));
    };

    return (
        <div className="space-y-4 px-4 py-4 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between gap-10">
                <label htmlFor="estadoCombustible" className="font-semibold">
                    Estado del combustible:
                </label>
                <select
                    id="estadoCombustible"
                    className="border rounded px-2 py-1"
                    value={estadoCombustible}
                    onChange={(e) => setEstadoCombustible(e.target.value)}
                >
                    <option value="">Seleccionar estado</option>
                    <option value="lleno">Lleno</option>
                    <option value="medio">Medio</option>
                    <option value="vacio">Bajo</option>
                </select>
            </div>

            {[
                { label: "Exterior limpio", key: "exteriorLimpio" },
                { label: "Interior limpio", key: "interiorLimpio" },
                { label: "Tiene rayones", key: "rayones" },
                { label: "Llantas en buen estado", key: "llantas" },
                { label: "Interior del vehículo sin daños", key: "interiorSinDanios" },
                { label: "¿Cuenta con herramientas?", key: "herramientas" },
            ].map(({ label, key }) => (
                <div key={key} className="flex items-center justify-between gap-10">
                    <span className="font-semibold">{label}:</span>
                    <RadioGroup_Recode
                        value={respuestas[key as keyof typeof respuestas]}
                        onChange={(v) => handleChange(key as keyof typeof respuestas, v)}
                        name={key}
                    />
                </div>
            ))}
        </div>
    );
};

export default memo(Entrada_Recode);
