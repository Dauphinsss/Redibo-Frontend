"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { Pencil, User } from "lucide-react";
import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { API_URL } from "@/utils/bakend";
import { getCroppedImg } from "@/utils/cropImagen";
import { Button } from "@/components/ui/button";

export default function EditableProfileImage({
  initialImage,
}: {
  initialImage?: string;
}) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialImage ?? null
  );

  const onCropComplete = useCallback(
    (
      _: unknown,
      croppedPixels: { x: number; y: number; width: number; height: number }
    ) => {
      setCroppedAreaPixels(croppedPixels);
    },
    []
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setDialogOpen(true);

      // Limpia el input para permitir volver a seleccionar el mismo archivo
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const uploadCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append("file", croppedBlob, `${uuidv4()}.jpg`);

      const token = localStorage.getItem("auth_token");
      const response = await axios.post(
        `${API_URL}/api/upload-foto`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Imagen actualizada");
      setPreviewUrl(response.data.fotoUrl);
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Error al subir la imagen");
    }
  };

  return (
    <div className="relative group w-32 h-32 rounded-full overflow-hidden">
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Foto de perfil"
            width={128}
            height={128}
            className="object-cover w-full h-full"
            unoptimized
          />
        ) : (
          <User size={64} className="text-gray-400" />
        )}
      </div>

      <label
        htmlFor="image-input"
        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
      >
        <Pencil className="text-white" />
        <input
          id="image-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[90vw] w-full sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Recorta tu imagen</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-64 bg-black">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setDialogOpen(false)} variant="secondary">
              Cancelar
            </Button>
            <Button onClick={uploadCroppedImage}>Guardar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
