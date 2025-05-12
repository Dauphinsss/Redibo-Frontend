"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { API_URL } from "@/utils/bakend";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react"; // Importar iconos

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"email" | "code" | "new-password">("email");
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState(30);
  const router = useRouter();

  // Efecto para manejar el temporizador
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [resendTimer]);

  // Maneja el reenvío del código
  const handleResendCode = async () => {
    setResendDisabled(true);
    setResendTimer(90); // Temporizador de 90 segundos después del reenvío

    try {
      const response = await axios.post(`${API_URL}/api/auth/request-recovery-code`, {
        correo: email,
      });
      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }
      toast.success("Código reenviado. Revisa tu correo electrónico.");
    } catch (error: unknown) {
      console.error("Error al reenviar código:", error);
      toast.error("Error al reenviar el código. Por favor intenta nuevamente.");
    }
  };

  // Función para validar la fortaleza de la contraseña
  const isPasswordStrong = (password: string) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  };

  // Manejar cambio en confirmación de contraseña
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordError(newPassword !== value);
  };

  // Maneja el envío del correo para solicitar código
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Llamada al backend para solicitar el código de verificación
      const response = await axios.post(`${API_URL}/api/auth/request-recovery-code`, {
        correo: email
      });
      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }
      toast.success("Código de verificación enviado. Revisa tu correo electrónico.");
      setStep("code");
    } catch (error: unknown) {
      console.error("Error al solicitar código:", error);
      toast.error("Error al solicitar el código. Por favor intenta nuevamente.");
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
      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }
      toast.success("Código verificado correctamente");
      setStep("new-password");
    } catch (error: unknown) {
      console.error("Error al verificar código:", error);
      toast.error("Error al verificar el código. Por favor intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Maneja el cambio de contraseña
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validar requisitos de contraseña
    if (!isPasswordStrong(newPassword)) {
      toast.error("La contraseña no cumple con los requisitos de seguridad");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
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
      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }
      console.log("Respuesta del backend:", response.data);
      localStorage.setItem("auth_token", response.data.token); // Guardar el nuevo token
      localStorage.setItem("nombre", response.data.nombre); // Guardar el nombre del usuario
      localStorage.setItem("foto", response.data.foto || "default.jpg"); // Guardar la foto del usuario
      localStorage.setItem("roles", response.data.roles || ""); // Guardar los roles del usuario
      toast.success("Contraseña actualizada correctamente");
      
      // Redireccionar al login después de un breve retraso
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error: unknown) {
      console.error("Error al cambiar contraseña:", error);
      const errorMessage = "Error al cambiar la contraseña";
      
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

      <Button
        type="button"
        className={`w-full h-10 ${
          resendDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : ""
        }`}
        disabled={resendDisabled}
        onClick={handleResendCode}
      >
        {resendDisabled
          ? `Reintentar envío de código en: ${resendTimer}s`
          : "Reenviar código"}
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
      <div className="space-y-2 relative">
        <Label htmlFor="new-password" className="text-sm font-medium">
          Nueva contraseña
        </Label>
        <div className="flex items-center gap-2 relative">
          <Input
            id="new-password"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            maxLength={20}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 20) {
                setNewPassword(value);
                if (confirmPassword.length > 0) {
                  setPasswordError(value !== confirmPassword);
                }
              }
            }}
            onBlur={() => setPasswordTouched(true)}
            placeholder="Ingrese su nueva contraseña"
            className={`h-10 px-4 pr-10 ${
              passwordTouched &&
              (newPassword.length === 0 ||
                !isPasswordStrong(newPassword))
                ? "border-red-500"
                : ""
            }`}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-600" />
            ) : (
              <Eye className="h-4 w-4 text-gray-600" />
            )}
          </Button>
        </div>
        {passwordTouched && (
          <div className="space-y-1">
            {newPassword.length === 0 ? (
              <p className="text-sm text-red-500">
                La contraseña es obligatoria.
              </p>
            ) : newPassword.length < 8 ? (
              <p className="text-sm text-red-500">
                La contraseña debe tener al menos 8 caracteres
              </p>
            ) : !/[A-Z]/.test(newPassword) ? (
              <p className="text-sm text-red-500">
                Debe contener al menos una letra mayúscula
              </p>
            ) : !/[0-9]/.test(newPassword) ? (
              <p className="text-sm text-red-500">
                Debe contener al menos un número
              </p>
            ) : !/[^A-Za-z0-9]/.test(newPassword) ? (
              <p className="text-sm text-red-500">
                Debe contener al menos un carácter especial
              </p>
            ) : null}
          </div>
        )}
      </div>

      <div className="space-y-2 relative">
        <Label htmlFor="confirm-password" className="text-sm font-medium">
          Confirmar contraseña
        </Label>
        <div className="flex items-center gap-2 relative">
          <Input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            maxLength={20}
            onChange={handleConfirmPasswordChange}
            onBlur={() => setPasswordTouched(true)}
            placeholder="Confirme su nueva contraseña"
            className={`h-10 px-4 pr-10 ${
              passwordError || (passwordTouched && !confirmPassword)
                ? "border-red-500"
                : ""
            }`}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-gray-600" />
            ) : (
              <Eye className="h-4 w-4 text-gray-600" />
            )}
          </Button>
        </div>
        {passwordTouched && !confirmPassword && (
          <p className="text-sm text-red-500">
            Debe confirmar su contraseña
          </p>
        )}
        {passwordError && confirmPassword && (
          <p className="text-sm text-red-500">
            Las contraseñas no coinciden
          </p>
        )}
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