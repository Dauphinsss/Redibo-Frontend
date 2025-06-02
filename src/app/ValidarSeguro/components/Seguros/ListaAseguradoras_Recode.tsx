import { memo } from "react";
import CardAseguradora_Recode from "./CardAseguradora_Recode";
import { Aseguradora } from "@/app/validarSeguro/interface/ListaAutoSeguro_Interface_Recode";




interface Props {
    aseguradoras: Aseguradora[];
}

function ListaAseguradoras_Recode({ aseguradoras }: Props) {
    return (
        <div className="flex flex-col gap-4">
            {aseguradoras.map((a) => (
                <CardAseguradora_Recode
                    key={a.id}
                    empresa={a.empresa}
                    fechaInicio={a.fechaInicio}
                    fechaFin={a.fechaFin}
                    planes={[
                        {
                            nombre: "Plan Básico",
                            tipos: [
                                { id: "robo123", nombre: "Robo" },
                                { id: "accidente123", nombre: "Accidente" },
                                { id: "robo1234", nombre: "Robo1" },
                                { id: "robo1235", nombre: "Robo2" },
                                { id: "robo1236", nombre: "Robo3" },
                                { id: "robo1237", nombre: "Robo4" },
                                { id: "robo1238", nombre: "Robo5" },
                                { id: "robo1238", nombre: "Robo1" },
                                { id: "robo9235", nombre: "Robo2" },
                                { id: "robo1236", nombre: "Robo3" },
                                { id: "robo1037", nombre: "Robo4" },
                                { id: "robo1938", nombre: "Robo5" },
                            ],
                        },
                        {
                            nombre: "Plan Premium",
                            tipos: [
                                { id: "robo123", nombre: "Robo" },
                                { id: "accidente123", nombre: "Accidente" },
                                { id: "accidente123", nombre: "Accidente" },
                                { id: "robo1234", nombre: "Robo1" },
                                { id: "robo1235", nombre: "Robo2" },
                                { id: "robo1236", nombre: "Robo3" },
                                { id: "robo1237", nombre: "Robo4" },
                                { id: "robo1238", nombre: "Robo5" },
                            ],
                        },
                    ]}
                />
            ))}
        </div>
    );
}

export default memo(ListaAseguradoras_Recode);