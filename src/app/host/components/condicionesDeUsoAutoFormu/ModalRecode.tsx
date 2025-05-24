"use client";

import { useEffect } from "react";
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    HelpCircle,
} from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    variant: "success" | "error" | "warning" | "question";
    autoCloseAfter?: number;
    showConfirm?: boolean;
    onConfirm?: () => void;
    children?: React.ReactNode;
}

const icons = {
    success: <CheckCircle className="h-6 w-6 text-green-600" />,
    error: <XCircle className="h-6 w-6 text-red-600" />,
    warning: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
    question: <HelpCircle className="h-6 w-6 text-blue-600" />,
};

export default function ModalRecode({
    isOpen,
    onClose,
    title,
    description,
    variant,
    autoCloseAfter,
    showConfirm,
    onConfirm,
    children,
}: Props) {
    useEffect(() => {
        if (!isOpen || !autoCloseAfter) return;
        const timeout = setTimeout(() => {
        onClose();
        }, autoCloseAfter);
        return () => clearTimeout(timeout);
    }, [isOpen, autoCloseAfter, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
            <div className="bg-white max-w-sm w-full p-6 rounded-lg shadow-lg relative animate-fadeIn scale-100 transition-transform">
                <div className="flex items-center gap-3 mb-4">
                    {icons[variant]}
                    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                </div>

                <p className="text-sm text-gray-600 mb-4">{description}</p>

                {showConfirm ? (
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 transition"
                    >
                        Confirmar
                    </button>
                </div>
                ) : (
                    children
                )}
            </div>
        </div>
    );
}
