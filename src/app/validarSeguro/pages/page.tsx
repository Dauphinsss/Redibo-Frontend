"use client";

import { useEffect, useState } from "react";
import CarList_Recode from "@/app/validarSeguro/components/listaAutosSeguros/CarList_Recode";
import { CarCardProps } from "@/app/validarSeguro/interface/ListaAutoSeguro_Interface_Recode";
import { getCarsSeguro } from "@/app/validarSeguro/services/servicesSeguro";

export default function Page() {
    const [carCards, setCarCards] = useState<CarCardProps[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const autos = await getCarsSeguro();
            setCarCards(autos);
            setLoading(false);
        }

        fetchData();
    }, []);

    return (
        <main className="min-h-screen p-8 bg-white">
            <h1 className="text-2xl font-bold text-center mb-6">Lista de autos</h1>
            {loading ? (
                <p className="text-center">Cargando autos...</p>
            ) : (
                <CarList_Recode carCards={carCards} />
            )}
        </main>
    );
}
