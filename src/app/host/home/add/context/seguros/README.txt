Explicación de los archivos

        types.ts: Define la interfaz SeguroAdicional y SegurosContextType, además de la constante SEGUROS_STORAGE_KEY para el almacenamiento local.
        segurosActions.ts: Contiene las funciones para manipular los seguros (agregar, eliminar, actualizar, etc.).
        segurosStorage.ts: Se encarga exclusivamente de la persistencia, con funciones para cargar y guardar datos en localStorage.
        SegurosContext.tsx: Implementa el contexto usando los hooks de React y los componentes anteriores.
        index.ts: Exporta la API pública del contexto de seguros.
        contexts/index.ts: Punto de entrada principal que re-exporta todos los contextos.
Actualización de importaciones
Con esta estructura, puedes actualizar las importaciones en tus componentes de la siguiente manera:
Antes:
import { SegurosProvider, useSegurosContext } from "@/contexts/SegurosContext";
Después (opción 1 - importar directamente del módulo seguros):
import { SegurosProvider, useSegurosContext } from "@/contexts/seguros";
Después (opción 2 - importar desde el índice principal):
import { SegurosProvider, useSegurosContext } from "@/contexts";