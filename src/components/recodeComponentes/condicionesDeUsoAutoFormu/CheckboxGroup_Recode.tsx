"use client";

import React from "react";

interface CheckboxOption {
    key: string;
    label: string;
}

interface CustomCheckboxGroupProps {
    title: string;
    options: CheckboxOption[];
    respuestas: Record<string, boolean>;
    onCheckboxChange: (key: string) => void;
}

const CheckboxGroup_Recode: React.FC<CustomCheckboxGroupProps> = ({
    title,
    options,
    respuestas,
    onCheckboxChange,
}) => {
    return (
        <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {options.map((opt) => {
                const checked = !!respuestas[opt.key];
                return (
                    <label
                        key={opt.key}
                        className={`flex items-center space-x-2 p-2 rounded transition-all duration-150 transform
                            ${checked ? "scale-105 shadow-md bg-gray-50" : "scale-100"}
                        `}
                    >
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => onCheckboxChange(opt.key)}
                            className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <span className="text-sm text-gray-900">{opt.label}</span>
                    </label>
                );
                })}
            </div>
        </div>
    );
};

export default CheckboxGroup_Recode;
