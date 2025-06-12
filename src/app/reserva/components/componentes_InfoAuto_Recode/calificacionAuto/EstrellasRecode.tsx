import React from "react";

const Estrellas = ({ promedio }: { promedio: number }) => {
  const estrellas = Array.from({ length: 5 }, (_, index) => {
    const isFilled = index < Math.floor(promedio);
    const isPartial = index === Math.floor(promedio) && promedio % 1 !== 0;
    const fillPercentage = (promedio % 1) * 100;

    return { isFilled, isPartial, fillPercentage };
  });

  return (
    <div className="flex justify-center space-x-0.5">
      {estrellas.map((estrella, index) => (
        <div key={index} className="relative text-2xl text-gray-300">
          <span className={estrella.isFilled ? "text-black" : ""}>★</span>
          {estrella.isPartial && (
            <span
              className="absolute left-0 top-0 text-black overflow-hidden"
              style={{
                clipPath: `inset(0 ${100 - estrella.fillPercentage}% 0 0)`,
              }}
            >
              ★
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Estrellas;
