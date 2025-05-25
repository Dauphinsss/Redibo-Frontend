"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Check, Upload, X } from "lucide-react"

interface FileUploadProps {
  type: "front" | "back"
  label: string
  file: File | null
  onFileChange: (file: File | null) => void
}

export default function FileUpload({  label, file, onFileChange }: FileUploadProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-muted-foreground transition-colors">
        {file ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Check className="h-5 w-5" />
              <span className="text-sm font-medium">Archivo subido</span>
            </div>
            <p className="text-sm text-muted-foreground">{file.name}</p>
            <Button variant="outline" size="sm" onClick={() => onFileChange(null)} className="mt-2">
              <X className="h-4 w-4 mr-1" />
              Remover
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
            <div>
              <Button
                variant="outline"
                onClick={() => {
                  const input = document.createElement("input")
                  input.type = "file"
                  input.accept = "image/*"
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) onFileChange(file)
                  }
                  input.click()
                }}
              >
                Seleccionar archivo
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">PNG, JPG hasta 10MB</p>
          </div>
        )}
      </div>
    </div>
  )
}
