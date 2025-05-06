'use client'
import RadioGroup_Recode from "@/components/recodeComponentes/condicionesDeUsoAuto/condicioneGenerales/RadioGroup_Recode";
import { useState } from "react";
import DevueltasRecode from "@/components/recodeComponentes/condicionesDeUsoAuto/condicionesDevueltas/Devueltas_Recode";

export default function CondicionesUsoAutoHome() {
    const [respuesta, setRespuesta] = useState("si");

    return (
        <div className="p-4">
            <DevueltasRecode></DevueltasRecode>
        </div>
    );
}