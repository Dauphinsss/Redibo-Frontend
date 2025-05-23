"use client";
import FotoPerfilUsr from "@/app/reserva/components/componentes_InfoAuto_Recode/realizarComentario/fotoPerfilUsrRecode";
import { FaStar } from "react-icons/fa";
import { HiOutlineChat, HiThumbUp, HiThumbDown } from "react-icons/hi";

interface Props {
  nombreCompleto: string;
  fotoUser: string;
  fechaComentario: string;
  comentario: string;
  calificacionUsr: number;
  cantLikes: number;
  cantDontlikes: number;
}

function VerComentario({nombreCompleto, fotoUser, fechaComentario, comentario, calificacionUsr,cantLikes,cantDontlikes}: Props) {
  
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

      {/*<div className="flex items-center space-x-2 text-sm self-start sm:self-auto">
        <span>¿Te resultó útil esta opinión?</span>
          <HiThumbUp className="cursor-pointer text-gray-400 hover:text-gray-600" ></HiThumbUp>
          <HiThumbDown className="cursor-pointer text-gray-400 hover:text-gray-600"></HiThumbDown>
      </div>*/}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 ">
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 rounded-lg self-start sm:self-auto">{/*hover:bg-stone-300*/}
          <HiOutlineChat />
          Comentar
        </button>

        <div className="flex items-center space-x-2 text-sm self-start sm:self-auto">

          <div className="flex items-center gap-1 cursor-pointer text-gray-400 hover:text-gray-600">
            <HiThumbUp />
            <span>{cantLikes}</span>
          </div>

          <div className="flex items-center gap-1 cursor-pointer text-gray-400 hover:text-gray-600">
            <HiThumbDown />
            <span>{cantDontlikes}</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default VerComentario;