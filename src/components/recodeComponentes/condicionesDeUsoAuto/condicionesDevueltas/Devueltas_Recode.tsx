"use client";
import React, { useState } from 'react';
import RadioGroup_Recode from '../condicioneGenerales/RadioGroup_Recode';

function DevueltasRecode(){

    const [limpioInt, setLimpioInt] = useState("si");
    const [limpioExt, setLimpioExt] = useState("si");
    const [rayones, setRayones] = useState("si");
    const [devuelto, setDevuelto] = useState("si");
    const [danios, setDanios] = useState("si");
    const [combustible, setCombustible] = useState("si");

    return (
        <div className='grid grid-cols-1 gap-6'>

            <div className="grid grid-cols-2 items-center">
                <span className="text-lg font-semibold mb-4">Interior limpio: </span>
                <RadioGroup_Recode
                    value={limpioInt}
                    onChange={setLimpioInt}
                    name="Interior"
                />
            </div>

            <div className="grid grid-cols-2 items-center">
                <span className="text-lg font-semibold mb-4">Exterior limpio: </span>
                <RadioGroup_Recode
                    value={limpioExt}
                    onChange={setLimpioExt}
                    name="Exterior"
                />
            </div>

            <div className="grid grid-cols-2 items-center">
                <span className="text-lg font-semibold mb-4">Tiene rayones: </span>
                <RadioGroup_Recode
                    value={rayones}
                    onChange={setRayones}
                    name="Rayones"
                />
            </div>

            <div className="grid grid-cols-2 items-center">
                <span className="text-lg font-semibold mb-4">Herramientas devueltas: </span>
                <RadioGroup_Recode
                    value={devuelto}
                    onChange={setDevuelto}
                    name="Devuelto"
                />
            </div>

            <div className="grid grid-cols-2 items-center">
                <span className="text-lg font-semibold mb-4">Cobrar daños adicionales presentes:</span>
                <RadioGroup_Recode
                    value={danios}
                    onChange={setDanios}
                    name="Danios"
                />
            </div>

            <div className="grid grid-cols-2 items-center">
                <span className="text-lg font-semibold mb-4">Nivel de combustible igual al entregado:</span>
                <RadioGroup_Recode
                    value={combustible}
                    onChange={setCombustible}
                    name="Combustible"
                />
            </div>
        </div>
    );
};

export default DevueltasRecode;