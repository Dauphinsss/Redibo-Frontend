'use client';

import { Star } from 'lucide-react';
import RatingBar_Recode from './RatingBar_Recode';

type RatingDistribution = {
    [key: number]: number; // 1 al 5 estrellas
};

type Props = {
    average: number;
    totalReviews: number;
    distribution: RatingDistribution;
};

const RatingSummary_Recode = ({ average, totalReviews, distribution }: Props) => {
    const total = Object.values(distribution).reduce((a, b) => a + b, 0);

    return (
        <div className="border rounded-lg p-4 w-full max-w-md shadow-sm bg-white dark:bg-gray-900">
            <div className="flex items-center gap-4">
                {/* Izquierda: promedio y estrellas */}
                <div className="text-center w-24">
                    <p className="text-4xl font-bold">{average.toFixed(1)}</p>
                    <div className="flex justify-center mt-1 text-black">
                        {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={18}
                            fill={i < Math.round(average) ? 'currentColor' : 'none'}
                            className="stroke-current"
                        />
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {totalReviews > 0 ? `${totalReviews} opiniones` : 'Sin opiniones'}
                    </p>
                </div>

                {/* Derecha: barras de distribución */}
                <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((stars) => {
                        const count = distribution[stars] ?? 0;
                        const percent = total > 0 ? (count / total) * 100 : 0;
                        return <RatingBar_Recode key={stars} stars={stars} percentage={percent} />;
                    })}
                </div>
            </div>
        </div>
    );
};

export default RatingSummary_Recode;
