"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CoberturaRecodeClient from "./CoberturaRecodeClient";

export default function Page() {
  const params = useParams();
  const [mostrar, setMostrar] = useState(false);
  const [idSeguro, setIdSeguro] = useState<number | null>(null);

  useEffect(() => {
    if (params.id) {
      const idNumber = Number(params.id);
      if (!isNaN(idNumber)) {
        setIdSeguro(idNumber);
        setMostrar(true);
      }
    }
  }, [params.id]);

  return mostrar && idSeguro !== null ? <CoberturaRecodeClient id_seguro={idSeguro} /> : null;
}