import React, { memo } from "react";

interface Props {
  onClick?: () => void;
}

function CarButton_Recode({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition 조합text-sm font-medium w-full sm:w-auto sm:self-end" // <--- CAMBIOS AQUÍ
    >
      Ver aseguradoras
    </button>
  );
}

export default memo(CarButton_Recode);