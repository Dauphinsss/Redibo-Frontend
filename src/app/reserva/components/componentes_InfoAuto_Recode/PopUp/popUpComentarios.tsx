"use client";

import { useState, useEffect } from "react";
import { HiOutlineX } from "react-icons/hi";
import FotoPerfilUsrRecode from "@/app/reserva/components/componentes_InfoAuto_Recode/realizarComentario/fotoPerfilUsrRecode";
import CalificacionRecode from "@/app/reserva/components/componentes_InfoAuto_Recode/calificacionAuto/calificacionRecode";
import Autoimag from "@/app/reserva/components/componentes_InfoAuto_Recode/detailsCar/RecodeAutoimag";
import VerComentario from "@/app/reserva/components/componentes_InfoAuto_Recode/verComentario/verComentarioRecode";

import { useComentariosAuto } from "@/app/reserva/hooks/useComentario_hook_Recode";
import RecodeFilter from "@/app/busqueda/components/seccionOrdenarMasResultados/RecodeFilter";

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
}

function PopUpComentarios({
  idCar,nombreCompleto,fotoHost,modeloAuto,calificaciones,
  numComentarios,comentariosConCalificacion,imagenes}: Props) {
    
  const [popUpOpen, setPopUpOpen] = useState(false);
  const ordenar = ["Mejor Calificación","Peor Calificación","Más valorado","Menos valorado","Más reciente","Más antiguo"];
  const [ordenSeleccionado, setOrdenSeleccionado] = useState("Más reciente");


  
  const closePopup = () => setPopUpOpen(false);
  const openPopup = () => setPopUpOpen(true);

  const [filtroCalificacion, setFiltroCalificacion] = useState<number | null>(null);
  useEffect(() => {
  }, [filtroCalificacion]);

  const { 
    comentariosFiltrados, 
    cargando, 
    error, 
    formatearFecha 
  } = useComentariosAuto(Number(idCar), filtroCalificacion, ordenSeleccionado);

  return (
    
    <div>
      <button onClick={openPopup} className="bg-black text-white px-4 py-2 rounded">
        Comentarios
      </button>

      {popUpOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/20 backdrop-blur-sm flex justify-center items-center z-50" onClick={closePopup} >
          <div className="bg-white rounded-lg max-w-md w-full relative" onClick={(e) => e.stopPropagation()} >
            
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
                  comentariosConCalificacion={comentariosConCalificacion}
                  onBarClick={setFiltroCalificacion}
                />
              </div>

              <div className="mb-4">
                <RecodeFilter lista={ordenar} nombre={"Ordenar por:"} onChange={(valor) => setOrdenSeleccionado(valor)}/>
              </div>

              <div className="space-y-4">
                {cargando && <p>Cargando comentarios...</p>}
                {error && <p>{error}</p>}
                {!cargando && comentariosFiltrados.length === 0 && <p>No hay comentarios disponibles.</p>}

                {comentariosFiltrados
                  //.filter((comentario) => comentario.Calificacion !== null)         para filtrar comentarios sin calificacion
                  .map((comentario) => (
                  <div key={comentario.id} className="p-2 ">
                    {/* <VerComentario
                      nombreCompleto={comentario.Usuario.nombre}
                      fotoUser={""}
                      fechaComentario={formatearFecha(comentario.comentado_en)}
                      comentario={comentario.contenido}
                      calificacionUsr={comentario.Calificacion?.calf_carro ?? 0}
                      cantDontlikes={comentario.dont_likes ?? 0}
                      cantLikes={comentario.likes ?? 0}
                    /> */}
                  </div>
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
