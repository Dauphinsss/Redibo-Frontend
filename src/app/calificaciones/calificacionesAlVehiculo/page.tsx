"use client";

import { useState, useEffect, MouseEvent } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RespuestaItem from "@/components/ui/RespuestaItem";
import ResponderButton from "@/components/ui/ResponderButton";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CalendarIcon, Search, Star } from "lucide-react";
import { API_URL } from "@/utils/bakend";
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";
import Header from "@/components/ui/Header";

type Respuesta = {
  id: number;
  id_comentario: number;
  respuesta: string;
  fecha_creacion: string | Date;
  id_usuario_host: number | null;
  host?: {
    id: number;
    nombre: string;
    foto: string | null;
  } | null;
};

type CarComment = {
  id: number;
  id_carro: number;
  id_usuario: number;
  comentario: string;
  calificacion: number;
  fecha_creacion: string | Date;
  fecha_actualizacion: string | Date;
  usuario: {
    id: number;
    nombre: string;
    foto: string | null;
  };
  carro?: {
    id: number;
    marca: string;
    modelo: string;
    año: number;
    Imagen: { data: string; public_id: string }[];
    id_usuario_rol: number;
  } | null;
  respuestas?: Respuesta[];
};

export default function ComentariosPage() {
  const [comments, setComments] = useState<CarComment[]>([]);
  const [filteredComments, setFilteredComments] = useState<CarComment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"fecha" | "calificacion">("fecha");
  const [sortOrder, setSortOrder] = useState<"ascendente" | "descendente">(
    "descendente"
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const commentsPerPage = 4;
  const { toast } = useToast();
  const [roles, setRoles] = useState<string[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const router = useRouter();

  async function enviarRespuesta(commentId: number, replyText: string) {
    try {
      const textoLimpiado = replyText.trim();

      if (!textoLimpiado) {
        throw new Error("La respuesta no puede estar vacía");
      }

      if (textoLimpiado.length > 200) {
        throw new Error("La respuesta no puede superar los 200 caracteres");
      }

      const res = await fetch(`${API_URL}/api/comentarios-carro/respuestas`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          id_comentario: commentId,
          respuesta: textoLimpiado,
        }),
      });

      if (!res.ok) {
        let errorMessage = "Error al guardar la respuesta";
        try {
          const errorData = await res.json();
          errorMessage = errorData?.error || errorMessage;
        } catch {
          console.warn("No se pudo parsear el error de la respuesta");
        }
        throw new Error(errorMessage);
      }

      const nuevaRespuesta = await res.json();

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                respuestas: [
                  ...(comment.respuestas || []),
                  {
                    ...nuevaRespuesta.respuesta,
                    fecha_creacion: new Date(
                      nuevaRespuesta.respuesta.fecha_creacion
                    ),
                  },
                ],
              }
            : comment
        )
      );

      // Toast de éxito usando objeto
      toast({
        title: "Éxito",
        description: "Respuesta enviada con éxito",
      });

      return nuevaRespuesta;
    } catch (error) {
      console.error("Error en enviarRespuesta:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error desconocido al enviar respuesta",
        variant: "destructive",
      });
      throw error;
    }
  }

  async function eliminarRespuesta(respuestaId: number) {
    try {
      const res = await fetch(
        `${API_URL}/api/comentarios-carro/respuestas/${respuestaId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al eliminar la respuesta");
      }

      toast({
        title: "Respuesta eliminada",
        description: "La respuesta fue eliminada correctamente",
        variant: "default",
      });

      setComments((prevComments) =>
        prevComments.map((comment) => ({
          ...comment,
          respuestas: comment.respuestas?.filter((r) => r.id !== respuestaId),
        }))
      );
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error desconocido al eliminar la respuesta",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const perfilRes = await fetch(`${API_URL}/api/perfil`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });

        if (!perfilRes.ok) {
          throw new Error("Error al obtener perfil");
        }

        const perfil = await perfilRes.json();
        const hostId = perfil.id;

        const commentsRes = await fetch(
          `${API_URL}/api/comentarios-carro?hostId=${hostId}`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          }
        );

        if (!commentsRes.ok) {
          throw new Error("Error al obtener comentarios");
        }

        const data: CarComment[] = await commentsRes.json();

        if (!Array.isArray(data)) {
          throw new Error("Formato de comentarios inválido");
        }

        const formatted = data.map((c) => ({
          ...c,
          fecha_creacion: new Date(c.fecha_creacion),
          fecha_actualizacion: new Date(c.fecha_actualizacion),
          respuestas: c.respuestas?.map((r) => ({
            ...r,
            fecha_creacion: new Date(r.fecha_creacion),
          })),
        }));
        setComments(formatted);
        setFilteredComments(formatted);
      } catch (e) {
        console.error("Error al cargar comentarios:", e);
        toast({
          title: "Error",
          description: "No se pudieron cargar los comentarios",
          variant: "destructive",
        });
        setComments([]);
        setFilteredComments([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();
  }, [toast]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${API_URL}/api/perfil`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Error al obtener roles");
        }

        const { roles } = await res.json();
        setRoles(roles || []);
      } catch (error) {
        console.error("Error al obtener roles:", error);
        setRoles([]);
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, dateRange, sortBy, sortOrder, comments]);

  const applyFilters = () => {
    let filtered = [...comments];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (comment) =>
          comment.carro?.marca?.toLowerCase().includes(term) ||
          comment.carro?.modelo?.toLowerCase().includes(term) ||
          comment.usuario?.nombre?.toLowerCase().includes(term) ||
          comment.comentario?.toLowerCase().includes(term)
      );
    }

    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter((comment) => {
        const commentDate = new Date(comment.fecha_creacion);
        const fromDate = new Date(dateRange.from as Date);
        fromDate.setHours(0, 0, 0, 0);

        const toDate = new Date(dateRange.to as Date);
        toDate.setHours(23, 59, 59, 999);

        return commentDate >= fromDate && commentDate <= toDate;
      });
    }

    filtered.sort((a, b) => {
      if (sortBy === "fecha") {
        const dateA = new Date(a.fecha_creacion).getTime();
        const dateB = new Date(b.fecha_creacion).getTime();
        return sortOrder === "ascendente" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "calificacion") {
        return sortOrder === "ascendente"
          ? a.calificacion - b.calificacion
          : b.calificacion - a.calificacion;
      } else {
        const nameA = `${a.carro?.marca || ""} ${
          a.carro?.modelo || ""
        }`.toLowerCase();
        const nameB = `${b.carro?.marca || ""} ${
          b.carro?.modelo || ""
        }`.toLowerCase();
        return sortOrder === "ascendente"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
    });

    setFilteredComments(filtered);
    setCurrentPage(1);
  };

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = filteredComments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );
  const totalPages = Math.ceil(filteredComments.length / commentsPerPage);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-4 h-4 fill-black text-black" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-black" />
          <div className="absolute inset-0 overflow-hidden w-[50%]">
            <Star className="w-4 h-4 fill-black text-black" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setDateRange(undefined);
    setSortBy("fecha");
    setSortOrder("descendente");
  };

  if (loadingRoles) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!roles.includes("HOST")) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-xl font-bold mb-4">Acceso no autorizado</h2>
          <p className="mb-4">No tienes permiso para ver esta página.</p>
          <Button variant="default" onClick={() => router.push("/perfil")}>
            Volver al perfil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen bg-white bg-opacity-90">
        <div className="flex-1 container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              Comentarios sobre mis vehículos
            </h1>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 sm:h-10 sm:px-4"
              onClick={() => router.push("/perfil")}
            >
              Atrás
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[240px] justify-start text-left font-normal bg-white"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-700" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                          {format(dateRange.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy")
                      )
                    ) : (
                      <span className="text-gray-500">Filtrar por fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    locale={es}
                    initialFocus
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap">Ordenar por</span>
              <Select
                value={sortBy}
                onValueChange={(value: "fecha" | "calificacion") =>
                  setSortBy(value)
                }
              >
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="fecha">Fecha</SelectItem>
                  <SelectItem value="calificacion">Calificación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap">Orden</span>
              <Select
                value={sortOrder}
                onValueChange={(value: "ascendente" | "descendente") =>
                  setSortOrder(value)
                }
              >
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Orden" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="ascendente">Ascendente</SelectItem>
                  <SelectItem value="descendente">Descendente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-grow">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Buscar por marca, modelo, usuario o comentario"
                  className="pl-8 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {(searchTerm || dateRange) && (
            <div className="mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-sm"
              >
                Limpiar todos los filtros
              </Button>
            </div>
          )}

          <div className="space-y-4 mb-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 flex gap-4 animate-pulse bg-white"
                >
                  <div className="flex-shrink-0 bg-gray-200 w-[120px] h-[80px] rounded-md"></div>
                  <div className="flex-grow">
                    <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))
            ) : currentComments.length > 0 ? (
              currentComments.map((comment) => (
                <div
                  key={comment.id}
                  className="border rounded-lg p-4 flex flex-col gap-4 bg-white shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={
                          comment.carro?.Imagen?.[0]?.data ||
                          "/placeholder_car.svg"
                        }
                        alt={
                          comment.carro
                            ? `${comment.carro.marca || ""} ${
                                comment.carro.modelo || ""
                              }`.trim()
                            : "Vehículo"
                        }
                        style={{
                          width: 120,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg">
                          {comment.carro?.marca || "Vehículo"}{" "}
                          {comment.carro?.modelo || ""}{" "}
                          {comment.carro?.año || ""}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {format(
                            new Date(comment.fecha_creacion),
                            "d MMMM yyyy",
                            { locale: es }
                          )}
                        </span>
                      </div>
                      <div className="mt-1">
                        {renderStars(comment.calificacion)}
                      </div>
                      <p className="mt-2 text-gray-700 break-words whitespace-pre-line">
                        {comment.comentario || "Sin comentarios"}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Por: {comment.usuario?.nombre || "Usuario desconocido"}
                      </p>

                      <div className="mt-4">
                        <ResponderButton
                          commentId={comment.id}
                          onSubmit={enviarRespuesta}
                          onSuccess={() => {}}
                          disabled={
                            comment.respuestas && comment.respuestas.length > 0
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {comment.respuestas && comment.respuestas.length > 0 && (
                    <div className="mt-6 pl-3 border-l-2 border-gray-300">
                      {comment.respuestas.map((respuesta) => (
                        <RespuestaItem
                          key={`${comment.id}-${respuesta.id}`}
                          respuesta={{
                            id: respuesta.id,
                            respuesta: respuesta.respuesta ?? "",
                            fecha_creacion:
                              respuesta.fecha_creacion ?? new Date(),
                          }}
                          onEliminar={() => eliminarRespuesta(respuesta.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">
                  No hay comentarios para mostrar.
                </p>
                {(searchTerm || dateRange) && (
                  <Button
                    variant="ghost"
                    className="mt-2"
                    onClick={handleClearFilters}
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
            )}
          </div>

          {filteredComments.length > commentsPerPage && (
            <div className="w-full py-4 border-t flex justify-center bg-white">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    {currentPage > 1 && (
                      <PaginationPrevious
                        href="#"
                        size="default"
                        onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                      />
                    )}
                  </PaginationItem>

                  {Array.from({ length: Math.min(totalPages, 5) }).map(
                    (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            href="#"
                            size="default"
                            isActive={pageNumber === currentPage}
                            onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                              e.preventDefault();
                              setCurrentPage(pageNumber);
                            }}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  )}

                  {totalPages > 5 && <PaginationEllipsis />}

                  <PaginationItem>
                    {currentPage < totalPages && (
                      <PaginationNext
                        href="#"
                        size="default"
                        onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault();
                          if (currentPage < totalPages)
                            setCurrentPage(currentPage + 1);
                        }}
                      />
                    )}
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
