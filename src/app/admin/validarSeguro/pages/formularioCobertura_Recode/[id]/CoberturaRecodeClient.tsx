"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/utils/bakend";

import Header from "@/components/ui/Header";
import PopUpCobertura from "@/app/admin/validarSeguro/components/cobertura/PopUpCobertura";
import TablaRecode from "@/app/admin/validarSeguro/components/cobertura/TablaRecode";
import { useSeguroCoberturas } from "@/app/admin/validarSeguro/hooks/useSeguroCoberturas";
import FormularioRecode from "@/app/admin/validarSeguro/components/cobertura/FormularioRecode";
import { Loader2 } from "lucide-react";
import { Button } from "react-day-picker";

interface Props {
  id_seguro: number;
}

export default function CoberturaRecodeClient({ id_seguro }: Props) {
  const router = useRouter();
  const { data: seguro, isLoading: isLoadingSeguro, error: errorSeguro } = useSeguroCoberturas(id_seguro);

  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthAndRole = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/api/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const userRoles = res.data.roles || [];
        
        if (!userRoles.includes("ADMIN")) {
          router.replace("/");
          return;
        }
        
        setIsAuthorized(true);
      } catch (err) {
        console.error("Error al verificar autorización:", err);
        router.replace("/login");
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkAuthAndRole();
  }, [router]);

  useEffect(() => {
    if (!isAuthLoading && isAuthorized) {
        if (!id_seguro || isNaN(Number(id_seguro))) {
            console.error("ID de seguro inválido:", id_seguro);
            router.replace("/admin/validarSeguro/pages");
        }
    }
  }, [id_seguro, router, isAuthLoading, isAuthorized]);

  useEffect(() => {
    if (!isAuthLoading && isAuthorized) { 
        if (!isLoadingSeguro && !seguro && !errorSeguro) {
            console.warn("No se encontró información del seguro con ID:", id_seguro);
            router.replace("/admin/validarSeguro/pages");
        } else if (errorSeguro) {
            console.error("Error SWR al cargar seguro:", errorSeguro);
            router.replace("/admin/validarSeguro/pages");
        }
    }
  }, [seguro, isLoadingSeguro, errorSeguro, router, id_seguro, isAuthLoading, isAuthorized]);

  if (isAuthLoading || (isAuthorized && isLoadingSeguro)) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-black" />
        <p className="mt-4 text-gray-600 text-lg">
          {isAuthLoading ? "Verificando acceso..." : "Cargando datos del seguro..."}
        </p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; 
  }

  if (!seguro) {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <p className="text-red-500 text-lg">No se pudo cargar la información del seguro o el ID es inválido.</p>
            <Button onClick={() => router.push("/admin/validarSeguro/pages")} className="mt-4">
                Volver a la lista de seguros
            </Button>
        </div>
    );
  }

  // Si está autorizado y los datos del seguro están listos
  return (
    <div className="border-b px-4 sm:px-6 lg:px-8 py-7">
      <Header />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Registro de coberturas para la Póliza ID: {id_seguro}</h1>

        <div className="border rounded shadow">
          <div className="bg-black text-white p-2 font-semibold">Datos del seguro</div>

          <div className="p-4 space-y-4">
            {/* FormularioRecode y TablaRecode necesitan 'seguro' */}
            <FormularioRecode initialDataFor={seguro} />
            <TablaRecode />
          </div>
        </div>
      </div>

      <PopUpCobertura />
    </div>
  );
}