import React, { useRef, useState } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CampoImagenProps {
  imageUrl: string | null;
  onImageChange: (url: string | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const CampoImagen: React.FC<CampoImagenProps> = ({
  imageUrl,
  onImageChange,
  error,
  setError,
}) => {
  const imageRef = useRef<HTMLInputElement>(null);

  // Validar que el archivo sea una imagen png o jpg y no exceda los 2MB
  const validateImage = (file: File): string | null => {
    // Validar tipo de archivo
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return "Solo se permiten imágenes PNG y JPG";
    }
    
    // Validar tamaño (2MB = 2 * 1024 * 1024 bytes)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return "La imagen no debe exceder los 2MB";
    }
    
    return null;
  };

  // Maneja la carga de la imagen
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationError = validateImage(file);
      
      if (validationError) {
        setError(validationError);
        onImageChange(null);
        // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
        if (imageRef.current) imageRef.current.value = '';
      } else {
        setError(null);
        onImageChange(URL.createObjectURL(file));
      }
    }
  };

  // Función para manejar el clic en el botón de carga
  const handleImageClick = () => {
    if (imageRef.current) {
      imageRef.current.click();
    }
  };

  return (
    <div className="col-span-1">
      <div 
        className={`border rounded-md bg-gray-50 h-64 flex flex-col items-center justify-center p-4 relative ${error ? 'border-red-500' : ''}`}
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {!imageUrl && <Upload className="h-10 w-10 text-gray-400 mb-2" />}
        <input
          type="file"
          ref={imageRef}
          onChange={handleImageUpload}
          accept="image/png,image/jpeg,image/jpg"
          className="hidden"
        />
        <Button 
          variant="outline" 
          className={`${imageUrl ? 'bg-white bg-opacity-70' : 'bg-white'}`}
          onClick={handleImageClick}
        >
          {imageUrl ? "Cambiar imagen" : "Elige una foto a subir"}
        </Button>
        {error && (
          <div className="text-red-500 text-sm mt-1 bg-white bg-opacity-70 p-1 rounded flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            {error}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">*Solo PNG/JPG, máx. 2MB</p>
    </div>
  );
};

export default CampoImagen;