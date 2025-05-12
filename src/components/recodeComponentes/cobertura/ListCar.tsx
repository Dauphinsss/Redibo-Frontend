import { memo } from "react";
import CarCard, { RecodeCarCardProps } from "./CarCard";

interface Props {
    carCards: RecodeCarCardProps[];
}

function RecodeCarList({ carCards }: Props) {
    return (
        <div className="flex flex-col gap-6">
            {carCards.map((car) => (
                <CarCard key={car.idAuto} {...car} />
            ))}
        </div>
    );
}

export default memo(RecodeCarList);