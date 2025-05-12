"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { API_URL } from "@/utils/bakend";
import axios from "axios";
import Link from "next/link";
// Componente de carga
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-2 border-black"></div>
    </div>
  );
}

// Componente del formulario
function LoginFormContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        "correo": email,
        "contrasena": password
      });

      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }

      const { usuario, token } = response.data;
      localStorage.setItem("nombre", usuario.nombre);
      // localStorage.setItem("correo", usuario.correo);
      // localStorage.setItem("telefono", usuario.telefono || "");
      // localStorage.setItem("fecha_nacimiento", usuario.fecha_nacimiento || "");
      // localStorage.setItem("genero", usuario.genero || "");
      // localStorage.setItem("ciudad", usuario.ciudad || "");
      localStorage.setItem("foto", usuario.foto || "default.jpg");
      localStorage.setItem("roles", usuario.roles || "");
      localStorage.setItem("auth_token", token);

      router.push("/");
      toast.success("Inicio de sesión exitoso");
    } catch (error: unknown) {
      console.error("Error al iniciar sesión:", error);
      const errorMessage = "Error al iniciar sesión";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-xl bg-card text-card-foreground shadow-lg border border-border">
      <h2 className="text-2xl font-bold text-center mb-8">
        Inicia sesión en REDIBO
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Label htmlFor="email" className="text-sm font-medium">
            Correo electrónico
          </Label>
          <Input 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com" 
            className="h-10 px-4" 
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="password" className="text-sm font-medium">
            Contraseña
          </Label>
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña" 
            className="h-10 px-4" 
            required
          />
        </div>

        <div className="flex justify-end">
          <Link href="/recuperar-contrasena" className="text-sm text-primary hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button type="submit" className="w-full h-10" disabled={isLoading}>
          {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </form>

      <div className="my-8 flex items-center justify-center text-muted-foreground">
        <hr className="flex-grow border-border" />
        <span className="mx-4">o</span>
        <hr className="flex-grow border-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => {
          window.location.href = `${API_URL}/api/auth/google`;
        }}
        className="w-full flex items-center justify-center gap-2 h-10"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
        Iniciar sesión con Google
      </Button>

      <p className="text-sm text-center mt-8 text-muted-foreground">
        ¿No tienes una cuenta?{" "}
        <a href="/registro" className="text-primary hover:underline">
          Registrarse
        </a>
      </p>
    </div>
  );
}

// Componente principal
export function LoginForm() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [shouldShowForm, setShouldShowForm] = useState(false);

  useEffect(() => {
    const processUrlData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedData = urlParams.get('data');
        const urlToken = urlParams.get('token');

        if (encodedData && urlToken) {
          const userData = JSON.parse(
            Buffer.from(encodedData, 'base64').toString()
          );
          // Guardar en localStorage
          localStorage.setItem("nombre", userData.nombre);
          // localStorage.setItem("correo", userData.correo);
          // localStorage.setItem("telefono", userData.telefono || "");
          // localStorage.setItem("fecha_nacimiento", userData.fecha_nacimiento || "");
          // localStorage.setItem("genero", userData.genero || "");
          // localStorage.setItem("ciudad", userData.ciudad || "");
          localStorage.setItem("foto", userData.foto || "default.jpg");
          localStorage.setItem("roles", userData.roles || "");
          localStorage.setItem("auth_token", urlToken);

          // Limpiar URL
          window.history.replaceState({}, document.title, "/login");
          
          // Esperar un momento para asegurar que los datos se guarden
          // await new Promise(resolve => setTimeout(resolve, 500));
          
          router.push("/");
          toast.success("Inicio de sesión exitoso");
        } else {
          setShouldShowForm(true);
        }
      } catch (error) {
        console.log("No hay datos en URL o error al procesarlos" + error);
        setShouldShowForm(true);
      } finally {
        setIsProcessing(false);
      }
    };

    processUrlData();
  }, [router]);

  // Si estamos procesando o no debemos mostrar el formulario, mostrar el spinner
  if (isProcessing || !shouldShowForm) {
    return <LoadingSpinner />;
  }

  return <LoginFormContent />;
}
