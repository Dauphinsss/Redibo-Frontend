import { useMemo } from "react";

const normalizeText = (text: string) =>
  text
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export function useCaracAdicionales(caracteristicasDelAuto: string[] = []) {
  return useMemo(() => {
    const caracteristicasSet = new Set(
      (caracteristicasDelAuto ?? []).map(normalizeText)
    );

    const presentes = caracteristicasDelAuto.filter((caracteristica) =>
      caracteristicasSet.has(normalizeText(caracteristica))
    );

    return { presentes };
  }, [caracteristicasDelAuto]);
}
