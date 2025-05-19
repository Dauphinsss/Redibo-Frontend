import { memo } from "react";
import RecodeCarCard, { RecodeCarCardProps } from "./CarCardRecode";

interface Props {
    carCards: RecodeCarCardProps[];
}

function RecodeCarList({ carCards }: Props) {
    return (
        <div className="flex flex-col gap-6">
            {carCards.map((car) => (
                <RecodeCarCard key={car.idAuto} {...car} />
            ))}
        </div>
    );
}

export default memo(RecodeCarList);