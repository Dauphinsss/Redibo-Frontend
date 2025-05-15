'use client';

import { useParams } from "next/navigation";
import CoberturaRecodeClient from "./CoberturaRecodeClient";
import { useEffect, useState } from "react";

export default function Page() {
  const { id } = useParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (id) setShow(true);
  }, [id]);

  return show ? <CoberturaRecodeClient id_carro={String(id)} /> : null;
}