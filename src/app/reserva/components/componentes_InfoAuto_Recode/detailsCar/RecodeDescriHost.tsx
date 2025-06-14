"use client";
import Link from 'next/link';
import { FaStar, FaCar, FaWhatsapp } from 'react-icons/fa';
import { DetalleHost_Recode as DetalleHost } from "@/app/reserva/interface/DetalleHost_Recode";
import { useEffect, useState } from 'react';
import { getDetalleHost_Recode } from '@/app/reserva/services/services_reserva';
import FotoPerfilUsrRecode from '@/app/reserva/components/componentes_InfoAuto_Recode/realizarComentario/fotoPerfilUsrRecode';
interface DescriHostProps {
  nombreHost: string;
  calificacion: number;
  numAuto: number;
  telefono: string
  idHost: number;
}

export default function DescriHost({ 
  nombreHost, 
  calificacion,
  telefono,
  idHost
}: DescriHostProps) {
  const mensaje = `Hola ${nombreHost}, estoy interesado en tu auto publicado en Redibo.`;
  const [host, setHost] = useState<DetalleHost | null>(null);

  useEffect(() => {
      const fetchData = async () => {
        const data = await getDetalleHost_Recode(idHost);
        setHost(data);
      };
  
      if (idHost) fetchData();
    }, [idHost]);
  
    if (!host) return <p>Cargando...</p>;
    
  return (
    <section className="w-full border border-gray-200 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <FotoPerfilUsrRecode imagenUrl={host.foto} ancho={90} alto={90} />
          <div>
            <h3 className="text-lg font-semibold">Conoce a tu host</h3>
            <div className="space-y-1 mt-1">

              <Link href={`/reserva/page/infoHost/${idHost}`} target="_blank"> {/**Para recargar en la misma pagina borrar target */}
                <button className='font-medium'>{nombreHost}</button>
              </Link>
            
              <div className="flex items-center gap-2 text-sm">
                <FaStar className="text-gray-300" />
                <span>{calificacion.toFixed(1)} calificación</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FaCar className="text-gray-500" />
                <span>{host.autos.length} {host.autos.length === 1 ? "auto" : "autos"}</span>
              </div>
            </div>
          </div>
        </div>
        <Link
          href={`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-500 transition"
          >
            <FaWhatsapp /> Contáctalo
          </button>
        </Link>
      </div>
    </section>
  );
}