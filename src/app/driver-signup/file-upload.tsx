"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import ImagePreview from "./image-preview";

interface FileUploadProps {
  type: "front" | "back";
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export default function FileUpload({
  label,
  file,
  onFileChange,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const droppedFile = files[0];
      processFile(droppedFile);
    }
  };

  const processFile = (selectedFile: File) => {
    // Validar que sea una imagen
    if (selectedFile.type.startsWith("image/")) {
      // Validar tamaño (10MB máximo)
      if (selectedFile.size <= 10 * 1024 * 1024) {
        onFileChange(selectedFile);
      } else {
        alert("El archivo es demasiado grande. Máximo 10MB.");
      }
    } else {
      alert("Por favor, selecciona solo archivos de imagen (PNG, JPG, etc.)");
    }
  };

  const handleFileSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const selectedFile = (e.target as HTMLInputElement).files?.[0];
      if (selectedFile) {
        processFile(selectedFile);
      }
    };
    input.click();
  };

  const handleRemove = () => {
    onFileChange(null);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {file ? (
        <ImagePreview file={file} onRemove={handleRemove} />
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver
              ? "border-foreground bg-muted/50"
              : "border-border hover:border-muted-foreground"
          }`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-2">
            <Upload
              className={`h-8 w-8 mx-auto ${
                isDragOver ? "text-foreground" : "text-muted-foreground"
              }`}
            />
            <div className="space-y-2">
              {isDragOver ? (
                <p className="text-sm font-medium">Suelta el archivo aquí</p>
              ) : (
                <>
                  <p className="text-sm font-medium">
                    Arrastra y suelta tu imagen aquí
                  </p>
                  <p className="text-xs text-muted-foreground">o</p>
                </>
              )}
              <Button
                variant="outline"
                onClick={handleFileSelect}
                disabled={isDragOver}
              >
                Seleccionar archivo
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">PNG, JPG hasta 10MB</p>
          </div>
        </div>
      )}
    </div>
  );
}
