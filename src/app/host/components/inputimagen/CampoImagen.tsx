// src/components/inputimagen/CampoImagen.tsx
"use client";
import React, { useRef, useCallback } from "react";
import { Upload, AlertCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CampoImagenProps {
  label?: string;
  image: File | string | null;
  onImageChange: (file: File | string | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  isPrimary?: boolean;
}

const CampoImagen: React.FC<CampoImagenProps> = ({
  label,
  image,
  onImageChange,
  error,
  setError,
  isPrimary = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const validateImage = useCallback((file: File): string | null => {
    const name = file.name.toLowerCase();
    const allowedExtensions = /\.(jpg|png)$/i;
    const allowedMimeTypes = ["image/jpeg", "image/png"];

    if (!allowedExtensions.test(name)) {
      return "Solo .jpg/.png";
    }

    const mimeType = file.type.toLowerCase();
    if (!allowedMimeTypes.includes(mimeType)) {
      return "Formato no válido";
    }

    if (file.size > 2 * 1024 * 1024) {
      return "Máx. 2MB";
    }

    return null;
  }, []);

  const handleClick = () => inputRef.current?.click();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const err = validateImage(file);
      if (err) {
        setError(err);
        onImageChange(null);
        e.target.value = "";
      } else {
        setError(null);
        onImageChange(file);
      }
    }
  }, [validateImage, onImageChange, setError]);

  return (
    <div className="col-span-1">
      <label className="block mb-2 text-sm font-medium">
        {label}
        {isPrimary && <Star className="inline-block ml-1 text-yellow-500" />}
      </label>
      <div
        className={`relative border rounded-lg overflow-hidden bg-gray-50 h-64 flex items-center justify-center ${error ? 'border-red-500' : 'border-gray-300'}`}
      >
        {image ? (
          typeof image === "string" ? (
            <img
              src={image}
              alt={label}
              className="object-contain w-full h-full"
            />
          ) : (
            <img
              src={URL.createObjectURL(image)}
              alt={label}
              className="object-contain w-full h-full"
            />
          )
        ) : (
          <Upload className="h-12 w-12 text-gray-400" />
        )}
        <input
          type="file"
          accept=".jpg,.png"
          ref={inputRef}
          className="hidden"
          onChange={handleChange}
        />
        <Button
          variant="outline"
          size="sm"
          className="absolute bottom-2"
          onClick={handleClick}
        >
          {image ? "Cambiar" : "Subir"}
        </Button>
      </div>
      {error && (
        <div className="flex items-center text-red-500 text-xs mt-1">
          <AlertCircle className="h-4 w-4 mr-1" /> {error}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-1">
        {isPrimary ? "Imagen principal" : "Imagen secundaria"} • .jpg/.png ≤2MB
      </p>
    </div>
  );
};

export default React.memo(CampoImagen);
