"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getCarById,
  getTotalCommentsCount,
  getCarRatingsFromComments,
} from "@/app/reserva/services/services_reserva";
import { transformAutoDetails_Recode } from "@/app/reserva/utils/transformAutoDetails_Recode";
import { AutoDetails_interface_Recode } from "@/app/reserva/interface/AutoDetails_interface_Recode";
import Header from "@/components/ui/Header";

import Autoimag from "@/app/reserva/components/componentes_InfoAuto_Recode/detailsCar/RecodeAutoimag"; //@/components/recodeComponentes/detailsCar/RecodeAutoimag
import InfoPrincipal from "@/app/reserva/components/componentes_InfoAuto_Recode/detailsCar/RecodeInfoPrincipal";
import InfoDestacable from "@/app/reserva/components/componentes_InfoAuto_Recode/detailsCar/RecodeInfoDestacable";
import DescriHost from "@/app/reserva/components/componentes_InfoAuto_Recode/detailsCar/RecodeDescriHost";
import DescripcionAuto from "@/app/reserva/components/componentes_InfoAuto_Recode/detailsCar/RecodeDescripcionAuto";
import Reserva from "@/app/reserva/components/componentes_InfoAuto_Recode/detailsCar/RecodeReserva";
import CalificaionRecode from "@/app/reserva/components/componentes_InfoAuto_Recode/calificacionAuto/calificacionRecode";
import PopUpComentarios from "@/app/reserva/components/componentes_InfoAuto_Recode/PopUp/popUpComentarios"; //@/app/busqueda/homeBuscador_Recode/components/PopUp/popUpComentarios
import { useComentariosAuto } from "@/app/reserva/hooks/useComentario_hook_Recode";
import VerComentario from "@/app/reserva/components/componentes_InfoAuto_Recode/verComentario/verComentarioRecode";
import CrearComentario from "@/app/reserva/components/componentes_Comentarios_Calificaciones_Bughunters/CrearComentario"; //@/app/reserva/components/componentes_Comentarios_Calificaciones_Bughunters/CrearComentario_Recode
import CrearCalificacion from "@/app/reserva/components/componentes_Comentarios_Calificaciones_Bughunters/CrearCalificacion";

interface HomeProps {
  id: string;
}

export default function Home({ id }: HomeProps) {
  const router = useRouter();
  const [auto, setAuto] = useState<AutoDetails_interface_Recode | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [calificaciones, setCalificaciones] = useState<number[]>([]);
  const [numComentarios, setNumComentarios] = useState(0);

  const [filtroCalificacion, setFiltroCalificacion] = useState<number | null>(
    null
  );

  const promedioCalificacion =
    calificaciones.length > 0
      ? (
          calificaciones.reduce((acc, cal) => acc + cal, 0) /
          calificaciones.length
        ).toFixed(1)
      : "0.0";

  const [ordenSeleccionado] = useState("Más reciente");

  function getUserIdFromStorage(): number {
    const id = localStorage.getItem("user_id");
    return id ? Number(id) : 0;
  }

  const [userId, setUserId] = useState<number>(0);

  const { comentariosFiltrados, formatearFecha, refetchComentarios } =
    useComentariosAuto(Number(id), filtroCalificacion, ordenSeleccionado);

  useEffect(() => {
    setUserId(getUserIdFromStorage());

    (async () => {
      const data = await getCarById(id);
      const autoTransformado = transformAutoDetails_Recode(data);
      setAuto(autoTransformado);
      const ratingsComments = await getCarRatingsFromComments(id);
      const totalComments = await getTotalCommentsCount(id);

      setCalificaciones(ratingsComments);
      setNumComentarios(totalComments);

      setLoaded(true);
    })();
  }, [id]);

  if (!loaded || !auto) return null;

  const handleEliminarComentario = async (idComentario: number) => {
    const confirmacion = confirm(
      "¿Seguro que deseas eliminar este comentario?"
    );
    if (!confirmacion) return;

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(
        `${API_URL}/api/comentarios-carro/${idComentario}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      if (!res.ok) throw new Error("No se pudo eliminar el comentario");

      await refetchComentarios();
    } catch (err) {
      console.error("Error al eliminar comentario:", err);
      alert("Error al eliminar comentario.");
    }
  };

  const handleResponderComentario = async (
    comentarioId: number,
    respuesta: string
  ) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${API_URL}/api/comentarios-carro/respuestas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({ id_comentario: comentarioId, respuesta }),
      });

      if (!res.ok) throw new Error("No se pudo enviar la respuesta");

      await refetchComentarios(); // o actualizás el estado si lo estás manejando
    } catch (err) {
      console.error("Error al responder comentario:", err);
      alert("Hubo un problema al enviar tu respuesta.");
    }
  };

  return (
    <>
      <Header />
      <main className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 py-6">
          <div className="flex-1">
            <Autoimag imagenes={auto.imagenes} nombre={auto.modelo} />

            <InfoPrincipal
              asientos={5}
              puertas={4}
              transmision={auto.transmision}
              combustible={auto.combustibles.join(", ")}
              calificacion={promedioCalificacion}
              numComentario={numComentarios}
              direccion={`${auto.ciudad}, ${auto.calle}`}
            />

            <DescripcionAuto descripcion={auto.descripcion} />

            <div className="mt-4 mb-4 flex justify-end">
              <PopUpComentarios
                idCar={id}
                nombreCompleto={auto.nombreHost}
                fotoHost=""
                modeloAuto={auto.modelo}
                marcaAuto={auto.marca}
                calificaciones={calificaciones}
                numComentarios={numComentarios}
                imagenes={auto.imagenes}
                nombreUser=""
                fotoUser=""
              />
            </div>
            <DescriHost
              idHost={auto.idHost}
              nombreHost={auto.nombreHost}
              calificacion={4.5}
              numAuto={1}
              telefono={auto.telefonoHost}
            />

            <div className="mt-6">
              <CalificaionRecode
                calificaciones={calificaciones}
                numComentarios={numComentarios}
                onBarClick={setFiltroCalificacion}
              />
            </div>

            <div className="mt-6 mb-4 space-y-4">
              {comentariosFiltrados.map((comentario) => (
                <div key={comentario.id} className="p-3">
                  <VerComentario
                    idComentario={comentario.id}
                    idUsuarioComentario={comentario.usuario.id}
                    userId={userId}
                    onEliminar={() => {}}
                    onResponder={handleResponderComentario}
                    nombreCompleto={comentario.usuario.nombre}
                    fotoUser={
                      "foto" in comentario.usuario
                        ? String(comentario.usuario.foto)
                        : ""
                    }
                    fechaComentario={formatearFecha(comentario.fecha_creacion)}
                    comentario={comentario.comentario}
                    calificacionUsr={comentario.calificacion ?? 0}
                    cantDontlikes={comentario.dont_likes ?? 0}
                    cantLikes={comentario.likes ?? 0}
                    respuestas={comentario.respuestas.map((r) => ({
                      id: r.id,
                      comentado_en: r.comentado_en,
                      respuesta: r.respuesta,
                      host: r.host,
                    }))}
                  />
                </div>
              ))}
            </div>

            <div className="mt-8">
              {/* <h2 className="text-xl font-bold mb-4">Escribe tu comentario</h2>
              <CrearComentario
                id_carro={Number(id)}
                onComentarioCreado={refetchComentarios}
              /> */}
              <div className="mt-8 space-y-6">
                <CrearComentario
                  id_carro={Number(id)}
                  onComentarioCreado={refetchComentarios}
                />
                <CrearCalificacion
                  id_carro={Number(id)}
                  onCalificacionActualizada={refetchComentarios}
                />
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="sticky top-4 flex flex-col gap-4">
              <InfoDestacable
                marca={auto.marca}
                modelo={auto.modelo}
                anio={auto.anio}
                soat={auto.soat}
              />
              <Reserva id={id} precio={auto.precio} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
