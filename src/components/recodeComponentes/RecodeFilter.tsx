import React from 'react';

interface FilterProps {
    lista: string[];
    nombre: string;
}

const Filter: React.FC<FilterProps> = ({ lista, nombre }) => {
    return (
        <select
            className="border border-black rounded-md p-2"
            defaultValue="" 
        >
            <option value="" disabled>{nombre}</option>
            {lista.map((item, index) => (
                <option key={index} value={item}>
                    {item}
                </option>
            ))}
        </select>
    );
};

export default Filter;