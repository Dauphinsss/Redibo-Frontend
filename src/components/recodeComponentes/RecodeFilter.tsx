import React from 'react';

interface FilterProps {
    lista: string[];
    nombre: string;
    onChange: (valor: string) => void;
}

const Filter: React.FC<FilterProps> = ({ lista, nombre, onChange }) => {
    return (
        <select
        className="border border-black rounded-md p-2"
        defaultValue=""
        onChange={(e) => onChange(e.target.value)}
        >
        <option value="">{nombre}</option>
        {lista.map((item, index) => (
            <option key={index} value={item}>
            {item}
            </option>
        ))}
        </select>
    );
};

export default Filter;
