"use client";

import { useEffect, useState } from "react";
import { CarCardProps } from "@/app/admin/validarSeguro/interface/ListaAutoSeguro_Interface_Recode";
import { getCarsSeguro } from "@/app/admin/validarSeguro/services/servicesSeguro";
import CarList_Recode from "@/app/admin/validarSeguro/components/ListaAutosSeguros/CarList_Recode";

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
