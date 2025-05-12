'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import SubirImagenCloudinary from '@/components/recodeComponentes/cobertura/ImagenUpload';

export default function ImagenUploadPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // Obtén el parámetro 'id' de la URL
  const [imagen, setImagen] = useState<string>('');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Subir Imagen de Cobertura</h1>
      <p className="mb-4">ID del auto: {id}</p>
      <SubirImagenCloudinary imagen={imagen} setImagen={setImagen} />
    </div>
  );
}