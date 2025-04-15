"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Upload } from "lucide-react";
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
  
  // Referencias para los inputs de archivo - especificando el tipo
  const mainImageRef = useRef<HTMLInputElement>(null);
  const secondaryImage1Ref = useRef<HTMLInputElement>(null);
  const secondaryImage2Ref = useRef<HTMLInputElement>(null);
  
  // Estado para almacenar las imágenes cargadas - especificando el tipo como string | null
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [secondaryImage1, setSecondaryImage1] = useState<string | null>(null);
  const [secondaryImage2, setSecondaryImage2] = useState<string | null>(null);

  // Maneja la carga de la imagen principal
  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(URL.createObjectURL(file));
    }
  };

  // Maneja la carga de la imagen secundaria 1
  const handleSecondaryImage1Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSecondaryImage1(URL.createObjectURL(file));
    }
  };

  // Maneja la carga de la imagen secundaria 2
  const handleSecondaryImage2Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSecondaryImage2(URL.createObjectURL(file));
    }
  };

  // Funciones seguras para manejar los clics en los botones
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
        <h1 className="text-4xl font-bold my-5 pl-7">Cargar Imágenes de tu auto:</h1>
      </div>

      {/* Formulario de carga de imágenes */}
      <div className="w-full max-w-5xl px-9 space-y-6">
        {/* Área de carga de imágenes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Imagen principal - Más grande */}
          <div className="col-span-1 md:col-span-2">
            <div 
              className="border rounded-md bg-gray-50 h-64 flex flex-col items-center justify-center p-4 relative"
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
                accept="image/*"
                className="hidden"
              />
              <Button 
                variant="outline" 
                className={`${mainImage ? 'bg-white bg-opacity-70' : 'bg-white'}`}
                onClick={handleMainImageClick}
              >
                Elige una foto a subir
              </Button>
            </div>
          </div>
          
          {/* Imagen secundaria 1 */}
          <div className="col-span-1">
            <div 
              className="border rounded-md bg-gray-50 h-64 flex flex-col items-center justify-center p-4 relative"
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
                accept="image/*"
                className="hidden"
              />
              <Button 
                variant="outline" 
                className={`${secondaryImage1 ? 'bg-white bg-opacity-70' : 'bg-white'}`}
                onClick={handleSecondaryImage1Click}
              >
                Elige una foto a subir
              </Button>
            </div>
          </div>
          
          {/* Imagen secundaria 2 */}
          <div className="col-span-1">
            <div 
              className="border rounded-md bg-gray-50 h-64 flex flex-col items-center justify-center p-4 relative"
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
                accept="image/*"
                className="hidden"
              />
              <Button 
                variant="outline" 
                className={`${secondaryImage2 ? 'bg-white bg-opacity-70' : 'bg-white'}`}
                onClick={handleSecondaryImage2Click}
              >
                Elige una foto a subir
              </Button>
            </div>
          </div>
        </div>
        
        {/* Número de mantenimientos */}
        <div className="flex flex-col mt-6">
          <label className="text-base font-medium mb-2">Nro de mantenimientos</label>
          <Input
            type="number"
            placeholder="3"
            className="w-full max-w-md"
          />
        </div>

        {/* Precio de alquiler por día */}
        <div className="flex flex-col mt-6">
          <label className="text-base font-medium mb-2">Precio de alquiler por día</label>
          <Input
            type="number"
            placeholder="150"
            className="w-full max-w-md"
          />
        </div>

        {/* Descripción */}
        <div className="flex flex-col mt-6">
          <label className="text-base font-medium mb-2">Descripción</label>
          <Textarea
            placeholder="Describa las características de su vehículo..."
            className="w-full resize-none h-24"
          />
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
          className="h-12 text-lg font-semibold text-white px-6"
          onClick={() => setConfirmOpen(true)}
        >
          FINALIZAR EDICIÓN Y GUARDAR
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