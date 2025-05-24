import { create } from "zustand";
import { CoberturaInterface } from "@/interface/CoberturaForm_Interface_Recode";

interface EstadoCobertura {
  lista: CoberturaInterface[];
  popup: { abierta: boolean; indice?: number };
  draft: CoberturaInterface | null;

  setLista: (nuevas: CoberturaInterface[]) => void;
  agregar: (c: CoberturaInterface) => void;
  editar: (i: number, c: CoberturaInterface) => void;
  eliminar: (i: number) => void;

  abrirPopup: (indice?: number) => void;
  cerrarPopup: () => void;
  setDraft: (c: CoberturaInterface) => void;
}

export const useCoberturasStore = create<EstadoCobertura>((set) => ({
  lista: [],
  popup: { abierta: false },
  draft: null,

  setLista: (nuevas) => set({ lista: nuevas }),

  agregar: (c) => set((s) => ({ lista: [...s.lista, c] })),

  editar: (i, c) =>
    set((s) => ({
      lista: s.lista.map((item, idx) => (idx === i ? c : item)),
    })),

  eliminar: (i) =>
    set((s) => ({
      lista: s.lista.filter((_, idx) => idx !== i),
    })),

  abrirPopup: (indice) =>
    set((s) => ({
      popup: { abierta: true, indice },
      draft: indice !== undefined ? s.lista[indice] : null,
    })),

  cerrarPopup: () => set({ popup: { abierta: false }, draft: null }),

  setDraft: (c) => set({ draft: c }),
}));
