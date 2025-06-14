import FotoPerfilUsrRecode from "@/app/reserva/components/componentes_InfoAuto_Recode/realizarComentario/fotoPerfilUsrRecode"; //../../comentarioUsuario/realizarComentario/fotoPerfilUsrRecode
import { FaWhatsapp } from "react-icons/fa";
import { FaTreeCity } from "react-icons/fa6";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaBirthdayCake } from "react-icons/fa";
import { IoPersonOutline } from "react-icons/io5";
import { PiGenderIntersexBold } from "react-icons/pi";
import Link from "next/link";

interface Props {
  nombreHost: string;
  fotoPerfil: string;
  fechaNacimiento: string;
  generoHost: string;
  ciudadHost: string;
  correoHost: string;
  telefono: string;
}

function PerfilHost({
  nombreHost,
  fotoPerfil,
  fechaNacimiento,
  generoHost,
  ciudadHost,
  correoHost,
  telefono,
}: Props) {
  const mensaje = `Hola ${nombreHost}, estoy interesado en tu auto publicado en Redibo.`;

  return (
    <div className="flex items-start gap-6 mt-9">
      <div className="flex flex-col items-center gap-8">
        <FotoPerfilUsrRecode imagenUrl={fotoPerfil} ancho={140} alto={140} />
        <Link
          href={`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-600 transition"
          >
            <FaWhatsapp className="text-lg" />
            Contáctalo
          </button>
        </Link>
      </div>

      <div>
        <div className="bg-black text-white p-2 flex items-center w-full">
          <IoPersonOutline className="text-3xl mr-4" />
          <h2 className="text-xl font-bold mb-2">Acerca de: {nombreHost}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr_1.5fr_0.5fr_1fr] gap-4 p-4">
          {/* Columna 1  */}
          <div></div>

          {/* Columna 2 */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-center gap-2">
                <FaTreeCity className="text-lg" />
                <span>{ciudadHost}</span>
              </div>
              <hr className="border-gray-400 mt-2" />
              <span className="text-gray-500 block text-center">Ciudad:</span>
            </div>

            <div>
              <div className="flex items-center justify-center gap-2">
                <PiGenderIntersexBold className="text-lg" />
                <span>
                  {generoHost.charAt(0).toUpperCase() +
                    generoHost.slice(1).toLowerCase()}
                </span>
              </div>
              <hr className="border-gray-400 mt-2" />
              <span className="text-gray-500 block text-center">Género:</span>
            </div>
          </div>

          {/* Columna 3  */}
          <div></div>

          {/* Columna 4:  */}
          <div className="space-y-8 ">
            <div>
              <div className="flex items-center justify-center gap-2">
                <FaBirthdayCake className="text-lg" />
                <span>{fechaNacimiento}</span>
              </div>
              <hr className="border-gray-400 mt-2" />
              <span className="text-gray-500 block text-center">
                Fecha de Nacimiento:
              </span>
            </div>

            <div>
              <div className="flex items-center justify-center gap-2">
                <MdOutlineAlternateEmail className="text-lg" />
                <span>{correoHost}</span>
              </div>
              <hr className="border-gray-400 mt-2" />
              <span className="text-gray-500 block text-center">Correo:</span>
            </div>
          </div>

          {/* Columna 5  */}
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default PerfilHost;
