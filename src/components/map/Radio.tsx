interface RadioControlProps {
  radio: number;
  setRadio: (value: number | ((prev: number) => number)) => void;
  punto: { lon: number, alt: number };
}

export default function Radio({ radio, setRadio, punto }: RadioControlProps) {
  const isDisabled = punto.alt === 0 && punto.lon === 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadio(parseInt(e.target.value));
  };

  return (
    <div
      className={`border-gray-300 p-4 rounded-md border-2 w-56 mx-auto transition-opacity duration-300 text-center bg-white hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300 ${isDisabled ? "opacity-30" : "opacity-100"
        }`}
    >
      <div className="mb-3">
        <span className="text-black font-semibold">
          Radio: {radio} kilometro
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={20}
        value={radio}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        aria-label="Ajustar radio"
        disabled={isDisabled}
      />
    </div>
  );
}
