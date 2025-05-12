import Image from "next/image";

interface Props {
  imagen: string;
  setImagen: (url: string) => void;
}
// revisar
export default function SubirImagenCloudinary({ imagen, setImagen }: Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const urlSimulada = URL.createObjectURL(file);
    setImagen(urlSimulada);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Imagen de cobertura</label>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-2"
      />

      {imagen && (
        <div className="relative w-32 h-32 mt-2">
          <Image
            src={imagen}
            alt="Imagen de cobertura"
            layout="fill"
            className="object-cover rounded"
          />
        </div>
      )}
    </div>
  );
}
