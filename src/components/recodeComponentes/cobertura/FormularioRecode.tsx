export default function FormularioCobertura() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <label className="font-medium">Cuenta con un seguro:</label>
        <label><input type="radio" name="seguro" /> Sí</label>
        <label><input type="radio" name="seguro" /> No</label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Aseguradora:</label>
        <input type="text" className="w-full p-2 border rounded" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Inicio:</label>
          <input type="date" className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fin:</label>
          <input type="date" className="w-full p-2 border rounded" />
        </div>
      </div>
    </div>
  );
}
