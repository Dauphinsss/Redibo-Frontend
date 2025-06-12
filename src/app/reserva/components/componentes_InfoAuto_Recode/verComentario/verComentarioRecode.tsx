"use client";
import FotoPerfilUsr from "@/app/reserva/components/componentes_InfoAuto_Recode/realizarComentario/fotoPerfilUsrRecode";
import { FaStar } from "react-icons/fa";
import { HiOutlineChat, HiThumbUp, HiThumbDown } from "react-icons/hi";
import { useState } from "react";

interface Respuesta {
  id: number;
  comentado_en: string;
  respuesta: string;
  host: {
    nombre: string;
  };
}

interface Props {
  idComentario: number;
  idUsuarioComentario: number;
  userId: number;
  nombreCompleto: string;
  fotoUser: string;
  fechaComentario: string;
  comentario: string;
  calificacionUsr: number;
  cantLikes: number;
  cantDontlikes: number;
  onEliminar?: (id: number) => void;
  onResponder?: (comentarioId: number, respuesta: string) => void;
  respuestas?: Respuesta[];
}

function VerComentario({
  idComentario,
  idUsuarioComentario,
  userId,
  nombreCompleto,
  fotoUser,
  fechaComentario,
  comentario,
  calificacionUsr,
  cantLikes,
  cantDontlikes,
  onEliminar,
  onResponder,
  respuestas,
}: Props) {
  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);
  const [respuestaTexto, setRespuestaTexto] = useState("");

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

        {/* <div className="text-sm text-right md:text-left">
          <p>{fechaComentario}</p>
          {userId === idUsuarioComentario && (
            <button
              onClick={() => {
                const confirmacion = confirm(
                  "¿Deseas eliminar este comentario?"
                );
                if (confirmacion && onEliminar) onEliminar(idComentario);
              }}
              className="text-red-600 text-sm hover:underline"
            >
              Eliminar
            </button>
          )}
        </div> */}
      </div>

      <p className="mt-4 mb-4">{comentario}</p>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <button
          onClick={() => setMostrarRespuesta(!mostrarRespuesta)}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 rounded-lg self-start sm:self-auto"
        >
          <HiOutlineChat />
          Responder
        </button>

        {mostrarRespuesta && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (respuestaTexto.trim().length === 0) return;
              if (onResponder) onResponder(idComentario, respuestaTexto);
              setRespuestaTexto("");
              setMostrarRespuesta(false);
            }}
            className="mt-2 w-full"
          >
            <textarea
              className="w-full p-2 border rounded text-sm"
              placeholder="Escribe tu respuesta..."
              value={respuestaTexto}
              onChange={(e) => setRespuestaTexto(e.target.value)}
              rows={2}
            />
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Enviar respuesta
              </button>
            </div>
          </form>
        )}

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

      {/* Respuestas */}
      {(respuestas?.length ?? 0) > 0 && (
        <div className="mt-4 border-t pt-2 space-y-2">
            <p className="font-bold">Respuestas:</p>
          {(respuestas ?? []).map((respuesta) => (
            <div key={respuesta.id} className="pl-4 border-l-2 border-gray-300">
              <p className="text-sm font-medium text-gray-800">
                ↳ {respuesta.host.nombre}
              </p>
              <p className="text-sm text-gray-700">{respuesta.respuesta}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VerComentario;
