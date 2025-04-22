"use client";
import React, { useRef, useCallback } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CampoImagenProps {
  image: File | null;
  onImageChange: (file: File | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const CampoImagen: React.FC<CampoImagenProps> = ({
  image,
  onImageChange,
  error,
  setError,
}) => {
  const imageRef = useRef<HTMLInputElement>(null);

  const validateImage = useCallback((file: File): string | null => {
    // Validar extensión del archivo (solo .jpg y .png)
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.jpg') && !fileName.endsWith('.png')) {
      return "Solo se permiten imágenes .jpg o .png";
    }
    
    // Validar tipo MIME (image/jpeg para .jpg y image/png para .png)
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return "Formato de archivo no válido";
    }
    
    // Validar tamaño (2MB máximo)
    if (file.size > 2 * 1024 * 1024) {
      return "La imagen no debe exceder 2MB";
    }
    
    return null;
  }, []);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationError = validateImage(file);
      
      if (validationError) {
        setError(validationError);
        onImageChange(null);
        if (imageRef.current) imageRef.current.value = '';
      } else {
        setError(null);
        onImageChange(file);
      }
    }
  }, [validateImage, setError, onImageChange]);

  const handleImageClick = useCallback(() => {
    imageRef.current?.click();
  }, []);

  return (
    <div className="col-span-1">
      <div 
        className={`border rounded-md bg-gray-50 h-64 flex flex-col items-center justify-center p-4 relative ${error ? 'border-red-500' : ''}`}
        style={{
          backgroundImage: image ? `url(${URL.createObjectURL(image)})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {!image && <Upload className="h-10 w-10 text-gray-400 mb-2" />}
        <input
          type="file"
          ref={imageRef}
          onChange={handleImageUpload}
          accept=".jpg,.png" // Solo acepta .jpg y .png explícitamente
          className="hidden"
        />
        <Button 
          variant="outline" 
          className={`${image ? 'bg-white bg-opacity-70' : 'bg-white'}`}
          onClick={handleImageClick}
        >
          {image ? "Cambiar imagen" : "Elige una foto a subir"}
        </Button>
        {error && (
          <div className="text-red-500 text-sm mt-1 bg-white bg-opacity-70 p-1 rounded flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            {error}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">*Solo .jpg/.png, máx. 2MB</p>
    </div>
  );
};

export default React.memo(CampoImagen);