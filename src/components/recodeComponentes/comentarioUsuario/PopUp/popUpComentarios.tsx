"use client";

import { useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import FotoPerfilUsrRecode from "../realizarComentario/fotoPerfilUsrRecode";
import CalificacionRecode from "../../calificacionAuto/calificacionRecode";
import Autoimag from "../../detailsCar/RecodeAutoimag";
import FiltroGenerico from "../filtrosComentariosRecode.tsx/filtroGenerico";
import VerComentario from "../verComentario/verComentarioRecode";

interface Props {
  nombreCompleto: string;
  fotoHost: string;
  modeloAuto: string;
  marcaAuto: string;
  calificaciones: number[];
  imagenes: { id: number; data: string }[];

  nombreUser: string;
  fotoUser: string;
  fechaComentario: string;
  comentario: string;
  calificacionUsr: number;
}

function PopUpComentarios({nombreCompleto,fotoHost,modeloAuto,marcaAuto,calificaciones,imagenes,
                           nombreUser,fotoUser,fechaComentario,comentario,calificacionUsr}: Props) {
  const [popUpOpen, setPopUpOpen] = useState(false);
  const ordenar = ["Mejor Calificación", "Peor Calificación", "Más valorado", "Menos valorado"];

  const closePopup = () => setPopUpOpen(false);
  const openPopup = () => setPopUpOpen(true);

  return (
    <div>
      <button onClick={openPopup} className="bg-black text-white px-4 py-2 rounded">
        Comentarios
      </button>

      {popUpOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative overflow-y-auto max-h-[90vh]">
            
            <button className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-black" onClick={closePopup}>
              <HiOutlineX />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <FotoPerfilUsrRecode imagenUrl={fotoHost} ancho={40} alto={40} />
              <h2 className="font-semibold text-lg">{nombreCompleto}</h2>
            </div>

           
            <div className="text-center mb-4">
              <h3 className="text-md font-medium">
                {modeloAuto}, <span className="text-black">{marcaAuto}</span>
              </h3>
            </div>

            <div className="mb-4 ">
              <Autoimag imagenes={imagenes} nombre={modeloAuto} />
            </div>

            <div className="mb-4">
              <CalificacionRecode calificaciones={calificaciones} />
            </div>

            <div className="mb-4">
              <FiltroGenerico lista={ordenar} tipo={"Ordenar por:"} />
            </div>

            <div className="space-y-4">
              <VerComentario
                nombreCompleto={nombreUser}
                fotoUser={fotoUser}
                fechaComentario={fechaComentario}
                comentario={comentario}
                calificacionUsr={calificacionUsr}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PopUpComentarios;
