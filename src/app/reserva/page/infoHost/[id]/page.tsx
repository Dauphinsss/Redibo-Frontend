"use client";

import { useEffect, useState } from "react";
import PerfilHost from "@/app/reserva/components/componentes_InfoHost_Recode/infoHost/perfilHost";
import TarjetaCar from "@/app/reserva/components/componentes_InfoHost_Recode/tarjetasAutos/tarjetaAuto";
import { getDetalleHost_Recode } from "@/service/services_Recode";
import { useParams } from "next/navigation";
//import { HiArrowCircleRight, HiArrowCircleLeft } from "react-icons/hi";
import { DetalleHost_Recode as DetalleHost } from "@/app/reserva/interface/DetalleHost_Recode";
import Header from "@/components/ui/Header";
import RatingSummary_Recode from "@/app/reserva/components/componentes_CalificacionesHost_Recode/RatingSummary_Recode";
import ListaReseñas from "@/app/reserva/components/componentes_ComentariosHost_Recode/ListaReseñas";

export default function Page() {
  const params = useParams();
  const id = Number(params?.id);
  const [host, setHost] = useState<DetalleHost | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDetalleHost_Recode(id);
      setHost(data);
    };
    if (id) fetchData();
  }, [id]);

  if (!host) return <p>Cargando...</p>;

  function formatearFecha(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()+1).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const año = fecha.getFullYear();
  return `${dia}/${mes}/${año}`;
  }


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="sticky top-0 z-50 bg-white overflow-visible">
              <div className=" px-4 sm:px-6 lg:px-8 py-7">
                <Header />
              </div>
            </div>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <PerfilHost
          nombreHost={host.nombre}
          fotoPerfil={host.foto}
          fechaNacimiento={formatearFecha(host.edad)}
          generoHost={host.genero}
          ciudadHost={host.ciudad}
          correoHost={host.correo}
          telefono={host.telefono.toString()}
        />
      </div>

      <div className="mt-10 relative">
        <h2 className="text-lg font-semibold mb-4">Mis Autos:</h2>

        {host.autos.length === 0 ? (
          <p>No tiene autos registrados.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto">
            {host.autos.map((auto, index) => (
              <div key={index} className="min-w-[250px] flex-shrink-0">
                <TarjetaCar
                  fotoAuto={auto.imagen} 
                  modeloAuto={auto.modelo}
                  marcaAuto={auto.marca}
                />
              </div>
            ))}
          </div>
        )}
        <div className="mt-10 flex flex-col md:flex-row gap-8 items-start">
          {/* Izquierda: Calificación del host */}
          <div className="w-full md:w-1/3">
            <RatingSummary_Recode
              average={0}
              totalReviews={0}
              distribution={{ 
                5: 0, 
                4: 0, 
                3: 0, 
                2: 0, 
                1: 0 
              }}
            />
          </div>

          {/* Derecha: Comentarios */}
          <div className="w-full md:w-2/3">
            <ListaReseñas />
          </div>
        </div>
      </div>
    </div>
  );
}
