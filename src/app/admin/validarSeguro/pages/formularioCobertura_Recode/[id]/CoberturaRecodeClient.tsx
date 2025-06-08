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
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      setIsAuthLoading(true);
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
        console.error("ID de seguro inválido en URL:", id_seguro);
        router.replace("/admin/validarSeguro/pages");
      }
    }
  }, [id_seguro, router, isAuthLoading, isAuthorized]);

  useEffect(() => {
    if (!isAuthLoading && isAuthorized) {
      if (!isLoadingSeguro && !seguro && !errorSeguro) {
        console.warn("No se encontró información del seguro con ID:", id_seguro, " (Hook SWR finalizó)");
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
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
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

  return (
    <div>
      <Header />
      <main className="max-w-5xl mx-auto p-6">
        <div className="mb-4">
          <Button 
            variant="ghost"
            onClick={() => router.push('/admin')} 
            size="sm"
            className="flex items-center bg-black text-white px-3 py-1.5 rounded-md hover:bg-gray-500 text-xs font-medium"
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Volver
          </Button>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Formulario de Coberturas
          </h1>
          <p className="text-sm text-gray-500">
            Póliza ID: {id_seguro}
          </p>
        </div>

        <div className="border rounded-lg shadow-md bg-white">
          <div className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-4 font-semibold rounded-t-lg text-lg">
            Datos del Seguro y Propietario
          </div>
          <div className="p-4 md:p-6 space-y-6">
            <FormularioRecode initialDataFor={seguro} />
            <TablaRecode />
          </div>
        </div>
      </main>
      <PopUpCobertura />
    </div>
  );
}