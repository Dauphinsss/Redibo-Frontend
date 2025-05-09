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
        <div className="p-4 border rounded-lg bg-white w-full flex justify-between items-center">
            <div className="text-center">
                <h2 className="text-6xl">{total === 0 ? "0.0" : promedio.toFixed(1)}</h2>
                <p className="text-gray-600">{total === 0 ? "0 comentarios" : `${total} opiniones`}
                    {total === 0 
                        ? "Este auto aún no tiene calificaciones"
                        : `${total} opiniones`}

                </p>
                {Array.from({ length: 5 }, (_, index) => (
                    <span
                        key={index}
                        className={`text-2xl ${index < Math.round(promedio) ? "text-black-500" : "text-gray-300"}`}
                    >
                        ★
                    </span>
                ))}
            </div>

            <div className="w-4/5 space-y-1">
                {porcentajes.map((value, index) => {
                    const count = Math.round((value * total) / 100);

                    return (
                        <div key={index} className="flex items-center">
                            <span className="w-8 text-right text-gray-700">{5 - index}</span>
                            <div 
                                className="flex-1 h-4 bg-gray-300 rounded-lg overflow-hidden ml-2 relative"
                                title={`${count} comentarios`} 
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
    );
};

export default CalificacionRecode;