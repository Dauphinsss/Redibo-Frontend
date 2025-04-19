import Image from "next/image";

interface Props {
    imagenUrl: string;
}

export default function CarCardImg({ imagenUrl }: Props) {
    return (
        <div className="w-[230px] h-[150px] bg-gray-200 rounded-[10px] overflow-hidden flex items-center justify-center relative">
        {imagenUrl ? (
            <Image
            src={imagenUrl}
            alt="Imagen del auto"
            fill
            className="object-contain"
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            Sin imagen
            </div>
        )}
        </div>
    );
}
