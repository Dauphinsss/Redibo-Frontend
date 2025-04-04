"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CargarImagenPage() {
  const mostrarImagen = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const vista = document.getElementById(
          event.target.id === "file1"
            ? "imagen-vista"
            : event.target.id === "file2"
            ? "imagen-vista-2"
            : "imagen-vista-3"
        ) as HTMLDivElement;
        if (vista) {
          vista.style.backgroundImage = `url(${e.target?.result})`;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Cargar Imágenes de tu auto:</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Input type="file" id="file1" onChange={mostrarImagen} />
          <div
            id="imagen-vista"
            className="w-full h-40 bg-gray-200 bg-cover bg-center"
          ></div>
        </div>
        <div className="flex space-x-4">
          <div className="space-y-2">
            <Input type="file" id="file2" onChange={mostrarImagen} />
            <div
              id="imagen-vista-2"
              className="w-32 h-32 bg-gray-200 bg-cover bg-center"
            ></div>
          </div>
          <div className="space-y-2">
            <Input type="file" id="file3" onChange={mostrarImagen} />
            <Label htmlFor="file3">Elige una foto a subir</Label>
            <div
              id="imagen-vista-3"
              className="w-32 h-32 bg-gray-200 bg-cover bg-center"
            ></div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mantenimientos">Nro de mantenimientos</Label>
          <Input type="number" id="mantenimientos" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="precio">Precio de alquiler por día</Label>
          <Input type="text" id="precio" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea id="descripcion" />
        </div>
      </div>

      <div className="flex space-x-4">
        <Button variant="outline" className="cancelar">
          CANCELAR
        </Button>
        <Button className="guardar">FINALIZAR EDICIÓN Y GUARDAR</Button>
      </div>
    </div>
  );
}