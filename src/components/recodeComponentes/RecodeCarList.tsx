import RecodeCarCard from "./RecodeCarCard"
import RecodeLoadMoreButton from "./RecodeLoadMoreButton"
import { RecodeCarCardProps } from "./RecodeCarCard"

interface Props {
    carCards: RecodeCarCardProps[]
    total: number
    visibles: number
    lote: number
    onLoadMore: () => void
}

export default function RecodeCarList({ carCards, total, visibles, lote, onLoadMore }: Props) {
    return (
        <div className="flex flex-col gap-6">
        {carCards.map((car, index) => (
            <div key={car.id}>
            <RecodeCarCard {...car} />

            {(index + 1) % lote === 0 &&
                index + 1 < total &&
                index + 1 === carCards.length && (
                <div className="mt-6 flex justify-center">
                    <RecodeLoadMoreButton onClick={onLoadMore} />
                </div>
            )}
            </div>
        ))}
        </div>
    )
}
