import { Suspense } from "react";
import CoberturaRecodeClient from "./CoberturaRecodeClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando formulario...</div>}>
      <CoberturaRecodeClient />
    </Suspense>
  );
}
