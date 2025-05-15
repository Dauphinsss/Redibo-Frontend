"use client";

import { Dialog, Transition } from "@headlessui/react";
import { BiHelpCircle } from "react-icons/bi";
import { Fragment, useEffect } from "react";
import { motion } from "framer-motion";
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";

type Variant = "success" | "error" | "question" | "warning";

interface ModalRecodeProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    variant?: Variant;
    autoCloseAfter?: number;
    children?: React.ReactNode;
}

const iconByVariant: Record<Variant, React.ReactNode> = {
    success: <CheckCircleIcon className="h-8 w-8 text-green-600" />,
    error: <XCircleIcon className="h-8 w-8 text-red-600" />,
    warning: <ExclamationCircleIcon className="h-8 w-8 text-yellow-500" />,
    question: <BiHelpCircle className="h-8 w-8 text-blue-600" />,
};

export default function ModalRecode({
    isOpen,
    onClose,
    title,
    description,
    variant = "success",
    autoCloseAfter,
    children,
}: ModalRecodeProps) {
    // Cierre automático si se indica
    useEffect(() => {
        if (isOpen && autoCloseAfter) {
        const timer = setTimeout(() => {
            onClose();
        }, autoCloseAfter);
        return () => clearTimeout(timer);
        }
    }, [isOpen, autoCloseAfter, onClose]);

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-50">
                {/* Fondo oscuro */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                {/* Contenido del modal */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel
                            as={motion.div}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
                        >
                            <div className="flex flex-col items-center text-center space-y-3">
                                {iconByVariant[variant]}
                                <Dialog.Title className="text-lg font-semibold text-black">
                                    {title}
                                </Dialog.Title>
                                <Dialog.Description className="text-sm text-gray-700">
                                    {description}
                                </Dialog.Description>
                            </div>

                            {/*Renderiza contenido personalizado si se proporciona */}
                            {children}

                            {/*Botón por defecto solo si no se pasan children */}
                            {!children && (
                                <div className="mt-5 flex justify-center">
                                    <button
                                        onClick={onClose}
                                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            )}
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
