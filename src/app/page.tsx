'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Agregar esta importación
import FiltrosIni from '@/app/home/components/FiltrosIni';
import Carrucel from '@/app/home/components/Carrucel';
import Header from '@/components/ui/Header';

export default function Home() {
  const router = useRouter(); // Agregar esta línea

  const [filters, setFilters] = useState<{
    ciudad?: string;
    startDate?: Date;
    endDate?: Date;
  }>({});

  const handleFilterSubmit = (newFilters: {
    ciudad: string;
    startDate: Date;
    endDate?: Date;
  }) => {
    setFilters(newFilters);
    // Aquí puedes agregar lógica adicional o llamar a API
    console.log('Filtros aplicados:', newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
    console.log('Filtros reseteados');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <br/>   
      <main className="flex-1 container mx-auto py-8 px-4 md:px-8">
        {/* Sección de Título */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Bienvenido a REDIBO</h1>
          <p className="text-xl text-gray-600">Tu tienda en línea para rentar autos</p>
        </section>

        {/* Sección de Filtros */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Encuentra tu vehículo ideal</h2>
          <FiltrosIni
            router={router} // Pasar el router como prop
            onFilterSubmit={handleFilterSubmit}
            onResetFilters={handleResetFilters}
          />
        </section>

        {/* Sección de Carrusel */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Vehículos más rentados</h2>
          <div className="flex justify-center px-4">
            <Carrucel />
          </div>
        </section>

        {/* Espacio adicional si necesitas agregar más secciones */}
        <section className="mb-16">
          {/* Otras secciones pueden ir aquí */}
        </section>
      </main>

      {/* Footer puede ir aquí */}
    </div>
  );
}
