"use client";

//import { UserCircle } from "lucide-react";
import FotoPerfilUsr from "@/app/reserva/components/componentes_InfoAuto_Recode/realizarComentario/fotoPerfilUsrRecode";
import { HiOutlinePaperAirplane } from "react-icons/hi";

interface Props{
    fotoUser : string;
    palabraInput: string;
}

function ComentarUsr({fotoUser,palabraInput}:Props){
    return(
        <div className="flex items-center space-x-4 w-full border border-gray-200 rounded-lg p-4">
            {/**foto de perfil del usuario*/}
            <FotoPerfilUsr 
                imagenUrl={fotoUser} 
                ancho={50} 
                alto={50}
            ></FotoPerfilUsr>
            
            <div className="flex-1">
                <input 
                type="text"
                placeholder={palabraInput}
                ></input>
            </div>
            
            <button className="text-gray-600 hover:text-black transform rotate-90 transition duration-200">
                <HiOutlinePaperAirplane size={24} />
            </button>
        </div>
    );
}
export default ComentarUsr;