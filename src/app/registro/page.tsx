"use client";

import type React from "react";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserIcon, HomeIcon, CarIcon } from "lucide-react";

type UserType = "propietario" | "arrendatario" | "conductor" | null;

export default function TermsForm() {
  // Add state variables for the new fields
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState<UserType>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // New state for Google sign-in flow
  const [isGoogleFirstLogin, setIsGoogleFirstLogin] = useState(false);
  const [googleUserInfo, setGoogleUserInfo] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setPasswordError(true);
      toast.error(
        "Las contraseñas no coinciden. Por favor, inténtelo de nuevo."
      );
      return;
    }

    if (!acceptTerms) {
      toast.error("Debes aceptar los términos y condiciones para continuar.");
      return;
    }

    if (!birthdate || !gender || !city || !phone) {
      toast.error("Por favor, complete todos los campos requeridos.");
      return;
    }

    // Aquí iría la lógica para enviar el formulario
    toast.success(`Gracias por registrarse como ${userType}.`);

    // Resetear el formulario
    setName("");
    setEmail("");
    setBirthdate("");
    setGender("");
    setPhone("");
    setCity("");
    setPassword("");
    setConfirmPassword("");
    setAcceptTerms(false);
    setPasswordError(false);
    setUserType(null);
  };

  // Validar contraseñas al escribir
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordError(password !== value && value !== "");
  };

  const getUserTypeTitle = () => {
    switch (userType) {
      case "propietario":
        return "Registrar Propietario";
      case "arrendatario":
        return "Registrar Arrendatario";
      case "conductor":
        return "Registrar Conductor";
      default:
        return "Registro";
    }
  };

  const getUserTypeDescription = () => {
    switch (userType) {
      case "propietario":
        return "Complete sus datos como propietario de vehículos para renta y acepte nuestros términos y condiciones.";
      case "arrendatario":
        return "Complete sus datos como persona que renta vehículos y acepte nuestros términos y condiciones.";
      case "conductor":
        return "Complete sus datos como conductor y acepte nuestros términos y condiciones.";
      default:
        return "Seleccione el tipo de usuario para continuar con el registro.";
    }
  };

  const handleGoogleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info("Iniciando sesión con Google...");

    // Simulate Google OAuth response with user info
    // In a real app, this would come from the Google OAuth API
    const mockGoogleUser = {
      name: "Usuario de Google",
      email: "usuario@gmail.com",
    };

    // Set the Google user info and activate first login flow
    setGoogleUserInfo(mockGoogleUser);
    setIsGoogleFirstLogin(true);

    // Pre-fill the form with Google data
    setName(mockGoogleUser.name);
    setEmail(mockGoogleUser.email);

    // For this example, we'll assume the user is registering as a specific type
    // In a real app, you might want to ask the user type after Google login
    setUserType("arrendatario");
  };

  const handleCompleteGoogleProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!birthdate || !city || !gender || !phone) {
      toast.error("Por favor, complete todos los campos requeridos.");
      return;
    }

    // Here you would save the additional user information
    toast.success("Perfil completado correctamente. ¡Bienvenido!");

    // Reset the Google first login state
    setIsGoogleFirstLogin(false);
    setGoogleUserInfo(null);
    setUserType(null);
    setBirthdate("");
    setCity("");
    setGender("");
    setPhone("");
  };

  // Render the Google first login form
  if (isGoogleFirstLogin && googleUserInfo) {
    return (
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Complete su perfil</CardTitle>
            <CardDescription>
              Necesitamos un poco más de información para completar su registro
              con Google
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleCompleteGoogleProfile}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <div className="p-2 border rounded-md bg-muted">
                  {googleUserInfo.name}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Correo electrónico</Label>
                <div className="p-2 border rounded-md bg-muted">
                  {googleUserInfo.email}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Ingrese su número de teléfono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthdate">Fecha de nacimiento</Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Género</Label>
                <RadioGroup
                  id="gender"
                  className="flex space-x-4"
                  value={gender}
                  onValueChange={setGender}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="masculino" id="masculino" />
                    <Label htmlFor="masculino">Masculino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="femenino" id="femenino" />
                    <Label htmlFor="femenino">Femenino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="otro" id="otro" />
                    <Label htmlFor="otro">Otro</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <select
                  id="city"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Seleccione una ciudad
                  </option>
                  <option value="bogota">Bogotá</option>
                  <option value="medellin">Medellín</option>
                  <option value="cali">Cali</option>
                  <option value="barranquilla">Barranquilla</option>
                  <option value="cartagena">Cartagena</option>
                  <option value="bucaramanga">Bucaramanga</option>
                  <option value="pereira">Pereira</option>
                  <option value="manizales">Manizales</option>
                  <option value="otra">Otra</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pb-6">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) =>
                    setAcceptTerms(checked as boolean)
                  }
                  required
                />
                <Label htmlFor="terms" className="text-sm">
                  He leído y acepto los términos y condiciones
                </Label>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsGoogleFirstLogin(false);
                  setGoogleUserInfo(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  !acceptTerms || !birthdate || !city || !gender || !phone
                }
              >
                Completar registro
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  // Renderizar la selección de tipo de usuario
  if (!userType) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">¿Cómo te quieres registrar?</CardTitle>
            <CardDescription>
              Selecciona el tipo de usuario que deseas registrar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              className="space-y-2.5"
              onValueChange={(value) => setUserType(value as UserType)}
            >
              <div className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-muted">
                <RadioGroupItem value="propietario" id="propietario" />
                <Label
                  htmlFor="propietario"
                  className="flex items-center cursor-pointer"
                >
                  <HomeIcon className="mr-2 h-5 w-5" />
                  <div>
                    <p className="font-medium">Propietario</p>
                    <p className="text-sm text-muted-foreground">
                      Registrarse como dueño de vehículos para renta
                    </p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-muted">
                <RadioGroupItem value="arrendatario" id="arrendatario" />
                <Label
                  htmlFor="arrendatario"
                  className="flex items-center cursor-pointer"
                >
                  <UserIcon className="mr-2 h-5 w-5" />
                  <div>
                    <p className="font-medium">Arrendatario</p>
                    <p className="text-sm text-muted-foreground">
                      Registrarse como persona que renta vehículos
                    </p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-muted">
                <RadioGroupItem value="conductor" id="conductor" />
                <Label
                  htmlFor="conductor"
                  className="flex items-center cursor-pointer"
                >
                  <CarIcon className="mr-2 h-5 w-5" />
                  <div>
                    <p className="font-medium">Conductor</p>
                    <p className="text-sm text-muted-foreground">
                      Registrarse como conductor de vehículos
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Renderizar el formulario de registro
  return (
    <div className="flex items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-xl">
          <CardTitle>{getUserTypeTitle()}</CardTitle>
          <CardDescription>{getUserTypeDescription()}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                placeholder="Ingrese su nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Ingrese su número de teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthdate">Fecha de nacimiento</Label>
              <Input
                id="birthdate"
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <RadioGroup
                id="gender"
                className="flex space-x-4"
                value={gender}
                onValueChange={setGender}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="masculino" id="masculino" />
                  <Label htmlFor="masculino">Masculino</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="femenino" id="femenino" />
                  <Label htmlFor="femenino">Femenino</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="otro" id="otro" />
                  <Label htmlFor="otro">Otro</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <select
                id="city"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              >
                <option value="" disabled>
                  Seleccione una ciudad
                </option>
                <option value="bogota">Bogotá</option>
                <option value="medellin">Medellín</option>
                <option value="cali">Cali</option>
                <option value="barranquilla">Barranquilla</option>
                <option value="cartagena">Cartagena</option>
                <option value="bucaramanga">Bucaramanga</option>
                <option value="pereira">Pereira</option>
                <option value="manizales">Manizales</option>
                <option value="otra">Otra</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (confirmPassword) {
                    setPasswordError(e.target.value !== confirmPassword);
                  }
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Repetir contraseña</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Repita su contraseña"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={passwordError ? "border-red-500" : ""}
                required
              />
              {passwordError && (
                <p className="text-sm text-red-500">
                  Las contraseñas no coinciden
                </p>
              )}
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="terms">
                <AccordionTrigger className="text-base">
                  Términos y Condiciones
                </AccordionTrigger>
                <AccordionContent>
                  <Textarea
                    className="min-h-[150px] resize-none"
                    readOnly
                    value="1. ACEPTACIÓN DE TÉRMINOS
Al acceder y utilizar este servicio, usted acepta estar sujeto a estos términos y condiciones.

2. USO DEL SERVICIO
Usted se compromete a utilizar el servicio de manera responsable y de acuerdo con todas las leyes aplicables.

3. PRIVACIDAD
Recopilamos y procesamos su información personal de acuerdo con nuestra política de privacidad.

4. PROPIEDAD INTELECTUAL
Todo el contenido proporcionado a través del servicio está protegido por derechos de autor y otras leyes de propiedad intelectual.

5. LIMITACIÓN DE RESPONSABILIDAD
No seremos responsables por daños indirectos, incidentales o consecuentes que surjan del uso del servicio.

6. MODIFICACIONES
Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación."
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex items-center space-x-2 pb-6">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) =>
                  setAcceptTerms(checked as boolean)
                }
              />
              <Label htmlFor="terms" className="text-sm">
                He leído y acepto los términos y condiciones
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <div className="flex w-full justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setUserType(null)}
              >
                Volver
              </Button>
              <Button type="submit" disabled={!acceptTerms || passwordError}>
                Crear cuenta
              </Button>
            </div>

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O continúa con
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={handleGoogleSignIn}
            >
              <div className="mr-2 flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
              </div>
              Iniciar sesión con Google
            </Button>

            <div className="mt-2 text-center text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => toast.info("Redirigiendo a inicio de sesión...")}
              >
                Iniciar sesión
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
