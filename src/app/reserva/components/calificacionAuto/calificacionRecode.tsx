"use client";
import React from "react";

const CalificacionRecode = ({ calificaciones, numComentarios, comentariosConCalificacion ,onBarClick}:
{ calificaciones: number[], numComentarios: number, comentariosConCalificacion: number[] ,onBarClick?: (index: number|null) => void}) => {
    const total = calificaciones.length;
    const promedio = total ? Number((calificaciones.reduce((sum, val) => sum + val, 0) / total).toFixed(1)) : 0;

    const porcentajes = Array.from({ length: 5 }, (_, i) => {
        const count = calificaciones.filter(c => c === i + 1).length;
        return total ? (count / total) * 100 : 0;
    });

    

    return (
        <div className="p-4 border rounded-lg bg-white w-full flex flex-col justify-between h-full cursor-pointer" >
            <div className="flex justify-between items-center">
                <div className="text-center">
                    <h2 className="text-6xl">{total === 0 ? "0.0" : promedio.toFixed(1)}</h2>
                    
                    <p className="text-gray-600 cursor-pointer" onClick={() => onBarClick?.(null)} >
                       {numComentarios === 0 ? "0 opiniones" : `${numComentarios} opiniones`}</p>
                    <p className="text-gray-600">{total === 0 ? "0 calificaciones" : `${total} ${total === 1 ? "calificación" : "calificaciones"}`}</p>

                    <div className="flex justify-center space-x-1">
                        {Array.from({ length: 5 }, (_, index) => {
                            const isFilled = index < Math.floor(promedio);
                            const isPartial = index === Math.floor(promedio) && promedio % 1 !== 0;
                            const fillPercentage = (promedio % 1) * 100;

                            return (
                                <div key={index} className="relative text-3xl text-gray-300">
                                    <span className={isFilled ? "text-black" : ""}>★</span>
                                    {isPartial && (
                                        <span 
                                            className="absolute left-0 top-0 text-black overflow-hidden" 
                                            style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }}
                                        >
                                            ★
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="w-4/5 space-y-1">
                    {porcentajes.map((value, index) => {
                        const comentariosCount = comentariosConCalificacion.filter(c => c === 5 - index).length;

                        return (
                            <div key={index} className="flex items-center">
                                <span className="w-8 text-right text-gray-700">{5 - index}</span>
                                <div  
                                    className="flex-1 h-4 bg-gray-300 rounded-lg overflow-hidden ml-2 relative"
                                    title={`${comentariosCount} ${comentariosCount === 1 ? "comentario" : "comentarios"}`}  
                                    onClick={() => {
                                            onBarClick?.(5 - index);
                                        }}

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
                    Este auto aún no tiene calificaciones ni comentarios
                </div>
            )}
        </div>
    );
};

export default CalificacionRecode;