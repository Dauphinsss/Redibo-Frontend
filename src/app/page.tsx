'use client';

import Header from "@/components/ui/Header";
import { notFound } from "next/navigation";

export default function Home() {
  const mostrarPagina = true;

  if (!mostrarPagina) {
    return notFound();
  }

  return (
    <div>
      <Header />
      <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
        <h1 className="text-4xl font-bold text-center">Bienvenido a REDIBO</h1>
        <p className="mt-4 text-lg">
          Tu tienda en línea para rentar autos.
        </p>
      </main>
    </div>
  );
}