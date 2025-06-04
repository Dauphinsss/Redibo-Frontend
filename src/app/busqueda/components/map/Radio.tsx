import { Coor } from "../../types/apitypes";

interface RadioControlProps {
  radio: number;
  setRadio: (value: number | ((prev: number) => number)) => void;
  punto: Coor;
  gpsActive: boolean;
}

export default function Radio({ radio, setRadio, punto, gpsActive }: RadioControlProps) {
  const isDisabled = (punto.alt === 0 && punto.lon === 0) || !gpsActive;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadio(parseInt(e.target.value));
  };

  return (
    <div
      className={`p-4 bg-white transition-opacity duration-300 ${isDisabled ? "opacity-40 pointer-events-none" : "opacity-100"
        }`}
    >
      <div className="mb-3">
        <span className="text-black font-semibold">
          Radio: {radio} kilometro
        </span>
      </div>
      <div className="relative px-2">
        <input
          type="range"
          min={1}
          max={20}
          value={radio}
          onChange={handleChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
          aria-label="Ajustar radio"
          disabled={isDisabled}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
          <span>1 km</span>
          <span>20 km</span>
        </div>
      </div>
    </div>
  );
}
