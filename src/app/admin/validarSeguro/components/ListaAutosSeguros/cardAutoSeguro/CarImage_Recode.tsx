import React, { memo, useState } from "react";
import Image from "next/image";
import { CarIcon } from "lucide-react";

interface CarImageProps {
  src?: string | null;
  alt: string;
}

function CarImage_Recode({ src, alt }: CarImageProps) {
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };

  // Dimensiones consistentes para la imagen y el placeholder
  const imageWidth = 160;
  const imageHeight = 128;

  return (
    <div 
      className="flex-shrink-0 rounded-lg overflow-hidden shadow-md bg-gray-100 flex items-center justify-center"
      style={{ width: `${imageWidth}px`, height: `${imageHeight}px` }}
    >
      {src && !error ? (
        <div className="relative w-full h-full">
          <Image
            src={src}
            alt={alt}
            layout="fill"
            objectFit="cover"
            sizes={`${imageWidth}px`} 
            onError={handleError} 
            loading="lazy"
            unoptimized={src.startsWith('http')}
          />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-gray-500">
          <CarIcon className="w-12 h-12 mb-1" />
          <span className="text-xs text-center px-1">Imagen no disponible</span>
        </div>
      )}
    </div>
  );
}

export default memo(CarImage_Recode);