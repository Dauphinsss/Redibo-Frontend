"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { AutoCard_Interfaces_Recode as Auto } from "@/interface/AutoCard_Interface_Recode";
import ImagenUpload from "@/components/recodeComponentes/cobertura/ImagenUpload";
import CarCardHeader from "@/components/recodeComponentes/carCard/CarCardHeaderRecode";

export type RecodeCarCardProps = Auto;
//esto
function RecodeCarCard(props: Auto) {
  const { idAuto, modelo, marca, imagenURL } = props;
  const router = useRouter();
  console.log("RecodeCarCard props:", props);

  const handleVerCobertura = () => {
    router.push(`/imagenUpload?id=${idAuto}`);
  };

  const handleValidarCobertura = () => {
    if (!imagenURL || imagenURL.trim() === "") {
      alert("Primero debe acreditarse (subir una imagen) para validar cobertura.");
      return;
    }
    router.push(`/formularioCobertura_Recode?id=${idAuto}`);
  };

  return (
    <div className="w-full max-w-[750px] border border-black rounded-[15px] p-4 shadow-sm bg-white flex flex-col items-center gap-4">

      <div className="w-full md:w-[230px] flex items-center justify-center">
        <ImagenUpload imagen={imagenURL} />
      </div>

      <CarCardHeader nombre={modelo} marca={marca} />

      <div className="flex gap-4">
        <button
          onClick={handleVerCobertura}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-300"
        >
          Acreditar
        </button>
        <button
          onClick={handleValidarCobertura}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-300"
        >
          Validar cobertura
        </button>
      </div>
    </div>
  );
}

export default memo(RecodeCarCard);
