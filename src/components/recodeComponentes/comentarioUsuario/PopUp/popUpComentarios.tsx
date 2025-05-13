"use client";

import { useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import FotoPerfilUsrRecode from "../realizarComentario/fotoPerfilUsrRecode";
import CalificacionRecode from "../../calificacionAuto/calificacionRecode";
import Autoimag from "../../detailsCar/RecodeAutoimag";
import FiltroGenerico from "../filtrosComentariosRecode.tsx/filtroGenerico";
import VerComentario from "../verComentario/verComentarioRecode";

import { useComentariosAuto } from "@/hooks/useComentario_hook_Recode";

interface Props {
  idCar: string;
  nombreCompleto: string;
  fotoHost: string;
  modeloAuto: string;
  marcaAuto: string;
 calificaciones: number[];
  numComentarios: number;
  comentariosConCalificacion: number[];
  imagenes: { id: number; data: string }[];
  nombreUser: string;
  fotoUser: string;
  fechaComentario: string;
  comentario: string;
  calificacionUsr: number;
}

function PopUpComentarios({
  idCar,
  nombreCompleto,
  fotoHost,
  modeloAuto,
  marcaAuto,
  calificaciones,
  numComentarios,
  comentariosConCalificacion,
  imagenes,
  nombreUser,
  fotoUser,
  fechaComentario,
  comentario,
  calificacionUsr,

}: Props) {
  const [popUpOpen, setPopUpOpen] = useState(false);
  const ordenar = ["Mejor Calificación", "Peor Calificación", "Más valorado", "Menos valorado"];
  
  const closePopup = () => setPopUpOpen(false);
  const openPopup = () => setPopUpOpen(true);
  
  const { comentarios, cargando, error } = useComentariosAuto(Number(idCar));

  function formatearFecha(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const año = fecha.getFullYear();
  return `${dia}/${mes}/${año}`;
  }

  return (
    <div>
      <button onClick={openPopup} className="bg-black text-white px-4 py-2 rounded">
        Comentarios
      </button>

      {popUpOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/20 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full relative">
            
            <button
              className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-black z-10"
              onClick={closePopup}
            >
              <HiOutlineX />
            </button>

            <div
              className="overflow-y-auto px-6 pb-6"
              style={{
                maxHeight: "calc(120vh - 160px)", // Altura máxima ajustable parte de 120vh
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              <div className="flex items-center space-x-3 mb-4 mt-6">
                <FotoPerfilUsrRecode imagenUrl={fotoHost} ancho={40} alto={40} />
                <h2 className="font-semibold text-lg">{nombreCompleto}</h2>
              </div>

              <div className="mb-4">
                <Autoimag imagenes={imagenes} nombre={modeloAuto} />
              </div>

              <div className="mb-4">
                <CalificacionRecode  
                 calificaciones={calificaciones}
               numComentarios={numComentarios} 
               comentariosConCalificacion={comentariosConCalificacion}/>
              </div>

              <div className="mb-4">
                <FiltroGenerico lista={ordenar} tipo={"Ordenar por:"} />
              </div>

              <div className="space-y-4">
                {cargando && <p>Cargando comentarios...</p>}
                {error && <p>{error}</p>}
                {!cargando && comentarios.length === 0 && <p>No hay comentarios disponibles.</p>}

                {comentarios.map((comentario) => (
                  <VerComentario
                    key={comentario.id}
                    nombreCompleto={comentario.Usuario.nombre}
                    fotoUser={fotoUser}
                    fechaComentario={formatearFecha(comentario.comentado_en)}
                    comentario={comentario.contenido}
                    calificacionUsr={comentario.Calificacion.calf_carro}
                    cantDontlikes={comentario.dont_likes}
                    cantLikes={comentario.likes}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PopUpComentarios;
