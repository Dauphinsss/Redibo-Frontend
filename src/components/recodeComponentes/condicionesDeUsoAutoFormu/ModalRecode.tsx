"use client";

import { ReactNode, useEffect, MouseEvent, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { XCircle, CheckCircle, AlertTriangle, Info } from "lucide-react";

type ModalVariant = "success" | "error" | "warning" | "info";

interface ModalRecodeProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    variant?: ModalVariant;
    children?: ReactNode;
    actions?: ReactNode;
    showCloseButton?: boolean;
    autoCloseAfter?: number;
}

function ModalRecode({
    isOpen,
    onClose,
    title,
    description,
    variant = "info",
    children,
    actions,
    showCloseButton = true,
    autoCloseAfter,
}: ModalRecodeProps) {
    const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
        };

        if (isOpen) {
        window.addEventListener("keydown", handleKey);
        }

        return () => {
        window.removeEventListener("keydown", handleKey);
        };
    }, [isOpen, onClose]);

    // Cierre automático si se define autoCloseAfter
    useEffect(() => {
        if (isOpen && autoCloseAfter) {
            const timer = setTimeout(() => onClose(), autoCloseAfter);
            return () => clearTimeout(timer);
        }
    }, [isOpen, autoCloseAfter, onClose]);

    const variantStyles = {
        success: {
            color: "text-green-600",
            icon: <CheckCircle className="w-10 h-10 text-green-600" />,
        },
        error: {
            color: "text-red-600",
            icon: <XCircle className="w-10 h-10 text-red-600" />,
        },
        warning: {
            color: "text-yellow-600",
            icon: <AlertTriangle className="w-10 h-10 text-yellow-600" />,
        },
        info: {
            color: "text-blue-600",
            icon: <Info className="w-10 h-10 text-blue-600" />,
        },
    };

    const { icon, color } = variantStyles[variant];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="modal-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={handleOverlayClick}
                    >
                    <motion.div
                        key="modal-content"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center space-y-4"
                    >
                        <div className="flex justify-center">{icon}</div>
                        {title && <h2 className={`text-xl font-semibold ${color}`}>{title}</h2>}
                        {description && <p className="text-gray-700">{description}</p>}
                        {children}
                        {actions && <div className="flex justify-center gap-4 mt-4">{actions}</div>}
                        {!actions && showCloseButton && (
                            <div className="mt-4">
                                <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                                >
                                    Cerrar
                                </button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
export default memo(ModalRecode);