// Archivo: src/app/recuperar-contrasena/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { API_URL } from "@/utils/bakend";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function LoginForm()  {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"email" | "code" | "new-password">("email");
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  // Maneja el envío del correo para solicitar código
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Llamada al backend para solicitar el código de verificación
      const response = await axios.post(`${API_URL}/api/auth/request-recovery-code`, {
        correo: email
      });

      toast.success("Código de verificación enviado. Revisa tu correo electrónico.");
      setStep("code");
    } catch (error: any) {
      console.error("Error al solicitar código:", error);
      const errorMessage = error.response?.data?.error || "Error al solicitar código de verificación";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Maneja el cambio en los inputs del código de verificación
  const handleCodeChange = (index: number, value: string) => {
    // Asegurarse de que solo se introduzcan números
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Avanzar al siguiente input si se introdujo un dígito
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Maneja el pegado de código
  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
      const newCode = pastedData.split("");
      setVerificationCode(newCode);
    }
  };

  // Maneja la verificación del código
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const codeString = verificationCode.join("");
    if (codeString.length !== 6) {
      toast.error("Por favor ingresa el código de 6 dígitos completo");
      setIsLoading(false);
      return;
    }

    try {
      // Llamada al backend para verificar el código
      const response = await axios.post(`${API_URL}/api/auth/verify-recovery-code`, {
        correo: email,
        codigo: codeString
      });

      toast.success("Código verificado correctamente");
      setStep("new-password");
    } catch (error: any) {
      console.error("Error al verificar código:", error);
      const errorMessage = error.response?.data?.error || "Código inválido o expirado";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Maneja el cambio de contraseña
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      // Llamada al backend para cambiar la contraseña
      const response = await axios.post(`${API_URL}/api/auth/reset-password`, {
        correo: email,
        codigo: verificationCode.join(""),
        nuevaContrasena: newPassword
      });

      toast.success("Contraseña actualizada correctamente");
      
      // Redireccionar al login después de un breve retraso
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      console.error("Error al cambiar contraseña:", error);
      const errorMessage = error.response?.data?.error || "Error al cambiar la contraseña";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar paso de solicitud de correo
  const renderEmailStep = () => (
    <form onSubmit={handleRequestCode} className="flex flex-col gap-6">
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

      <Button type="submit" className="w-full h-10" disabled={isLoading}>
        {isLoading ? "Enviando..." : "Enviar código de verificación"}
      </Button>

      <div className="text-center">
        <Link href="/login" className="text-sm text-primary hover:underline">
          Volver a inicio de sesión
        </Link>
      </div>
    </form>
  );

  // Renderizar paso de verificación de código
  const renderCodeStep = () => (
    <form onSubmit={handleVerifyCode} className="flex flex-col gap-6">
      <div className="text-center mb-4">
        <p>Hemos enviado un código a tu correo electrónico:</p>
        <p className="font-medium">{email}</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="code-0" className="text-sm font-medium">
          Código de verificación
        </Label>
        <div className="flex justify-between gap-2">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <Input
              key={index}
              id={`code-${index}`}
              type="text"
              maxLength={1}
              value={verificationCode[index]}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onPaste={index === 0 ? handleCodePaste : undefined}
              className="h-12 w-12 text-center text-lg font-bold"
              required
            />
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full h-10" disabled={isLoading}>
        {isLoading ? "Verificando..." : "Verificar código"}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setStep("email")}
          className="text-sm text-primary hover:underline"
        >
          Volver atrás
        </button>
      </div>
    </form>
  );

  // Renderizar paso de nueva contraseña
  const renderNewPasswordStep = () => (
    <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Label htmlFor="new-password" className="text-sm font-medium">
          Nueva contraseña
        </Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Ingrese su nueva contraseña"
          className="h-10 px-4"
          required
          minLength={8}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="confirm-password" className="text-sm font-medium">
          Confirmar contraseña
        </Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirme su nueva contraseña"
          className="h-10 px-4"
          required
          minLength={8}
        />
      </div>

      <Button type="submit" className="w-full h-10" disabled={isLoading}>
        {isLoading ? "Cambiando contraseña..." : "Cambiar contraseña"}
      </Button>
    </form>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md mx-auto p-8 rounded-xl bg-card text-card-foreground shadow-lg border border-border">
        <h2 className="text-2xl font-bold text-center mb-8">
          {step === "email" && "Recuperar contraseña"}
          {step === "code" && "Verificar código"}
          {step === "new-password" && "Nueva contraseña"}
        </h2>

        {step === "email" && renderEmailStep()}
        {step === "code" && renderCodeStep()}
        {step === "new-password" && renderNewPasswordStep()}
      </div>
    </div>
  );
}

export default function RecuperarContrasenaPage() {
  return <LoginForm />;
}