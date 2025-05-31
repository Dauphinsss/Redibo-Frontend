"use client";

import { memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";

export interface TipoSeguro {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface PlanSeguro {
  nombre: string;
  tipos: TipoSeguro[];
}

interface Props {
  planes: PlanSeguro[];
  visible: boolean;
  onClose?: () => void;
}

function PlanesSeguroDropdown_Recode({ planes, visible, onClose }: Props) {
  // Cerrar con tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-2 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4 space-y-4 overflow-hidden"
          role="region"
          aria-label="Lista de planes de seguros"
          onClick={onClose}
        >
          {planes.map((plan, index) => (
            <div key={index} className="text-sm space-y-2">
              <p className="font-semibold text-black dark:text-white">{plan.nombre}</p>
              <ul className="flex flex-wrap gap-2" role="list" aria-label={`Tipos de ${plan.nombre}`}>
                {plan.tipos.map((tipo, tipoIdx) => (
                  <li key={`${plan.nombre}-${tipo.nombre}-${tipoIdx}`} role="listitem">
                    <a
                      href={`/validarSeguro/plan/${tipo.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={tipo.descripcion || `Ver más sobre ${tipo.nombre}`}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-black text-white text-sm font-medium hover:bg-white hover:text-black hover:border hover:border-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-black transition"
                    >
                      {tipo.nombre}
                      <FaExternalLinkAlt className="text-xs" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(PlanesSeguroDropdown_Recode);
