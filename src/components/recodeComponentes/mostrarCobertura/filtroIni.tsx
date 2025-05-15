'use client';
import { useEffect, useState } from 'react';

const opcionesFechas = [
  { inicio: '2025-05-16', fin: '2025-05-19', ciudad: 'Cochabamba' },
  { inicio: '2025-05-18', fin: '2025-05-25', ciudad: 'Cochabamba' },
  { inicio: '2025-05-19', fin: '2025-05-22', ciudad: 'Cochabamba' },
];

export default function FechasAlquiler({ onFechasSeleccionadas }: { onFechasSeleccionadas: (fechas: { inicio: string, fin: string }) => void }) {
  const [seleccion, setSeleccion] = useState(opcionesFechas[0]);

  useEffect(() => {
    const random = Math.floor(Math.random() * opcionesFechas.length);
    setSeleccion(opcionesFechas[random]);
    onFechasSeleccionadas(opcionesFechas[random]);
  }, [onFechasSeleccionadas]);

  return (
    <div className="flex justify-center gap-4 border p-4 rounded">
      <div className="text-center">
        <strong>{seleccion.ciudad}</strong>
        <p>{new Date(seleccion.inicio).toLocaleDateString('es-BO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
      <div className="text-center">
        <strong>{seleccion.ciudad}</strong>
        <p>{new Date(seleccion.fin).toLocaleDateString('es-BO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
      <button className="bg-black text-white px-3 py-1 rounded">Edit</button>
    </div>
  );
}
