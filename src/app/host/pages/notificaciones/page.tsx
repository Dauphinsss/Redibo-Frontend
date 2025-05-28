'use client';

import { useEffect, useRef, useState } from "react";
import Notificacion_Recode from "../../components/notificacion/Notificacion";
import { IoNotifications } from "react-icons/io5";

export default function Page() {
    const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
    const contenedorRef = useRef<HTMLDivElement>(null);
    const botonRef = useRef<HTMLDivElement>(null);

    const toggleNotificaciones = () => {
        setMostrarNotificaciones((prev) => !prev);
    };

    const closePopup = () => setMostrarNotificaciones(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                mostrarNotificaciones &&
                contenedorRef.current &&
                !contenedorRef.current.contains(target) &&
                botonRef.current &&
                !botonRef.current.contains(target)
            ) {
                closePopup();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [mostrarNotificaciones]);

    return (
        <div className="relative z-0 min-h-screen">
            <div
                ref={botonRef}
                onClick={toggleNotificaciones}
                className="h-10 w-10 bg-black rounded-full flex items-center justify-center cursor-pointer fixed top-6 right-6 z-50"
            >
                <IoNotifications className="text-white text-xl" />
            </div>

            

            {mostrarNotificaciones && (
                <div className="fixed inset-0 backdrop-blur-sm px-200 py-20 z-40">
                    <div
                        ref={contenedorRef}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gray-400 rounded-lg w-[500px] max-h-[600px] p-4 shadow-lg overflow-y-auto relative "
                        style={{ boxShadow: "0 0 15px rgba(32, 32, 32, 0.2)" }}
                    >
                        <div className="space-y-4 mt-4">
                            <Notificacion_Recode
                                nombreUsr={"Carlos Gomez"}
                                fotoPerfil={""}
                                mensaje={"Por motivo de viaje"}
                                fechaIni={"99/99/99"}
                                fechaFin={"99/99/99"}
                                fotoCar={""}
                                marcaCar={"Ford"}
                                modeloCar={"Mustang"}
                            />
                            <Notificacion_Recode
                                nombreUsr={"Ana"}
                                fotoPerfil={""}
                                mensaje={"Para vacaciones familiares"}
                                fechaIni={"99/99/99"}
                                fechaFin={"99/99/99"}
                                fotoCar={""}
                                marcaCar={"Chevrolet"}
                                modeloCar={"Camaro"}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
