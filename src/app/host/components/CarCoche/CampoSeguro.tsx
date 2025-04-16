import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function SeguroCheckbox({
  seguro,
  setSeguro,
}: {
  seguro: boolean;
  setSeguro: (val: boolean) => void;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-base font-medium mb-1">
        Seguro: <span className="text-red-600">*</span>
      </label>
      <div className="flex items-center space-x-2 ml-4">
        <Checkbox
          id="soat"
          checked={seguro}
          onCheckedChange={(checked) => setSeguro(checked === true)}
        />
        <Label htmlFor="soat">
          SOAT (Seguro Obligatorio de Accidentes de Tránsito)
        </Label>
      </div>
      {!seguro && (
        <p className="text-sm text-red-600 mt-1">El seguro SOAT es obligatorio</p>
      )}
    </div>
  );
}
