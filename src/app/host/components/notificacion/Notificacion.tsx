import FotoPerfilUsrRecode from "@/app/reserva/components/componentes_InfoAutp_Recode/realizarComentario/fotoPerfilUsrRecode";
import Image from "next/image";
import { Notificacion } from "@/app/reserva/interface/NotificacionSolicitud_Recode";

interface Props {
  fotoPerfil: string;
  mensaje: string;
  fotoCar: string;
  notificacion: Notificacion;
  onAceptar?: () => void;
  onRechazar?: () => void;
}

export const Notificacion_Recode: React.FC<Props> =({fotoPerfil, mensaje,fotoCar,
  notificacion,onAceptar,onRechazar}: Props) =>{
  const esImagenValida = fotoCar && (fotoCar.startsWith("http") || fotoCar.startsWith("/"));
  const {
    nombreUsuario = 'Usuario',
    marcaVehiculo = 'Vehículo',
    modeloVehiculo = '',
    fechaInicio = '',
    fechaFin = '',
    lugarRecogida = 'Ubicación no especificada',
    lugarDevolucion = 'Ubicación no especificada'
  } = notificacion.datos;


  return (
    <div
      className="w-full max-w-2xl p-4 bg-white rounded-xl shadow-lg flex justify-between items-start gap-4 hover:bg-gray-200 transition-colors duration-200"
      style={{ boxShadow: "0 0 0px rgba(32, 32, 32, 0.2)" }}//Sombreado exterior personalizado
    >
      {/* Columna izquierda */}
      <div className="flex flex-col gap-2 w-2/3">
        <div className="flex items-center gap-3 ">
          <FotoPerfilUsrRecode imagenUrl={fotoPerfil} ancho={50} alto={50} />
          <div>
            <h1 className="font-bold text-lg">{nombreUsuario}</h1>
          </div>
        </div>
        <p className="text-sm text-gray-700"> 
           Está interesado en alquilar.<br />
            Desde {fechaInicio} hasta {fechaFin}.<br />
            {/*A recoger de {lugarRecogida} y devolución en {lugarDevolucion} */}
        </p>
        {/** 
        <div className="text-sm text-gray-700 grid grid-cols-2 gap-x-1 gap-y-1 mt-2">
          <span>De: {fechaIni}</span>
          <span>Hora: 99:99</span>
          <span>A: {fechaFin}</span>
          <span>Hora: 99:99</span>
        </div>*/}

        <div className="flex gap-1 mt-4">
          <button
            type="button"
            className="flex-1 px-1 py-2 bg-black text-white text-sm rounded hover:bg-gray-900 transition"
          >
            Rechazar
          </button>
          <button
            type="button"
            className="flex-1 px-1 py-2 bg-gray-400 text-white text-sm rounded hover:bg-gray-600 transition"
          >
            Aceptar
          </button>
        </div>
      </div>

      {/* Columna derecha */}
      <div className="w-1/3 flex flex-col items-end justify-between h-full">
        <span className="text-xs text-gray-500 mb-2">Hace 9 d.</span>

        <div className="w-28 h-28 bg-gray-400 rounded flex items-center justify-center overflow-hidden relative">
          {esImagenValida ? (
            <Image
              src={fotoCar}
              alt="Imagen del auto"
              fill
              className="object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-white text-xs">Sin imagen</span>
          )}
        </div>

        <p className="text-sm text-center mt-2 mr-3 text-gray-800">
          {marcaVehiculo} {modeloVehiculo}
        </p>
      </div>
    </div>
  );
}
