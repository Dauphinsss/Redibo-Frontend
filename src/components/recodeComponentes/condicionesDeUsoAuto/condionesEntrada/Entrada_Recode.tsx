"use client";

import React, { useState, memo } from 'react';
import RadioGroup_Recode from '@/components/recodeComponentes/condicionesDeUsoAuto/condicioneGenerales/RadioGroup_Recode';
import Herramientas_Recode from '@/components/recodeComponentes/condicionesDeUsoAuto/condionesEntrada/Herramientas_Recode';

function Entrada_Recode() {
    const [mostrarHerramientas, setMostrarHerramientas] = useState(false);

    const [estadoCombustible, setEstadoCombustible] = useState("");
    const [respuestas, setRespuestas] = useState({
        exteriorLimpio: "si",
        interiorLimpio: "si",
        rayones: "si",
        llantas: "si",
        interiorSinDanios: "si",
        herramientas: "no",
    });

    const handleChange = (campo: keyof typeof respuestas, valor: string) => {
        setRespuestas((prev) => ({ ...prev, [campo]: valor }));

        if (campo === "herramientas" && valor === "no") {
            setMostrarHerramientas(false);
        }
    };

    if (mostrarHerramientas) {
        return (
            <div className="space-y-4 px-4 py-4 bg-white rounded-lg shadow">
                <button
                    onClick={() => setMostrarHerramientas(false)}
                    className="mb-4 bg-black text-white px-4 py-2 rounded"
                >
                    Volver
                </button>
                <Herramientas_Recode />
            </div>
        );
    }

    return (
        <div className="space-y-4 px-4 py-4 bg-white rounded-lg shadow">
        {/* Estado del combustible */}
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
                    <option value="vacio">Vacío</option>
                </select>
            </div>

            {/* Radio buttons */}
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

            {/* Botón para entrar a herramientas */}
            {respuestas.herramientas === "si" && (
                <div className="flex justify-end">
                    <button
                        onClick={() => setMostrarHerramientas(true)}
                        className="bg-black text-white px-4 py-2 rounded mt-4"
                    >
                        Herramientas
                    </button>
                </div>
            )}
        </div>
    );
}

export default memo(Entrada_Recode);
