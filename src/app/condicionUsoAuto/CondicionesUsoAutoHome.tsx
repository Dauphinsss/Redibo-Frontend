'use client'
import RadioGroup_Recode from "@/components/recodeComponentes/condicionesDeUsoAuto/condicioneGenerales/RadioGroup_Recode";
import { useState } from "react";

export default function CondicionesUsoAutoHome() {
    const [respuesta, setRespuesta] = useState("si");

    return (
        <div className="p-4">
            <h1 className="text-lg font-semibold mb-4">¿Acepta los términos?</h1>
            <RadioGroup_Recode
                value={respuesta}
                onChange={setRespuesta}
                name="aceptacion"
            />
    </div>
    );
}