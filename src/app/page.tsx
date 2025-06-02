"use client";
import Carrucel from "@/app/home/components/Carrucel";
import { Footer } from "@/components/ui/footer";
import Header from "@/components/ui/Header";
import Driver from "./driver-signup";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "@/utils/bakend";

interface Info {
  nombre: string;
  foto: string;
  estadoConductor: string;
  roles: string[];
}

export default function Home() {
  const request = () => {
    return conductor === "NO_REQUESTED";
  };
  const [conductor, setConductor] = useState("NO_REQUESTED");
  const [token, setToken] = useState<string | null>(null);
  const getInfo = async () => {
    try {
      const authToken = localStorage.getItem("auth_token");
      if (!authToken) return;
      setToken(authToken);
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
      console.error("Error fetching info:", error);
    }
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
      <Header />
      <main className="flex flex-col items-center pt-8">
        <h1 className="text-4xl font-bold text-center">REDIBO</h1>
        <div className="mt-8 w-full max-w-7xl flex justify-center">
          <Carrucel />
        </div>

        {request() && token && <Driver />}
      </main>
      <Footer />
    </div>
  );
}
