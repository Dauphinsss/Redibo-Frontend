"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import SubirImagenCloudinary from '@/app/polizaAutoEnlace/components/ImagenUpload';
import { postCoberturaEnlace } from '@/service/services_Recode';
import { EnlaceInterface } from '@/app/validarSeguro/interface/CoberturaForm_Interface_Recode';

export default function ImagenUploadClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  const [enlace, setEnlace] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!enlace) {
      alert('Falta la imagen.');
      return;
    }

    const payload: EnlaceInterface = {
      id_carro: Number(id),
      enlace
    };

    try {
      setIsSubmitting(true);
      await postCoberturaEnlace(payload);
      alert('Imagen subida y guardada correctamente');
      router.push('/listadoPrueba');
      router.refresh();
    } catch (err) {
      console.error('Error al guardar en la base de datos:', err);
      alert('Hubo un error al guardar la imagen en la base de datos');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVolver = () => {
    router.push('/listadoPrueba');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 border border-black rounded-lg bg-white shadow-md">
        <h1 className="text-xl font-bold mb-4 text-center">Subir Imagen de Cobertura</h1>
        {id && (
          <p className="mb-4 text-center">
            ID del auto: <span className="font-semibold">{id}</span>
          </p>
        )}
        <SubirImagenCloudinary imagen={enlace} setImagen={setEnlace} />

        <button
          onClick={handleSubmit}
          disabled={!enlace || isSubmitting}
          className={`w-full mt-4 px-4 py-2 rounded text-white font-semibold ${
            enlace && !isSubmitting ? 'bg-black hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Guardando...' : 'Subir Imagen'}
        </button>

        <button
          onClick={handleVolver}
          className="w-full mt-2 px-4 py-2 rounded border border-black text-black hover:bg-gray-200"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
