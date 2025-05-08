"use client";
import FotoPerfilUsr from "@/components/recodeComponentes/comentarioUsuario/realizarComentario/fotoPerfilUsrRecode";
import { FaStar } from "react-icons/fa";
import { HiOutlineChat, HiOutlineHeart,HiHeart} from "react-icons/hi";

interface Props {
  nombreCompleto: string;
  fotoUser: string;
  fechaComentario: string;
  comentario: string;
  calificacionUsr: number;
}

function VerComentario({nombreCompleto, fotoUser,fechaComentario,comentario,calificacionUsr,}: Props) {

    nombreCompleto = "Juan Pérez";
    fechaComentario = "05 de mayo de 2025";
    comentario ="No tiene el Auto en buenas condiciones.";
    calificacionUsr = 3;

  return (
    <div className="w-full border border-gray-200 rounded-lg p-4">

        <div className="flex justify-between">
            <div className="flex space-x-4">
                <FotoPerfilUsr imagenUrl={fotoUser} ancho={50} alto={50} />
                <div>
                    <h3 className="font-medium">{nombreCompleto}</h3>
                    <div className="flex space-x-1 text-black">{/**text-yellow-500 */}
                        {Array.from({ length: calificacionUsr }, (_, i) => (
                            <FaStar key={i} />
                        ))}
                    </div>
                </div>
            </div>
            <p className="text-sm text-right whitespace-nowrap">{fechaComentario}</p>
        </div>

        <p className="mt-4 mb-4">{comentario}</p>

        <div className="flex space-x-4">
            <button className="text-black hover:bg-red-500">
            <HiOutlineHeart />
            </button>

            <button className="flex items-center gap-2 px-4 py-2 text-black hover:bg-stone-300 rounded-lg">
            <HiOutlineChat />Comentar
            </button>
        </div>
    </div>
  );
}

export default VerComentario;
