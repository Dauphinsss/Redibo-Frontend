"use client"

import React, { useState, useEffect, memo } from 'react'
import { Range, getTrackBackground } from 'react-range'

export interface SliderRangeSimpleRecodeProps {
    min: number
    max: number
    step?: number
    label?: string
    unit?: string
    values: [number]
    onChange?: (values: [number]) => void
}

function SliderRangeSimple_Recode({
    min,
    max,
    step = 1,
    label = "Kilometraje permitido",
    unit = " km",
    values,
    onChange
}: SliderRangeSimpleRecodeProps) {
    const clamp = (val: number) => Math.max(min, Math.min(max, val))
    const [internalValue, setInternalValue] = useState<[number]>([clamp(values[0])])

    useEffect(() => {
        setInternalValue([clamp(values[0])])
    }, [values, min, max])

    const handleChange = (vals: number[]) => {
        const next: [number] = [clamp(vals[0])]
        setInternalValue(next)
        onChange?.(next)
    }

    return (
        <div className="flex flex-col items-center w-full">
            <div className="py-4 px-6 w-full">
                <h2 className="mb-8 text-base font-medium text-gray-900 text-center">
                    {label}
                </h2>
                <div className="w-full py-2">
                    <Range
                        values={internalValue}
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
                                            values: internalValue,
                                            colors: ['#000000', '#e5e7eb'],
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
                                        <span>{internalValue[0]}</span>
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
