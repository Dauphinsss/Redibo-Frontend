'use client';

import { useEffect, useState } from 'react';
import {
  getCarById,
  getCarRatingsFromAuto,
  getCarRatingsFromComments
} from '@/service/services_Recode';
import { transformAutoDetails_Recode } from '@/utils/transformAutoDetails_Recode';
import { AutoDetails_interface_Recode } from '@/interface/AutoDetails_interface_Recode';

import RecodeHeader from '@/components/recodeComponentes/detailsCar/RecodeHeader';
import Autoimag from '@/components/recodeComponentes/detailsCar/RecodeAutoimag';
import InfoPrincipal from '@/components/recodeComponentes/detailsCar/RecodeInfoPrincipal';
import InfoDestacable from '@/components/recodeComponentes/detailsCar/RecodeInfoDestacable';
import DescriHost from '@/components/recodeComponentes/detailsCar/RecodeDescriHost';
import DescripcionAuto from '@/components/recodeComponentes/detailsCar/RecodeDescripcionAuto';
import Reserva from '@/components/recodeComponentes/detailsCar/RecodeReserva';
import CalificaionRecode from '@/components/recodeComponentes/calificacionAuto/calificacionRecode';
import PopUpComentarios from '@/components/recodeComponentes/comentarioUsuario/PopUp/popUpComentarios';
import { useComentariosAuto } from '@/hooks/useComentario_hook_Recode';
import VerComentario from '@/components/recodeComponentes/comentarioUsuario/verComentario/verComentarioRecode';

interface HomeProps {
  id: string;
}

export default function Home({ id }: HomeProps) {
  const [auto, setAuto] = useState<AutoDetails_interface_Recode | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [calificaciones, setCalificaciones] = useState<number[]>([]);
  const [numComentarios, setNumComentarios] = useState(0);
  const [comentariosConCalificacion, setComentariosConCalificacion] = useState<number[]>([]);
  const [filtroCalificacion, setFiltroCalificacion] = useState<number | null>(null);
 const promedioCalificacion = calificaciones.length > 0
  ? (calificaciones.reduce((acc, cal) => acc + cal, 0) / calificaciones.length).toFixed(1)
  : "0.0";  
  
  const [ordenSeleccionado] = useState("Más reciente");

  const {
  comentariosFiltrados,
  formatearFecha
  } = useComentariosAuto(Number(id), filtroCalificacion, ordenSeleccionado);

  useEffect(() => {
    (async () => {
      const data = await getCarById(id);
      const autoTransformado = transformAutoDetails_Recode(data);
      setAuto(autoTransformado);

      const ratingsAuto = await getCarRatingsFromAuto(id);
      const ratingsComments = await getCarRatingsFromComments(id);

      setCalificaciones([...ratingsAuto, ...ratingsComments]);
      setComentariosConCalificacion(ratingsComments.filter((c) => c > 0));
      setNumComentarios(ratingsComments.filter((c) => c > 0).length);
      setLoaded(true);
    })();
  }, [id]);

  if (!loaded || !auto) return null;

  return (
    <>
      <RecodeHeader />
      <main className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 py-6">
          <div className="flex-1">
            <Autoimag imagenes={auto.imagenes} nombre={auto.modelo} />

            <InfoPrincipal
              asientos={5}
              puertas={4}
              transmision={auto.transmision}
              combustible={auto.combustibles.join(', ')}
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
                comentariosConCalificacion={comentariosConCalificacion}
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
                comentariosConCalificacion={comentariosConCalificacion}
                onBarClick={setFiltroCalificacion}
              />
            </div>

            <div className="mt-6 mb-4 space-y-4">
              {comentariosFiltrados.map((comentario) => (
                <div key={comentario.id} className="p-3">
                  <VerComentario
                    nombreCompleto={comentario.Usuario.nombre}
                    fotoUser=""
                    fechaComentario={formatearFecha(comentario.comentado_en)}
                    comentario={comentario.contenido}
                    calificacionUsr={comentario.Calificacion?.calf_carro ?? 0}
                    cantDontlikes={comentario.dont_likes ?? 0}
                    cantLikes={comentario.likes ?? 0}
                  />
                </div>
              ))}
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
