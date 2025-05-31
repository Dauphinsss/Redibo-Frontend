"use client";

import React, { memo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

function Modal_Recode({ isOpen, onClose, title = "", children }: Props) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Cerrar con ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // Cerrar al hacer clic fuera
    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
        }
    };

    return (
        <AnimatePresence>
        {isOpen && (
            <motion.div
                onClick={handleClickOutside}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50"
                >
                <motion.div
                    ref={modalRef}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white p-6 rounded-xl max-w-lg w-full shadow-xl relative"
                >
                    <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
                    <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-400 hover:text-black text-lg font-bold"
                    >
                    ×
                    </button>
                    {children}
                </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    );
}

export default memo(Modal_Recode);