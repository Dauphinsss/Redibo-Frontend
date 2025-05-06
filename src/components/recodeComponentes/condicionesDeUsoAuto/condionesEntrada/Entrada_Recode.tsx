"use client";
import React, { useState } from 'react';
import RadioGroup_Recode from '../condicioneGenerales/RadioGroup_Recode';
import Filter from '../../seccionOrdenarMasResultados/RecodeFilter';

function EntradaRecode() {
    const [limpioInt, setLimpioInt] = useState("si");
    const [limpioExt, setLimpioExt] = useState("si");
    const [rayones, setRayones] = useState("si");
    const [devuelto, setDevuelto] = useState("si");
    const [danios, setDanios] = useState("si");
    const [combustible, setCombustible] = useState("si"); 

    const tanque = ["Lleno", "Vacio", "Medio"];
    const [nivelCombustible, setNivelCombustible] = useState("");


    return (
        <div className="min-h-screen bg-[#ffffff] font-sans px-10 py-6">
        
                    <button className="flex items-center text-white bg-black px-3 py-1 rounded mb-4">
                        <span className="mr-2">←</span> Volver
                    </button>
        
                    <h2 className="text-xl font-semibold mb-4">Condiciones de uso del auto</h2>
        
                    <div className="w-[800px] border-2 border-black bg-white">
        
                        <div className="flex border-b border-black">
                            <button className="w-1/3 px-6 py-2 border-r border-black">Condiciones generales</button>
                            <button className="w-1/3 px-6 py-2 border-r border-black">Entrega del auto</button>
                            <button className="w-1/3 px-6 py-2 bg-black text-white">Devolución del auto</button>
                        </div>
        
                        <div className="px-10 py-8 grid gap-6">

                            <div className="grid grid-cols-2 items-center">
                                <span className="text-base font-semibold">Estado de combustible:</span>
                                <div className='w-[160px]'>
                                    <Filter
                                    lista={tanque}
                                    nombre='Seleccionar Estado'
                                    onChange={setNivelCombustible}
                                    ></Filter >
                                </div>
                            </div>

                            <div className="grid grid-cols-2 items-center">
                                <span className="text-base font-semibold">Interior limpio:</span>
                                <RadioGroup_Recode value={limpioInt} onChange={setLimpioInt} name="Interior" />
                            </div>
        
                            <div className="grid grid-cols-2 items-center">
                                <span className="text-base font-semibold">Exterior limpio:</span>
                                <RadioGroup_Recode value={limpioExt} onChange={setLimpioExt} name="Exterior" />
                            </div>
        
                            <div className="grid grid-cols-2 items-center">
                                <span className="text-base font-semibold">Tiene rayones:</span>
                                <RadioGroup_Recode value={rayones} onChange={setRayones} name="Rayones" />
                            </div>
        
                            <div className="grid grid-cols-2 items-center">
                                <span className="text-base font-semibold">Herramientas devueltas:</span>
                                <RadioGroup_Recode value={devuelto} onChange={setDevuelto} name="Devuelto" />
                            </div>
        
                            <div className="grid grid-cols-2 items-center">
                                <span className="text-base font-semibold">Cobrar daños adicionales presentes:</span>
                                <RadioGroup_Recode value={danios} onChange={setDanios} name="Danios" />
                            </div>
        
                            <div className="grid grid-cols-2 items-center">
                                <span className="text-base font-semibold">Nivel de combustible igual al entregado:</span>
                                <RadioGroup_Recode value={combustible} onChange={setCombustible} name="Combustible" />
                            </div>
        
                        </div>
                        
                    </div>
                    <div className="w-[800px] flex justify-end mt-4">
                        <button className="bg-black text-white px-6 py-2 rounded">Siguiente</button>
                    </div>
                </div>
    );
};

export default EntradaRecode;