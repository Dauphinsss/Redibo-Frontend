"use client";

import React, { memo } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

function Modal_Recode({ isOpen, onClose, title = "", children }: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl max-w-lg w-full shadow-xl relative">
                <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
                <button
                onClick={onClose}
                className="absolute top-3 right-4 text-gray-400 hover:text-black text-lg font-bold"
                >
                ×
                </button>
                {children}
            </div>
        </div>
    );
}

export default memo(Modal_Recode);