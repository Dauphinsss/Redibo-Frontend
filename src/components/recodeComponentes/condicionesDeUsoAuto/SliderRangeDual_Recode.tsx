import React, { useState, memo } from 'react'
import { Range, getTrackBackground } from 'react-range'

export interface SliderRangeDualRecodeProps {
    min: number
    max: number
    step?: number
    label?: string
    unit?: string      
    onChange?: (values: [number, number]) => void  // callback al cambiar
}

function SliderRangeDualRecode({
    min,
    max,
    step = 1,
    label = "Edades permitidas",
    unit = " años",
    onChange
}: SliderRangeDualRecodeProps) {
    const [values, setValues] = useState<[number, number]>([min, max])

    const handleChange = (vals: number[]) => {
        const next: [number, number] = [vals[0], vals[1]]
        setValues(next)
        onChange?.(next)
    }

    return (
        <div className="p-2 rounded-xl w-full max-w-lg">
            <h2 className="text-center text-xl font-semibold text-gray-800 mb-8">
                {label}
            </h2>
            <div className="w-full py-6">
                <Range
                    values={values}
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
                            values,
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
                                    <span>{values[index]}</span>
                                    <span className="text-xs">{unit.trim()}</span>
                                </div>
                            </div>
                        )
                    }}
                />
            </div>
        </div>
    )
}
export default memo(SliderRangeDualRecode)
