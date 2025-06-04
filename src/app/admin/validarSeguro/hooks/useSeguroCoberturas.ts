import useSWR from "swr";
import { z } from "zod";
import { 
    SeguroConCoberturas_Interface_Recode
} from "@/app/admin/validarSeguro/interface/SeguroConCoberturas_Interface_Recode";
import { CoberturaInterface } from "@/app/admin/validarSeguro/interface/SeguroConCoberturas_Interface_Recode"; 
import { useCoberturasStore } from "./useCoberturasStore";
import { getSeguroCompletoPorId } from "@/app/admin/validarSeguro/services/servicesSeguro";

const CoberturaTransformadaSchema = z.object({
  id_cobertura: z.number(),
  tipodanio_cobertura: z.string(),
  descripcion_cobertura: z.string().optional().nullable(), // Ajustado a opcional y nulable
  cantida_cobertura: z.string(),
});

const SeguroSchema: z.ZodType<SeguroConCoberturas_Interface_Recode> = z.object({
  id_poliza_seguro_carro: z.number(),
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
  coberturas: z.array(CoberturaTransformadaSchema),
});

export const useSeguroCoberturas = (id_poliza_param: number) =>
  useSWR(
    id_poliza_param ? ["seguroCompleto", id_poliza_param] : null,
    async () => {
      const datosTransformados = await getSeguroCompletoPorId(id_poliza_param);

      if (!datosTransformados) {
        console.warn(`Hook: No se encontraron datos transformados para la póliza ID: ${id_poliza_param}`);
        return null;
      }

      // Validar los datos transformados con Zod
      const parsed = SeguroSchema.safeParse(datosTransformados);
      if (!parsed.success) {
        console.warn("Hook: Error al validar los datos transformados del seguro con Zod:", parsed.error.format());
        return null; 
      }

      const datosValidados = parsed.data;
      const { setLista } = useCoberturasStore.getState();

      const coberturasParaStore: CoberturaInterface[] = datosValidados.coberturas.map((cob) => ({
        id: cob.id_cobertura,
        id_poliza: datosValidados.id_poliza_seguro_carro,
        tipodaño: cob.tipodanio_cobertura,
        descripcion: cob.descripcion_cobertura ?? "",
        valides: cob.cantida_cobertura,
      }));
      
      setLista(
        coberturasParaStore,
        datosValidados.id_poliza_seguro_carro 
      );

      return datosValidados;
    },
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );