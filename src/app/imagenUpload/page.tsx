'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import SubirImagenCloudinary from '@/components/recodeComponentes/cobertura/ImagenUpload';

export default function ImagenUploadPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // Obtén el parámetro 'id' de la URL
  const [imagen, setImagen] = useState<string>('');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 border border-black rounded-lg bg-white shadow-md">
        <h1 className="text-xl font-bold mb-4 text-center">Subir Imagen de Cobertura</h1>
        <p className="mb-4 text-center">ID del auto: <span className="font-semibold">{id}</span></p>
        <SubirImagenCloudinary imagen={imagen} setImagen={setImagen} />
        <button
          onClick={() => alert('Imagen subida con éxito')}
          disabled={!imagen}
          className={`w-full mt-4 px-4 py-2 rounded text-white font-semibold ${
            imagen ? 'bg-black hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Subir Imagen
        </button>
      </div>
    </div>
  );
}