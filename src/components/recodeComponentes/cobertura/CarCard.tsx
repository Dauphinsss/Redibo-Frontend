"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { AutoCard_Interfaces_Recode as Auto } from "@/interface/AutoCard_Interface_Recode";
import CarCardImg from "@/components/recodeComponentes/carCard/CarCardImgRecode";
import CarCardHeader from "@/components/recodeComponentes/carCard/CarCardHeaderRecode";


export type RecodeCarCardProps = Auto;

function RecodeCarCard(props: Auto) {
  const { idAuto, modelo, marca, imagenURL } = props;
  const router = useRouter();

  const handleVerCobertura = () => {
    router.push(`/imagenUpload?id=${idAuto}`);
  };

  const handleFormularioCondicionUso = () => {
    router.push(`/condicionUsoAuto/${idAuto}`);
  };

  const handleValidarCobertura = async () => {
    
      router.push(`/formularioCobertura_Recode/${idAuto}`);
    
  };

  return (
    <div className="w-full max-w-[750px] border border-black rounded-[15px] p-4 shadow-sm bg-white flex flex-col items-center gap-4">
      <div className="w-full md:w-[230px] flex items-center justify-center">
        <CarCardImg imagenUrl={imagenURL} />
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

        <button
          onClick={handleFormularioCondicionUso}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-300"
        >
          Condiciones de uso
        </button>
      </div>
    </div>
  );
}

export default memo(RecodeCarCard);
