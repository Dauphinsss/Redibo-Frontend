import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function TransmisionSelect({
  transmision,
  setTransmision,
}: {
  transmision: string;
  setTransmision: (val: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-base font-medium mb-1">
        Transmisión: <span className="text-red-600">*</span>
      </label>
      <Select value={transmision} onValueChange={setTransmision}>
        <SelectTrigger className="w-full max-w-md">
          <SelectValue placeholder="Seleccione" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="manual">Manual</SelectItem>
          <SelectItem value="automatico">Automático</SelectItem>
          <SelectItem value="semiautomatico">Semi-automático</SelectItem>
        </SelectContent>
      </Select>
      {transmision === "" && (
        <p className="text-sm text-red-600 mt-1">Debe seleccionar el tipo de transmisión</p>
      )}
    </div>
  );
}
