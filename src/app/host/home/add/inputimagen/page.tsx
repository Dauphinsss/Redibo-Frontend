"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "../context/FormContext";

// Componentes modulares
import CampoImagen from "../../../components/inputimagen/CampoImagen";
import CampoMantenimientos from "../../../components/inputimagen/CampoMantenimientos";
import CampoPrecio from "../../../components/inputimagen/CampoPrecio";
import CampoDescripcion from "../../../components/inputimagen/CampoDescripcion";
import BotonesFormulario from "../../../components/inputimagen/BotonesFormulario";

export default function InputImagen() {
  const { formData, updateFinalizacion, submitForm } = useFormContext();
  const { finalizacion } = formData;

  const updatingFromContextRef = useRef(false);
  const formDataRef = useRef({
    mainImage: null as File | null,
    secondaryImage1: null as File | null,
    secondaryImage2: null as File | null,
    mantenimientos: "",
    precio: "",
    descripcion: ""
  });

  const [mainImage, setMainImage] = useState<File | null>(finalizacion?.imagenes?.[0] || null);
  const [secondaryImage1, setSecondaryImage1] = useState<File | null>(finalizacion?.imagenes?.[1] || null);
  const [secondaryImage2, setSecondaryImage2] = useState<File | null>(finalizacion?.imagenes?.[2] || null);

  const [mantenimientos, setMantenimientos] = useState<string>(finalizacion?.num_mantenimientos?.toString() || "");
  const [precio, setPrecio] = useState<string>(finalizacion?.precio_por_dia?.toString() || "");
  const [descripcion, setDescripcion] = useState<string>(finalizacion?.descripcion || "");

  const [mainImageError, setMainImageError] = useState<string | null>(null);
  const [secondaryImage1Error, setSecondaryImage1Error] = useState<string | null>(null);
  const [secondaryImage2Error, setSecondaryImage2Error] = useState<string | null>(null);
  const [mantenimientosError, setMantenimientosError] = useState<string | null>(null);
  const [precioError, setPrecioError] = useState<string | null>(null);
  const [descripcionError, setDescripcionError] = useState<string | null>(null);

  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // Sincroniza desde contexto sólo cuando finalizacion cambia
  useEffect(() => {
    if (!finalizacion) return;
    updatingFromContextRef.current = true;

    setMantenimientos(finalizacion.num_mantenimientos?.toString() || "");
    setPrecio(finalizacion.precio_por_dia?.toString() || "");
    setDescripcion(finalizacion.descripcion || "");

    updatingFromContextRef.current = false;
  }, [finalizacion]);

  // Actualiza contexto cuando cambian los estados locales
  const updateContextSafely = useCallback(() => {
    if (updatingFromContextRef.current) return;

    const currentData = { mainImage, secondaryImage1, secondaryImage2, mantenimientos, precio, descripcion };
    const prevData = formDataRef.current;

    const changed =
      prevData.mainImage !== currentData.mainImage ||
      prevData.secondaryImage1 !== currentData.secondaryImage1 ||
      prevData.secondaryImage2 !== currentData.secondaryImage2 ||
      prevData.mantenimientos !== currentData.mantenimientos ||
      prevData.precio !== currentData.precio ||
      prevData.descripcion !== currentData.descripcion;

    if (!changed) return;

    formDataRef.current = { ...currentData };

    updateFinalizacion({
      imagenes: [mainImage, secondaryImage1, secondaryImage2].filter(Boolean) as File[],
      num_mantenimientos: mantenimientos ? parseInt(mantenimientos) : 0,
      precio_por_dia: precio ? parseFloat(precio) : 0,
      estado: "disponible",
      descripcion
    });
  }, [mainImage, secondaryImage1, secondaryImage2, mantenimientos, precio, descripcion, updateFinalizacion]);

  useEffect(() => {
    updateContextSafely();
  }, [mainImage, secondaryImage1, secondaryImage2, mantenimientos, precio, descripcion, updateContextSafely]);

  useEffect(() => {
    const valid =
      mainImage && !mainImageError &&
      secondaryImage1 && !secondaryImage1Error &&
      secondaryImage2 && !secondaryImage2Error &&
      mantenimientos !== "" && !mantenimientosError &&
      precio !== "" && !precioError &&
      !descripcionError;

    setIsFormValid(!!valid);
  }, [
    mainImage, mainImageError,
    secondaryImage1, secondaryImage1Error,
    secondaryImage2, secondaryImage2Error,
    mantenimientos, mantenimientosError,
    precio, precioError,
    descripcionError
  ]);

  const handleSubmit = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      await submitForm();
      return { success: true };
    } catch (error: unknown) {
      let message = "Error desconocido";
      if (error instanceof Error) {
        message = error.message;
      }
      console.error("Error al enviar el formulario:", error);
      return { success: false, error: message };
    }
  };

  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      <Link href="/host/home/add/caradicional" passHref>
        <Button variant="secondary" className="self-start mb-4">
          <ChevronLeft className="h-3 w-3 mr-1" /> Volver
        </Button>
      </Link>

      <h1 className="text-4xl font-bold mb-6">Cargar Imágenes de tu vehículo:</h1>
      <p className="font-medium mb-4">
        Debe cargar obligatoriamente tres imágenes: <span className="text-red-600">*</span>
      </p>

      <div className="w-full max-w-5xl px-9 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CampoImagen image={mainImage} onImageChange={setMainImage} error={mainImageError} setError={setMainImageError} />
          <CampoImagen image={secondaryImage1} onImageChange={setSecondaryImage1} error={secondaryImage1Error} setError={setSecondaryImage1Error} />
          <CampoImagen image={secondaryImage2} onImageChange={setSecondaryImage2} error={secondaryImage2Error} setError={setSecondaryImage2Error} />
        </div>

        <CampoMantenimientos mantenimientos={mantenimientos} setMantenimientos={setMantenimientos} error={mantenimientosError} setError={setMantenimientosError} />
        <CampoPrecio precio={precio} setPrecio={setPrecio} error={precioError} setError={setPrecioError} />
        <CampoDescripcion descripcion={descripcion} setDescripcion={setDescripcion} error={descripcionError} setError={setDescripcionError} />
      </div>

      <BotonesFormulario isFormValid={isFormValid} onSubmit={handleSubmit} />
    </div>
  );
}
