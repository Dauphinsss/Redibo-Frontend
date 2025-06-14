'use client';

import { motion } from 'framer-motion';
import React from 'react';

type Props = {
    stars: number;
    percentage: number;
};

const RatingBar_Recode = ({ stars, percentage }: Props) => {
    return (
        <div className="flex items-center text-sm">
            <span className="w-4 mr-2 text-gray-700 dark:text-gray-300">{stars}</span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                    className="bg-black dark:bg-gray-500 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6 }}
                />
            </div>
        </div>
    );
};

export default RatingBar_Recode;
