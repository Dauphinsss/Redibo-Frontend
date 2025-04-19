"use client";
import React, { useState, useEffect, useCallback } from "react";
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
  
  // Estado para almacenar las imágenes cargadas
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [secondaryImage1, setSecondaryImage1] = useState<File | null>(null);
  const [secondaryImage2, setSecondaryImage2] = useState<File | null>(null);
  
  // Estado para los valores de los campos
  const [mantenimientos, setMantenimientos] = useState<string>("");
  const [precio, setPrecio] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  
  // Estado para mensajes de error
  const [mainImageError, setMainImageError] = useState<string | null>(null);
  const [secondaryImage1Error, setSecondaryImage1Error] = useState<string | null>(null);
  const [secondaryImage2Error, setSecondaryImage2Error] = useState<string | null>(null);
  const [mantenimientosError, setMantenimientosError] = useState<string | null>(null);
  const [precioError, setPrecioError] = useState<string | null>(null);
  const [descripcionError, setDescripcionError] = useState<string | null>(null);
  
  // Estado para controlar la habilitación del botón finalizar - AÑADIDO
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // Función estable para actualizar el contexto
  const updateContext = useCallback(() => {
    updateFinalizacion({
      imagenes: [mainImage, secondaryImage1, secondaryImage2].filter(Boolean) as File[],
      mantenimientos: mantenimientos ? parseInt(mantenimientos) : 0,
      precioAlquiler: precio ? parseFloat(precio) : 0,
      descripcion
    });
  }, [mainImage, secondaryImage1, secondaryImage2, mantenimientos, precio, descripcion, updateFinalizacion]);

  // Efecto para validación del formulario
  useEffect(() => {
    const isValid = 
      mainImage !== null && mainImageError === null &&
      secondaryImage1 !== null && secondaryImage1Error === null &&
      secondaryImage2 !== null && secondaryImage2Error === null &&
      mantenimientos !== "" && mantenimientosError === null &&
      precio !== "" && precioError === null &&
      descripcionError === null;
    
    setIsFormValid(isValid);
  }, [
    mainImage, mainImageError,
    secondaryImage1, secondaryImage1Error,
    secondaryImage2, secondaryImage2Error,
    mantenimientos, mantenimientosError,
    precio, precioError,
    descripcionError
  ]);

  // Efecto para actualizar el contexto (con dependencias estables)
  useEffect(() => {
    updateContext();
  }, [updateContext]);

  const handleSubmit = async () => {
    try {
      await submitForm();
      return true;
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      return false;
    }
  };

  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      {/* Botón Volver */}
      <Link href="/host/home/add/caradicional" passHref>
        <Button
          variant="secondary"
          className="flex items-center gap-1 self-start justify-start cursor-pointer w-32 h-10 text-base font-medium transition-all duration-200 hover:bg-gray-100 hover:brightness-90"
        >
          <ChevronLeft className="h-3 w-3" />
          Volver
        </Button>
      </Link>

      {/* Título */}
      <div className="w-full max-w-5xl flex justify-start">
        <h1 className="text-4xl font-bold my-5 pl-7">Cargar Imágenes de tu vehículo:</h1>
      </div>

      <div className="flex flex-col mt-6">
        <label className="text-base font-medium mb-2">
          Debe cargar obligatoriamente tres imágenes: <span className="text-red-600">*</span>
        </label>
      </div>

      {/* Formulario de carga de imágenes */}
      <div className="w-full max-w-5xl px-9 space-y-6">
        {/* Área de carga de imágenes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CampoImagen 
            image={mainImage}
            onImageChange={setMainImage}
            error={mainImageError}
            setError={setMainImageError}
          />
          
          <CampoImagen 
            image={secondaryImage1}
            onImageChange={setSecondaryImage1}
            error={secondaryImage1Error}
            setError={setSecondaryImage1Error}
          />
          
          <CampoImagen 
            image={secondaryImage2}
            onImageChange={setSecondaryImage2}
            error={secondaryImage2Error}
            setError={setSecondaryImage2Error}
          />
        </div>
        
        <CampoMantenimientos
          mantenimientos={mantenimientos}
          setMantenimientos={setMantenimientos}
          error={mantenimientosError}
          setError={setMantenimientosError}
        />

        <CampoPrecio
          precio={precio}
          setPrecio={setPrecio}
          error={precioError}
          setError={setPrecioError}
        />

        <CampoDescripcion
          descripcion={descripcion}
          setDescripcion={setDescripcion}
          error={descripcionError}
          setError={setDescripcionError}
        />
      </div>

      <BotonesFormulario 
        isFormValid={isFormValid} 
        onSubmit={handleSubmit} 
      />
    </div>
  );
}