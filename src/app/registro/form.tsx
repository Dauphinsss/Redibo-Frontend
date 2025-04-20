"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { isUnderage } from "../../lib/utils";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TooltipProvider } from "@/components/ui/tooltip";
import InputErrorIcon from "@/components/ui/inputErrorIcon";
import { UserIcon, HomeIcon, CarIcon, ArrowRight } from "lucide-react";
import { API_URL } from "@/utils/bakend";
import { Ciudad } from "@/utils/types";
import Link from "next/link";

type UserType = "HOST" | "RENTER" | "DRIVER" | null;

export default function Form() {
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState<UserType>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState<number>(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  //const [passwordError, setPasswordError] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);

  // Evitar la selección de fechas futuras
  const today = new Date().toISOString().split("T")[0];

  // Manejar el botón de retroceso del navegador
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isFormDirty) {
        const message =
          "¿Estás seguro que deseas salir? Los cambios no guardados se perderán.";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    const fechData = async () => {
      try {
        const { data } = await axios.get<Ciudad[]>(`${API_URL}/api/ciudades`);
        setCiudades(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fechData();

    const handlePopState = () => {
      if (isFormDirty) {
        if (
          window.confirm(
            "¿Estás seguro que deseas salir? Los cambios no guardados se perderán."
          )
        ) {
          window.history.back();
        } else {
          window.history.pushState(null, "", window.location.href);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    // Add state to browser history when component mounts
    window.history.pushState(null, "", window.location.href);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isFormDirty]);

  const handleFormChange = () => {
    if (!isFormDirty) {
      setIsFormDirty(true);
    }
  };

  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [birthdateTouched, setBirthdateTouched] = useState(false);
  const [genderTouched, setGenderTouched] = useState(false);
  const [cityTouched, setCityTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setNameTouched(true);
    setEmailTouched(true);
    setBirthdateTouched(true);
    setGenderTouched(true);
    setCityTouched(true);
    setPasswordTouched(true);
    setPhoneTouched(true);

    if (!acceptTerms) {
      toast.error("Debes aceptar los términos y condiciones.");
      return;
    }

    if (!birthdate || !gender || !city || !phone) {
      toast.error("Por favor, complete todos los campos requeridos.");
      return;
    }

    const usuario = {
      nombre: name,
      correo: email,
      fechaNacimiento: birthdate,
      genero: gender,
      ciudad: city,
      contrasena: password,
      telefono: phone,
      rol: userType,
    };

    console.log(usuario);

    try {
      const response = await axios.post(`${API_URL}/api/registro`, usuario);
      console.log(response.data);
      toast.success(`Gracias por registrarse como ${userType}.`);
      setName("");
      setEmail("");
      setBirthdate("");
      setGender("");
      setPhone("");
      setCity(0);
      setPassword("");
      setConfirmPassword("");
      setAcceptTerms(false);
      setPasswordError(false);
      setUserType(null);
      setIsFormDirty(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(` ${error.response?.data.error}`);
      }
      console.error("Error al registrar el usuario:", error);
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordError(password !== value && value !== "");
    handleFormChange();
  };

  const getUserTypeTitle = () => {
    switch (userType) {
      case "HOST":
        return "Registrar Propietario";
      case "RENTER":
        return "Registrar Arrendatario";
      case "DRIVER":
        return "Registrar Conductor";
      default:
        return "Registro";
    }
  };

  const getUserTypeDescription = () => {
    switch (userType) {
      case "HOST":
        return "Complete sus datos como propietario de vehículos para renta y acepte nuestros términos y condiciones.";
      case "RENTER":
        return "Complete sus datos como persona que se renta vehículos y acepte nuestros términos y condiciones.";
      case "DRIVER":
        return "Complete sus datos como conductor y acepte nuestros términos y condiciones.";
      default:
        return "Seleccione el tipo de usuario para continuar con el registro.";
    }
  };

  if (!userType) {
    return (
      <div className="flex items-center justify-center p-8 mt-auto">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">
              ¿Cómo te quieres registrar?
            </CardTitle>
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
                <RadioGroupItem value="HOST" id="propietario" />
                <Label htmlFor="propietario" className="flex items-center">
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
                <RadioGroupItem value="RENTER" id="arrendatario" />
                <Label htmlFor="arrendatario" className="flex items-center">
                  <UserIcon className="mr-2 h-5 w-5" />
                  <div>
                    <p className="font-medium">Arrendatario</p>
                    <p className="text-sm text-muted-foreground">
                      Registrarse como persona que se renta vehículos
                    </p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-md border p-4 cursor-pointer hover:bg-muted">
                <RadioGroupItem value="DRIVER" id="conductor" />
                <Label htmlFor="conductor" className="flex items-center">
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
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => (window.location.href = "/")}
            >
              Regresar al inicio
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  function isPasswordStrong(pw: string) {
    const hasUpperCase = /[A-Z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);
    return pw.length >= 8 && hasUpperCase && hasNumber && hasSpecial;
  }

  return (
    <TooltipProvider>
      <div className="flex items-center justify-center min-h-screen p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">{getUserTypeTitle()}</CardTitle>
            <CardDescription>{getUserTypeDescription()}</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 relative">
              {/* Warning Dialog */}
              {showExitWarning && (
                <div className="fixed inset-0 flex items-center justify-center z-[9999]">
                  <div
                    className="absolute inset-0 bg-black/50"
                    style={{ height: "100vh", width: "100vw" }}
                  />
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4 relative z-50">
                    <h3 className="text-lg font-semibold mb-4">
                      ¿Estás seguro que deseas salir?
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Los cambios no guardados se perderán.
                    </p>
                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowExitWarning(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setShowExitWarning(false);
                          setUserType(null);
                        }}
                      >
                        Salir
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo *</Label>
                <div className="relative flex items-center">
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setNameTouched(true)}
                    placeholder="Ingrese su nombre"
                    className={
                      nameTouched &&
                      (name.length < 3 ||
                        name.length > 30 ||
                        !/^[a-zA-Z\s]+$/.test(name))
                        ? "border-red-500 pr-10"
                        : ""
                    }
                  />
                  {nameTouched && (
                    <>
                      {name.length < 3 ? (
                        <InputErrorIcon message="Debe tener al menos 3 caracteres" />
                      ) : name.length > 30 ? (
                        <InputErrorIcon message="Debe tener menos de 30 caracteres" />
                      ) : !/^[a-zA-Z\s]+$/.test(name) ? (
                        <InputErrorIcon message="No debe contener caracteres especiales" />
                      ) : null}
                    </>
                  )}
                </div>
              </div>

              {/* Correo electrónico */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico *</Label>
                <div className="relative flex items-center">
                  <Input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    placeholder="correo@ejemplo.com"
                    className={
                      emailTouched &&
                      (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
                        ? "border-red-500 pr-10"
                        : ""
                    }
                  />
                  {emailTouched && (
                    <>
                      {email.length === 0 && (
                        <InputErrorIcon message="El correo es obligatorio." />
                      )}
                      {email.length > 0 &&
                        !/^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                          email
                        ) && (
                          <InputErrorIcon message="Ingrese un correo válido." />
                        )}
                    </>
                  )}
                </div>
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <div className="relative flex items-center">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Ingrese su número de teléfono"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setPhone(value);
                        handleFormChange();
                      }
                    }}
                    onBlur={() => setPhoneTouched(true)}
                    maxLength={8}
                    className={
                      phoneTouched && phone.length !== 8
                        ? "border-red-500 pr-10"
                        : ""
                    }
                  />
                  {phoneTouched && phone.length !== 8 && (
                    <InputErrorIcon message="El teléfono debe tener exactamente 8 números." />
                  )}
                </div>
              </div>

              {/* Fecha */}
              <div className="space-y-2">
                <Label htmlFor="birthdate">Fecha de nacimiento *</Label>
                <div className="relative flex items-center">
                  <Input
                    id="birthdate"
                    type="date"
                    value={birthdate}
                    max={today} // sigue respetando el máximo como hoy
                    onChange={(e) => setBirthdate(e.target.value)}
                    onBlur={() => setBirthdateTouched(true)}
                    className={
                      !birthdate && birthdateTouched
                        ? "border-red-500 pr-10"
                        : isUnderage(birthdate)
                        ? "border-red-500 pr-10"
                        : ""
                    }
                  />
                  {/* Si no hay fecha */}
                  {!birthdate && birthdateTouched && (
                    <InputErrorIcon message="Debes seleccionar tu fecha de nacimiento." />
                  )}
                  {/* Si hay fecha y es menor de edad */}
                  {birthdate && isUnderage(birthdate) && (
                    <InputErrorIcon message="Debes tener al menos 18 años para continuar." />
                  )}
                </div>
              </div>

              {/* Género */}
              <div className="space-y-2">
                <Label htmlFor="gender">Género *</Label>
                <div className="relative w-full h-10">
                  <div
                    className={`w-full h-full flex items-center rounded-md px-3 ${
                      genderTouched && !gender
                        ? "border border-red-500 pr-10"
                        : "border"
                    }`}
                  >
                    <RadioGroup
                      id="gender"
                      className="flex gap-6 w-full"
                      value={gender}
                      onValueChange={setGender}
                      onBlur={() => setGenderTouched(true)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="MASCULINO" id="masculino" />
                        <Label htmlFor="masculino">Masculino</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="FEMENINO" id="femenino" />
                        <Label htmlFor="femenino">Femenino</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="OTRO" id="otro" />
                        <Label htmlFor="otro">Otro</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {!gender && genderTouched && (
                    <div className="absolute right-[-23px] top-1/2 -translate-y-1/2">
                      <InputErrorIcon message="Por favor selecciona tu género." />
                    </div>
                  )}
                </div>
              </div>

              {/* Ciudad */}
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad *</Label>
                <div className="relative flex items-center">
                  <select
                    id="city"
                    value={city}
                    onChange={(e) => setCity(Number(e.target.value))}
                    onBlur={() => setCityTouched(true)}
                    className={`w-full border rounded-md h-10 px-3 text-sm ${
                      cityTouched && !city ? "border-red-500 pr-10" : ""
                    }`}
                  >
                    <option value={0} disabled>
                      Seleccione una ciudad
                    </option>
                    {ciudades.map((ciudad) => (
                      <option key={ciudad.id} value={ciudad.id}>
                        {ciudad.nombre}
                      </option>
                    ))}
                  </select>
                  {!city && cityTouched && (
                    <InputErrorIcon message="Debes seleccionar una ciudad." />
                  )}
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <div className="relative flex items-center">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    maxLength={20}
                    onChange={(e) => {
                      const newPassword = e.target.value;
                      if (newPassword.length <= 20) {
                        setPassword(newPassword);
                        if (confirmPassword) {
                          setPasswordError(newPassword !== confirmPassword);
                        }
                      }
                      //handleFormChange();
                    }}
                    onBlur={() => setPasswordTouched(true)}
                    placeholder="Ingrese su contraseña"
                    className={
                      passwordTouched &&
                      (password.length < 8 || !isPasswordStrong(password))
                        ? "border-red-500 pr-10"
                        : ""
                    }
                  />
                    {passwordTouched && (
                  <>
                    {password.length < 8 ? (
                      <InputErrorIcon message="Debe tener al menos 8 caracteres." />
                    ) : !/[A-Z]/.test(password) ? (
                      <InputErrorIcon message="Debe contener al menos una letra mayúscula." />
                    ) : !/[0-9]/.test(password) ? (
                      <InputErrorIcon message="Debe contener al menos un número." />
                    ) : !/[^A-Za-z0-9]/.test(password) ? (
                      <InputErrorIcon message="Debe contener al menos un carácter especial." />
                    ) : null}
                  </>
                )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Repetir contraseña *</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Repita su contraseña"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={passwordError ? "border-red-500" : ""}
                />
                {passwordError && (
                  <p className="text-sm text-red-500">
                    Las contraseñas no coinciden
                  </p>
                )}
              </div>
              <div>
               <Link href="/terminos-y-condiciones" >
                  <Button variant="link" className="font-normal -ml-2" >
                    Leer términos y condiciones <ArrowRight />
                  </Button>
              </Link>
              </div>
              
              <div className="flex items-center space-x-2">
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

            <CardFooter className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowExitWarning(true)}
              >
                Volver
              </Button>
              <Button type="submit" disabled={!acceptTerms || passwordError}>
                Crear cuenta
              </Button>
            </CardFooter>
          </form>

          {/* Footer extra opcional */}
          <CardFooter className="flex flex-col gap-4 pt-0">
            <div className="relative w-full text-center">
              <hr className="border-gray-300" />
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-gray-500 text-sm">
                O CONTINÚA CON
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Iniciar sesión con Google
            </Button>

            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <a href="/login" className="text-black-600 hover:underline">
                Iniciar sesión
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </TooltipProvider>
  );
}
