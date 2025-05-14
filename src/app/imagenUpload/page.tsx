import { Suspense } from "react";
import ImagenUploadClient from "./ImagenUploadClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ImagenUploadClient />
    </Suspense>
  );
}
