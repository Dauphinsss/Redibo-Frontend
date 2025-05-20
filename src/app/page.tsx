'use client';
import Carrucel from "@/components/custom/Carrucel";
import Header from "@/components/ui/Header";

export default function Home() {


  return (
    <div>
      <Header />
      <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
        <h1 className="text-4xl font-bold text-center">Bienvenido a REDIBO</h1>
        <p className="mt-4 text-lg">
          Tu tienda en línea para rentar autos.
        </p>
        <div className="mt-8 w-full max-w-7xl flex justify-center">
          <Carrucel />
        </div>
      </main>
    </div>
  );
}