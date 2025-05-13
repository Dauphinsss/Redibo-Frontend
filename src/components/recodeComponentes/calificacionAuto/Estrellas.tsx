const Estrellas: React.FC<{ promedio: number }> = ({ promedio }) => (
  <div className="flex justify-center space-x-1">
    {Array.from({ length: 5 }, (_, index) => {
      const isFilled = index < Math.floor(promedio);
      const isPartial = index === Math.floor(promedio) && promedio % 1 !== 0;
      const fillPercentage = (promedio % 1) * 100;

      return (
        <div key={index} className="relative text-3xl text-gray-300">
          <span className={isFilled ? "text-black" : ""}>★</span>
          {isPartial && (
            <span className="absolute left-0 top-0 text-black overflow-hidden" style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }}>
              ★
            </span>
          )}
        </div>
      );
    })}
  </div>
);