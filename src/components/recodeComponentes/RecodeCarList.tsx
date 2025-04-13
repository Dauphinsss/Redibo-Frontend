"use client"

import RecodeCarCard from "./RecodeCarCard"
import { RecodeCarCardProps } from "./RecodeCarCard"

interface RecodeCarListProps {
    carCards: RecodeCarCardProps[]
}

export default function RecodeCarList({ carCards }: RecodeCarListProps) {
    return (
        <div className="flex flex-col gap-6">
            {carCards.map((car) => (
                <RecodeCarCard key={car.id} {...car} />
            ))}
        </div>
    )
}
