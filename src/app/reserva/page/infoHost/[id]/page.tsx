"use client";

import { useEffect, useState } from "react";
import PerfilHost from "@/app/reserva/components/componentes_InfoHost_Recode/infoHost/perfilHost";
import TarjetaCar from "@/app/reserva/components/componentes_InfoHost_Recode/tarjetasAutos/tarjetaAuto";
import { getDetalleHost_Recode } from "@/app/reserva/services/services_reserva";
import { useParams } from "next/navigation";
//import { HiArrowCircleRight, HiArrowCircleLeft } from "react-icons/hi";
import { DetalleHost_Recode as DetalleHost } from "@/app/reserva/interface/DetalleHost_Recode";
import Header from "@/components/ui/Header";

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
    const dia = String(fecha.getDate() + 1).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  }

  return (
    <div>
      <div className="sticky top-0 z-50 bg-white shadow overflow-visible">
        <div>
          <Header />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6 items-start p-6 max-w-6xl mx-auto">
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

      <div className="mt-20 relative flex flex-col max-w-6xl mx-auto">
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
      </div>
    </div>
  );
}
