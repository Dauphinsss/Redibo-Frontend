"use client";

import { useState } from "react";
import Image from "next/image";

interface AutoImagProps {
  imagenes: { id: number; data: string }[];
  nombre: string;
}

export default function Autoimag({ imagenes, nombre }: AutoImagProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const tieneImagenes = imagenes.length > 0;

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imagenes.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imagenes.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">{nombre}</h2>

      <div className="relative rounded-lg overflow-hidden">
        {tieneImagenes ? (
          <div className="relative aspect-video bg-white">
            <Image
              src={imagenes[currentImageIndex].data}
              alt={`${nombre} - Vista ${currentImageIndex + 1}`}
              fill
              className="object-scale-down p-1"
              sizes="(max-width: 768px) 100vw, 700px"
            />

            {imagenes.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition z-10"
                  aria-label="Imagen anterior"
                >
                  &larr;
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition z-10"
                  aria-label="Siguiente imagen"
                >
                  &rarr;
                </button>
              </>
            )}

            {imagenes.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {imagenes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition ${
                      index === currentImageIndex
                        ? "bg-blue-500"
                        : "bg-white bg-opacity-50"
                    }`}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">Imagen no disponible</span>
          </div>
        )}
      </div>
    </section>
  );
}