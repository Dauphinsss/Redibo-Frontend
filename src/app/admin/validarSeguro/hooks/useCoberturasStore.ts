import { create } from "zustand";
import { CoberturaInterface } from "../interface/SeguroConCoberturas_Interface_Recode";
interface EstadoCobertura {
  lista: (CoberturaInterface & { isNew?: boolean })[];
  id_poliza_actual: number;
  popup: { abierta: boolean; indice?: number };
  draft: CoberturaInterface | null;

  setLista: (nuevas: CoberturaInterface[], id_poliza_param: number) => void;
  agregar: (c: CoberturaInterface) => void;
  editar: (i: number, c: CoberturaInterface) => void;
  eliminar: (i: number) => void;

  abrirPopup: (indice?: number) => void;
  cerrarPopup: () => void;
  setDraft: (c: CoberturaInterface | null) => void;
}

export const useCoberturasStore = create<EstadoCobertura>((set) => ({
  lista: [],
  id_poliza_actual: 0,
  popup: { abierta: false },
  draft: null,

  setLista: (nuevas, id_poliza_param) =>
    set({
      lista: nuevas.map((c) => ({ ...c, isNew: false })),
      id_poliza_actual: id_poliza_param,
    }),

  agregar: (c) =>
    set((state) => ({
      lista: [...state.lista, { ...c, isNew: true }], 
    })),

  editar: (i, c) =>
    set((state) => ({
      lista: state.lista.map((item, idx) =>
        idx === i ? { ...c, isNew: item.isNew } : item
      ),
    })),

  eliminar: (i) =>
    set((state) => ({
      lista: state.lista.filter((_, idx) => idx !== i),
    })),

  abrirPopup: (indice?: number) =>
    set((state) => {
      let draftData: CoberturaInterface;
      if (indice !== undefined && state.lista[indice]) {
        draftData = { ...state.lista[indice] };
      } else {
        draftData = {
          id: Date.now(),
          id_poliza: state.id_poliza_actual, 
          tipodaño: "",
          descripcion: "",
          valides: "0B",
        };
      }
      return {
        popup: { abierta: true, indice },
        draft: draftData,
      };
    }),

  cerrarPopup: () => set({ popup: { abierta: false }, draft: null }),

  setDraft: (c) => set({ draft: c }),
}));