"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

interface Props {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function ModalEliminar({ visible, onClose, onConfirm }: Props) {
    return (
        <AnimatePresence>
        {visible && (
            <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            >
                <motion.div
                    className="bg-white px-6 py-8 rounded-2xl shadow-2xl max-w-sm w-full text-center relative"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                    <div className="flex justify-center mb-4">
                        <Trash2 className="w-10 h-10 text-red-600" />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900">
                        ¿Eliminar cobertura?
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                        Esta acción no se puede deshacer. ¿Estás seguro de continuar?
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => {
                            onConfirm();
                            onClose();
                            }}
                            className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        >
                            Sí, eliminar
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    );
}
