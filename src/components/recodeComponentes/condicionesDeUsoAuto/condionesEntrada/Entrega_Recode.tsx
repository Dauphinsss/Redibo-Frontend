"use client";

import React, { useEffect, useState, memo } from 'react';
import RadioGroup_Recode from '@/components/recodeComponentes/condicionesDeUsoAuto/RadioGroup_Recode';
import Herramientas_Recode from '@/components/recodeComponentes/condicionesDeUsoAuto/condionesEntrada/Herramientas_Recode';

interface Herramienta {
    id: number;
    nombre: string;
    cantidad: number;
}

function Entrada_Recode() {
    const [mostrarHerramientas, setMostrarHerramientas] = useState(false);

    const [estadoCombustible, setEstadoCombustible] = useState("");
    const [herramientasGuardadas, setHerramientasGuardadas] = useState<Herramienta[]>([]);

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

    useEffect(() => {
        if (!mostrarHerramientas) {
        const data = localStorage.getItem("herramientas_recode");
        if (data) {
            setHerramientasGuardadas(JSON.parse(data));
        } else {
            setHerramientasGuardadas([]);
        }
        }
    }, [mostrarHerramientas]);

    // Si está en modo herramientas, mostrar ese componente
    if (mostrarHerramientas) {
        return (
        <div className="space-y-4 px-4 py-4 bg-white rounded-lg shadow">
            <Herramientas_Recode onVolver={() => setMostrarHerramientas(false)} />
        </div>
        );
    }

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
                    <option value="vacio">Vacío</option>
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

            {/* Mostrar herramientas guardadas */}
            {herramientasGuardadas.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-bold mb-2">Herramientas registradas:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                        {herramientasGuardadas.map((h) => (
                        <li key={h.id}>
                            {h.nombre} (x{h.cantidad})
                        </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default memo(Entrada_Recode);