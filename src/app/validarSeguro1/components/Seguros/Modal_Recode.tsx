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

    // Cerrar al hacer clic fuera del modal
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
                        className="bg-white rounded-xl max-w-lg w-full shadow-xl relative flex flex-col max-h-[80vh]"
                    >
                        {/* Encabezado fijo */}
                        <div className="p-4 border-b sticky top-0 z-10 bg-white flex justify-between items-center rounded-t-xl">
                            <h2 className="text-xl font-bold">{title}</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-black text-lg font-bold"
                            >
                                ×
                            </button>
                        </div>

                        {/* Contenido con scroll */}
                        <div className="p-6 overflow-y-auto">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default memo(Modal_Recode);