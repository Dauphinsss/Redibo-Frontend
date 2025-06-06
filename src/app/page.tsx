"use client";
import Carrucel from "@/app/home/components/Carrucel";
import { Footer } from "@/components/ui/footer";
import Header from "@/components/ui/Header";
import Driver from "./driver-signup";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "@/utils/bakend";
import { toast } from "sonner";

interface Info {
  nombre: string;
  foto: string;
  estadoConductor: string;
  roles: string[];
}

export default function Home() {
  const [conductor, setConductor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const getInfo = async () => {
    try {
      const authToken = localStorage.getItem("auth_token");
      if (!authToken) return;
      const response = await axios.get<Info>(`${API_URL}/api/info`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const { nombre, foto, estadoConductor, roles } = response.data;
      if (nombre) localStorage.setItem("nombre", nombre);
      if (foto) localStorage.setItem("foto", foto);
      if (estadoConductor)
        localStorage.setItem("estadoConductor", estadoConductor);
      if (roles) localStorage.setItem("roles", JSON.stringify(roles));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Sesión expirada. Por favor, inicia sesión nuevamente.");
          localStorage.removeItem("auth_token");
          localStorage.removeItem("nombre");
          localStorage.removeItem("foto");
          localStorage.removeItem("estadoConductor");
          localStorage.removeItem("roles");
        } else {
          toast.error("Error al obtener la información del usuario.");
        }
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const estado = localStorage.getItem("estadoConductor");
    if (estado) {
      setConductor(estado);
    }
    getInfo();
  }, []);

  useEffect(() => {
    const estado = localStorage.getItem("estadoConductor");
    if (estado) {
      setConductor(estado);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoading={isLoading} />
      <main className="flex flex-col items-center pt-8">
        <h1 className="text-4xl font-bold text-center">REDIBO</h1>
        <div className="mt-8 w-full max-w-7xl flex justify-center">
          <Carrucel />
        </div>

        {conductor === "NO_REQUESTED" && <Driver />}
      </main>
      <Footer />
    </div>
  );
}
