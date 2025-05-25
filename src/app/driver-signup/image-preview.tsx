"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
}

export default function ImagePreview({ file, onRemove }: ImagePreviewProps) {
  const [showFullPreview, setShowFullPreview] = useState(false);
  const imageUrl = URL.createObjectURL(file);

  return (
    <>
      <div className="space-y-3">
        <div className="relative">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-32 object-cover rounded-lg border cursor-pointer"
            onClick={() => setShowFullPreview(true)}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowFullPreview(true)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Ver completa
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium truncate">{file.name}</span>
            <Button variant="ghost" size="sm" onClick={onRemove}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFullPreview(true)}
            className="w-full"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver imagen completa
          </Button>
        </div>
      </div>

      <Dialog open={showFullPreview} onOpenChange={setShowFullPreview}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Vista Previa - {file.name}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt="Vista previa completa"
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Tamaño: {(file.size / (1024 * 1024)).toFixed(2)} MB
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
