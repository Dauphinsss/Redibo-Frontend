
import PerfilHost from "@/components/recodeComponentes/perfilHost/infoHost/perfilHost";
import TarjetaCar from "@/components/recodeComponentes/perfilHost/tarjetasAutos/tarjetaAuto";

import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: number }> }) {

  const { id } = await params;
  const id_host = id;

  if (isNaN(id_host) || id_host <= 0) {
    notFound();
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <PerfilHost
          nombreHost={"Carlos Pérez"}
          fotoPerfil={""}
          fechaNacimiento={"1988-04-12"}
          generoHost={"Masculino"}
          ciudadHost={"La Paz"}
          correoHost={"carlos@example.com"}
          telefono={"59176543210"}
        />
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">Mis Autos:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <TarjetaCar fotoAuto={[]} modeloAuto={"Civic"} marcaAuto={"Honda"} />
          <TarjetaCar fotoAuto={[]} modeloAuto={"Yaris"} marcaAuto={"Toyota"} />
          <TarjetaCar fotoAuto={[]} modeloAuto={"Focus"} marcaAuto={"Ford"} />
        </div>
      </div>
    </div>
  );
}
