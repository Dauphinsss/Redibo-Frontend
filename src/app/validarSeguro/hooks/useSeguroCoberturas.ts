import useSWR from "swr";
import { z } from "zod";
import { SeguroConCoberturas_Interface_Recode } from "@/app/validarSeguro/interface/SeguroConCoberturas_Interface_Recode";
import { useCoberturasStore } from "./useCoberturasStore";
import { getSeguroCompletoPorId } from "@/app/validarSeguro/services/servicesSeguro";

const SeguroSchema: z.ZodType<SeguroConCoberturas_Interface_Recode> = z.object({
  id_carro: z.number(),
  modelo_carro: z.string(),
  marca_carro: z.string(),
  imagenURL_carro: z.string(),
  id_propietario: z.number(),
  nombre_propietario: z.string(),
  telefono_propietario: z.string(),
  fotoURL_propietario: z.string(),
  fecha_inicio: z.string(),
  fecha_fin: z.string(),
  enlaceSeguroURL: z.string().nullable(),
  id_seguro: z.number(),
  nombre_empresa_seguro: z.string(),
  nombre_seguro: z.string(),
  tipo_seguro: z.string(),
  coberturas: z.array(
    z.object({
      id_cobertura: z.number(),
      tipodanio_cobertura: z.string(),
      descripcion_cobertura: z.string().optional(),
      cantida_cobertura: z.string(),
    })
  ),
});

export const useSeguroCoberturas = (id_seguro: number) =>
  useSWR(id_seguro ? ["seguro", id_seguro] : null, async () => {
    const raw = await getSeguroCompletoPorId(id_seguro);
    if (!raw) return null;

    const parsed = SeguroSchema.safeParse(raw);
    if (!parsed.success) {
      console.warn("Error al validar el seguro con Zod:", parsed.error.format());
      return null;
    }

    const setLista = useCoberturasStore.getState().setLista;
    setLista(
      parsed.data.coberturas.map((cob) => ({
        id: cob.id_cobertura,
        id_carro: parsed.data.id_carro,
        tipodaño: cob.tipodanio_cobertura,
        descripcion: cob.descripcion_cobertura ?? "",
        valides: cob.cantida_cobertura,
      })),
      parsed.data.id_carro
    );

    return parsed.data;
  });
