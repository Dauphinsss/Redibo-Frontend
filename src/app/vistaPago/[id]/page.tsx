import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import { getCarById } from "@/app/infoAuto_Recode/service/services_Recode";
import { transformAutoDetails_Recode } from "@/app/infoAuto_Recode/utils/transformAutoDetails_Recode";
import NotFound from "@/app/not-found";

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  /* ─────── Datos del auto ─────── */
  const autoData = await getCarById(params.id);
  if (!autoData) return NotFound();

  const auto = transformAutoDetails_Recode(autoData);

  /* ─────── UI ─────── */
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Barra superior */}
      <header className="flex items-center gap-3 bg-gray-200 px-6 py-3">
        <Link href="/" className="p-1 rounded hover:bg-gray-300">
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-semibold">Redibo</h1>
      </header>

      {/* Cuerpo */}
      <main className="flex flex-1 justify-center items-start p-8 overflow-auto">
        <div className="flex w-full max-w-6xl">
          {/* Panel izquierdo */}
          <section className="relative w-64 bg-gray-100 p-6">
            {/* Imagen */}
            <div className="w-full h-36 bg-gray-300 rounded mb-6" />

            {/* Detalles */}
            <div className="space-y-2 text-sm">
              <p>Marca: <span className="font-medium">{auto.marca}</span></p>
              <p>Modelo: <span className="font-medium">{auto.modelo}</span></p>
              <p>Ubicación: <span className="font-medium">ubicacion</span></p>
            </div>

            {/* Flecha separadora */}
            <span className="absolute inset-y-0 right-0 my-auto w-0 h-0 border-y-8 border-y-transparent border-l-8 border-l-white" />

            {/* Precio */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between text-base font-bold">
              <span>Precio:</span>
              <span>{auto.precio ?? "000 bs"}</span>
            </div>
          </section>

          {/* Panel derecho */}
          <section className="flex-1 px-10">
            <h2 className="text-xl font-semibold mb-8">¿Cómo quieres pagar?</h2>

            {/* Mock de métodos de pago */}
            <div className="flex gap-4 mb-10">
              <div className="flex-1 h-40 bg-gray-300 rounded" />
              <div className="w-24 h-40 bg-gray-300 rounded" />
            </div>

            {/* Garantía / Total */}
            <div className="space-y-2">
              <div className="flex justify-between items-center border-b border-gray-400 pb-1">
                <span className="font-semibold">Garantía</span>
                <span className="font-semibold">000</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-400 pb-1">
                <span className="font-semibold">Total a pagar</span>
                <span className="font-semibold">000 bs</span>
              </div>
            </div>

            {/* Términos */}
            <div className="flex items-center gap-2 mt-6">
              <input id="terms" type="checkbox" className="h-4 w-4 accent-gray-700" />
              <label htmlFor="terms" className="text-sm">Términos y condiciones</label>
            </div>

            {/* Botón Pagar */}
            <button
              type="button"
              className="mt-10 ml-auto block bg-gray-300 hover:bg-gray-400 px-10 py-2 rounded font-semibold"
            >
              Pagar
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
