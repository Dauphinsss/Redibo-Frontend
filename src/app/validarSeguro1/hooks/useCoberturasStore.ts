import { create } from "zustand";
import { CoberturaInterface } from "@/app/validarSeguro1/interface/CoberturaForm_Interface_Recode";

interface EstadoCobertura {
  lista: (CoberturaInterface & { isNew?: boolean })[];
  id_carro_actual: number;
  popup: { abierta: boolean; indice?: number };
  draft: CoberturaInterface | null;

  setLista: (nuevas: CoberturaInterface[], id_carro: number) => void;
  agregar: (c: CoberturaInterface) => void;
  editar: (i: number, c: CoberturaInterface) => void;
  eliminar: (i: number) => void;

  abrirPopup: (indice?: number) => void;
  cerrarPopup: () => void;
  setDraft: (c: CoberturaInterface) => void;
}

export const useCoberturasStore = create<EstadoCobertura>((set) => ({
  lista: [],
  id_carro_actual: 0,
  popup: { abierta: false },
  draft: null,

  setLista: (nuevas, id_carro) =>
    set({
      lista: nuevas.map((c) => ({ ...c, isNew: false })),
      id_carro_actual: id_carro,
    }),

  agregar: (c) =>
    set((s) => ({
      lista: [...s.lista, { ...c, isNew: true }],
    })),

  editar: (i, c) =>
    set((s) => ({
      lista: s.lista.map((item, idx) =>
        idx === i ? { ...c, isNew: item.isNew } : item
      ),
    })),

  eliminar: (i) =>
    set((s) => ({
      lista: s.lista.filter((_, idx) => idx !== i),
    })),

  abrirPopup: (indice) =>
    set((state) => {
      const draft =
        indice !== undefined
          ? state.lista[indice]
          : {
              id: Date.now(),
              id_carro: state.id_carro_actual,
              tipodaño: "",
              descripcion: "",
              valides: "0B",
            };

      return {
        popup: { abierta: true, indice },
        draft,
      };
    }),

  cerrarPopup: () => set({ popup: { abierta: false }, draft: null }),

  setDraft: (c) => set({ draft: c }),
}));
