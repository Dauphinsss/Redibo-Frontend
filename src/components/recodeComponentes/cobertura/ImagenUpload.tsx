"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  imagen: string;
  setImagen: (url: string) => void;
}

export default function SubirImagenCloudinary({ imagen, setImagen }: Props) {
  const [cargando, setCargando] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "auto_cobertura");

    try {
      setCargando(true);
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dzoeeaovz/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        setImagen(data.secure_url);
      } else {
        alert("Error al subir la imagen.");
        console.error("Cloudinary error:", data);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Falló la subida a Cloudinary");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <label
        htmlFor="file-upload"
        className="w-full max-w-md flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition p-6"
      >
        {imagen ? (
          <div className="relative w-64 h-64 border border-black rounded overflow-hidden">
            <Image
              src={imagen}
              alt="Imagen de cobertura"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-500 font-medium">
              {cargando ? "Subiendo imagen..." : "Haz clic para subir una imagen"}
            </p>
            <p className="text-sm text-gray-400">Formatos soportados: JPG, PNG</p>
          </div>
        )}
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  );
}