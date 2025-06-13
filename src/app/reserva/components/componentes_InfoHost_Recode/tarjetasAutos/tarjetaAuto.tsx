import Image from "next/image";
import { memo } from "react";

import Estrellas from "@/app/reserva/components/componentes_InfoAuto_Recode/calificacionAuto/EstrellasRecode";
import { useCalificaciones } from "@/app/busqueda/hooks/useCalifPromedio";

interface Props {
  idAuto: number;
  fotoAuto: string | null;
  modeloAuto: string;
  marcaAuto: string;
}

function TarjetaCar({idAuto, fotoAuto, modeloAuto, marcaAuto }: Props) {
  const { promedioCalificacion } = useCalificaciones(idAuto.toString());
  const calificacion = parseFloat(promedioCalificacion);

  const esImagenValida = fotoAuto && (fotoAuto.startsWith("http") || fotoAuto.startsWith("/"));

  return (
    <div className="border rounded-lg p-4 flex flex-col items-start shadow-md w-[300px] h-[250px]">
      <div className="relative w-full h-[160px] bg-gray-300 rounded">
        {esImagenValida ? (
          <Image
            src={fotoAuto as string}
            alt="Imagen del auto"
            fill
            className="object-cover rounded"
            loading="lazy"
          />
        ) : (
          <span className="text-sm text-black flex items-center justify-center h-full w-full">Sin imagen</span>
        )}
      </div>

      <div className="text-sm mt-2 grid grid-cols-2 gap-4">
        <div>
          <h2 className="font-semibold">Modelo:</h2>
          <p>{modeloAuto}</p>
        </div>
        <div>
          <h2 className="font-semibold">Marca:</h2>
          <p>{marcaAuto}</p>
        </div>
      </div>
      <div className="flex items-center  text-black gap-x-2">
        <span className="mt-1">{calificacion}</span>
        <Estrellas promedio={calificacion} />
      </div>
    </div>
  );
}

export default memo(TarjetaCar);
