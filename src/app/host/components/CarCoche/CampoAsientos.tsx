import { Input } from "@/components/ui/input";

interface Props {
  asientos: string;
  setAsientos: (val: string) => void;
  error: string;
  setError: (val: string) => void;
}

export default function AsientosSelect({
  asientos,
  setAsientos,
  error,
  setError,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setAsientos(value);
      if (value === "") setError("El número de asientos es obligatorio");
      else if (parseInt(value) <= 0) setError("Debe ser mayor a 0");
      else if (parseInt(value) >= 240) setError("Debe ser menor a 240");
      else setError("");
    } else {
      setError("Solo se permiten números");
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-base font-medium mb-1">
        Asientos: <span className="text-red-600">*</span>
      </label>
      <Input
        type="text"
        value={asientos}
        onChange={handleChange}
        placeholder="Introduzca la cant. de asientos en su vehículo"
        className="w-full max-w-md"
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
