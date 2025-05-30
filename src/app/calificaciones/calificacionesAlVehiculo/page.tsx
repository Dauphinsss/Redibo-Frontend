"use client";

import { useState, useEffect, MouseEvent } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
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
};

export default function ComentariosPage() {
  const [comments, setComments] = useState<CarComment[]>([]);
  const [filteredComments, setFilteredComments] = useState<CarComment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("fecha");
  const [sortOrder, setSortOrder] = useState("descendente");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const commentsPerPage = 4;
  const { toast } = useToast();
  const [roles, setRoles] = useState<string[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/perfil`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });
        const sessionData = await response.json();
        if (!sessionData || !sessionData.id) {
          throw new Error("No se pudo obtener la sesión del usuario");
        }
        const userId = sessionData.id;

        const commentsResponse = await fetch(
          `${API_URL}/api/comentarios-carro?hostId=${userId}`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          }
        );
        const commentsData = await commentsResponse.json();
        if (!commentsData || !Array.isArray(commentsData)) {
          throw new Error("No se pudieron obtener los comentarios");
        }

        const formattedComments = commentsData.map((comment: CarComment) => ({
          ...comment,
          fecha_creacion: new Date(comment.fecha_creacion),
          fecha_actualizacion: new Date(comment.fecha_actualizacion),
        }));

        setComments(formattedComments);
        setFilteredComments(formattedComments);
      } catch (error) {
        console.error("Error al cargar comentarios:", error);
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
        const token = localStorage.getItem("auth_token");
        const res = await fetch(`${API_URL}/api/perfil`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setRoles(data.roles || []);
      } catch (error) {
        console.error("Error fetching roles:", error);
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
    
  }, [searchTerm, dateRange, sortBy, sortOrder]);

  const applyFilters = () => {
    let filtered = [...comments];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (comment) =>
          comment.carro?.marca?.toLowerCase().includes(term) ||
          comment.carro?.modelo?.toLowerCase().includes(term)
      );
    }

    if (dateRange && dateRange.from && dateRange.to) {
      filtered = filtered.filter((comment) => {
        const commentDate = new Date(comment.fecha_creacion);

        
        const fromDate = new Date(dateRange.from as Date);
        fromDate.setHours(0, 0, 0, 0);

        const toDate = new Date(dateRange.to as Date);
        toDate.setHours(23, 59, 59, 999); 

        const normalizedCommentDate = new Date(commentDate);
        normalizedCommentDate.setHours(12, 0, 0, 0); 

        return (
          normalizedCommentDate >= fromDate && normalizedCommentDate <= toDate
        );
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
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-black text-black"
        />
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
        <span className="ml-1 text-sm font-medium">{rating}</span>
      </div>
    );
  };

  if (loadingRoles) {
    return <div>Cargando...</div>;
  }

  if (!roles.includes("HOST")) {
    return <div>No tienes permiso para ver esta página.</div>;
  }

  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              Comentarios sobre mis vehículos
            </h1>
            <Link href="/perfil">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 sm:h-10 sm:px-4"
              >
                Atrás
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[240px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange && dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                          {format(dateRange.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy")
                      )
                    ) : (
                      "Fecha recientes primero"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range: DateRange | undefined) =>
                      setDateRange(range || { from: undefined, to: undefined })
                    }
                    locale={es}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm">Ordenar por</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fecha">Fecha</SelectItem>
                  <SelectItem value="calificacion">Calificación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm">Orden</span>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Orden" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ascendente">Ascendente</SelectItem>
                  <SelectItem value="descendente">Descendente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-grow">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por marca o modelo"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 flex gap-4 animate-pulse"
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
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={comment.carro?.Imagen?.[0]?.data || "/placeholder_car.svg"}
                        alt={`${comment.carro?.marca} ${comment.carro?.modelo}`}
                        className="w-full h-full object-cover rounded-lg"
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
                            {
                              locale: es,
                            }
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
                        Por: {comment.usuario.nombre}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No se encontraron comentarios con los filtros aplicados.
              </div>
            )}
          </div>
        </div>

        {/* PAGINACIÓN FINAL */}
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

                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
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
                })}

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
    </>
  );
}


