import { getCarById , getCarRatingsFromComments,getCarRatingsFromAuto} from '@/service/services_Recode'
import NotFound from '@/app/not-found'
import { transformAutoDetails_Recode } from '@/utils/transformAutoDetails_Recode'
import { notFound } from 'next/navigation';
import Home from '@/app/infoAuto_Recode/[id]/Home';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const autoData = await getCarById(id);
  
  if (!autoData) NotFound();

  const auto = transformAutoDetails_Recode(autoData);
  const calificacionesAuto = await getCarRatingsFromAuto(id);
  const calificacionesComentarios = await getCarRatingsFromComments(id);
  const numComentarios = calificacionesComentarios.filter(c => c > 0).length; 
  const comentariosConCalificacion = calificacionesComentarios.filter(c => c > 0);
  const calificaciones = [...calificacionesAuto, ...calificacionesComentarios];

   const mostrarpagina = true;
  if(!mostrarpagina) {
    return notFound();
  }
  
    return (
      <Home
        id={id}
        auto={auto} 
        calificaciones={calificaciones}
        numComentarios={numComentarios}
        comentariosConCalificacion={comentariosConCalificacion}
      />
    );
}