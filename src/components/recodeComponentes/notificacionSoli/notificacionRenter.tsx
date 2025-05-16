import React from "react";

interface NotificacionRenterProps {
    mensaje: string;
    fecha: string;
}

export const NotificacionRenter:React.FC<NotificacionRenterProps> = ({ mensaje, fecha }) => {
    return (
        <div className="border border-black bg-gray-600 p-3 rounded mb-2">
            <p className="text-sm text-white">{mensaje}</p>
            <p className="text-sm text-white">{fecha}</p>
        </div>
    );
};