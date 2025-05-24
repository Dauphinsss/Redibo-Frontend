import useSWR from "swr";
import { z } from "zod";
import { getInsuranceByID } from "@/service/services_Recode";
import { SeguroConCoberturas_Interface_Recode } from "@/interface/SeguroConCoberturas_Interface_Recode";

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
  enlaceSeguroURL: z.string(),
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

export const useSeguroCoberturas = (id_carro: string) =>
  useSWR(id_carro ? ["seguro", id_carro] : null, async () => {
    const raw = await getInsuranceByID(id_carro);
    if (!raw) return null;
    return SeguroSchema.parse(raw);
  });
