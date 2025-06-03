"use client";

import React, { useState, useEffect } from "react";
import {
  SidebarProvider,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, UserPlus, Inbox, Search } from "lucide-react";
import { Toaster, toast } from "sonner";
import Image from "next/image";
import axios from "axios";
import { API_URL } from "@/utils/bakend";
import Header from "@/components/ui/Header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import type { LucideProps } from "lucide-react";
import Loading from "@/components/loading";
import { Footer } from "@/components/ui/footer";
import { MdEmail } from "react-icons/md";

// --- NUEVO: Utilidad para obtener roles del usuario actual ---
function getUserRoles() {
  const rolesStr = localStorage.getItem("roles") || "";
  if (rolesStr.includes("[")) {
    try {
      return JSON.parse(rolesStr);
    } catch (error) {
      console.error("Error parsing roles from localStorage:", error);
      return rolesStr.split(",").map((r) => r.trim());
    }
  }
  return rolesStr.split(",").map((r) => r.trim());
}

// --- MODIFICAR SociosPage para mostrar tabs dinámicos según roles ---
export default function SociosPage() {
  // Obtén los roles directamente de localStorage para el primer render
  function getInitialRoles() {
    const rolesStr = localStorage.getItem("roles") || "";
    if (rolesStr.includes("[")) {
      try {
        return JSON.parse(rolesStr);
      } catch {
        return rolesStr.split(",").map((r) => r.trim());
      }
    }
    return rolesStr.split(",").map((r) => r.trim());
  }

  type SidebarItem = {
    id: string;
    label: string;
    icon: React.ElementType;
  };

  // Calcula los roles y sidebarItems para el primer render
  const initialRoles = getInitialRoles();
  const initialSidebarItems = [
    initialRoles.includes("RENTER") && {
      id: "solicitar-driver",
      label: "Solicitar asociación a Conductor",
      icon: UserPlus,
    },
    initialRoles.includes("DRIVER") && {
      id: "solicitar-renter",
      label: "Solicitar asociación a Arrendatario",
      icon: UserPlus,
    },
    {
      id: "recibidas",
      label: "Solicitudes Recibidas",
      icon: Inbox,
    },
  ].filter(Boolean) as SidebarItem[];

  // El tab inicial es el primero disponible
  const [activeTab, setActiveTab] = useState<string>(initialSidebarItems[0].id);

  // El resto de estados igual
  const [userRoles, setUserRoles] = useState<string[]>(initialRoles);
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem("nombre"));
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Cuando los roles cambian, sincroniza el tab activo si ya no es válido
  useEffect(() => {
    const sidebarItems = [
      userRoles.includes("RENTER") && {
        id: "solicitar-driver",
        label: "Solicitar asociación a Conductor",
        icon: UserPlus,
      },
      userRoles.includes("DRIVER") && {
        id: "solicitar-renter",
        label: "Solicitar asociación a Arrendatario",
        icon: UserPlus,
      },
      {
        id: "recibidas",
        label: "Solicitudes Recibidas",
        icon: Inbox,
      },
    ].filter(Boolean) as SidebarItem[];
    if (!sidebarItems.some((item) => item.id === activeTab)) {
      setActiveTab(sidebarItems[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRoles.join(",")]);

  useEffect(() => {
    setLoadingAuth(true);
    setTimeout(() => {
      const nombre = localStorage.getItem("nombre");
      setIsLogged(!!nombre);
      setUserRoles(getUserRoles());
      setLoadingAuth(false);
    }, 0);
  }, []);

  if (loadingAuth || activeTab === null) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loading />
        </div>
      </div>
    );
  }

  if (!isLogged) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 w-full p-6 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">
            Debes iniciar sesión para acceder a la sección de Socios
          </h1>
          <Button asChild>
            <a href="/login">Iniciar sesión</a>
          </Button>
        </main>
      </div>
    );
  }

  // Responsive: sidebar as drawer on mobile, sticky on desktop
  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      {/* Header with sidebar trigger for mobile */}
      <div className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="flex items-center h-16  ">
          {/* Sidebar trigger only on mobile */}
          <button
            className="md:hidden p-3 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Abrir menú"
            onClick={() => setSidebarOpen(true)}
            data-sidebar-trigger="true"
          >
            {activeTab === "recibidas" ? (
              <Inbox className="w-6 h-6 text-gray-500"/>
            ) : (
              <UserPlus className="w-6 h-6 text-gray-500" />
            )}
          </button>
          <div className="flex-1">
            <Header />
          </div>
        </div>
      </div>
      <div className="flex flex-1 min-h-0">
        <SidebarProvider>
          {/* Sidebar: drawer on mobile, sticky on desktop */}
          {/* Overlay for mobile drawer, igual que perfil */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-opacity-30 backdrop-blur-sm transition-opacity duration-200 md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Cerrar menú"
            />
          )}
          <aside
            className={`fixed z-50 top-0 left-0 h-full w-72 bg-white border-r border-gray-100 shadow-sm transition-transform duration-300 md:sticky md:top-16 md:z-10 md:translate-x-0 md:block
              ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } md:translate-x-0`}
            style={{ minWidth: 0 }}
            tabIndex={-1}
            aria-label="Menú lateral"
          >
            {/* Solo en móvil: nombre de la plataforma arriba */}
            <div className="md:hidden px-6 py-4 border-b border-gray-100">
              <h3 className="tracking-wider text-black font-bold text-xl">
                REDIBO
              </h3>
            </div>
            <SidebarContent className="p-2 bg-white h-full flex flex-col">
              <SidebarMenu className="bg-white flex-1">
                {initialSidebarItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false); // close drawer on mobile
                      }}
                      isActive={activeTab === item.id}
                      className={`justify-start rounded-lg transition-all duration-200 px-4 py-3 text-base my-1 w-full text-left ${
                        activeTab === item.id
                          ? "bg-gray-100 font-medium text-primary"
                          : "text-gray-700"
                      }`}
                      style={{ minHeight: 56, minWidth: 0, width: "100%" }}
                    >
                      <item.icon
                        className={`h-5 w-5 mr-3 ${
                          activeTab === item.id
                            ? "text-primary"
                            : "text-gray-500"
                        }`}
                      />
                      <span className="whitespace-normal break-words text-sm md:text-base w-full block">
                        {item.label}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </aside>
          {/* Main content: margin-left on desktop, full on mobile */}
          <SidebarInset>
            <main
              className="flex-1 p-4 sm:p-6 md:p-8 transition-all duration-300"
              style={{ marginLeft: 0 }}
            >
              <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-2 text-center md:text-left">
                  {getTabTitle(activeTab)}
                </h1>
                <p className="mb-6 text-gray-600 text-center md:text-left">
                  {getTabDescription(activeTab, userRoles)}
                </p>
                <div className="bg-white rounded-lg min-h-[300px]">
                  {activeTab === "solicitar-driver" && (
                    <SolicitarAsociacion tipo="driver" userRoles={userRoles} />
                  )}
                  {activeTab === "solicitar-renter" && (
                    <SolicitarAsociacion tipo="renter" userRoles={userRoles} />
                  )}
                  {activeTab === "recibidas" && <SolicitudesRecibidas />}
                </div>
              </div>
            </main>
            <Footer />
          </SidebarInset>
        </SidebarProvider>
      </div>
      <Toaster />
    </div>
  );
}

function getTabTitle(tab: string) {
  switch (tab) {
    case "solicitar-driver":
      return "Solicitar Asociación con un Conductor";
    case "solicitar-renter":
      return "Solicitar Asociación con un Arrendatario";
    case "recibidas":
      return "Solicitudes Recibidas";
    default:
      return "Socios";
  }
}

// Cambia getTabDescription para mostrar el texto correcto según roles y tab
function getTabDescription(tab: string, userRoles: string[]) {
  if (tab === "solicitar-driver") {
    if (userRoles.includes("RENTER") && !userRoles.includes("DRIVER")) {
      return "Busca y envía solicitudes de asociación a Drivers. Como Arrendatario solo puedes asociarte a Conductores.";
    }
    if (userRoles.includes("DRIVER")) {
      return "Busca y envía solicitudes de asociación a otros Conductores.";
    }
  }
  if (tab === "solicitar-renter") {
    return "Busca y envía solicitudes de asociación a Arrendatarios. Como Conductor puedes asociarte a Arrendatarios.";
  }
  if (tab === "recibidas") {
    return "Gestiona las solicitudes de asociación que has recibido.";
  }
  return "";
}

function SolicitarAsociacion({
  tipo,
  userRoles,
}: {
  tipo: "driver" | "renter";
  userRoles: string[];
}) {
  const [query, setQuery] = useState("");
  const [allResults, setAllResults] = useState<Record<string, unknown>[]>([]); // Todos los usuarios
  const [results, setResults] = useState<Record<string, unknown>[]>([]); // Filtrados
  const [loading, setLoading] = useState(false);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [sentIds, setSentIds] = useState<string[]>([]);
  const [errorIds, setErrorIds] = useState<string[]>([]);
  const [fetched, setFetched] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  // Estado para saber si el debounce está activo
  const [isDebouncing, setIsDebouncing] = useState(false);

  // Solo pedir todos los usuarios una vez al cambiar tipo, y solo si el input está vacío
  useEffect(() => {
    if (query.length !== 0) return;
    setLoading(true);
    setAllResults([]);
    setResults([]);
    setFetched(false);
    async function fetchUsers() {
      try {
        const token = localStorage.getItem("auth_token");
        const url =
          tipo === "driver" ? "/api/list-drivers" : "/api/list-renters";
        // Siempre POST, pero body vacío si no hay búsqueda
        const res = await axios.post(
          `${API_URL}${url}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Leer la propiedad correcta del backend
        const list = tipo === "driver" ? res.data.drivers : res.data.renters;
        const myName = localStorage.getItem("nombre");
        const filtered = (list || []).filter(
          (u: Record<string, unknown>) => u.nombre !== myName
        );
        setAllResults(filtered);
        setResults(filtered);
        setFetched(true);
      } catch (err) {
        toast.error("Error al buscar usuarios");
        setAllResults([]);
        setResults([]);
        console.error("Error al obtener usuarios:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo]);

  // Búsqueda: debounced, solo hace petición si el usuario deja de escribir 400ms
  useEffect(() => {
    if (query.length < 1) {
      setResults(allResults);
      setIsDebouncing(false);
      return;
    }
    setResults([]); // Limpiar resultados previos al empezar búsqueda
    if (!fetched) return;
    setIsDebouncing(true);
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const timeout = setTimeout(() => {
      setIsDebouncing(false);
      const fetchSearch = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("auth_token");
          const url =
            tipo === "driver" ? "/api/list-drivers" : "/api/list-renters";
          const res = await axios.post(
            `${API_URL}${url}`,
            { search: query },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          // Leer la propiedad correcta del backend
          const list = tipo === "driver" ? res.data.drivers : res.data.renters;
          const myName = localStorage.getItem("nombre");
          const filtered = (list || []).filter(
            (u: Record<string, unknown>) => u.nombre !== myName
          );
          setResults(filtered);
        } catch (err) {
          console.error("Error al buscar usuarios:", err);
          toast.error("Error al buscar usuarios");
          setResults([]);
        } finally {
          setLoading(false);
        }
      };
      fetchSearch();
    }, 400); // 400ms debounce
    setDebounceTimeout(timeout);
    return () => {
      clearTimeout(timeout);
      setIsDebouncing(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, tipo, fetched]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Abrir modal para mensaje
  const handleOpenDialog = (id: string) => {
    setSelectedUserId(id);
    setMessage("");
    setShowDialog(true);
  };

  // Enviar solicitud de asociación con mensaje
  const handleSendRequest = async () => {
    if (!selectedUserId) return;
    setPendingIds((prev: string[]) => [...prev, selectedUserId]);
    setErrorIds((prev: string[]) =>
      prev.filter((eid) => eid !== selectedUserId)
    );
    setSending(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (tipo === "driver") {
        // Renter solicita a Driver
        await axios.post(
          `${API_URL}/api/association-request-renter-to-driver`,
          { id_receptor: selectedUserId, mensaje: message },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Driver solicita a Renter
        await axios.post(
          `${API_URL}/api/association-request-driver-to-renter`,
          { id_receptor: selectedUserId, mensaje: message },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setSentIds((prev: string[]) => [...prev, selectedUserId]);
      toast.success("Solicitud enviada");
      setShowDialog(false);
      setMessage("");
      setSelectedUserId(null);
    } catch (err) {
      toast.error("Error al enviar solicitud");
      console.error("Error al enviar solicitud:", err);
    } finally {
      setPendingIds((prev: string[]) =>
        prev.filter((pid: string) => pid !== selectedUserId)
      );
      setSending(false);
    }
  };

  // --- MODIFICAR el mensaje del modal según roles y tipo ---
  let modalMsg = "";
  if (tipo === "driver") {
    if (userRoles.includes("RENTER") && !userRoles.includes("DRIVER")) {
      modalMsg =
        "Usted como Arrendatario está enviando una solicitud a un Conductor y puede agregar un mensaje opcional para la persona a la que envía la solicitud.";
    } else if (userRoles.includes("DRIVER")) {
      modalMsg =
        "Usted como Conductor está enviando una solicitud a otro Conductor y puede agregar un mensaje opcional para la persona a la que envía la solicitud.";
    }
  } else if (tipo === "renter") {
    modalMsg =
      "Usted como Conductor está enviando una solicitud a un Arrendatario y puede agregar un mensaje opcional para la persona a la que envía la solicitud.";
  }

  React.useEffect(() => {
    return () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
    };
  }, [debounceTimeout]);

  // --- MODAL MENSAJE: input simple, validación de palabra y filtro de groserías ---
  // Lista simple de palabras prohibidas (puedes expandirla)
  const BAD_WORDS = [
    "puta",
    "puto",
    "mierda",
    "imbecil",
    "idiota",
    "estupido",
    "maldito",
    "perra",
    "pendejo",
    "tonto",
    "bobo",
    "cabrón",
    "culero",
    "zorra",
    "asqueroso",
    "muere",
    "matar",
    "te mato",
    "te voy a matar",
    "te odio",
    "desgraciado",
    "malnacido",
    "asesino",
    "violador",
    "amenaza",
    "amenazar",
    "golpear",
    "golpearte",
    "te pego",
    "te voy a golpear",
  ];
  function isValidMessage(msg: string) {
    const trimmed = msg.trim();
    if (trimmed.length === 0) return false;
    if (trimmed.length > 50) return false;
    // Al menos una palabra
    if (!/\w+/.test(trimmed)) return false;
    // No palabras prohibidas (case insensitive)
    const lower = trimmed.toLowerCase();
    for (const bad of BAD_WORDS) {
      if (lower.includes(bad)) return false;
    }
    return true;
  }
  const messageValid = message.length === 0 || isValidMessage(message); // vacío es válido (opcional)

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Search className="text-gray-500" />
        <Input
          placeholder={`Buscar ${
            tipo === "driver" ? "Driver" : "Arrendatario"
          } por nombre o correo`}
          value={query}
          onChange={handleSearch}
          className="w-full "
        />
      </div>
      {/* Mostrar spinner solo si loading y no está debouncing */}
      {loading && !isDebouncing && (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {/* No mostrar nada mientras está debouncing */}
      {isDebouncing && <div className="py-8" />}
      {/* Mostrar mensaje solo si no hay loading, no debouncing, ya se buscó y no hay resultados */}
      {!loading &&
        !isDebouncing &&
        fetched &&
        results.length === 0 &&
        query.length >= 1 && (
          <div className="text-center text-gray-500 py-8">
            No se encontraron resultados
          </div>
        )}
      {/* Mostrar resultados solo si no está debouncing */}
      {!isDebouncing && (
        <ul className="divide-y space-y-2">
          {results.map((user) => (
            <li
              key={user.id as string}
              className="flex items-center gap-4 p-4 border-1 rounded-lg"
            >
              {user.foto &&
              typeof user.foto === "string" &&
              /^https?:\/\//.test(user.foto) ? (
                <>
                  <img
                    src={user.foto as string}
                    alt={user.nombre as string}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </>
              ) : (
                <Image
                  src={(user.foto as string) || "/file.svg"}
                  alt={user.nombre as string}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <div className="font-medium">{user.nombre as string}</div>
                <p className="text-sm text-gray-500 truncate max-w-40 sm:max-w-full">{user.correo as string}</p>
              </div>
              {sentIds.includes(user.id as string) ? (
                <Button
                  variant="outline"
                  disabled
                  className="cursor-not-allowed"
                  title={
                    errorIds.includes(user.id as string)
                      ? "La solicitud ya existe"
                      : "Pendiente"
                  }
                >
                  Pendiente
                </Button>
              ) : (
                <Button
                  onClick={() => handleOpenDialog(user.id as string)}
                  disabled={pendingIds.includes(user.id as string)}
                  className="md:min-w-[120px]"
                >
                  {pendingIds.includes(user.id as string) ? (
                    <Loader2 className="animate-spin mr-2" />
                  ) : null}
                  <span className="hidden md:block">Enviar</span>Solicitud
                  <MdEmail className="inline-block" />
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
      {/* Modal para mensaje opcional */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Enviar solicitud de asociación</DialogTitle>
            <DialogDescription>{modalMsg}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Input
              type="text"
              className="w-full"
              placeholder="Mensaje opcional..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={50}
            />
            <div
              className={`text-xs mt-1 ${
                message.length > 50 ? "text-red-500" : "text-gray-400"
              }`}
            >
              {message.length}/50
            </div>
            {!messageValid && message.length > 0 && (
              <div className="text-xs text-red-500 mt-1">
                El mensaje debe tener al menos una palabra, máximo 50 caracteres
                y no contener insultos o amenazas.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={sending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSendRequest}
              disabled={sending || !messageValid}
            >
              {sending ? <Loader2 className="animate-spin mr-2" /> : null}
              Enviar solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SolicitudesRecibidas() {
  const [solicitudes, setSolicitudes] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [accionandoId, setAccionandoId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("auth_token");
        // Obtiene solicitudes pendientes donde el usuario es receptor
        const res = await axios.get(
          `${API_URL}/api/list-association-requests`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // El backend ahora retorna { requests: [...], requesters: [...] }
        const { requests, requesters } = res.data;
        // Relacionar cada solicitud con su solicitante (por índice)
        const solicitudesFormateadas = requests.map(
          (sol: Record<string, unknown>, idx: number) => {
            const requester = requesters[idx] || {};
            return {
              id: sol.id as string,
              nombre: requester.nombre || sol.solicitanteId,
              correo: requester.correo || "-",
              foto: requester.foto || "/file.svg",
              telefono: requester.telefono || "-",
              mensaje: sol.mensaje || "",
              fecha: formatDateDMY(
                (sol.fechaSolicitud as string) || (sol.createdAt as string)
              ),
              estado:
                typeof sol.estado === "string" &&
                sol.estado?.toLowerCase() === "aceptada"
                  ? "aceptado"
                  : typeof sol.estado === "string" &&
                    sol.estado?.toLowerCase() === "rechazada"
                  ? "rechazado"
                  : "pendiente",
            };
          }
        );
        setSolicitudes(solicitudesFormateadas);
      } catch (err) {
        console.error("Error al obtener solicitudes:", err);
        setSolicitudes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSolicitudes();
  }, []);

  // Cambiar estado de la solicitud (aceptar/rechazar)
  const handleAccion = async (id: string, accion: "aceptar" | "rechazar") => {
    setAccionandoId(id);
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      // El backend espera: { id_solicitud, estado }
      const estado = accion === "aceptar" ? "APROBADA" : "RECHAZADA";
      await axios.post(
        `${API_URL}/api/change-association-request-state`,
        { id_solicitud: id, estado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSolicitudes((prev: Record<string, unknown>[]) =>
        prev.map((s: Record<string, unknown>) =>
          s.id === id
            ? { ...s, estado: accion === "aceptar" ? "aceptado" : "rechazado" }
            : s
        )
      );
      toast.success(
        accion === "aceptar" ? "Solicitud aceptada" : "Solicitud rechazada"
      );
    } catch (err) {
      console.error("Error al procesar la solicitud:", err);
      toast.error("Error al procesar la solicitud");
    } finally {
      setLoading(false);
      setAccionandoId(null);
    }
  };

  return (
    <ul className="divide-y">
      {loading && solicitudes.length === 0 && (
        <div className="text-center text-gray-500 py-8">Cargando...</div>
      )}
      {!loading && solicitudes.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No tienes solicitudes recibidas
        </div>
      )}
      {solicitudes.map((sol) => (
        <li key={sol.id as string} className="flex items-center gap-4 p-4 border-1 rounded-lg">
          <img
            src={(sol.foto as string) || "/file.svg"}
            alt={sol.nombre as string}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="font-medium">{sol.nombre as string}</div>
            <div className="text-gray-500 text-sm">{sol.correo as string}</div>
            <div className="text-gray-500 text-sm">
              {sol.telefono as string}
            </div>
            <div className="text-gray-500 text-sm">{sol.mensaje as string}</div>
            <div className="text-gray-500 text-xs">{sol.fecha as string}</div>
          </div>
          {sol.estado === "pendiente" && (
            <div className="grid sm:flex gap-2">
              <Button
                onClick={() => handleAccion(sol.id as string, "aceptar")}
                disabled={loading && accionandoId === sol.id}
              >
                {loading && accionandoId === sol.id ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : null}
                Aceptar
              </Button>
              <Button
                onClick={() => handleAccion(sol.id as string, "rechazar")}
                disabled={loading && accionandoId === sol.id}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {loading && accionandoId === sol.id ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : null}
                Rechazar
              </Button>
            </div>
          )}
          {sol.estado === "aceptado" && (
            <span className="px-3 py-1 rounded bg-green-100 text-green-700 font-medium">
              Aceptado
            </span>
          )}
          {sol.estado === "rechazado" && (
            <span className="px-3 py-1 rounded bg-red-100 text-red-700 font-medium">
              Rechazado
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function formatDateDMY(date: string) {
  if (!date) return "-";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}