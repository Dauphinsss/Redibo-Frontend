"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
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
  const [editandoFoto, setEditandoFoto] = useState(false);
  const [valorFoto, setValorFoto] = useState("");
  const [listaCiudades, setListaCiudades] = useState<City[]>([]);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : "";

  function parseBackendDate(fechaBruta: string | undefined): string {
    if (!fechaBruta) return "";
    if (fechaBruta.includes("T")) {
      return fechaBruta.split("T")[0];
    }
    if (fechaBruta.includes("/")) {
      let [d, m, y] = fechaBruta.split("/");
      d = d.padStart(2, "0");
      m = m.padStart(2, "0");
      return `${y}-${m}-${d}`;
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
        setValorFoto(data.foto || "");
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
    onSuccess: (nuevoValor: any) => void,
    onError?: (msg: string) => void
  ) => {
    try {
      const payload: Record<string, any> = {};
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
          (data as any).message || "Error al actualizar " + campo;
        if (onError) onError(msg);
        else alert(msg);
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
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
          prev ? { ...prev, nombre: nuevoValor } : prev
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
        prev ? { ...prev, telefono: nuevoValor } : prev
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
      const iso = parseBackendDate(nuevoValor);
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
        prev ? { ...prev, genero: nuevoValor } : prev
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
    (nuevaCiudadObj) => {
      setUserData((prev) =>
        prev
          ? {
              ...prev,
              ciudad: {
                id: prev.ciudad.id,
                nombre: nuevaCiudadObj.nombre,
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
  const guardarFoto = () => {
    if (!valorFoto.trim()) {
      alert("La URL de la foto no puede quedar vacía");
      return;
    }
    actualizarCampo("foto", valorFoto.trim(), (nuevoValor) => {
      setUserData((prev) => (prev ? { ...prev, foto: nuevoValor } : prev));
      setEditandoFoto(false);
    });
  };

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        <div className="grid col-span-2 md:col-span-1 gap-2 relative">
          <Label htmlFor="nombre" className="text-base">
            Nombre Completo
          </Label>
          {editandoNombre ? (
            <>
              <input
                type="text"
                id="nombre"
                className="border rounded px-2 py-1"
                value={valorNombre}
                onChange={(e) => setValorNombre(e.target.value)}
              />
              <div className="mt-2 space-x-2">
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
            </>
          ) : (
            <>
              <a className="text-base">{userData.nombre}</a>
              <button
                className="absolute top-0 right-0 text-gray-500 hover:text-gray-800"
                onClick={() => setEditandoNombre(true)}
                title="Editar nombre"
              >
                Editar
              </button>
            </>
          )}
        </div>

        <div className="grid col-span-2 md:col-span-1 gap-2">
          <Label htmlFor="correo" className="text-base">
            Correo Electrónico
          </Label>
          <a className="text-base">{userData.correo}</a>
        </div>

        <div className="grid col-span-2 md:col-span-1 gap-2 relative">
          <Label htmlFor="telefono" className="text-base">Número de Teléfono</Label>
          {editandoTelefono ? (
            <>
              <input
                type="text"
                id="telefono"
                className="border rounded px-2 py-1"
                value={valorTelefono}
                onChange={(e) => setValorTelefono(e.target.value)}
              />
              <div className="mt-2 space-x-2">
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
            </>
          ) : (
            <>
              <a className="text-base">{userData.telefono || "—"}</a>
              <button
                className="absolute top-0 right-0 text-gray-500 hover:text-gray-800"
                onClick={() => setEditandoTelefono(true)}
                title="Editar teléfono"
              >
                Editar
              </button>
            </>
          )}
        </div>

        <div className="grid col-span-2 md:col-span-1 gap-2 relative">
          <Label htmlFor="fecha_nacimiento" className="text-base">Fecha de Nacimiento</Label>
          {editandoNacimiento ? (
            <>
              <input
                type="date"
                id="fecha_nacimiento"
                className="border rounded px-2 py-1"
                value={valorNacimiento}
                onChange={(e) => setValorNacimiento(e.target.value)}
              />
              <div className="mt-2 space-x-2">
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
            </>
          ) : (
            <>
              <a className="text-base">
                {formatToDDMMYYYY(userData.fecha_nacimiento) || "—"}
              </a>
              <button
                className="absolute top-0 right-0 text-gray-500 hover:text-gray-800"
                onClick={() => setEditandoNacimiento(true)}
                title="Editar fecha de nacimiento"
              >
                Editar
              </button>
            </>
          )}
        </div>

        <div className="grid col-span-2 md:col-span-1 gap-2 relative">
          <Label htmlFor="genero" className="text-base">Género</Label>
          {editandoGenero ? (
            <>
              <select
                id="genero"
                className="border rounded px-2 py-1"
                value={valorGenero}
                onChange={(e) => setValorGenero(e.target.value)}
              >
                <option value="">--Selecciona--</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
                <option value="OTRO">Otro</option>
              </select>
              <div className="mt-2 space-x-2">
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
            </>
          ) : (
            <>
              <a className="text-base">{userData.genero || "—"}</a>
              <button
                className="absolute top-0 right-0 text-gray-500 hover:text-gray-800"
                onClick={() => setEditandoGenero(true)}
                title="Editar género"
              >
                Editar
              </button>
            </>
          )}
        </div>

        <div className="grid col-span-2 md:col-span-1 gap-2 relative">
          <Label htmlFor="ciudad" className="text-base">
            Ciudad
          </Label>
          {editandoCiudad ? (
            <>
              <select
                id="ciudad"
                className="border rounded px-2 py-1"
                value={valorCiudad}
                onChange={(e) => setValorCiudad(e.target.value)}
              >
                <option value="">--Selecciona ciudad--</option>
                {listaCiudades.map((ciud) => (
                  <option key={ciud.id} value={ciud.nombre}>
                    {ciud.nombre}
                  </option>
                ))}
              </select>
              <div className="mt-2 space-x-2">
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
            </>
          ) : (
            <>
              <a className="text-base">{userData.ciudad.nombre || "—"}</a>
              <button
                className="absolute top-0 right-0 text-gray-500 hover:text-gray-800"
                onClick={() => setEditandoCiudad(true)}
                title="Editar ciudad"
              >
                Editar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
