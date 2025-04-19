import RecodeHeader from '@/components/recodeComponentes/RecodeHeader'
import Autoimag from '@/components/recodeComponentes/RecodeAutoimag'
import InfoPrincipal from '@/components/recodeComponentes/RecodeInfoPrincipal'
import InfoDestacable from '@/components/recodeComponentes/RecodeInfoDestacable'
import DescriHost from '@/components/recodeComponentes/RecodeDescriHost'
import DescripcionAuto from '@/components/recodeComponentes/RecodeDescripcionAuto'
import Reserva from '@/components/recodeComponentes/RecodeReserva'
import Ubicacion from '@/components/recodeComponentes/RecodeUbicacion'
import { getCarById } from '@/service/services_Recode'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; 
  const autoData = await getCarById(resolvedParams.id);
  
  const auto = {
      nombre: `${autoData.marca || "Marca desconocida"} ${autoData.modelo || "Modelo desconocido"}`,
      imagenes: autoData.imagen?.map((img: { id: number, data: string }) => ({
          id: img.id,
          data: img.data,
      })) || [],
      descripcion: `Auto ${autoData.marca || "desconocido"} ${autoData.modelo || "desconocido"} en excelente estado`,
      host: {
          nombre: "Anfitrión Ejemplo",
          calificacion: 4.8,
          autosCount: 3,
      },
      ubicacion: `${autoData.direccion?.calle || "Calle desconocida"}, ${autoData.direccion?.zona || "Zona desconocida"}`,
      precio: autoData.precio_por_dia || "Precio no disponible",
  };
      console.log("el data es: ",autoData.combustiblecarro);
  
    return (
      <>
        <RecodeHeader />
        <main className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 py-6">
            <div className="flex-1">
              <Autoimag 
                imagenes={auto.imagenes} 
                nombre={auto.nombre} 
              />
              
              <InfoPrincipal
                  asientos={5}
                  puertas={4}
                  transmision="Automática"
                  combustible={
                      Array.isArray(autoData.combustiblecarro) && autoData.combustiblecarro.length > 0
                          ? autoData.combustiblecarro[0]?.tipocombustible?.tipo_de_combustible || "No especificado"
                          : "No especificado"
                  }
                  calificacion={4.5}
                  direccion={auto.ubicacion}
              />
              
              <DescripcionAuto 
                descripcion={auto.descripcion} 
              />
              
              <DescriHost 
                nombreHost={auto.host.nombre}
                calificacion={auto.host.calificacion}
                numAuto={auto.host.autosCount}
              />
            </div>
    
            <div className="lg:w-1/3">
              <div className="sticky top-4 flex flex-col gap-4">
                <InfoDestacable 
                    marca={autoData.marca}
                    modelo={autoData.modelo}
                    combustible={autoData.combustiblecarro}
                    placa={''}                  
                />
                
                <Reserva 
                  precio={auto.precio} 
                />
              </div>
            </div>
          </div>
          
          <div className="w-full max-w-6xl border-t border-gray-300 lg:hidden py-4">
            <Ubicacion direccion={auto.ubicacion} />
          </div>
        </main>
      </>
    );
  }