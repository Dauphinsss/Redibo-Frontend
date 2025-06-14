// src/app/reserva/page/infoAuto_Recode/[id]/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import Home from './Home';
import { useParams, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useSearchStore } from '@/app/busqueda/store/searchStore'; // Importamos el store

// Componente interno para leer la URL y actualizar Zustand
function PageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { setCiudad, setFechas } = useSearchStore(); // Obtenemos las acciones del store

  const id = params.id as string;

  useEffect(() => {
    // Leemos los parámetros de la URL
    const ciudadParam = searchParams.get('ciudad');
    const fechaInicioParam = searchParams.get('fechaInicio');
    const fechaFinParam = searchParams.get('fechaFin');

    // Actualizamos el store de Zustand con los valores de la URL
    // Esto asegura que el estado en la nueva pestaña esté sincronizado
    if (ciudadParam) {
      setCiudad(ciudadParam);
    }
    if (fechaInicioParam) {
      setFechas(fechaInicioParam, fechaFinParam || null);
    }
    
    // Para depuración
    console.log('Datos de URL sincronizados con Zustand:', { 
      ciudad: ciudadParam, 
      fechaInicio: fechaInicioParam, 
      fechaFin: fechaFinParam 
    });

  }, [searchParams, setCiudad, setFechas]); // Se ejecuta cuando los searchParams están listos

  // Ahora, el componente Home leerá los datos actualizados desde Zustand
  return id ? <Home id={id} /> : null;
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-gray-800" />
      </div>
    }>
      <PageContent />
    </Suspense>
  );
}