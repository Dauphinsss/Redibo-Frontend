"use client";
import FotoPerfilUsr from "@/components/recodeComponentes/comentarioUsuario/realizarComentario/fotoPerfilUsrRecode";
import { FaStar } from "react-icons/fa";
import { HiOutlineChat, HiThumbUp, HiThumbDown } from "react-icons/hi";

interface Props {
  nombreCompleto: string;
  fotoUser: string;
  fechaComentario: string;
  comentario: string;
  calificacionUsr: number;
}

function VerComentario({nombreCompleto, fotoUser, fechaComentario, comentario, calificacionUsr,}: Props) {

  nombreCompleto = "Juan Pérez";
  fotoUser = "";
  fechaComentario = "05 de mayo de 2025";
  comentario = "No tiene el Auto en buenas condiciones.";
  calificacionUsr = 3;

  return (
    <div className="w-full border border-gray-200 rounded-lg p-4">

      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div className="flex gap-4 items-start">
          <FotoPerfilUsr imagenUrl={fotoUser} ancho={50} alto={50} />
          <div>
            <h3 className="font-medium">{nombreCompleto}</h3>
            <div className="flex space-x-1 text-black">
              {Array.from({ length: calificacionUsr }, (_, i) => (
                <FaStar key={i} />
              ))}
            </div>
          </div>
        </div>

        <div className="text-sm text-right md:text-left">
          <p>{fechaComentario}</p>
        </div>
      </div>

      <p className="mt-4 mb-4">{comentario}</p>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 text-black hover:bg-stone-300 rounded-lg self-start sm:self-auto">
          <HiOutlineChat />
          Comentar
        </button>

        <div className="flex items-center space-x-2 text-sm self-start sm:self-auto">
          <span>¿Te resultó útil esta opinión?</span>
          <HiThumbUp className="cursor-pointer hover:text-green-600" />
          <HiThumbDown className="cursor-pointer hover:text-red-600" />
        </div>
      </div>
    </div>
  );
}

export default VerComentario;
