"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCarById, updateCar } from "@/app/host/services/carService";
import {
  getImagesByCarId,
  updateImage,
} from "@/app/host/services/imageService";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import CampoImagen from "@/app/host/components/inputimagen/CampoImagen";
import CampoMantenimientos from "@/app/host/components/inputimagen/CampoMantenimientos";
import CampoPrecio from "@/app/host/components/inputimagen/CampoPrecio";
import CampoDescripcion from "@/app/host/components/inputimagen/CampoDescripcion";
export default function EditarCarroImagen() {
  const { id } = useParams();
  const router = useRouter();
  const carId = Number(id);

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
    descripcion: null as string | null,
  });
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const refImagesId = useRef<number[]>([]);
  const refOriginal = useRef({
    main: null as string | null,
    sec1: null as string | null,
    sec2: null as string | null,
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const carData = await getCarById(carId);
      const imagesResp = await getImagesByCarId(carId);
      const images = imagesResp.data || [];

      setMain(images[0]?.data || null);
      setSec1(images[1]?.data || null);
      setSec2(images[2]?.data || null);
      refImagesId.current = [images[0]?.id, images[1]?.id, images[2]?.id];

      refOriginal.current = {
        main: images[0]?.data || null,
        sec1: images[1]?.data || null,
        sec2: images[2]?.data || null,
      };

      setMantenimientos(carData?.num_mantenimientos?.toString() || "");
      setPrecio(carData?.price?.toString() || "");
      setDescripcion(carData?.descripcion || "");
      setLoading(false);
    }

    if (carId) fetchData();
  }, [carId]);

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
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    if (!valid) return;

    try {
      // Actualizar datos del carro
      await updateCar(carId, {
        num_mantenimientos: parseInt(mantenimientos),
        precio_por_dia: parseFloat(precio),
        descripcion,
      });

      // Actualizar imágenes
      const updates = [
        { file: main, prev: refOriginal.current.main, id: refImagesId.current[0] },
        { file: sec1, prev: refOriginal.current.sec1, id: refImagesId.current[1] },
        { file: sec2, prev: refOriginal.current.sec2, id: refImagesId.current[2] },
      ];

      for (const { file, prev, id } of updates) {
        if (typeof file !== "string" && file instanceof File) {
          await updateImage(id, file);
        }
      }

      // Modal de éxito opcional: puedes agregar otro AlertDialog si lo deseas
      router.push("/host/pages");
    } catch (error) {
      console.error("Error al guardar cambios", error);
      alert("Ocurrió un error al guardar los cambios");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6 flex flex-col items-start min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Editar Imágenes de tu vehículo</h1>
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

      <div className="w-full mt-10 flex flex-col sm:flex-row sm:justify-between gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          className="w-full sm:w-auto text-2xl py-6 px-15 transition-all duration-200 hover:bg-gray-400 hover:text-white"
        >
          CANCELAR
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!valid}
          className="w-full sm:w-auto text-2xl py-6 px-15 transition-all duration-200 hover:bg-gray-400 hover:text-white disabled:opacity-60"
        >
          FINALIZAR Y GUARDAR
        </Button>
      </div>

      {/* Modal de confirmación */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
  <AlertDialogContent className="bg-zinc-900 border border-zinc-800 text-zinc-100 max-w-xs mx-auto p-6">
    <AlertDialogHeader>
      <AlertDialogTitle className="text-xl font-semibold text-zinc-100 text-center">
        ¿Está seguro que desea guardar los cambios?
      </AlertDialogTitle>
      <AlertDialogDescription className="text-zinc-400 text-center mt-2">
        Esta acción actualizará la información e imágenes del vehículo.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter className="flex flex-row justify-between items-center mt-8 gap-2">
      <AlertDialogCancel asChild>
        <Button
          type="button"
          variant="ghost"
          className="bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 px-8 py-4 rounded-md text-lg transition-all min-w-[120px]"
        >
          Cancelar
        </Button>
      </AlertDialogCancel>
      <div className="flex-1" />
      <AlertDialogAction asChild>
        <Button
          type="button"
          onClick={handleConfirmSave}
          className="bg-zinc-700 text-zinc-100 hover:bg-zinc-600 px-8 py-4 rounded-md text-lg transition-all min-w-[120px]"
        >
          Confirmar
        </Button>
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    </div>
  );
}
