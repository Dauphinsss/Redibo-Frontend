import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function PuertasSelect({
  puertas,
  setPuertas,
}: {
  puertas: string;
  setPuertas: (val: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-base font-medium mb-1">
        Puertas: <span className="text-red-600">*</span>
      </label>
      <Select value={puertas} onValueChange={setPuertas}>
        <SelectTrigger className="w-full max-w-md">
          <SelectValue placeholder="Seleccione" />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4, 5].map((num) => (
            <SelectItem key={num} value={String(num)}>
              {num}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {puertas === "" && (
        <p className="text-sm text-red-600 mt-1">Debe seleccionar la cantidad de puertas</p>
      )}
    </div>
  );
}
