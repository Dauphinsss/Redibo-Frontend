'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getInsuranceByID } from '@/service/services_Recode';
import { ValidarInterface } from '@/interface/CoberturaForm_Interface_Recode';

export default function FormularioCobertura() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [datos, setDatos] = useState<ValidarInterface | null>(null);
  const [tieneImagen, setTieneImagen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const idSeguro = id ?? '';

    async function fetchDatos() {
      try {
        const data = await getInsuranceByID<ValidarInterface>(idSeguro);
        setDatos(data);
        setTieneImagen(!!data?.enlace);
      } catch (error) {
        console.error('Error al obtener datos del seguro:', error);
        setTieneImagen(false);
      } finally {
        setLoading(false);
      }
    }

    fetchDatos();
  }, [id]);

  if (loading) {
    return <div className="p-4">Cargando datos...</div>;
  }

  return (
    <div className="space-y-4 p-4 max-w-xl mx-auto">
      {tieneImagen ? (
        <div className="mb-4">
          <Image
            src={datos?.enlace ?? ''}
            alt="Imagen de acreditación"
            width={500}
            height={300}
            className="w-full max-w-md border border-gray-300 rounded"
            priority
            unoptimized
          />
          <p className="mt-2 text-sm text-gray-600">{datos?.enlace}</p>
        </div>
      ) : (
        <div className="text-red-500 font-medium">
          No se ha subido ninguna imagen para este auto.
        </div>
      )}

      <div className="flex gap-4 items-center">
        <label className="font-medium">Cuenta con un seguro:</label>
        <label>
          <input
            type="radio"
            name="seguro"
            checked={tieneImagen}
            readOnly
          />{' '}
          Sí
        </label>
        <label>
          <input
            type="radio"
            name="seguro"
            checked={!tieneImagen}
            readOnly
          />{' '}
          No
        </label>
      </div>

      {tieneImagen && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Aseguradora:</label>
            <input
              type="text"
              value={datos?.empresa ?? ''}
              readOnly
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Inicio:</label>
              <input
                type="date"
                value={datos?.fechaInicio ?? ''}
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fin:</label>
              <input
                type="date"
                value={datos?.fechaFin ?? ''}
                readOnly
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
