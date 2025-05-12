import React from 'react';

interface FilterProps {
    lista: string[];
    tipo: string;
}

const FiltroGenerico: React.FC<FilterProps> = ({ lista, tipo }) => {
    return (
        <select
            className="border border-black rounded-md p-2"
            defaultValue="" // <- esto hace que el disabled esté seleccionado por defecto
        >
            <option value="" disabled>{tipo}</option>
            {lista.map((item, index) => (
                <option key={index} value={item}>
                    {item}
                </option>
            ))}
        </select>
    );
};

export default FiltroGenerico;
