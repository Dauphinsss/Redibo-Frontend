"use client";
import { IdCardIcon } from 'lucide-react';
import Link from 'next/link';
import { FaUserCircle, FaStar, FaCar, FaWhatsapp } from 'react-icons/fa';
import { DetalleHost_Recode as DetalleHost } from "@/interface/DetalleHost_Recode";
import { useEffect, useState } from 'react';
import { getDetalleHost_Recode } from '@/service/services_Recode';
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
  numAuto, 
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
          <FaUserCircle className="w-12 h-12 text-gray-400" />
          <div>
            <h3 className="text-lg font-semibold">Conoce a tu host</h3>
            <div className="space-y-1 mt-1">

              <Link href={`/infoHost/${idHost}`} target="_blank"> {/**Para recargar en la misma pagina borrar target */}
                <button className='font-medium'>{nombreHost}</button>
              </Link>
            
              <div className="flex items-center gap-2 text-sm">
                <FaStar className="text-gray-300" />
                <span>{calificacion.toFixed(1)} calificación</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FaCar className="text-gray-500" />
                <span>{host.autos.length} autos</span>
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