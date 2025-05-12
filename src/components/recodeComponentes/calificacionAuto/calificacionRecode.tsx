import React from "react";

const CalificacionRecode = ({ calificaciones }: { calificaciones: number[] }) => {
    const total = calificaciones.length;
    const promedio = total
        ? Number((calificaciones.reduce((sum, val) => sum + val, 0) / total).toFixed(1))
        : 0;
    
    const porcentajes = Array.from({ length: 5 }, (_, i) => {
        const count = calificaciones.filter(c => c === i + 1).length;
        return total ? (count / total) * 100 : 0;
    });

    return (
        <div className="p-4 border rounded-lg bg-white w-full flex flex-col justify-between h-full">
            <div className="flex justify-between items-center">
                <div className="text-center">
                    <h2 className="text-6xl">{total === 0 ? "0.0" : promedio.toFixed(1)}</h2>
                    <p className="text-gray-600">{total === 0 ? "0 comentarios" : `${total} opiniones`}</p>

                    {/* Mostrar estrellas completas y medias estrellas según el promedio */}
                    <div className="flex justify-center space-x-1">
                        {Array.from({ length: 5 }, (_, index) => {
                            const isFilled = index < Math.floor(promedio); // Determina si es una estrella llena
                            const isHalfFilled = promedio - Math.floor(promedio) >= 0.5 && Math.floor(promedio) === index; // Determina si es media estrella

                            return (
                                <div key={index} className="relative text-3xl text-gray-300">
                                    {/* Estrella completa */}
                                    <span className={isFilled ? "text-black" : ""}>★</span>
                                    
                                    {/* Media estrella (superpuesta) */}
                                    {isHalfFilled && (
                                        <span className="absolute left-0 top-0 text-black overflow-hidden w-1/2">★</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="w-4/5 space-y-1">
                    {porcentajes.map((value, index) => {
                        const count = Math.round((value * total) / 100);
                        return (
                            <div key={index} className="flex items-center">
                                <span className="w-8 text-right text-gray-700">{5 - index}</span>
                                <div  
                                    className="flex-1 h-4 bg-gray-300 rounded-lg overflow-hidden ml-2 relative"
                                    title={`${count} ${count === 1 ? "comentario" : "comentarios"}`}  
                                >
                                    <div   
                                        className="h-full bg-black transition-width duration-300"
                                        style={{ width: total === 0 ? "0%" : `${value}%`, borderRadius: "8px"}}  
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {total === 0 && (
                <div className="mt-auto text-right text-gray-600 text-sm">
                    Este auto aún no tiene calificaciones
                </div>
            )}
        </div>
    );
};

export default CalificacionRecode;