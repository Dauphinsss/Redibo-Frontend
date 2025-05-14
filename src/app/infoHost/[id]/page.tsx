"use client";

import { useEffect, useState } from "react";
import PerfilHost from "@/components/recodeComponentes/perfilHost/infoHost/perfilHost";
import TarjetaCar from "@/components/recodeComponentes/perfilHost/tarjetasAutos/tarjetaAuto";
import { getDetalleHost_Recode } from "@/service/services_Recode";
import { useParams } from "next/navigation";
//import { HiArrowCircleRight, HiArrowCircleLeft } from "react-icons/hi";
import { DetalleHost_Recode as DetalleHost } from "@/interface/DetalleHost_Recode";

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
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <PerfilHost
          nombreHost={host.nombre}
          fotoPerfil={""}
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
            {host.autos.map((autos, index) => (
              <div key={index} className="min-w-[250px] flex-shrink-0">
                <TarjetaCar
                  fotoAuto={autos.imagen} 
                  modeloAuto={autos.modelo}
                  marcaAuto={autos.marca}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
