"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function InputImagen() {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  
  // Referencias para los inputs de archivo
  const mainImageRef = useRef<HTMLInputElement>(null);
  const secondaryImage1Ref = useRef<HTMLInputElement>(null);
  const secondaryImage2Ref = useRef<HTMLInputElement>(null);
  
  // Estado para almacenar las imágenes cargadas
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [secondaryImage1, setSecondaryImage1] = useState<string | null>(null);
  const [secondaryImage2, setSecondaryImage2] = useState<string | null>(null);
  
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
  
  // Estado para controlar la habilitación del botón finalizar
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // Validar que el archivo sea una imagen png o jpg y no exceda los 2MB
  const validateImage = (file: File): string | null => {
    // Validar tipo de archivo
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return "Solo se permiten imágenes PNG y JPG";
    }
    
    // Validar tamaño (2MB = 2 * 1024 * 1024 bytes)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return "La imagen no debe exceder los 2MB";
    }
    
    return null;
  };

  // Maneja la carga de la imagen principal
  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const error = validateImage(file);
      
      if (error) {
        setMainImageError(error);
        setMainImage(null);
        // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
        if (mainImageRef.current) mainImageRef.current.value = '';
      } else {
        setMainImageError(null);
        setMainImage(URL.createObjectURL(file));
      }
    }
  };

  // Maneja la carga de la imagen secundaria 1
  const handleSecondaryImage1Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const error = validateImage(file);
      
      if (error) {
        setSecondaryImage1Error(error);
        setSecondaryImage1(null);
        if (secondaryImage1Ref.current) secondaryImage1Ref.current.value = '';
      } else {
        setSecondaryImage1Error(null);
        setSecondaryImage1(URL.createObjectURL(file));
      }
    }
  };

  // Maneja la carga de la imagen secundaria 2
  const handleSecondaryImage2Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const error = validateImage(file);
      
      if (error) {
        setSecondaryImage2Error(error);
        setSecondaryImage2(null);
        if (secondaryImage2Ref.current) secondaryImage2Ref.current.value = '';
      } else {
        setSecondaryImage2Error(null);
        setSecondaryImage2(URL.createObjectURL(file));
      }
    }
  };

  // Funciones para manejar los clics en los botones de carga
  const handleMainImageClick = () => {
    if (mainImageRef.current) {
      mainImageRef.current.click();
    }
  };

  const handleSecondaryImage1Click = () => {
    if (secondaryImage1Ref.current) {
      secondaryImage1Ref.current.click();
    }
  };

  const handleSecondaryImage2Click = () => {
    if (secondaryImage2Ref.current) {
      secondaryImage2Ref.current.click();
    }
  };

  // Validar número de mantenimientos
  const handleMantenimientosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMantenimientos(value);
    
    if (value === "") {
      setMantenimientosError("Este campo es obligatorio");
    } else {
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 0) {
        setMantenimientosError("Debe ser un número igual o mayor a 0");
      } else {
        setMantenimientosError(null);
      }
    }
  };

  // Validar precio
  const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrecio(value);
    
    if (value === "") {
      setPrecioError("Este campo es obligatorio");
    } else {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 1) {
        setPrecioError("Debe ser un número mayor o igual a 1");
      } else {
        setPrecioError(null);
      }
    }
  };

  // Validar descripción
  const handleDescripcionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Limitar a 150 caracteres
    if (value.length <= 150) {
      setDescripcion(value);
    }
    
    if (value.length === 0) {
      setDescripcionError("Este campo es obligatorio");
    } else if (value.length > 150) {
      setDescripcionError("La descripción no debe superar los 150 caracteres");
    } else {
      setDescripcionError(null);
    }
  };

  // Verificar validez del formulario cuando cualquier estado cambie
  useEffect(() => {
    const isValid = 
      // Todas las imágenes subidas y sin errores
      mainImage !== null && mainImageError === null &&
      secondaryImage1 !== null && secondaryImage1Error === null &&
      secondaryImage2 !== null && secondaryImage2Error === null &&
      // Mantenimientos válido
      mantenimientos !== "" && mantenimientosError === null &&
      // Precio válido
      precio !== "" && precioError === null &&
      // Descripción válida
      descripcion !== "" && descripcionError === null;
    
    setIsFormValid(isValid);
  }, [
    mainImage, mainImageError,
    secondaryImage1, secondaryImage1Error,
    secondaryImage2, secondaryImage2Error,
    mantenimientos, mantenimientosError,
    precio, precioError,
    descripcion, descripcionError
  ]);

  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      {/* Botón Volver */}
      <Link href="/host/home/add/carcoche">
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

      {/* Formulario de carga de imágenes */}
      <div className="w-full max-w-5xl px-9 space-y-6">
        {/* Área de carga de imágenes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Imagen principal - Más grande */}
          <div className="col-span-1">
            <div 
              className={`border rounded-md bg-gray-50 h-64 flex flex-col items-center justify-center p-4 relative ${mainImageError ? 'border-red-500' : ''}`}
              style={{
                backgroundImage: mainImage ? `url(${mainImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {!mainImage && <Upload className="h-10 w-10 text-gray-400 mb-2" />}
              <input
                type="file"
                ref={mainImageRef}
                onChange={handleMainImageUpload}
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
              />
              <Button 
                variant="outline" 
                className={`${mainImage ? 'bg-white bg-opacity-70' : 'bg-white'}`}
                onClick={handleMainImageClick}
              >
                {mainImage ? "Cambiar imagen" : "Elige una foto a subir"}
              </Button>
              {mainImageError && (
                <div className="text-red-500 text-sm mt-1 bg-white bg-opacity-70 p-1 rounded flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {mainImageError}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">*Solo PNG/JPG, máx. 2MB</p>
          </div>
          
          {/* Imagen secundaria 1 */}
          <div className="col-span-1">
            <div 
              className={`border rounded-md bg-gray-50 h-64 flex flex-col items-center justify-center p-4 relative ${secondaryImage1Error ? 'border-red-500' : ''}`}
              style={{
                backgroundImage: secondaryImage1 ? `url(${secondaryImage1})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {!secondaryImage1 && <Upload className="h-10 w-10 text-gray-400 mb-2" />}
              <input
                type="file"
                ref={secondaryImage1Ref}
                onChange={handleSecondaryImage1Upload}
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
              />
              <Button 
                variant="outline" 
                className={`${secondaryImage1 ? 'bg-white bg-opacity-70' : 'bg-white'}`}
                onClick={handleSecondaryImage1Click}
              >
                {secondaryImage1 ? "Cambiar imagen" : "Elige una foto a subir"}
              </Button>
              {secondaryImage1Error && (
                <div className="text-red-500 text-sm mt-1 bg-white bg-opacity-70 p-1 rounded flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {secondaryImage1Error}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">*Solo PNG/JPG, máx. 2MB</p>
          </div>
          
          {/* Imagen secundaria 2 */}
          <div className="col-span-1">
            <div 
              className={`border rounded-md bg-gray-50 h-64 flex flex-col items-center justify-center p-4 relative ${secondaryImage2Error ? 'border-red-500' : ''}`}
              style={{
                backgroundImage: secondaryImage2 ? `url(${secondaryImage2})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {!secondaryImage2 && <Upload className="h-10 w-10 text-gray-400 mb-2" />}
              <input
                type="file"
                ref={secondaryImage2Ref}
                onChange={handleSecondaryImage2Upload}
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
              />
              <Button 
                variant="outline" 
                className={`${secondaryImage2 ? 'bg-white bg-opacity-70' : 'bg-white'}`}
                onClick={handleSecondaryImage2Click}
              >
                {secondaryImage2 ? "Cambiar imagen" : "Elige una foto a subir"}
              </Button>
              {secondaryImage2Error && (
                <div className="text-red-500 text-sm mt-1 bg-white bg-opacity-70 p-1 rounded flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {secondaryImage2Error}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">*Solo PNG/JPG, máx. 2MB</p>
          </div>
        </div>
        
        {/* Número de mantenimientos */}
        <div className="flex flex-col mt-6">
          <label className="text-base font-medium mb-2">Número de mantenimientos:</label>
          <Input
            type="number"
            placeholder="0"
            className={`w-full max-w-md ${mantenimientosError ? 'border-red-500' : ''}`}
            value={mantenimientos}
            onChange={handleMantenimientosChange}
            min="0"
            required
          />
          {mantenimientosError && (
            <div className="text-red-500 text-sm mt-1">
              {mantenimientosError}
            </div>
          )}
        </div>

        {/* Precio de alquiler por día */}
        <div className="flex flex-col mt-6">
          <label className="text-base font-medium mb-2">Precio de alquiler por día:</label>
          <Input
            type="number"
            placeholder="0"
            className={`w-full max-w-md ${precioError ? 'border-red-500' : ''}`}
            value={precio}
            onChange={handlePrecioChange}
            min="1"
            required
          />
          {precioError && (
            <div className="text-red-500 text-sm mt-1">
              {precioError}
            </div>
          )}
        </div>

        {/* Descripción */}
        <div className="flex flex-col mt-6">
          <label className="text-base font-medium mb-2">Descripción:</label>
          <Textarea
            placeholder="Describa las características de su vehículo..."
            className={`w-full resize-none h-24 ${descripcionError ? 'border-red-500' : ''}`}
            value={descripcion}
            onChange={handleDescripcionChange}
            maxLength={150}
            required
          />
          <div className="flex justify-between items-center mt-1">
            {descripcionError && (
              <div className="text-red-500 text-sm">
                {descripcionError}
              </div>
            )}
            <div className={`text-sm ${descripcion.length > 140 ? 'text-red-500' : 'text-gray-500'}`}>
              {descripcion.length}/150 caracteres
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Cancelar y Finalizar */}
      <div className="w-full max-w-5xl flex justify-between items-center mt-10 px-10">
        {/* Botón Cancelar */}
        <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="secondary"
              className="w-[160px] h-12 text-lg font-semibold transition-all duration-200 hover:bg-gray-100 hover:brightness-90"
            >
              CANCELAR
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                ¿Está seguro que desea salir del proceso de añadir un carro?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Toda la información no guardada se perderá si abandona esta sección.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => router.push("/host/pages")}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Botón Finalizar */}
        <Button
          variant="default"
          className="w-[180px] h-12 text-lg font-semibold text-white bg-gray-800"
          onClick={() => setConfirmOpen(true)}
          disabled={!isFormValid}
        >
          FINALIZAR
        </Button>
      </div>

      {/* AlertDialog para Confirmación de Finalización */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Confirmar publicación del vehículo?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Al confirmar, su vehículo será publicado y estará disponible para alquiler.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => router.push("/host/pages")}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}