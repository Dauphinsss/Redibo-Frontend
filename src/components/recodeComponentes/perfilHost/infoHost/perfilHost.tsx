import FotoPerfilUsrRecode from "../../comentarioUsuario/realizarComentario/fotoPerfilUsrRecode";
import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

interface Props {
  nombreHost: string;
  fotoPerfil: string;
  fechaNacimiento: string;
  generoHost: string;
  ciudadHost: string;
  correoHost: string;
  telefono: string;
}

function PerfilHost({nombreHost,fotoPerfil,fechaNacimiento,generoHost,ciudadHost,correoHost,telefono,}: Props) {
  const mensaje = `Hola ${nombreHost}, estoy interesado en tu auto publicado en Redibo.`;

  return (
    <div className="flex items-start gap-6">
      <div className="relative">
        <FotoPerfilUsrRecode imagenUrl={fotoPerfil} ancho={180} alto={180} />
        <Link
          href={`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            type="button"
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mt-2 flex items-center gap-2 px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-600 transition"
          >
            <FaWhatsapp className="text-lg" />
            Contáctalo
          </button>
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Acerca de : {nombreHost}</h2>
        <ul className="space-y-1 text-sm text-gray-700">
          <li><strong>Fecha de Nacimiento:</strong> {fechaNacimiento}</li>
          <li><strong>Género:</strong> {generoHost}</li>
          <li><strong>Ciudad:</strong> {ciudadHost}</li>
          <li><strong>Correo:</strong> {correoHost}</li>
        </ul>
      </div>
    </div>
  );
}

export default PerfilHost;
