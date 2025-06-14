type Props = {
  nombre: string;
  fecha: string; // formato ISO o ya formateado
  contenido: string;
};
/*
function formatearFecha(fechaISO: string): string {
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const año = fecha.getFullYear();
  return `${dia}/${mes}/${año}`;
}*/

const TarjetaRespuesta = ({ nombre, fecha, contenido }: Props) => (
  <div className="ml-12 mt-4">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold bg-gray-100">👤</div>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <p className="font-semibold">{nombre}</p>
          <p className="text-xs text-gray-500">{fecha}</p>
        </div>

        <p className="text-sm text-gray-800">{contenido}</p>
      </div>
    </div>
  </div>
);

export default TarjetaRespuesta;