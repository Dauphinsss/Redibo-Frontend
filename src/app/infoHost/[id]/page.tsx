"use client";

import PerfilHost from "@/components/recodeComponentes/perfilHost/infoHost/perfilHost";
import TarjetaCar from "@/components/recodeComponentes/perfilHost/tarjetasAutos/tarjetaAuto";
import { notFound } from "next/navigation";
import { DetalleHost } from "@/interface/DetalleHost_Recode";
import { HiArrowCircleRight, HiArrowCircleLeft } from "react-icons/hi";
import { useRef } from "react";

export default async function Page({ params }: { params: { id: string } }) {
  const id_host = Number(params.id);

  if (isNaN(id_host) || id_host <= 0) {
    notFound();
  }

  const response = await fetch(`https://search-car-backend.vercel.app/detailHost/${id_host}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    notFound();
  }

  const data: DetalleHost = await response.json();

  return <HostPerfilConCarrusel data={data} />;
}

function HostPerfilConCarrusel({ data }: { data: DetalleHost }) {
  const carruselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (carruselRef.current) {
      const amount = 300;
      carruselRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <PerfilHost
          nombreHost={data.nombre}
          fotoPerfil={data.foto}
          fechaNacimiento={data.fecha_nacimiento}
          generoHost={data.genero}
          ciudadHost={data.Ciudad.nombre}
          correoHost={data.correo}
          telefono={data.telefono.toString()}
        />
      </div>

      <div className="mt-10 relative">
        <h2 className="text-lg font-semibold mb-4">Mis Autos:</h2>

        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow hover:bg-gray-200"
        >
          <HiArrowCircleLeft size={36} />
        </button>

        <div
          ref={carruselRef}
          className="flex overflow-x-auto gap-4 pb-4 px-10 scroll-smooth no-scrollbar"
        >
          {data.Carro.map((carro, index) => (
            <div key={index} className="min-w-[250px] flex-shrink-0">
              <TarjetaCar
                fotoAuto={[]}
                modeloAuto={carro.modelo}
                marcaAuto={carro.marca}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow hover:bg-gray-200"
        >
          <HiArrowCircleRight size={36} />
        </button>
      </div>
    </div>
  );
}
