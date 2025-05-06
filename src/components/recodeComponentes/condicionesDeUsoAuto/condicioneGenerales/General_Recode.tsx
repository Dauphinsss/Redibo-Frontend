import { memo, useState } from "react";
import RadioGroup_Recode from "./RadioGroup_Recode";

function GeneralRecode() {
    const [respuestas, setRespuestas] = useState({
        no_fumar: "si",
        mascotas: "si",
        combustible: "si",
        fuera_ciudad: "si",
        multas: "si",
        lugar_entrega: "si",
        uso_comercial: "si",
    });

    const [edadMin, setEdadMin] = useState<{
        edadMin: number | string;
        edadMax: number | string;
    }>({
        edadMin: 18,
        edadMax: 70,
    });

    const [kilometrajeMax, setKilometrajeMax] = useState<string | number>("");
    const [errores, setErrores] = useState({
        minInvalida: false,
        maxInvalida: false,
        kmInvalido: false,
    });

    const handleChange = (campo: keyof typeof respuestas, valor: string) => {
        setRespuestas((prev) => ({ ...prev, [campo]: valor }));
    };

    const handleEdadMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setEdadMin((prev) => ({ ...prev, edadMin: valor }));

        const num = parseInt(valor);
        if (valor === "" || isNaN(num)) {
            setErrores((prev) => ({ ...prev, minInvalida: false }));
        } else {
            setErrores((prev) => ({ ...prev, minInvalida: num < 18 || num > 70 }));
        }
    };

    const handleEdadMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setEdadMin((prev) => ({ ...prev, edadMax: valor }));

        const num = parseInt(valor);
        if (valor === "" || isNaN(num)) {
            setErrores((prev) => ({ ...prev, maxInvalida: false }));
        } else {
            setErrores((prev) => ({ ...prev, maxInvalida: num < 18 || num > 70 }));
        }
    };

    const handleKmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        setKilometrajeMax(valor);

        const num = parseInt(valor);
        if (valor === "" || isNaN(num)) {
            setErrores((prev) => ({ ...prev, kmInvalido: false }));
        } else {
            setErrores((prev) => ({ ...prev, kmInvalido: num < 60 || num > 900 }));
        }
    };

    return (
        <div className="space-y-4 px-4 py-4 bg-white rounded-lg shadow">
            {/* Fila: Edad mínima y máxima */}
            <div className="flex items-center justify-between gap-1">
                {/* Edad mínima */}
                <div className="flex items-center gap-3">
                    <label className="font-semibold" htmlFor="edad-min">
                        Edad mínima del conductor:
                    </label>
                    <div className="flex flex-col items-end gap-1">
                        <input
                            id="edad-min"
                            type="number"
                            placeholder="Ej: 18"
                            title="Edad mínima entre 18 y 70"
                            value={edadMin.edadMin}
                            onChange={handleEdadMinChange}
                            className={`w-15 px-2 py-1 border rounded ${
                            errores.minInvalida ? "border-red-500" : "border-gray-400"
                        }`}
                        />
                        {errores.minInvalida && (
                        <span className="text-red-500 text-sm text-right">
                            Debe ser entre 18 y 70
                        </span>
                        )}
                    </div>
                </div>

                {/* Edad máxima */}
                <div className="flex items-center gap-3">
                <label className="font-semibold" htmlFor="edad-max">
                    Edad máxima del conductor:
                </label>
                <div className="flex flex-col items-end gap-1">
                    <input
                    id="edad-max"
                    type="number"
                    placeholder="Ej: 70"
                    title="Edad máxima entre 18 y 70"
                    value={edadMin.edadMax}
                    onChange={handleEdadMaxChange}
                    className={`w-15 px-2 py-1 border rounded ${
                        errores.maxInvalida ? "border-red-500" : "border-gray-400"
                    }`}
                    />
                    {errores.maxInvalida && (
                    <span className="text-red-500 text-sm text-right">
                        Debe ser entre 18 y 70
                    </span>
                    )}
                </div>
                </div>
            </div>

            {/* Fila: Kilometraje máximo permitido */}
            <div className="flex items-center justify-between gap-10">
                <label className="font-semibold" htmlFor="km-max">
                Kilometraje máximo permitido por día:
                </label>
                <div className="flex flex-col items-end gap-1">
                <input
                    id="km-max"
                    type="number"
                    placeholder="Ej: 300"
                    title="Kilometraje permitido entre 60 y 900"
                    min={60}
                    max={900}
                    value={kilometrajeMax}
                    onChange={handleKmChange}
                    className={`w-20 px-2 py-1 border rounded ${
                    errores.kmInvalido ? "border-red-500" : "border-gray-400"
                    }`}
                />
                {errores.kmInvalido && (
                    <span className="text-red-500 text-sm text-right">
                    {parseInt(kilometrajeMax as string) < 60
                        ? "Debe ser mayor o igual a 60 km"
                        : "No debe pasar de 900 km"}
                    </span>
                )}
                </div>
            </div>

            {/* Condiciones con radio buttons */}
            {[
                { label: "No fumar", key: "no_fumar" },
                { label: "Mascotas permitidas", key: "mascotas" },
                { label: "Devolver mismo combustibles", key: "combustible" },
                { label: "Uso fuera de la ciudad permitido", key: "fuera_ciudad" },
                { label: "Multas por cuenta del conductor", key: "multas" },
                { label: "Devolver el auto en mismo lugar de entrega", key: "lugar_entrega" },
                { label: "Uso del vehículo para fines comerciales permitido", key: "uso_comercial" },
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
}

export default memo(GeneralRecode);
