"use client";

import { useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import FotoPerfilUsrRecode from "../realizarComentario/fotoPerfilUsrRecode";
import CalificacionRecode from "../../calificacionAuto/calificacionRecode";
import Autoimag from "../../detailsCar/RecodeAutoimag";

interface Props{
    nombreCompleto: string;
    fotoHost: string;
    modeloAuto: string;
    marcaAuto: string;
    calificaciones: number[];
    imagenes: { id: number; data: string }[];
    comentarios: { id: number; data: string }[];
}

function PopUpComentarios({nombreCompleto, fotoHost, modeloAuto, marcaAuto, calificaciones , imagenes}: Props) {

    const [popUpOpen, setPopUpOpen] = useState(false);

    const closePopup = () => setPopUpOpen(false);
    const openPopup = () => setPopUpOpen(true);

    return (
        <div>
            <button onClick={openPopup}>Comentarios</button>

            {popUpOpen && (
                <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div style={{background: 'white',padding: '20px', borderRadius: '8px',minWidth: '300px'}}>

                        <HiOutlineX onClick={closePopup}/>
                        <h1 className="font-medium">{nombreCompleto}</h1>
                        <FotoPerfilUsrRecode imagenUrl={fotoHost} ancho={50} alto={50} />
                        <h2>{marcaAuto}</h2>
                        <Autoimag imagenes={imagenes} nombre={modeloAuto} ></Autoimag>
                        <CalificacionRecode calificaciones={calificaciones}></CalificacionRecode>
                        <h2>Comentarios sadadasda</h2>

                    </div>
                </div>
            )}
        </div>
    );
}

export default PopUpComentarios;
