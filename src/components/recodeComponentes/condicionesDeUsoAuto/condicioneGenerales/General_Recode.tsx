import React, { memo, useState } from "react";
import SliderRangeDualRecode from "../SliderRangeDual_Recode";
import SliderRangeSimple_Recode from "../SliderRangeSimple_Recode";

function GeneralRecode() {
    // Condiciones: true = permitido
    const [respuestas, setRespuestas] = useState<Record<string, boolean>>({
        fumar: false,
        mascotas: false,
        combustible: false,
        fuera_ciudad: false,
        multas: false,
        lugar_entrega: false,
        uso_comercial: false
    });
    // Rango de edad (min, max)
    const [edadRango, setEdadRango] = useState<[number, number]>([18, 70]);
    // Kilometraje máximo
    const [kmMax, setKmMax] = useState<number>(0);

    const handleCheckboxChange = (key: string) => {
        setRespuestas(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-6 px-4 py-4 bg-white rounded-lg shadow">
            {/* Slider dual para rango de edad */}
            <SliderRangeDualRecode
                min={18}
                max={70}
                label="Edad mínima y máxima de los conductores"
                unit=" años"
                onChange={setEdadRango}
            />

            {/* Slider simple para kilometraje */}
            <SliderRangeSimple_Recode
                min={0}
                max={900}
                label="Kilometraje permitido"
                unit=" km"
                onChange={([km]) => setKmMax(km)}
            />

            {/* Resumen de valores seleccionados: grid para ser responsivo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1 gap-x-4 text-sm text-gray-700 px-2">
                <div className="flex items-center space-x-2">
                    <span className="text-lg">🧍</span>
                    <span>Desde: <strong>{edadRango[0]}</strong> años</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-lg">👴</span>
                    <span>Hasta: <strong>{edadRango[1]}</strong> años</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-lg">🚗</span>
                    <span>Km máx.: <strong>{kmMax}</strong> km</span>
                </div>
            </div>

            {/* Checkboxes en grid: 1 columna en mobile, 2 en lg */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                {[
                    { label: "Fumar", key: "fumar" },
                    { label: "Mascotas permitidas", key: "mascotas" },
                    { label: "Devolver mismo combustible", key: "combustible" },
                    { label: "Uso fuera de la ciudad permitido", key: "fuera_ciudad" },
                    { label: "Multas por cuenta del conductor", key: "multas" },
                    { label: "Devolver auto en mismo lugar", key: "lugar_entrega" },
                    { label: "Uso comercial permitido", key: "uso_comercial" }
                ].map(({ label, key }) => (
                    <label key={key} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={respuestas[key]}
                            onChange={() => handleCheckboxChange(key)}
                            className="h-4 w-4 accent-black border-black rounded"
                        />
                        <span className="font-semibold">{label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}

export default memo(GeneralRecode);
