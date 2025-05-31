import { useMemo } from "react";

const todasLasCaracteristicas = [
  "Aire acondicionado",
  "Bluetooth",
  "GPS",
  "Portabicicletas",
  "Soporte para esquís",
  "Pantalla táctil",
  "Sillas para bebé",
  "Cámara de reversa",
  "Asientos de cuero",
  "Sistema antirrobo",
  "Toldo o rack de techo",
  "Vidrios polarizados",
  "Sistema de sonido",
];

// Función para normalizar textos
const normalizeText = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export function useCaracAdicionales(caracteristicasDelAuto: string[] = []) {
  return useMemo(() => {
    const todasLasCaracteristicasNormalizadas =
      todasLasCaracteristicas.map(normalizeText);
    const caracteristicasSet = new Set(
      (caracteristicasDelAuto ?? []).map(normalizeText)
    );

    const presentes = todasLasCaracteristicasNormalizadas.filter(
      (caracteristica) => caracteristicasSet.has(caracteristica)
    );

    const faltantes = todasLasCaracteristicasNormalizadas.filter(
      (caracteristica) => !caracteristicasSet.has(caracteristica)
    );

    return { presentes, faltantes };
  }, [caracteristicasDelAuto]);
}
