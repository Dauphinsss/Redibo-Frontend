"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CoberturaRecodeClient from "./CoberturaRecodeClient";

export default function Page() {
  const { id } = useParams();
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    if (id) setMostrar(true);
  }, [id]);

  return mostrar ? <CoberturaRecodeClient id_carro={String(id)} /> : null;
}
