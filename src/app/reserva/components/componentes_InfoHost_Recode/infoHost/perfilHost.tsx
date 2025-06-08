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
    <div className="flex items-start gap-6">
      <div className="mt-10 flex flex-col items-center gap-5">
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
        <div className="bg-black text-white p-2 flex items-center w-283">
          <IoPersonOutline className="text-3xl mr-4" />
          <h2 className="text-xl font-bold mb-2 ">Acerca de : {nombreHost}</h2>
        </div>
        <div className=" flex flex-col md:flex-row ">
          <ul className="space-y-4 flex flex-col w-1/2 items-start ml-20">
            <li className="mt-12">
              <div className="flex items-center">
                <FaTreeCity className="text-lg" />
                <span>{ciudadHost}</span>
              </div>
              <hr className="w-full border-gray-400" />
              <span className="text-gray-500 ml-5">Ciudad:</span>
            </li>

            <li className="mt-12">
              <div className="flex items-center">
                <PiGenderIntersexBold className="text-lg" />
                <span>
                  {generoHost.charAt(0).toUpperCase() +
                    generoHost.slice(1).toLowerCase()}
                </span>
              </div>
              <hr className="w-full border-gray-400" />
              <span className="text-gray-500 ml-5">Género:</span>
            </li>
          </ul>

          <ul className="space-y-4 flex flex-col w-1/2 items-start  ">
            <li className="mt-12  ">
              <div className="flex items-center ml-8">
                <FaBirthdayCake className="text-lg" />
                <span className="">{fechaNacimiento}</span>
              </div>
              <hr className="w-full border-gray-400" />
              <span className="text-gray-500 ml-5 ">Fecha de Nacimiento:</span>
            </li>

            <li className="mt-12   ">
              <div className="flex items-center">
                <MdOutlineAlternateEmail className="text-lg" />
                <span>{correoHost}</span>
              </div>
              <hr className="w-full border-gray-400" />
              <span className="text-gray-500 ml-8">Correo:</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PerfilHost;
