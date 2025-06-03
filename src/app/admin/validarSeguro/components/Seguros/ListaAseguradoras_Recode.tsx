"use client";

import { memo, useEffect, useState } from "react";
import { Aseguradora } from "@/app/admin/validarSeguro/interface/ListaAutoSeguro_Interface_Recode";
import { getSegurosCards } from "@/app/admin/validarSeguro/services/servicesSeguro";
import CardAseguradora_Recode from "./CardAseguradora_Recode";

interface Props {
    idAuto: number;
}

function ListaAseguradoras_Recode({ idAuto }: Props) {
    const [aseguradoras, setAseguradoras] = useState<Aseguradora[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await getSegurosCards(idAuto);
            setAseguradoras(data);
            setLoading(false);
        };

        fetchData();
    }, [idAuto]);

    if (loading) return <p className="text-center text-gray-500">Cargando aseguradoras...</p>;
    if (aseguradoras.length === 0) return <p className="text-center text-gray-500">No se encontraron aseguradoras.</p>;

    return (
        <div className="flex flex-col gap-4">
            {aseguradoras.map((a) => (
                <CardAseguradora_Recode
                    key={a.idAseguradora}
                    idAseguradora={a.idAseguradora}
                    empresa={a.empresa}
                    nombre={a.nombre}
                    tipoSeguro={a.tipoSeguro}
                    fechaInicio={a.fechaInicio}
                    fechaFin={a.fechaFin}
                />
            ))}
        </div>
    );
}

export default memo(ListaAseguradoras_Recode);
