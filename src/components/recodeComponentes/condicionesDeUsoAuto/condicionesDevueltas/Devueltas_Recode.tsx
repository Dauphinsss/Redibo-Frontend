"use client";

import React, { useState, memo } from 'react';
import RadioGroup_Recode from '@/components/recodeComponentes/condicionesDeUsoAuto/condicioneGenerales/RadioGroup_Recode';

function Devueltas_Recode(){
    const [respuestas, setRespuestas] = useState({
        interior_limpio: "si",
        exterior_limpio: "si",
        rayones: "si",
        herramientas_devueltas: "si",
        danios: "si",
        combustible_igual: "si",
    });

    const handleChange = (campo: keyof typeof respuestas, valor: string) => {
        setRespuestas((prev) => ({ ...prev, [campo]: valor }));
    };

    return (
        <div className="space-y-4 px-4 py-4 bg-white rounded-lg shadow">
            {[
                { label: "Interior limpio", key: "interior_limpio" },
                { label: "Exterior limpio", key: "exterior_limpio" },
                { label: "Tiene rayones", key: "rayones" },
                { label: "Herramientas devueltas", key: "herramientas_devueltas" },
                { label: "Cobrar daños adicionales presentes", key: "danios" },
                { label: "Nivel de combustible igual al entregado", key: "combustible_igual" },
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

export default memo(Devueltas_Recode);
