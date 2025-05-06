'use client'
import General_Recode from "@/components/recodeComponentes/condicionesDeUsoAuto/condicioneGenerales/General_Recode";
import DevueltasRecode from "@/components/recodeComponentes/condicionesDeUsoAuto/condicionesDevueltas/Devueltas_Recode";
import EntradaRecode from "@/components/recodeComponentes/condicionesDeUsoAuto/condionesEntrada/Entrada_Recode";

export default function CondicionesUsoAutoHome() {

    return (
        <div className="p-4">
            <DevueltasRecode></DevueltasRecode>
        </div>
    );
}