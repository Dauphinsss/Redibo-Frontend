"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios, { AxiosError }from "axios";

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
        setValorNombre(data.nombre);
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
  const guardarNombre = () => {
    if (!valorNombre.trim()) {
      alert("El nombre no puede quedar vacío");
      return;
    }
    actualizarCampo(
      "nombre",
      valorNombre.trim(),
      (nuevoValor) => {
        setUserData((prev) =>
          prev ? { ...prev, nombre: nuevoValor as string } : prev
        );
        setEditandoNombre(false);
      }
    );
  };
  const guardarTelefono = () => {
    if (!valorTelefono.trim()) {
      alert("El teléfono no puede quedar vacío");
      return;
    }
    actualizarCampo("telefono", valorTelefono.trim(), (nuevoValor) => {
      setUserData((prev) =>
        prev ? { ...prev, telefono: nuevoValor as string } : prev
      );
      setEditandoTelefono(false);
    });
  };
  const guardarNacimiento = () => {
    if (!valorNacimiento) {
      alert("Debes seleccionar una fecha");
      return;
    }
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
      alert("Debes seleccionar un género");
      return;
    }
    actualizarCampo("genero", valorGenero, (nuevoValor) => {
      setUserData((prev) =>
        prev ? { ...prev, genero: nuevoValor as string} : prev
      );
      setEditandoGenero(false);
    });
  };
  const guardarCiudad = () => {
  if (!valorCiudad.trim()) {
    alert("Debes seleccionar una ciudad");
    return;
  }
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
      alert(mensajeError);
    }
  );
};

  return (
  <div className="space-y-6 mt-6">
    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
      <div className="grid col-span-2 md:col-span-1 gap-2">
        <Label htmlFor="nombre" className="text-base">
          Nombre Completo
        </Label>
        <div className="relative min-h-[6rem]">
          <div className="border rounded bg-gray-50 px-3 py-2 h-[2.75rem] flex items-center">
            {editandoNombre ? (
              <input
                type="text"
                id="nombre"
                className="w-full bg-transparent outline-none text-gray-800"
                value={valorNombre}
                onChange={(e) => setValorNombre(e.target.value)}
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
                onClick={() => setEditandoNombre(false)}
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
                      onClick={() => setEditandoNombre(true)}
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
          {editandoNombre && (
            <div className="absolute bottom-2 left-3 flex space-x-2">
              <Button size="sm" onClick={guardarNombre}>
                Guardar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditandoNombre(false);
                  setValorNombre(userData.nombre);
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
        <div className="relative min-h-[6rem]">
          <div className="border rounded bg-gray-50 px-3 py-2 h-[2.75rem] flex items-center">
            {editandoTelefono ? (
              <input
                type="text"
                id="telefono"
                className="w-full bg-transparent outline-none text-gray-800"
                value={valorTelefono}
                onChange={(e) => setValorTelefono(e.target.value)}
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
                onClick={() => setEditandoTelefono(false)}
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
                onClick={() => setEditandoTelefono(true)}
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
          {editandoTelefono && (
            <div className="absolute bottom-2 left-3 flex space-x-2">
              <Button size="sm" onClick={guardarTelefono}>
                Guardar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditandoTelefono(false);
                  setValorTelefono(userData.telefono);
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
        <div className="relative min-h-[6rem]">
          <div className="border rounded bg-gray-50 px-3 py-2 h-[2.75rem] flex items-center">
            {editandoNacimiento ? (
              <input
                type="date"
                id="fecha_nacimiento"
                className="w-full bg-transparent outline-none text-gray-800"
                value={valorNacimiento}
                onChange={(e) => setValorNacimiento(e.target.value)}
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
                onClick={() => setEditandoNacimiento(false)}
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
                onClick={() => setEditandoNacimiento(true)}
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
          {editandoNacimiento && (
            <div className="absolute bottom-2 left-3 flex space-x-2">
              <Button size="sm" onClick={guardarNacimiento}>
                Guardar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditandoNacimiento(false);
                  setValorNacimiento(userData.fecha_nacimiento);
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
        <div className="relative min-h-[6rem]">
          <div className="border rounded bg-gray-50 px-3 py-2 h-[2.75rem] flex items-center">
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
                onClick={() => setEditandoGenero(false)}
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
                onClick={() => setEditandoGenero(true)}
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
          {editandoGenero && (
            <div className="absolute bottom-2 left-3 flex space-x-2">
              <Button size="sm" onClick={guardarGenero}>
                Guardar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditandoGenero(false);
                  setValorGenero(userData.genero);
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
        <div className="relative min-h-[6rem]">
          <div className="border rounded bg-gray-50 px-3 py-2 h-[2.75rem] flex items-center">
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
                onClick={() => setEditandoCiudad(false)}
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
                onClick={() => setEditandoCiudad(true)}
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
          {editandoCiudad && (
            <div className="absolute bottom-2 left-3 flex space-x-2">
              <Button size="sm" onClick={guardarCiudad}>
                Guardar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditandoCiudad(false);
                  setValorCiudad(userData.ciudad.nombre);
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
