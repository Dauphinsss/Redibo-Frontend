import React, { useState, useEffect, memo } from 'react'
import { Range, getTrackBackground } from 'react-range'

export interface SliderRangeDualRecodeProps {
    min: number
    max: number
    step?: number
    label?: string
    unit?: string
    values: [number, number]
    onChange?: (values: [number, number]) => void
}

function SliderRangeDualRecode({
    min,
    max,
    step = 1,
    label = "Edades permitidas",
    unit = " años",
    values,
    onChange
}: SliderRangeDualRecodeProps) {
    const [internalValues, setInternalValues] = useState<[number, number]>(values)

    useEffect(() => {
        setInternalValues(values)
    }, [values])

    const handleChange = (vals: number[]) => {
        const next: [number, number] = [vals[0], vals[1]]
        setInternalValues(next)
        onChange?.(next)
    }

    return (
        <div className="flex flex-col items-center w-full">
            <div className="py-8 px-6 w-full">
                <h2 className="text-center text-base font-medium text-gray-900 mb-8">
                    {label}
                </h2>
                <div className="w-full py-6">
                    <Range
                        values={internalValues}
                        step={step}
                        min={min}
                        max={max}
                        onChange={handleChange}
                        renderTrack={({ props, children }) => (
                            <div
                                {...props}
                                ref={props.ref}
                                className="h-2 w-full rounded-full"
                                style={{
                                    background: getTrackBackground({
                                        values: internalValues,
                                        colors: ['#e5e7eb', '#000000', '#e5e7eb'],
                                        min,
                                        max
                                    })
                                }}
                            >
                                {children}
                            </div>
                        )}
                        renderThumb={({ props, index }) => {
                            const { key, ...rest } = props
                            return (
                                <div
                                    key={key}
                                    {...rest}
                                    className="relative flex items-center justify-center"
                                >
                                    <div className="h-6 w-6 bg-white rounded-full border-2 border-black" />
                                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm font-medium rounded px-2 py-1 flex flex-col items-center">
                                        <span>{internalValues[index]}</span>
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

export default memo(SliderRangeDualRecode)
