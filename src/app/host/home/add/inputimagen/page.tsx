"use client";
import React, { useEffect, useState, useRef } from "react";
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

  // Para inicializar solo una vez localmente 
  const initialized = useRef(false);

  const [main, setMain] = useState<File | string | null>(null);
  const [sec1, setSec1] = useState<File | string | null>(null);
  const [sec2, setSec2] = useState<File | string | null>(null);
  const [mantenimientos, setMantenimientos] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [errors, setErrors] = useState({
    main: null as string | null,
    sec1: null as string | null,
    sec2: null as string | null,
    mantenimientos: null as string | null,
    precio: null as string | null,
    descripcion: null as string | null
  });

  const [valid, setValid] = useState(false);

  // Inicializa estado local una sola vez con datos del context
  useEffect(() => {
    if (!initialized.current && finalizacion) {
      setMain(finalizacion.imagenes[0] || null);
      setSec1(finalizacion.imagenes[1] || null);
      setSec2(finalizacion.imagenes[2] || null);
      setMantenimientos(finalizacion.num_mantenimientos.toString());
      setPrecio(finalizacion.precio_por_dia.toString());
      setDescripcion(finalizacion.descripcion || "");
      initialized.current = true;
    }
  }, [finalizacion]);

  // Actualizar context solo cuando los valores cambien
  useEffect(() => {
    // Solo después de la inicialización
    if (!initialized.current) return;

    const next = {
      imagenes: [main, sec1, sec2].filter(Boolean) as File[],
      num_mantenimientos: mantenimientos ? parseInt(mantenimientos) : 0,
      precio_por_dia: precio ? parseFloat(precio) : 0,
      estado: "Disponible",
      descripcion
    };

    const same =
      finalizacion.num_mantenimientos === next.num_mantenimientos &&
      finalizacion.precio_por_dia   === next.precio_por_dia   &&
      finalizacion.descripcion     === next.descripcion     &&
      finalizacion.imagenes.length === next.imagenes.length;

    if (!same) {
      updateFinalizacion(next);
    }
  }, [main, sec1, sec2, mantenimientos, precio, descripcion, finalizacion, updateFinalizacion]);

  // Validación de formulario: requiere 3 imágenes, número de mantenimientos y precio > 0
  useEffect(() => {
    const mantNum = parseInt(mantenimientos, 10);
    const precioNum = parseFloat(precio);

    const ok =
      Boolean(main) && !errors.main &&
      Boolean(sec1) && !errors.sec1 &&
      Boolean(sec2) && !errors.sec2 &&
      !isNaN(mantNum) && mantNum > 0 && !errors.mantenimientos &&
      !isNaN(precioNum) && precioNum > 0 && !errors.precio &&
      !errors.descripcion;

    setValid(ok);
  }, [main, sec1, sec2, mantenimientos, precio, errors]);

  const handleSubmit = async () => {
    try {
      await submitForm();
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
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

