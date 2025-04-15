import RecodeCarCard from "./RecodeCarCard"
import { RecodeCarCardProps } from "./RecodeCarCard"

interface Props {
    carCards: RecodeCarCardProps[]
}

export default function RecodeCarList({ carCards }: Props) {
    return (
        <div className="flex flex-col gap-6">
            {carCards.map((car) => (
                <div key={car.id}>
                    <RecodeCarCard {...car} />
                </div>
            ))}
        </div>
    )
}