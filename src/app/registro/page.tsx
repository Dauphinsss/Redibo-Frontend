"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
  const [isFormDirty, setIsFormDirty] = useState(false);

  // Evitar la selección de fechas futuras
  const today = new Date().toISOString().split('T')[0];

  // Manejar el botón de retroceso del navegador
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isFormDirty) {
        const message = "¿Estás seguro que deseas salir? Los cambios no guardados se perderán.";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    const handlePopState = () => {
      if (isFormDirty) {
        if (window.confirm("¿Estás seguro que deseas salir? Los cambios no guardados se perderán.")) {
          window.history.back();
        } else {
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    
    // Add state to browser history when component mounts
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isFormDirty]);

  const handleFormChange = () => {
    if (!isFormDirty) {
      setIsFormDirty(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError(true);
      toast.error("Las contraseñas no coinciden. Por favor, inténtelo de nuevo.");
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

    toast.success(`Gracias por registrarse como ${userType}.`);
    
    // Restablecer formulario
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
    setIsFormDirty(false);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordError(password !== value && value !== "");
    handleFormChange();
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

  if (!userType) {
    return (
      <div className="flex items-center justify-center p-8">
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
                onChange={(e) => {
                  setName(e.target.value);
                  handleFormChange();
                }}
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleFormChange();
                }}
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
                onChange={(e) => {
                  setPhone(e.target.value);
                  handleFormChange();
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthdate">Fecha de nacimiento</Label>
              <Input
                id="birthdate"
                type="date"
                value={birthdate}
                max={today}
                onChange={(e) => {
                  setBirthdate(e.target.value);
                  handleFormChange();
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <RadioGroup
                id="gender"
                className="flex space-x-4"
                value={gender}
                onValueChange={(value) => {
                  setGender(value);
                  handleFormChange();
                }}
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
                onChange={(e) => {
                  setCity(e.target.value);
                  handleFormChange();
                }}
                required
              >
                <option value="" disabled>
                  Seleccione una ciudad
                </option>
                <option value="Beni">Beni</option>
                <option value="Pando">Pando</option>
                <option value="La paz">La paz</option>
                <option value="Santa Cruz">Santa Cruz</option>
                <option value="Chuquisaca">Chuquisaca</option>
                <option value="Tarija">Tarija</option>
                <option value="Cochabamba">Cochabamba</option>
                <option value="Oruro">Oruro</option>
                <option value="Potosi">Potosi</option>
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
                  handleFormChange();
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
                onCheckedChange={(checked) => {
                  setAcceptTerms(checked as boolean);
                  handleFormChange();
                }}
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
                onClick={() => {
                  if (isFormDirty) {
                    if (window.confirm("¿Estás seguro que deseas cancelar el registro? Los cambios no guardados se perderán.")) {
                      setUserType(null);
                      setIsFormDirty(false);
                    }
                  } else {
                    setUserType(null);
                  }
                }}
              >
                Volver
              </Button>
              <Button type="submit" disabled={!acceptTerms || passwordError}>
                Crear cuenta
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
