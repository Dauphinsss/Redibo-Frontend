import { memo } from "react";

interface SioNoProps {
    value: string;
    onChange: (value: string) => void;
    name: string;
}

function RadioGroup_Recode({ value, onChange, name }: SioNoProps){
    return (
        <div className="flex space-x-8 items-center">
            {["si", "no"].map((opcion) => (
                <label key={opcion} className="flex items-center space-x-2 cursor-pointer">
                <input
                    type="radio"
                    name={name}
                    value={opcion}
                    checked={value === opcion}
                    onChange={() => onChange(opcion)}
                    className={`
                    w-6 h-6 border-2 border-black rounded-full
                    transition duration-300 ease-in-out
                    checked:bg-blue-600 checked:border-blue-600
                    `}
                />
                <span className="text-xl font-bold capitalize">{opcion}</span>
                </label>
            ))}
        </div>
    );
};

export default memo(RadioGroup_Recode);