'use client'
import React, { useState } from 'react'
import { useCardByID, useCreatePaymentOrder, useHostById, useRenter, useGarantiaByCarId } from '../hooks/useCarByID'
import Image from 'next/image'
import Header from '@/components/ui/Header';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ConfirmacionReservaOpciones from '@/app/reserva/components/ConfirmacionHost';

export default function View({ id }: { id: number }) {
  const searchParams = useSearchParams();

  const fechaInicio = searchParams.get('fechaInicio');
  const fechaFin = searchParams.get('fechaFin');
  const precio = searchParams.get('precio');

  const [mostrarModal, setMostrarModal] = useState(false);
  const [showConfirmationOptions, setShowConfirmationOptions] = useState(false);

  const { mutate, error, data } = useCreatePaymentOrder();
  const { data: car } = useCardByID(id)
  const { data: host } = useHostById(id)
  const { data: renter } = useRenter()
  const { data: garantia } = useGarantiaByCarId(id);
  const [clickCheck, setclickCheck] = useState(false)
  const pagarCompleto = () => {
    setShowConfirmationOptions(false);
    setMostrarModal(true);
    mutate({
      id_carro: id,
      id_usuario_host: Number(host?.id_host ?? 0),
      id_usuario_renter: Number(renter?.id),
      monto_a_pagar: Number(precio ?? 0),
    });
  };
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Barra superior */}
      <Header />
      <main className="flex md:justify-center items-start p-8 overflow-auto">
        <div className="flex flex-col md:flex-row justify-center items-center w-full ">
          {/* Panel izquierdo */}
          <section className="relative sm:w-85 bg-gray-100 p-6">
            {/* Imagen o Contenedor plano */}
            {car?.imagen ? (
              <Image
                src={car.imagen}
                alt="vehiculo"
                width={400}
                height={300}
                className="rounded mb-6"
              />
            ) : (
              <div
                className="bg-gray-200 rounded mb-6 flex items-center justify-center text-gray-500"
                style={{ width: 295, height: 200 }}
              >
                Sin imagen disponible
              </div>
            )}

            {/* Detalles */}
            <div className="space-y-2 text-sm">
              <p>Marca: <span className="font-medium">{car?.marca}</span></p>
              <p>Modelo: <span className="font-medium">{car?.modelo}</span></p>
              <p>Ubicación: <span className="font-medium">{car?.direccion}</span></p>
            </div>

            {/* Precio */}
            <div className="flex justify-between text-base font-bold">
              <span>Precio:</span>
              <span>Bs {car?.precio_por_dia ?? "0"}</span>
            </div>
          </section>

          {/* Panel derecho */}
          <section className="flex-1 w-full px-10">
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
                <span className="font-semibold">Bs {garantia?.precio ?? "000"}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-400 pb-1">
                <span className="font-semibold">Total a pagar</span>
                <span className="font-semibold">Bs {precio}</span>
              </div>
            </div>

            {/* Términos */}
            <div className="flex items-center gap-2 mt-6">
              <input id="terms" type="checkbox" onChange={() => setclickCheck(!clickCheck)} className="h-4 w-4 accent-gray-700" />
              <label htmlFor="terms" className="text-sm">Términos y condiciones</label>
            </div>

            {/* Botón Pagar */}
            <button
              type="button"
              onClick={() => setShowConfirmationOptions(true)}
              disabled={!clickCheck}
              className={`mt-10 ml-auto block bg-gray-300 hover:bg-gray-400 px-10 py-2 rounded font-semibold ${clickCheck ? 'opacity-100' : 'opacity-50'}`}
            >
              Pagar
            </button>
            {showConfirmationOptions && (
              <ConfirmacionReservaOpciones
                //user={user}
                pickupDate={fechaInicio ? new Date(fechaInicio) : undefined}
                returnDate={fechaFin ? new Date(fechaFin) : undefined}
                id={id.toString()}
                marca={car?.marca ?? ""}
                modelo={car?.modelo ?? ""}
                precio={Number(precio) || 0}
                onReservarSinPagar={() => {
                  setShowConfirmationOptions(false);
                }}
                onPagarCompleto={pagarCompleto}
                onCancelar={() => setShowConfirmationOptions(false)}
              />
            )}
            {mostrarModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
                  <button
                    onClick={() => setMostrarModal(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                  >
                    ✕
                  </button>
                  <h2 className="text-xl font-bold mb-4">Mensaje</h2>
                  <p className="mb-4">¡Gracias! Tu pago está siendo verificado. Te notificaremos en breve.</p>
                  <Link href="/" onClick={() => setMostrarModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition">
                    Seguir alquilando
                  </Link>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
