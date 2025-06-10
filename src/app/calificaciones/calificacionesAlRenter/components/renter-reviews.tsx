"use client"

import { useState, useMemo, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Star, ChevronDown, ChevronUp, Filter, SortAsc, SortDesc, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface Review {
  id: number | string
  rating: number
  comment?: string
  createdAt: string | Date
  hostName?: string
  hostPicture?: string
}

interface RenterReviewsProps {
  reviews: Review[]
}

type SortOrder = "newest" | "oldest"
type RatingFilter = "all" | "5" | "4" | "3" | "2" | "1"

function tiempoTranscurrido(fecha: string | Date) {
  const ahora = new Date()
  const fechaResena = new Date(fecha)
  const diff = (ahora.getTime() - fechaResena.getTime()) / 1000 // en segundos

  if (diff < 60) return "ahora mismo"
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} minuto${Math.floor(diff / 60) === 1 ? "" : "s"}`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} hora${Math.floor(diff / 3600) === 1 ? "" : "s"}`
  if (diff < 604800) return `hace ${Math.floor(diff / 86400)} día${Math.floor(diff / 86400) === 1 ? "" : "s"}`
  if (diff < 2592000) return `hace ${Math.floor(diff / 604800)} semana${Math.floor(diff / 604800) === 1 ? "" : "s"}`
  return fechaResena.toLocaleDateString()
}

export default function RenterReviews({ reviews }: RenterReviewsProps) {
  const [expanded, setExpanded] = useState(false)
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest")
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [, setForceUpdate] = useState(0)
  const initialReviewsCount = 2
  //const [expandedComment, setExpandedComment] = useState<number | null>(null)

  // Actualizar el tiempo relativo cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setForceUpdate(prev => prev + 1)
    }, 60000) // 60000 ms = 1 minuto

   
    setForceUpdate(prev => prev + 1)

    return () => clearInterval(interval)
  }, [])

  const filteredAndSortedReviews = useMemo(() => {
    let filtered = [...reviews]
    if (ratingFilter !== "all") {
      const ratingValue = Number.parseInt(ratingFilter)
      filtered = filtered.filter((review) => Math.round(review.rating) === ratingValue)
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })
  }, [reviews, ratingFilter, sortOrder])

  const displayedReviews = expanded ? filteredAndSortedReviews : filteredAndSortedReviews.slice(0, initialReviewsCount)

  const hasMoreReviews = filteredAndSortedReviews.length > initialReviewsCount

  const hasActiveFilters = ratingFilter !== "all" || sortOrder !== "newest"

  const resetFilters = () => {
    setRatingFilter("all")
    setSortOrder("newest")
  }

  if (!reviews || reviews.length === 0) {
    return <p className="text-muted-foreground">Este arrendatario aún no tiene reseñas.</p>
  }

  return (
    <div className="space-y-6">
      {/* Botón de filtros */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1"
        >
          <Filter className="h-4 w-4 mr-1" />
          Filtros
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 h-5 px-1">
              {ratingFilter !== "all" ? `${ratingFilter}★` : ""}
              {ratingFilter !== "all" && sortOrder !== "newest" ? " · " : ""}
              {sortOrder !== "newest" ? (sortOrder === "oldest" ? "Antiguos" : "Recientes") : ""}
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs">
            <X className="h-3 w-3 mr-1" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <div className="bg-muted/40 p-3 rounded-md space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium">Calificación</label>
              <Select value={ratingFilter} onValueChange={(value) => setRatingFilter(value as RatingFilter)}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Todas las calificaciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las calificaciones</SelectItem>
                  <SelectItem value="5">5 estrellas</SelectItem>
                  <SelectItem value="4">4 estrellas</SelectItem>
                  <SelectItem value="3">3 estrellas</SelectItem>
                  <SelectItem value="2">2 estrellas</SelectItem>
                  <SelectItem value="1">1 estrella</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Ordenar por</label>
              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Más recientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">
                    <div className="flex items-center">
                      <SortDesc className="h-3.5 w-3.5 mr-1.5" />
                      Más recientes
                    </div>
                  </SelectItem>
                  <SelectItem value="oldest">
                    <div className="flex items-center">
                      <SortAsc className="h-3.5 w-3.5 mr-1.5" />
                      Más antiguas
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Resumen de resultados */}
          <div className="text-xs text-muted-foreground">
            {filteredAndSortedReviews.length === 0
              ? "No se encontraron reseñas con estos filtros"
              : `Mostrando ${filteredAndSortedReviews.length} de ${reviews.length} reseñas`}
          </div>
        </div>
      )}

      {/* Lista de reseñas */}
      {filteredAndSortedReviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No hay reseñas que coincidan con los filtros seleccionados.</p>
          <Button variant="outline" size="sm" onClick={resetFilters} className="mt-2">
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <>
          {displayedReviews.map((review, index) => {
            // Usar rating como valor de estrellas
            const promedio = review.rating || 0
            const comentarioTexto = review.comment || ""
            //const comentarioLargo = comentarioTexto.length > 120
            //const mostrarExpandido = expandedComment === index

            return (
              <div key={review.id || index}>
                <div className="flex items-start gap-4">
                  <Avatar>
                     <AvatarImage 
                      src={review.hostPicture || "/placeholder.svg"} 
                      alt={review.hostName || "Anfitrión"} 
                      style={{ 
                        objectFit: 'cover', 
                        width: '100%', 
                        height: '100%', 
                        display: 'block'
                      }} 
                    />
                    <AvatarFallback>
                      {review.hostName && review.hostName.length > 0 ? review.hostName.charAt(0) : "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{review.hostName || "Anfitrión"}</h4>
                      <span className="text-sm text-muted-foreground">
                        {review.createdAt ? tiempoTranscurrido(review.createdAt) : ""}
                      </span>
                    </div>
                    <div className="flex items-center mt-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.round(promedio) ? "text-black fill-black" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="ml-2 text-xs text-muted-foreground">({promedio.toFixed(1)})</span>
                    </div>
                    <p className="text-sm">
                      {comentarioTexto || "Sin comentarios"}
                    </p>
                  </div>
                </div>
                {index < displayedReviews.length - 1 && <Separator className="my-4" />}
              </div>
            )
          })}

          {/* Botón Ver más */}
          {hasMoreReviews && (
            <div className="text-center pt-2">
              <Button variant="outline" onClick={() => setExpanded(!expanded)} className="w-full">
                {expanded ? (
                  <>
                    <ChevronUp className="mr-2 h-4 w-4" />
                    Mostrar menos
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Ver más reseñas ({filteredAndSortedReviews.length - initialReviewsCount})
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
