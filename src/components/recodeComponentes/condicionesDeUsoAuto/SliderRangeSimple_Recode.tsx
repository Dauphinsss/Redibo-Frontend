// src/components/recodeComponentes/condicionesDeUsoAuto/SliderRangeSimple_Recode.tsx
import React, { useState, memo } from 'react'
import { Range, getTrackBackground } from 'react-range'

export interface SliderRangeSimpleRecodeProps {
    min: number
    max: number
    step?: number
    label?: string
    unit?: string              
    onChange?: (values: [number]) => void
}

function SliderRangeSimple_Recode({
    min,
    max,
    step = 1,
    label = "Kilometraje permitido",
    unit = " km",
    onChange
}: SliderRangeSimpleRecodeProps) {
    const [value, setValue] = useState<[number]>([min])

    const handleChange = (vals: number[]) => {
        const next: [number] = [vals[0]]
        setValue(next)
        onChange?.(next)
    }

    return (
        <div className="flex flex-col items-center bg-white rounded-xl shadow-md w-full">
            <div className="py-8 px-6 w-full">
                <h2 className="mb-7 text-xl font-semibold text-gray-800 text-center">
                    {label}
                </h2>
                <div className="w-full py-4">
                    <Range
                        values={value}
                        step={step}
                        min={min}
                        max={max}
                        onChange={handleChange}
                        renderTrack={({ props, children }) => (
                        <div
                            {...props}
                            ref={props.ref}
                            className="relative w-full"
                            style={{ height: 24 }}
                        >
                            <div
                            className="absolute left-0 right-0"
                            style={{
                                top: '50%',
                                transform: 'translateY(-50%)',
                                height: 10,
                                background: getTrackBackground({
                                values: value,
                                colors: ['#000000', '#e5e7eb'], // negro hasta el thumb, luego gris
                                min,
                                max
                                }),
                                borderRadius: 9999
                            }}
                            />
                            {children}
                        </div>
                        )}
                        renderThumb={({ props }) => {
                        const { key, ...rest } = props
                            return (
                                <div
                                key={key}
                                {...rest}
                                className="relative z-10 h-6 w-6 bg-white rounded-full border-2 border-black flex items-center justify-center"
                                >
                                    <div className="
                                        absolute -top-10 left-1/2 transform -translate-x-1/2
                                        bg-black text-white text-sm px-2 py-1 rounded
                                        inline-flex items-center space-x-1
                                    ">
                                        <span>{value[0]}</span>
                                        <span className="text-xs">{unit.trim()}</span>
                                    </div>
                                </div>
                            )
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default memo(SliderRangeSimple_Recode)
