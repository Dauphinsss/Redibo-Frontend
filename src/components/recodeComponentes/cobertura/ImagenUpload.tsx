import Image from "next/image";

interface Props {
  setImagen: (url: string) => void;
}
export default function ImagenUpload({ setImagen }: Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const urlSimulada = URL.createObjectURL(file);
    setImagen(urlSimulada);
  };

  return (
    <div className="flex flex-col items-center">
      <label
        htmlFor="file-upload"
        className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition p-6"
      >
        {imagen ? (
          <div className="relative w-64 h-64 border border-black rounded overflow-hidden">
            <Image
              src={imagen}
              alt="Imagen de cobertura"
              layout="fill"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-500 font-medium">Haz clic para subir una imagen</p>
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
