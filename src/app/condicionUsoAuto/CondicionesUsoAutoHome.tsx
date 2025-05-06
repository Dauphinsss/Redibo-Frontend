'use client'
import RadioGroup_Recode from "@/components/recodeComponentes/condicionesDeUsoAuto/condicioneGenerales/RadioGroup_Recode";
import { useState } from "react";
import DevueltasRecode from "@/components/recodeComponentes/condicionesDeUsoAuto/condicionesDevueltas/Devueltas_Recode";
import EntradaRecode from "@/components/recodeComponentes/condicionesDeUsoAuto/condionesEntrada/Entrada_Recode";

export default function CondicionesUsoAutoHome() {
    const [respuesta, setRespuesta] = useState("si");

    return (
        <div className="">
           {/** <DevueltasRecode></DevueltasRecode>*/} 
            <EntradaRecode></EntradaRecode>
        </div>
    );
}