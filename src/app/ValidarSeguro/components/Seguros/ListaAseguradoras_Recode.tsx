import { memo } from "react";
import CardAseguradora_Recode from "./CardAseguradora_Recode";

interface Aseguradora {
    id: number;
    empresa: string;
    fechaInicio: string;
    fechaFin: string;
}

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
                />
            ))}
        </div>
    );
}

export default memo(ListaAseguradoras_Recode);