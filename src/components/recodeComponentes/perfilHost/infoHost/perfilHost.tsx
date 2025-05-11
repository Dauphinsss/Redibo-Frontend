import FotoPerfilUsrRecode from "../../comentarioUsuario/realizarComentario/fotoPerfilUsrRecode";
import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

interface Props{
    nombreHost: string;
    fotoPerfil: string;
    fechaNacimiento: string;
    generoHost: string;
    ciudadHost: string;
    correoHost: string;
    telefono: string;
}

function PerfilHost({nombreHost,fotoPerfil,fechaNacimiento,generoHost,ciudadHost,correoHost,telefono}:Props){

    const mensaje = `Hola ${nombreHost}, estoy interesado en tu auto publicado en Redibo.`;

    <div>
        <FotoPerfilUsrRecode imagenUrl={fotoPerfil} ancho={180} alto={180}></FotoPerfilUsrRecode>

        <div>
            <h1>Acerca de : {nombreHost}</h1>
            <span>Fecha de Nacimiento: {fechaNacimiento}</span>
            <span>Genero: {generoHost}</span>
            <span>Ciudad: {ciudadHost}</span>
            <span>Correo: {correoHost}</span>
        </div>

        <div>
            <Link
                href={`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-500 transition"
                >
                    <FaWhatsapp /> Contáctalo
                </button>
            </Link>

        </div>
    </div>
}
export default PerfilHost;