'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface AutoImagProps {
  imagenes: { id: number; data: string }[];
  nombre: string;
}

export default function Autoimag({ imagenes, nombre }: AutoImagProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const tieneImagenes = imagenes.length > 0;
  const [direction, setDirection] = useState<1 | -1>(1);

  const nextImage = () => {
    setDirection(1);
    setCurrentImageIndex((prev) =>
      prev === imagenes.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentImageIndex((prev) =>
      prev === 0 ? imagenes.length - 1 : prev - 1
    );
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">{nombre}</h2>

      <div className="relative rounded-lg overflow-hidden aspect-video bg-white">
        {tieneImagenes ? (
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentImageIndex}
              className="absolute inset-0"
              custom={direction}
              initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.x < -100) nextImage();
                else if (info.offset.x > 100) prevImage();
              }}
            >
              <Image
                src={imagenes[currentImageIndex].data}
                alt={`${nombre} - Vista ${currentImageIndex + 1}`}
                fill
                className="object-scale-down p-1"
                sizes="(max-width: 768px) 100vw, 700px"
                loading="lazy"
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">Imagen no disponible</span>
          </div>
        )}

        {/* Flechas */}
        {tieneImagenes && imagenes.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition z-10 hidden sm:block"
              aria-label="Imagen anterior"
            >
              &larr;
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition z-10 hidden sm:block"
              aria-label="Siguiente imagen"
            >
              &rarr;
            </button>
          </>
        )}

        {/* Indicadores */}
        {tieneImagenes && imagenes.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {imagenes.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentImageIndex ? 1 : -1);
                  setCurrentImageIndex(index);
                }}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  index === currentImageIndex
                    ? 'bg-blue-500'
                    : 'bg-white bg-opacity-50'
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}