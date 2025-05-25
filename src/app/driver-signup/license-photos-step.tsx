import FileUpload from "./file-upload"
import type { LicensePhotos } from "./types"

interface LicensePhotosStepProps {
  licensePhotos: LicensePhotos
  onPhotoChange: (type: "front" | "back", file: File | null) => void
}

export default function LicensePhotosStep({ licensePhotos, onPhotoChange }: LicensePhotosStepProps) {
  return (
    <div className="space-y-6">
      <FileUpload
        type="front"
        label="Foto del Anverso de la Licencia *"
        file={licensePhotos.front}
        onFileChange={(file) => onPhotoChange("front", file)}
      />

      <FileUpload
        type="back"
        label="Foto del Reverso de la Licencia *"
        file={licensePhotos.back}
        onFileChange={(file) => onPhotoChange("back", file)}
      />

      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium mb-2">Consejos para las fotos:</h4>
        <ul className="text-sm space-y-1">
          <li>• Asegúrate de que la foto sea clara y legible</li>
          <li>• Evita reflejos y sombras</li>
          <li>• La licencia debe estar completamente visible</li>
          <li>• Formato JPG o PNG, máximo 10MB</li>
        </ul>
      </div>
    </div>
  )
}
