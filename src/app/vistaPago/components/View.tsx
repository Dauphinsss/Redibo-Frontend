'use client'
import React, { useState } from 'react'
import { useCardByID, useCreatePaymentOrder, useHostById, useRenter } from '../hooks/useCarByID'
import Image from 'next/image'

export default function View({ id }: { id: number }) {
  const { mutate, error, data } = useCreatePaymentOrder();
  const { data: car } = useCardByID(id)
  const { data: host } = useHostById(id)
  const { data: renter } = useRenter()
  const [clickCheck, setclickCheck] = useState(false)
  const handleSubmit = () => {
    mutate({
      id_carro: id,
      id_usuario_host: Number(host?.id_host ?? 0),
      id_usuario_renter: renter.id,
      monto_a_pagar: car?.precio_por_dia ?? 0,
    });
  };
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Barra superior */}
      <header className="flex items-center gap-3 bg-gray-200 px-6 py-3">
        
        <h1 className="text-lg font-semibold">Redibo</h1>
      </header>
      <main className="flex flex-1 justify-center items-start p-8 overflow-auto">
        <div className="flex w-full max-w-6xl">
          {/* Panel izquierdo */}
          <section className="relative w-64 bg-gray-100 p-6">
            {/* Imagen */}
            <Image className="w-full h-36 bg-gray-300 rounded mb-6" src={car?.imagen ?? ''} alt="vehiculo" />

            {/* Detalles */}
            <div className="space-y-2 text-sm">
              <p>Marca: <span className="font-medium">{car?.marca}</span></p>
              <p>Modelo: <span className="font-medium">{car?.modelo}</span></p>
              <p>Ubicación: <span className="font-medium">{car?.direccion}</span></p>
            </div>

            {/* Flecha separadora */}
            <span className="absolute inset-y-0 right-0 my-auto w-0 h-0 border-y-8 border-y-transparent border-l-8 border-l-white" />

            {/* Precio */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between text-base font-bold">
              <span>Precio:</span>
              <span>{car?.precio_por_dia ?? "0"} bs</span>
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
                <span className="font-semibold">{car?.precio_por_dia} bs</span>
              </div>
            </div>

            {/* Términos */}
            <div className="flex items-center gap-2 mt-6">
              <input id="terms" type="checkbox" onChange={()=> setclickCheck(!clickCheck) } className="h-4 w-4 accent-gray-700" />
              <label htmlFor="terms" className="text-sm">Términos y condiciones</label>
            </div>

            {/* Botón Pagar */}
            <button
              type="button"
              onClick={handleSubmit}
              className={`mt-10 ml-auto block bg-gray-300 hover:bg-gray-400 px-10 py-2 rounded font-semibold ${clickCheck?'opacity-100' : 'opacity-50'}`}
            >
              Pagar
            </button>
          </section>
        </div>
      </main>
    </div>
  )
}
