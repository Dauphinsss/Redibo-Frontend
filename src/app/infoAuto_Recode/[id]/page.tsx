import RecodeHeader from '@/components/recodeComponentes/detailsCar/RecodeHeader'
import Autoimag from '@/components/recodeComponentes/detailsCar/RecodeAutoimag'
import InfoPrincipal from '@/components/recodeComponentes/detailsCar/RecodeInfoPrincipal'
import InfoDestacable from '@/components/recodeComponentes/detailsCar/RecodeInfoDestacable'
import DescriHost from '@/components/recodeComponentes/detailsCar/RecodeDescriHost'
import DescripcionAuto from '@/components/recodeComponentes/detailsCar/RecodeDescripcionAuto'
import Reserva from '@/components/recodeComponentes/detailsCar/RecodeReserva'
import { getCarById } from '@/service/services_Recode'
import NotFound from '@/app/not-found'
import { transformAutoDetails_Recode } from '@/utils/transformAutoDetails_Recode'
import CalificaionRecode from '@/components/recodeComponentes/calificacionAuto/calificacionRecode'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const autoData = await getCarById(id);

  if (!autoData) NotFound();

  const auto = transformAutoDetails_Recode(autoData);

  return (
    <>
      <RecodeHeader />
      <main className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 py-6">
          <div className="flex-1">
            <Autoimag 
              imagenes={auto.imagenes} 
              nombre={auto.modelo}/>
            <InfoPrincipal
              asientos={5}
              puertas={4}
              transmision={auto.transmision}
              combustible={auto.combustibles.join(', ')}
              calificacion={4.5}
              direccion={`${auto.ciudad}, ${auto.calle}`}
            />
            <DescripcionAuto descripcion={auto.descripcion} />
            <DescriHost
              nombreHost={auto.nombreHost}
              calificacion={4.5}
              numAuto={1} 
              telefono={auto.telefonoHost}
            />
            <div className="mt-6"  >
                <CalificaionRecode 
                  promedio={4.0} 
                  total={150.2} 
                  porcentajes={[80, 60, 40, 20, 10]}
                />
            </div >
          </div>
          
          <div className="lg:w-1/3">
            <div className="sticky top-4 flex flex-col gap-4">
              <InfoDestacable
                marca={auto.marca}
                modelo={auto.modelo}
                anio={auto.anio}
                soat={auto.soat}
              />
              <Reserva precio={auto.precio} />
            </div>
          </div>
          

        </div>
      </main>
    </>
  );
}