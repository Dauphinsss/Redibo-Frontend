'use client';

import { useEffect } from 'react';
import Filter from '@/components/recodeComponentes/RecodeFilter';
import { AutoCard_Interfaces_Recode as Auto } from '@/interface/AutoCard_Interface_Recode';

interface Props {
    autos: Auto[];
    ordenSeleccionado: string;
    setOrdenSeleccionado: (orden: string) => void;
    setAutosFiltrados: (autos: Auto[]) => void;
}

const ordenados = [
    'Precio bajo a alto',
    'Precio alto a bajo',
    'Modelo Ascendente',
    'Modelo Descendente',
];

export default function OrdenadorBusquedaRecode({
    autos,
    ordenSeleccionado,
    setOrdenSeleccionado,
    setAutosFiltrados,
}: Props) {
    useEffect(() => {
        if (!autos || autos.length === 0) return;

        console.log('Orden seleccionado:', ordenSeleccionado);
        console.log('Primer precio:', autos[0]?.precioPorDia, 'tipo:', typeof autos[0]?.precioPorDia);

        if (ordenSeleccionado === 'Recomendación') {
            setAutosFiltrados(autos);
            return;
        }

        const ordenadosLista = [...autos];

        switch (ordenSeleccionado) {
            case 'Modelo Ascendente':
                ordenadosLista.sort((a, b) => a.modelo.localeCompare(b.modelo));
                break;
            case 'Modelo Descendente':
                ordenadosLista.sort((a, b) => b.modelo.localeCompare(a.modelo));
                break;
            case 'Precio bajo a alto':
                ordenadosLista.sort((a, b) => a.precioPorDia - b.precioPorDia);
                break;
            case 'Precio alto a bajo':
                ordenadosLista.sort((a, b) => b.precioPorDia - a.precioPorDia);
                break;
        }

        setAutosFiltrados(ordenadosLista);
    }, [ordenSeleccionado]);

    return (
        <Filter
            lista={ordenados}
            nombre="Ordenados por"
            onChange={setOrdenSeleccionado}
        />
    );
}