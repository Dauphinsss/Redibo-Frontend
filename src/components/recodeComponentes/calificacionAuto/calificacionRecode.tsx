import React from "react";

const CalificacionRecode = ({ 
    promedio = 0, 
    total = 0, 
    porcentajes = [0, 0, 0, 0, 0] 
}) => {
    // Asegurar que porcentajes tenga un array válido con cinco elementos
    const validRatings: number[] = (Array.isArray(porcentajes) && porcentajes.length === 5) 
        ? porcentajes 
        : [0, 0, 0, 0, 0];

    return (
        <div className="p-4 border rounded-lg bg-white w-full flex justify-between items-center">
            {/* Calificación promedio y total de opiniones */}
            <div className="text-center">
                <h2 className="text-6xl">{total === 0 ? "0.0" : promedio.toFixed(1)}</h2>
                <p className="text-gray-600">{total === 0 ? "Sin opiniones" : `${total} opiniones`}</p>
                {Array.from({ length: 5 }, (_, index) => (
                    <span
                        key={index}
                        className={`text-2xl ${index < Math.round(promedio) ? "text-black" : "text-gray-300"}`}
                    >
                        ★
                    </span>
                ))}
            </div>
            {/* Barras de distribución de estrellas */}
            <div className="w-4/5 space-y-1">
                {validRatings.map((value, index) => (
                    <div key={index} className="flex items-center">
                        <span className="w-8 text-right text-gray-700">{5 - index} </span>
                        <div className="flex-1 h-4 bg-gray-300 rounded-lg overflow-hidden ml-2">
                            <div 
                                className="h-full bg-black"
                                style={{ width: `${total === 0 ? 0 : value}%` }} 
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalificacionRecode;