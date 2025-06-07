import { memo } from "react";
import { FaUser } from "react-icons/fa";
import Estrellas from "@/app/reserva/components/componentes_InfoAuto_Recode/calificacionAuto/EstrellasRecode";

interface Props {
  nombreHost: string;
  calificacion: number;
}

function CarCardHost({ nombreHost, calificacion }: Props) {
  return (
    <div className="flex flex-col gap-1 mt-1 text-sm">
      <div className="flex items-center gap-2">
        <FaUser /> {nombreHost}
      </div>
      <div className="flex items-center  text-black gap-x-2">
        <span className="mb-2">{calificacion}</span>
        <Estrellas promedio={calificacion} />
      </div>
    </div>
  );
}

export default memo(CarCardHost);
