// src/app/host/page/inputimagen/page.tsx
"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "../context/FormContext";

import CampoImagen from "../../../components/inputimagen/CampoImagen";
import CampoMantenimientos from "../../../components/inputimagen/CampoMantenimientos";
import CampoPrecio from "../../../components/inputimagen/CampoPrecio";
import CampoDescripcion from "../../../components/inputimagen/CampoDescripcion";
import BotonesFormulario from "../../../components/inputimagen/BotonesFormulario";

export default function InputImagen() {
  const { formData, updateFinalizacion, submitForm } = useFormContext();
  const { finalizacion } = formData;

  const refLock = useRef(false);
  const formRef = useRef({
    main: null as File | null,
    sec1: null as File | null,
    sec2: null as File | null,
    mantenimientos: "",
    precio: "",
    descripcion: ""
  });

  const [main, setMain] = useState<File | string | null>(finalizacion.imagenes[1] || null);
  const [sec1, setSec1] = useState<File | string | null>(finalizacion.imagenes[2] || null);
  const [sec2, setSec2] = useState<File | string | null>(finalizacion.imagenes[3] || null);
  const [mantenimientos, setMantenimientos] = useState(finalizacion.num_mantenimientos.toString());
  const [precio, setPrecio] = useState(finalizacion.precio_por_dia.toString());
  const [descripcion, setDescripcion] = useState(finalizacion.descripcion || "");

  const [errors, setErrors] = useState({
    main: null as string | null,
    sec1: null as string | null,
    sec2: null as string | null,
    mantenimientos: null as string | null,
    precio: null as string | null,
    descripcion: null as string | null
  });

  const [valid, setValid] = useState(false);

  // sync from context
  useEffect(() => {
    if (!finalizacion) return;
    refLock.current = true;
    setMantenimientos(finalizacion.num_mantenimientos.toString());
    setPrecio(finalizacion.precio_por_dia.toString());
    setDescripcion(finalizacion.descripcion || "");
    refLock.current = false;
  }, [finalizacion]);

  // update context
  const syncContext = useCallback(() => {
    if (refLock.current) return;
    const curr = { main, sec1, sec2, mantenimientos, precio, descripcion };
    const prev = formRef.current;
    if (
      curr.main !== prev.main ||
      curr.sec1 !== prev.sec1 ||
      curr.sec2 !== prev.sec2 ||
      curr.mantenimientos !== prev.mantenimientos ||
      curr.precio !== prev.precio ||
      curr.descripcion !== prev.descripcion
    ) {
      formRef.current = {
        ...curr,
        main: typeof curr.main === "string" ? null : curr.main,
        sec1: typeof curr.sec1 === "string" ? null : curr.sec1,
        sec2: typeof curr.sec2 === "string" ? null : curr.sec2,
      };
      updateFinalizacion({
        imagenes: [main, sec1, sec2].filter(Boolean) as File[],
        num_mantenimientos: mantenimientos ? parseInt(mantenimientos) : 0,
        precio_por_dia: precio ? parseFloat(precio) : 0,
        estado: "Disponible",
        descripcion
      });
    }
  }, [main, sec1, sec2, mantenimientos, precio, descripcion, updateFinalizacion]);

  useEffect(() => { syncContext(); }, [syncContext]);

  // validation
  useEffect(() => {
    const ok =
      main && !errors.main &&
      sec1 && !errors.sec1 &&
      sec2 && !errors.sec2 &&
      mantenimientos !== "" && !errors.mantenimientos &&
      precio !== "" && !errors.precio &&
      !errors.descripcion;
    setValid(!!ok);
  }, [main, sec1, sec2, mantenimientos, precio, descripcion, errors]);

  const handleSubmit = async () => {
    const res = await submitForm();
    return res;
  };

  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      <Link href="/host/home/add/caradicional" passHref>
        <Button
          variant="secondary"
          className="self-start mb-2 text-2xl px-2 py-1 transition-colors duration-200 hover:bg-zinc-200 hover:text-zinc-900"
        >
          <ChevronLeft className="h-9 w-9 mr-2" /> Volver
        </Button>
      </Link>
      <h1 className="text-4xl font-bold mb-6">Cargar Imágenes de tu vehículo:</h1>
      <p className="font-medium mb-4">
        Debe seleccionar exactamente tres imágenes: <span className="text-red-600">*</span>
      </p>

      <div className="w-full max-w-5xl px-9 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CampoImagen
            label="Principal"
            image={main}
            onImageChange={setMain}
            error={errors.main}
            setError={msg => setErrors(e => ({ ...e, main: msg }))}
            isPrimary
          />
          <CampoImagen
            label="Secundaria 1"
            image={sec1}
            onImageChange={setSec1}
            error={errors.sec1}
            setError={msg => setErrors(e => ({ ...e, sec1: msg }))}
          />
          <CampoImagen
            label="Secundaria 2"
            image={sec2}
            onImageChange={setSec2}
            error={errors.sec2}
            setError={msg => setErrors(e => ({ ...e, sec2: msg }))}
          />
        </div>

        <CampoMantenimientos
          mantenimientos={mantenimientos}
          setMantenimientos={setMantenimientos}
          error={errors.mantenimientos}
          setError={msg => setErrors(e => ({ ...e, mantenimientos: msg }))}
        />
        <CampoPrecio
          precio={precio}
          setPrecio={setPrecio}
          error={errors.precio}
          setError={msg => setErrors(e => ({ ...e, precio: msg }))}
        />
        <CampoDescripcion
          descripcion={descripcion}
          setDescripcion={setDescripcion}
          error={errors.descripcion}
          setError={msg => setErrors(e => ({ ...e, descripcion: msg }))}
        />
      </div>

      <BotonesFormulario isFormValid={valid} onSubmit={handleSubmit} />
    </div>
);
}
