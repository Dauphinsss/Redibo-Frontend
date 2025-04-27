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
import {
  UserIcon,
  HomeIcon,
  CarIcon,
  ChevronRight,
  EyeOff,
  Eye,
} from "lucide-react";
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
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const resetar = () => {
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

    setNameTouched(false);
    setEmailTouched(false);
    setBirthdateTouched(false);
    setGenderTouched(false);
    setCityTouched(false);
    setPasswordTouched(false);
    setPhoneTouched(false);

    setShowConfirmPassword(false);
    setShowPassword(false);
  };


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

  useEffect(() => {
    const fetchCiudades = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/ciudades`);
        setCiudades(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCiudades();

  })
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setNameTouched(true);
    setEmailTouched(true);
    setBirthdateTouched(true);
    setGenderTouched(true);
    setCityTouched(true);
    setPasswordTouched(true);
    setPhoneTouched(true);

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    if (
      !name ||
      name.length < 3 ||
      name.length > 50 ||
      !/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/.test(name)
    ) {
      toast.error("Por favor, ingrese un nombre válido.");
      return;
    }

    if (
      !email ||
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(email) ||
      email.includes("..") ||
      email.startsWith(".") ||
      email.endsWith(".")
    ) {
      toast.error("Por favor, ingrese un correo electrónico válido.");
      return;
    }

    if (!phone || phone.length !== 8) {
      toast.error("El teléfono debe tener exactamente 8 números.");
      return;
    }

    if (!birthdate || isUnderage(birthdate) || birthdate > today) {
      toast.error("Por favor, ingrese una fecha de nacimiento válida.");
      return;
    }

    if (!gender) {
      toast.error("Por favor, seleccione su género.");
      return;
    }

    if (!city) {
      toast.error("Por favor, seleccione una ciudad.");
      return;
    }

    if (
      !password ||
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password)
    ) {
      toast.error("Por favor, ingrese una contraseña válida.");
      return;
    }

    if (!acceptTerms) {
      toast.error("Debes aceptar los términos y condiciones.");
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
      const user =
        userType === "HOST"
          ? "Propietario"
          : userType === "RENTER"
          ? "Arrendatario"
          : userType === "DRIVER"
          ? "Conductor"
          : "";
      const response = await axios.post(`${API_URL}/api/registro`, usuario);
      console.log(response.data);
      toast.success(`Gracias por registrarse como ${user}.`);
      resetar();
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
    // Solo establecer error si el campo tiene valor
    if (value.length > 0) {
      setPasswordError(password !== value);
    } else {
      setPasswordError(false);
    }
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
        return "Complete sus datos como conductor y acepte nuestnombreos términos y condiciones.";
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
                        onClick={() => {
                          setShowExitWarning(false);
                          setUserType(null);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setShowExitWarning(false); // Cerrar el modal
                          resetar(); // Restablecer el formulario
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
                <div className="flex flex-col gap-2">
                  <Input
                    id="name"
                    value={name}
                    maxLength={50}
                    onChange={(e) => setName(e.target.value.trimStart())}
                    onBlur={() => setNameTouched(true)}
                    placeholder="Ingrese su nombre"
                    className={
                      nameTouched &&
                      (name.length < 3 ||
                        name.length > 50 ||
                        !/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/.test(name.trim()))
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {nameTouched && (
                    <>
                      {name.trim().length < 3 && (
                        <p className="text-sm text-red-500">
                          El nombre debe tener al menos 3 caracteres
                        </p>
                      )}
                      {name.trim().length > 50 && (
                        <p className="text-sm text-red-500">
                          Debe tener menos de 50 caracteres
                        </p>
                      )}
                      {!/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/.test(name.trim()) &&
                        name.trim().length > 0 && (
                          <p className="text-sm text-red-500">
                            No debe contener caracteres especiales
                          </p>
                        )}
                    </>
                  )}
                </div>
              </div>

              {/* Correo electrónico */}
              {/* Correo electrónico */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico *</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    placeholder="correo@ejemplo.com"
                    className={
                      emailTouched &&
                      (!email ||
                        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(
                          email
                        ) ||
                        email.includes(".."))
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {emailTouched && (
                    <>
                      {email.length === 0 && (
                        <p className="text-sm text-red-500">
                          El correo es obligatorio
                        </p>
                      )}
                      {email.length > 0 &&
                        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(
                          email
                        ) && (
                          <p className="text-sm text-red-500">
                            Ingrese un correo válido
                          </p>
                        )}
                      {email.includes("..") && (
                        <p className="text-sm text-red-500">
                          El correo no debe contener puntos consecutivos
                        </p>
                      )}
                      {email.startsWith(".") && (
                        <p className="text-sm text-red-500">
                          El correo no debe comenzar con un punto
                        </p>
                      )}
                      {email.endsWith(".") && (
                        <p className="text-sm text-red-500">
                          El correo no debe terminar con un punto
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <div className="flex flex-col gap-2">
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
                      phoneTouched &&
                      (!/^[467]\d{7}$/.test(phone) || phone.length !== 8)
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {phoneTouched && (
                    <>
                      {phone.length !== 8 && (
                        <p className="text-sm text-red-500">
                          El teléfono debe tener exactamente 8 números
                        </p>
                      )}
                      {!/^[467]\d{7}$/.test(phone) && phone.length === 8 && (
                        <p className="text-sm text-red-500">
                          El teléfono debe comenzar con 4, 6 o 7
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Fecha */}
              <div className="space-y-2">
                <Label htmlFor="birthdate">Fecha de nacimiento *</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    id="birthdate"
                    type="date"
                    value={birthdate}
                    max={today}
                    min="1895-01-01"
                    onChange={(e) => setBirthdate(e.target.value)}
                    onBlur={() => setBirthdateTouched(true)}
                    className={
                      (!birthdate && birthdateTouched) ||
                      (birthdate &&
                        (isUnderage(birthdate) ||
                          birthdate > today ||
                          birthdate < "1895-01-01"))
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {birthdateTouched && (
                    <>
                      {!birthdate ? (
                        <p className="text-sm text-red-500">
                          Debes seleccionar tu fecha de nacimiento
                        </p>
                      ) : birthdate > today ? (
                        <p className="text-sm text-red-500">
                          La fecha no puede ser futura
                        </p>
                      ) : birthdate < "1895-01-01" ? (
                        <p className="text-sm text-red-500">
                          Ingrese una fecha válida
                        </p>
                      ) : isUnderage(birthdate) ? (
                        <p className="text-sm text-red-500">
                          Debes tener al menos 18 años para continuar
                        </p>
                      ) : null}
                    </>
                  )}
                </div>
              </div>

              {/* Género */}
              <div className="space-y-2">
                <Label htmlFor="gender">Género *</Label>
                <div className="flex flex-col gap-2">
                  <div
                    className={`w-full border rounded-md p-3 ${
                      genderTouched && !gender ? "border-red-500" : ""
                    }`}
                  >
                    <RadioGroup
                      id="gender"
                      className="flex gap-6"
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
                    <p className="text-sm text-red-500">
                      Por favor selecciona tu género
                    </p>
                  )}
                </div>
              </div>

              {/* Ciudad */}
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad *</Label>
                <div className="flex flex-col gap-2">
                  <select
                    id="city"
                    value={city}
                    onChange={(e) => setCity(Number(e.target.value))}
                    onBlur={() => setCityTouched(true)}
                    className={`w-full border rounded-md h-10 px-3 text-sm ${
                      cityTouched && !city ? "border-red-500" : ""
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
                    <p className="text-sm text-red-500">
                      Debes seleccionar una ciudad
                    </p>
                  )}
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-2 relative">
                <Label htmlFor="password">Contraseña *</Label>
                <div className="flex items-center gap-2 relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    maxLength={20}
                    onChange={(e) => {
                      const newPassword = e.target.value;
                      if (newPassword.length <= 20) {
                        setPassword(newPassword);
                        if (confirmPassword.length > 0) {
                          setPasswordError(newPassword !== confirmPassword);
                        }
                      }
                    }}
                    onBlur={() => setPasswordTouched(true)}
                    placeholder="Ingrese su contraseña"
                    className={`pr-10 ${
                      passwordTouched &&
                      (password.length === 0 ||
                        password.length < 8 ||
                        !isPasswordStrong(password))
                        ? "border-red-500"
                        : ""
                    }`}
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
                    {password.length === 0 ? (
                      <p className="text-sm text-red-500">
                        La contraseña es obligatoria.
                      </p>
                    ) : password.length < 8 ? (
                      <p className="text-sm text-red-500">
                        La contraseña debe tener al menos 8 caracteres
                      </p>
                    ) : !/[A-Z]/.test(password) ? (
                      <p className="text-sm text-red-500">
                        Debe contener al menos una letra mayúscula
                      </p>
                    ) : !/[0-9]/.test(password) ? (
                      <p className="text-sm text-red-500">
                        Debe contener al menos un número
                      </p>
                    ) : !/[^A-Za-z0-9]/.test(password) ? (
                      <p className="text-sm text-red-500">
                        Debe contener al menos un carácter especial
                      </p>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="confirm-password">Repetir contraseña *</Label>
                <div className="flex items-center gap-2 relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repita su contraseña"
                    value={confirmPassword}
                    maxLength={20}
                    onChange={handleConfirmPasswordChange}
                    onBlur={() => setPasswordTouched(true)}
                    className={`pr-10 ${
                      passwordError || (passwordTouched && !confirmPassword)
                        ? "border-red-500"
                        : ""
                    }`}
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
              <div>
                <Link href="/terminos-y-condiciones ">
                  <Button
                    variant="link"
                    className="font-normal -ml-2"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open("/terminos-y-condiciones", "_blank");
                    }}
                  >
                    Leer términos y condiciones{" "}
                    <ChevronRight className="-ml-1" />
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
              <Button type="submit" disabled={!acceptTerms}>
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
              disabled
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
              <a className="text-black-600 hover:underline">Iniciar sesión</a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </TooltipProvider>
  );
}
