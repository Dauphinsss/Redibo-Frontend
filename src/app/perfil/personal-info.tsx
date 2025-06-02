"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios, { AxiosError } from "axios";
import { isUnderage } from "@/lib/utils"; 
import { API_URL } from "@/utils/bakend";
interface City {
  id: number;
  nombre: string;
}

interface UserProfile {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  fecha_nacimiento: string;
  genero: string;
  ciudad: {
    id: number;
    nombre: string;
  };
  roles: string[];
  foto: string;
}


export function PersonalInfo() {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [valorNombre, setValorNombre] = useState("");
  const [editandoTelefono, setEditandoTelefono] = useState(false);
  const [valorTelefono, setValorTelefono] = useState("");
  const [editandoNacimiento, setEditandoNacimiento] = useState(false);
  const [valorNacimiento, setValorNacimiento] = useState("");
  const [editandoGenero, setEditandoGenero] = useState(false);
  const [valorGenero, setValorGenero] = useState("");
  const [editandoCiudad, setEditandoCiudad] = useState(false);
  const [valorCiudad, setValorCiudad] = useState("");
  const [listaCiudades, setListaCiudades] = useState<City[]>([]);
  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : "";

  function parseBackendDate(fechaBruta: string | undefined): string {
    if (!fechaBruta) return "";
    if (fechaBruta.includes("T")) {
      return fechaBruta.split("T")[0];
    }
    if (fechaBruta.includes("/")) {
      const [d, m, y] = fechaBruta.split("/");
      const dia = d.padStart(2, "0");
      const mes = m.padStart(2, "0");
      return `${y}-${mes}-${dia}`;
    }
    return "";
  }
  function formatToDDMMYYYY(fechaISO: string): string {
    if (!fechaISO) return "";
    let dia: string, mes: string, anio: string;
    if (fechaISO.includes("T")) {
      const soloFecha = fechaISO.split("T")[0];
      [anio, mes, dia] = soloFecha.split("-");
    } else {
      [anio, mes, dia] = fechaISO.split("-");
    }
    dia = dia.padStart(2, "0");
    mes = mes.padStart(2, "0");
    return `${dia}/${mes}/${anio}`;
  }
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!token) {
          console.error("No se encontró el token de autenticación");
          setLoading(false);
          return;
        }

        const response = await axios.get<UserProfile>(`${API_URL}/api/perfil`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        const data = response.data;
        const isoNacimiento = parseBackendDate(data.fecha_nacimiento);
        setUserData({
          ...data,fecha_nacimiento: isoNacimiento,
        });
        setValorNombre(data.nombre || "");
        setValorTelefono(data.telefono || "");
        setValorNacimiento(isoNacimiento);
        setValorGenero(data.genero || "");
        setValorCiudad(data.ciudad?.nombre || "");
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCiudades = async () => {
      try {
        if (!token) return;
        const res = await axios.get<City[]>(`${API_URL}/api/ciudades`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setListaCiudades(res.data);
      } catch (err) {
        console.error("Error al obtener ciudades:", err);
      }
    };
    fetchUserProfile();
    fetchCiudades();
  }, [token]);

  if (loading) {
    return <div>Cargando información personal...</div>;
  }
  if (!userData) {
    return <div>No se pudo cargar la información del usuario.</div>;
  }
  const actualizarCampo = async (
    campo: string,
    valor: string,
    onSuccess: (nuevoValor: unknown) => void,
    onError?: (msg: string) => void
  ) => {
    try {
      const payload: Record<string, string> = {};
      payload[campo] = valor;

      const response = await axios.post(
        `${API_URL}/api/update-profile`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      if (response.status === 200 && data.success) {
        onSuccess(data.user[campo as keyof typeof data.user]);
      } else {
        const msg: string =
          (data as { message?: string }).message || "Error al actualizar " + campo;
        if (onError) onError(msg);
        else alert(msg);
      }
    } catch (err) {
      const errorAxios = err as AxiosError<{ message?: string }>;
      const msg =
        errorAxios.response?.data?.message ||
        "Ocurrió un error al actualizar " + campo.replace("_", " ");
      if (onError) onError(msg);
      else alert(msg);
      console.error(err);
    }
  };
  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoValor = e.target.value;
    const regexSoloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;
    if (nuevoValor.length > 60) {
      setErrores((prev) => ({
        ...prev,
        nombre: "El nombre no puede exceder los 60 caracteres.",
      }));
      return;
    }
    if (nuevoValor === "" || regexSoloLetras.test(nuevoValor)) {
      setValorNombre(nuevoValor);
      setErrores((prev) => {
        const copia = { ...prev };
        delete copia.nombre;
        return copia;
      });
    } else {
      setErrores((prev) => ({
        ...prev,
        nombre: "Sólo se permiten letras y espacios.",
      }));
    }
  };

  const guardarNombre = () => {
    if (!valorNombre.trim()) {
      setErrores((prev) => ({ ...prev, nombre: "Este campo es obligatorio." }));
      return;
    }
    if (valorNombre.trim().length < 3) {
      setErrores((prev) => ({
        ...prev,
        nombre: "El nombre debe tener al menos 3 caracteres.",
      }));
      return;
    }
    if (valorNombre.trim().length > 60) {
      setErrores((prev) => ({
        ...prev,
        nombre: "El nombre no puede exceder los 60 caracteres.",
      }));
      return;
    }
    const regexSoloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!regexSoloLetras.test(valorNombre.trim())) {
      setErrores((prev) => ({
        ...prev,
        nombre: "Sólo se permiten letras y espacios.",
      }));
      return;
    }
    setErrores((prev) => {
      const copia = { ...prev };
      delete copia.nombre;
      return copia;
    });
    actualizarCampo("nombre", valorNombre.trim(), (nuevoValor) => {
      setUserData((prev) =>
        prev ? { ...prev, nombre: nuevoValor as string } : prev
      );
      setEditandoNombre(false);
    },
    (mensajeError) => {
      setErrores((prev) => ({ ...prev, nombre: mensajeError }));
    });
  };
  const guardarTelefono = () => {
    if (!valorTelefono.trim()) {
      setErrores((prev) => ({
        ...prev,
        telefono: "El teléfono es obligatorio.",
      }));
      return;
    }
    if (valorTelefono.trim().length !== 8) {
      setErrores((prev) => ({
        ...prev,
        telefono: "El teléfono debe tener exactamente 8 números.",
      }));
      return;
    }
    if (!/^[467]/.test(valorTelefono.trim())) {
      setErrores((prev) => ({
        ...prev,
        telefono: "El teléfono debe comenzar con 4, 6 o 7.",
      }));
      return;
    }

    setErrores((prev) => {
      const copia = { ...prev };
      delete copia.telefono;
      return copia;
    });

    actualizarCampo("telefono", valorTelefono.trim(), (nuevoValor) => {
      setUserData((prev) =>
        prev ? { ...prev, telefono: nuevoValor as string } : prev
      );
      setEditandoTelefono(false);
      window.location.reload();
    });
  };
  const guardarNacimiento = () => {
    if (!valorNacimiento) {
      setErrores((prev) => ({
        ...prev,
        fechaNacimiento: "La fecha de nacimiento es obligatoria.",
      }));
      return;
    }
    if (valorNacimiento < minDate) {
        setErrores((prev) => ({
          ...prev,
          fechaNacimiento: `Por favor ingrese una fecha valida.`,
        }));
        return;
      }

    if (isUnderage(valorNacimiento)) {
      setErrores((prev) => ({
        ...prev,
        fechaNacimiento: "Debes ser mayor de 18 años.",
      }));
      return;
    }

    setErrores((prev) => {
      const copia = { ...prev };
      delete copia.fechaNacimiento;
      return copia;
    });

    const [y, m, d] = valorNacimiento.split("-");
    const ddmmyyyy = `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
    actualizarCampo("fecha_nacimiento", ddmmyyyy, (nuevoValor) => {
      const iso = parseBackendDate(nuevoValor as string);
      setUserData((prev) =>
        prev ? { ...prev, fecha_nacimiento: iso } : prev
      );
      setEditandoNacimiento(false);
    });
  };
  const guardarGenero = () => {
    if (!valorGenero) {
      setErrores((prev) => ({
        ...prev,
        genero: "Por favor seleccione su genero.",
      }));
      return;
    }
    setErrores((prev) => {
      const copia = { ...prev };
      delete copia.genero;
      return copia;
    });

    actualizarCampo("genero", valorGenero, (nuevoValor) => {
      setUserData((prev) =>
        prev ? { ...prev, genero: nuevoValor as string } : prev
      );
      setEditandoGenero(false);
    });
  };
  const guardarCiudad = () => {
    if (!valorCiudad.trim()) {
      setErrores((prev) => ({
        ...prev,
        ciudad: "Debes seleccionar una ciudad.",
      }));
      return;
    }
    setErrores((prev) => {
      const copia = { ...prev };
      delete copia.ciudad;
      return copia;
    });

    actualizarCampo(
      "ciudad",
      valorCiudad.trim(),
      (nuevoValor) => {
        const obj = nuevoValor as { id: number; nombre: string };
        setUserData((prev) =>
          prev
            ? {
                ...prev,
                ciudad: {
                  id: obj.id,
                  nombre: obj.nombre,
                },
              }
            : prev
        );
        setEditandoCiudad(false);
      },
      (mensajeError) => {
        setErrores((prev) => ({ ...prev, ciudad: mensajeError }));
      }
    );
  };
  const today = new Date().toISOString().split("T")[0];
  const haceCienAnios = new Date();
  haceCienAnios.setFullYear(haceCienAnios.getFullYear() - 100);
  const minDate = haceCienAnios.toISOString().split("T")[0];

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        <div className="grid col-span-2 md:col-span-1 gap-2">
          <Label htmlFor="nombre" className="text-base">
            Nombre Completo 
          </Label>
          <div className="relative min-h-[6.5rem]">
            <div className={`border rounded bg-gray-50 px-3 py-2 h-[2.75rem] flex items-center ${
                errores.nombre ? "border-red-500" : ""
              }`}
            >
              {editandoNombre ? (
                <input
                  type="text"
                  id="nombre"
                  className="w-full bg-transparent outline-none text-gray-800"
                  value={valorNombre}
                  onChange={handleNombreChange}
                  autoFocus
                />
              ) : (
                <span className="block w-full text-gray-800">
                  {userData.nombre || "—"}
                </span>
              )}

              {editandoNombre ? (
                <button
                  className="text-gray-500 hover:text-gray-800 ml-2"
                  onClick={() => {
                    setEditandoNombre(false);
                    setValorNombre(userData.nombre);
                    setErrores((prev) => {
                      const copia = { ...prev };
                      delete copia.nombre;
                      return copia;
                    });
                  }}
                  title="Cerrar edición"
                  aria-label="Cerrar edición nombre"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  className="text-gray-500 hover:text-gray-800 ml-2"
                  onClick={() => {
                    setEditandoNombre(true);
                    setErrores((prev) => {
                      const copia = { ...prev };
                      delete copia.nombre;
                      return copia;
                    });
                  }}
                  title="Editar nombre"
                  aria-label="Editar nombre"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M4 13.414V17h3.586l9.364-9.364-3.586-3.586L4 13.414z"
                    />
                  </svg>
                </button>
              )}
            </div>
            {errores.nombre && (
              <p className="text-red-500 text-sm mt-1 absolute bottom-9 left-3">
                {errores.nombre}
              </p>
            )}
            {editandoNombre && (
              <div className="absolute bottom-0 left-0 flex space-x-2">
                <Button size="sm" onClick={guardarNombre}>
                  Guardar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditandoNombre(false);
                    setValorNombre(userData.nombre);
                    setErrores((prev) => {
                      const copia = { ...prev };
                      delete copia.nombre;
                      return copia;
                    });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid col-span-2 md:col-span-1 gap-2">
          <Label htmlFor="correo" className="text-base">
            Correo Electrónico
          </Label>
          <div className="relative min-h-[6rem]">
            <div className="border rounded bg-gray-50 px-3 py-2 h-[2.75rem] flex items-center">
              <span className="block w-full text-gray-800">
                {userData.correo}
              </span>
            </div>
          </div>
        </div>

        <div className="grid col-span-2 md:col-span-1 gap-2">
          <Label htmlFor="telefono" className="text-base">
            Número de Teléfono 
          </Label>
          <div className="relative min-h-[6.5rem]">
            <div
              className={`border rounded bg-gray-50 px-3 py-2 h-[2.75rem] flex items-center ${
                errores.telefono ? "border-red-500" : ""
              }`}
            >
              {editandoTelefono ? (
                <input
                  type="text"
                  id="telefono"
                  className="w-full bg-transparent outline-none text-gray-800"
                  value={valorTelefono}
                  onChange={(e) =>
                    setValorTelefono(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  autoFocus
                />
              ) : (
                <span className="block w-full text-gray-800">
                  {userData.telefono || "—"}
                </span>
              )}
              {editandoTelefono ? (
                <button
                  className="text-gray-500 hover:text-gray-800 ml-2"
                  onClick={() => {
                    setEditandoTelefono(false);
                    setValorTelefono(userData.telefono);
                    setErrores((prev) => {
                      const copia = { ...prev };
                      delete copia.telefono;
                      return copia;
                    });
                  }}
                  title="Cerrar edición"
                  aria-label="Cerrar edición teléfono"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  className="text-gray-500 hover:text-gray-800 ml-2"
                  onClick={() => {
                    setEditandoTelefono(true);
                    setErrores((prev) => {
                      const copia = { ...prev };
                      delete copia.telefono;
                      return copia;
                    });
                  }}
                  title="Editar teléfono"
                  aria-label="Editar teléfono"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M4 13.414V17h3.586l9.364-9.364-3.586-3.586L4 13.414z"
                    />
                  </svg>
                </button>
              )}
            </div>
            {errores.telefono && (
              <p className="text-red-500 text-sm mt-1 absolute bottom-9 left-3">
                {errores.telefono}
              </p>
            )}
            {editandoTelefono && (
              <div className="absolute bottom-0 left-0 flex space-x-2">
                <Button size="sm" onClick={guardarTelefono}>
                  Guardar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditandoTelefono(false);
                    setValorTelefono(userData.telefono);
                    setErrores((prev) => {
                      const copia = { ...prev };
                      delete copia.telefono;
                      return copia;
                    });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid col-span-2 md:col-span-1 gap-2">
          <Label htmlFor="fecha_nacimiento" className="text-base">
            Fecha de Nacimiento 
          </Label>
          <div className="relative min-h-[6.5rem]">
            <div
              className={`border rounded bg-gray-50 px-3 py-2 h-[2.75rem] flex items-center ${
                errores.fechaNacimiento ? "border-red-500" : ""
              }`}
            >
              {editandoNacimiento ? (
                <input
                  type="date"
                  id="fecha_nacimiento"
                  className="w-full bg-transparent outline-none text-gray-800"
                  value={valorNacimiento}
                  onChange={(e) => setValorNacimiento(e.target.value)}
                  min={minDate}
                  max={today} 
                  autoFocus
                />
              ) : (
                <span className="block w-full text-gray-800">
                  {formatToDDMMYYYY(userData.fecha_nacimiento) || "—"}
                </span>
              )}
              {editandoNacimiento ? (
                <button
                  className="text-gray-500 hover:text-gray-800 ml-2"
                  onClick={() => {
                    setEditandoNacimiento(false);
                    setValorNacimiento(userData.fecha_nacimiento);
                    setErrores((prev) => {
                      const copia = { ...prev };
                      delete copia.fechaNacimiento;
                      return copia;
                    });
                  }}
                  title="Cerrar edición"
                  aria-label="Cerrar edición fecha"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  className="text-gray-500 hover:text-gray-800 ml-2"
                  onClick={() => {
                    setEditandoNacimiento(true);
                    setErrores((prev) => {
                      const copia = { ...prev };
                      delete copia.fechaNacimiento;
                      return copia;
                    });
                  }}
                  title="Editar fecha de nacimiento"
                  aria-label="Editar fecha de nacimiento"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M4 13.414V17h3.586l9.364-9.364-3.586-3.586L4 13.414z"
                    />
                  </svg>
                </button>
              )}
            </div>
            {errores.fechaNacimiento && (
              <p className="text-red-500 text-sm mt-1 absolute bottom-9 left-3">
                {errores.fechaNacimiento}
              </p>
            )}
            {editandoNacimiento && (
              <div className="absolute bottom-0 left-0 flex space-x-2">
                <Button size="sm" onClick={guardarNacimiento}>
                  Guardar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditandoNacimiento(false);
                    setValorNacimiento(userData.fecha_nacimiento);
                    setErrores((prev) => {
                      const copia = { ...prev };
                      delete copia.fechaNacimiento;
                      return copia;
                    });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid col-span-2 md:col-span-1 gap-2">
          <Label htmlFor="genero" className="text-base">
            Género 
          </Label>
          <div className="relative min-h-[6.5rem]">
            <div
              className={`border rounded bg-gray-50 px-3 py-2 h-[2.75rem] flex items-center ${
                errores.genero ? "border-red-500" : ""
              }`}
            >
              {editandoGenero ? (
                <select
                  id="genero"
                  className="w-full bg-transparent outline-none text-gray-800"
                  value={valorGenero}
                  onChange={(e) => setValorGenero(e.target.value)}
                  autoFocus
                >
                  <option value="">--Selecciona--</option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMENINO">Femenino</option>
                  <option value="OTRO">Otro</option>
                </select>
              ) : (
                <span className="block w-full text-gray-800">
                  {userData.genero || "—"}
                </span>
              )}
              {editandoGenero ? (
                <button
                  className="text-gray-500 hover:text-gray-800 ml-2"
                  onClick={() => {
                    setEditandoGenero(false);
                    setValorGenero(userData.genero);
                    setErrores((prev) => {
                      const copia = { ...prev };
                      delete copia.genero;
                      return copia;
                    });
                  }}
                  title="Cerrar edición"
                  aria-label="Cerrar edición género"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  className="text-gray-500 hover:text-gray-800 ml-2"
                  onClick={() => {
                    setEditandoGenero(true);
                    setErrores((prev) => {
                      const copia = { ...prev };
                      delete copia.genero;
                      return copia;
                    });
                  }}
                  title="Editar género"
                  aria-label="Editar género"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M4 13.414V17h3.586l9.364-9.364-3.586-3.586L4 13.414z"
                    />
                  </svg>
                </button>
              )}
            </div>

            {errores.genero && (
              <p className="text-red-500 text-sm mt-1 absolute bottom-9 left-3">
                {errores.genero}
              </p>
            )}

            {editandoGenero && (
              <div className="absolute bottom-0 left-0 flex space-x-2">
                <Button size="sm" onClick={guardarGenero}>
                  Guardar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditandoGenero(false);
                    setValorGenero(userData.genero);
                    setErrores((prev) => {
                      const copia = { ...prev };
                      delete copia.genero;
                      return copia;
                    });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid col-span-2 md:col-span-1 gap-2">
          <Label htmlFor="ciudad" className="text-base">
            Ciudad 
          </Label>
          <div className="relative min-h-[6.5rem]">
            <div
              className={`border rounded bg-gray-50 px-3 py-2 h-[2.75rem] flex items-center ${
                errores.ciudad ? "border-red-500" : ""
              }`}
            >
              {editandoCiudad ? (
                <select
                  id="ciudad"
                  className="w-full bg-transparent outline-none text-gray-800"
                  value={valorCiudad}
                  onChange={(e) => setValorCiudad(e.target.value)}
                  autoFocus
                >
                  <option value="">--Selecciona ciudad--</option>
                  {listaCiudades.map((ciud) => (
                    <option key={ciud.id} value={ciud.nombre}>
                      {ciud.nombre}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="block w-full text-gray-800">
                  {userData.ciudad.nombre || "—"}
                </span>
              )}
              {editandoCiudad ? (
                <button
                  className="text-gray-500 hover:text-gray-800 ml-2"
                  onClick={() => {
                    setEditandoCiudad(false);
                    setValorCiudad(userData.ciudad.nombre);
                    setErrores((prev) => {
                      const copia = { ...prev };
                      delete copia.ciudad;
                      return copia;
                    });
                  }}
                  title="Cerrar edición"
                  aria-label="Cerrar edición ciudad"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  className="text-gray-500 hover:text-gray-800 ml-2"
                  onClick={() => {
                    setEditandoCiudad(true);
                    setErrores((prev) => {
                      const copia = { ...prev };
                      delete copia.ciudad;
                      return copia;
                    });
                  }}
                  title="Editar ciudad"
                  aria-label="Editar ciudad"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M4 13.414V17h3.586l9.364-9.364-3.586-3.586L4 13.414z"
                    />
                  </svg>
                </button>
              )}
            </div>
            {errores.ciudad && (
              <p className="text-red-500 text-sm mt-1 absolute bottom-9 left-3">
                {errores.ciudad}
              </p>
            )}

            {editandoCiudad && (
              <div className="absolute bottom-0 left-0 flex space-x-2">
                <Button size="sm" onClick={guardarCiudad}>
                  Guardar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditandoCiudad(false);
                    setValorCiudad(userData.ciudad.nombre);
                    setErrores((prev) => {
                      const copia = { ...prev };
                      delete copia.ciudad;
                      return copia;
                    });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
