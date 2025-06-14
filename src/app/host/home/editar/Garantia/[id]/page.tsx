"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { axiosInstance } from "@/api/axios";

export default function GarantiaPage() {
  const router = useRouter();
  const { id: id_carro } = useParams(); // id del carro
  //const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const [loading, setLoading] = useState(true);
  const [garantia, setGarantia] = useState({
    id: null as number | null,
    precio: 0,
    descripcion: "",
    pagado: false,
    fecha_limite: "",
  });

  // Cargar garantía si existe
  useEffect(() => {
    async function fetchGarantia() {
      try {
        const res = await axiosInstance.get(`/api/garantias/carro/${id_carro}`);
        // Si no hay garantía, api responde { garantia: null }
        if (res.data && res.data.garantia) {
          const g = res.data.garantia;
          setGarantia({
            id: g.id,
            precio: g.precio,
            descripcion: g.descripcion,
            pagado: g.pagado,
            fecha_limite: g.fecha_limite.split("T")[0],
          });
        } else {
          // No hay garantía, limpiar formulario para crear
          setGarantia({
            id: null,
            precio: 0,
            descripcion: "",
            pagado: false,
            fecha_limite: "",
          });
        }
      } catch (error) {
        console.log("Error al obtener garantía o no existe aún");
        setGarantia({
          id: null,
          precio: 0,
          descripcion: "",
          pagado: false,
          fecha_limite: "",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchGarantia();
  }, [id_carro]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setGarantia({
      ...garantia,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setGarantia({ ...garantia, pagado: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("ID de la garantía que se enviará:", garantia.id); //
    try {
      if (garantia.id) {
        await axiosInstance.patch(`/api/garantias/${garantia.id}`, {
          precio: garantia.precio,
          descripcion: garantia.descripcion,
          pagado: garantia.pagado,
          fecha_limite: garantia.fecha_limite,
        });
      } else {
        await axiosInstance.post(`/api/garantias`, {
          precio: garantia.precio,
          descripcion: garantia.descripcion,
          pagado: garantia.pagado,
          fecha_limite: garantia.fecha_limite,
          id_carro: Number(id_carro), // importante que sea number
        });
      }
      router.push("/host/pages");
    } catch (error) {
      console.error("Error al guardar la garantía", error);
      alert("No se pudo guardar la garantía.");
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">
        {garantia.id ? "Editar Garantía" : "Crear Garantía"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Label>Precio (BS)</Label>
        <Input
          type="number"
          name="precio"
          value={garantia.precio === 0 ? "" : garantia.precio}
          onChange={handleChange}
          min={0}
          required
          placeholder="0"
        />

        <div>
          <Label>Fecha límite</Label>
          <Input
            type="date"
            name="fecha_limite"
            value={garantia.fecha_limite}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Descripción</Label>
          <Textarea
            name="descripcion"
            value={garantia.descripcion}
            onChange={handleChange}
            placeholder="Ej: Deposito de 5.000 para cubrir posibles daños ..."
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={garantia.pagado}
            onCheckedChange={handleCheckboxChange}
          />
          <Label>¿Incluye pago por daños?</Label>
        </div>

        <Button type="submit">
          {garantia.id ? "Guardar Cambios" : "Crear Garantía"}
        </Button>
      </form>
    </div>
  );
}
