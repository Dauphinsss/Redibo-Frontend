import React, { memo, useState } from "react"
import RadioGroup_Recode from "../RadioGroup_Recode"
import SliderRangeDualRecode from "../SliderRangeDual_Recode"
import SliderRangeSimple_Recode from "../SliderRangeSimple_Recode"

function GeneralRecode() {
    const [respuestas, setRespuestas] = useState({
        no_fumar: "si",
        mascotas: "si",
        combustible: "si",
        fuera_ciudad: "si",
        multas: "si",
        lugar_entrega: "si",
        uso_comercial: "si"
    })

    // Estado para el rango de edad (mín, máx)
    const [edadRango, setEdadRango] = useState<[number, number]>([18, 70])
    // Estado para el kilometraje máximo
    const [kmMax, setKmMax] = useState<number>(0)

    const handleRadioChange = (campo: keyof typeof respuestas, valor: string) => {
        setRespuestas(prev => ({ ...prev, [campo]: valor }))
    }

    return (
        <div className="space-y-6 px-4 py-4 bg-white rounded-lg shadow">
            {/* Slider dual para edades */}
            <SliderRangeDualRecode
                min={18}
                max={70}
                label="Edad mínima y maxima de los conductores"
                unit=" años"
                onChange={(vals) => setEdadRango(vals)}
            />

            {/* Slider simple para kilometraje */}
            <SliderRangeSimple_Recode
                min={0}
                max={900}
                label="Kilometraje permitido"
                unit=" km"
                onChange={([km]) => setKmMax(km)}
            />

            {/* Resumen de valores seleccionados */}
            <div className="flex justify-between text-sm text-gray-700 px-2">
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

            {/* Grupo de radio buttons */}
            {[
                { label: "No fumar", key: "no_fumar" },
                { label: "Mascotas permitidas", key: "mascotas" },
                { label: "Devolver mismo combustible", key: "combustible" },
                { label: "Uso fuera de la ciudad permitido", key: "fuera_ciudad" },
                { label: "Multas por cuenta del conductor", key: "multas" },
                { label: "Devolver auto en mismo lugar", key: "lugar_entrega" },
                { label: "Uso comercial permitido", key: "uso_comercial" }
            ].map(({ label, key }) => (
                <div key={key} className="flex items-center justify-between">
                    <span className="font-semibold">{label}:</span>
                    <RadioGroup_Recode
                        value={respuestas[key as keyof typeof respuestas]}
                        onChange={(v) => handleRadioChange(key as keyof typeof respuestas, v)}
                        name={key}
                    />
                </div>
            ))}
        </div>
    )
}

export default memo(GeneralRecode)
