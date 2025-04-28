"use client"
import { useEffect, useState } from "react"
import { Trash2 } from "lucide-react"
import "./styles.css"

interface TasklistUsuario {
  hostId: number
}

export function Tasklist({ hostId }: TasklistUsuario) {
  interface Rating {
    comportamiento: number
    cuidadoVehiculo: number
    puntualidad: number
  }

  interface Renter {
    idReserva: number
    usuarioNombre: string
    usuarioId: number
    autoNombre: string
    autoModelo: string
    autoAnio: string
    fechaFin: string
    estado: string
    rated?: boolean
  }

  interface Calificacion {
    idCalificacion: number
    comportamiento: number
    cuidadoVehiculo: number
    puntualidad: number
    comentario?: string
    reservaId: number
    calificadorNombre: string
    calificadoNombre: string
    fechaCreacion: string
  }

  const [renters, setRenters] = useState<Renter[]>([])
  const [selected, setSelected] = useState<Renter | null>(null)
  const [rating, setRating] = useState<Rating>({
    comportamiento: 0,
    cuidadoVehiculo: 0,
    puntualidad: 0,
  })
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showRatingPanel, setShowRatingPanel] = useState(false)

  // Fetch rentals data from API
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        // Fetch rentals
        const rentalsResponse = await fetch(`http://localhost:4000/api/rentas/completadas/${hostId}`)
        const rentalsData = await rentalsResponse.json()
        // Fetch ratings
        const ratingsResponse = await fetch(`http://localhost:4000/api/rentas/calificaciones/${hostId}`)
        const ratingsData = await ratingsResponse.json()
        // Process data
        if (Array.isArray(rentalsData)) {
          // Mark rentals that have been rated
          const processedRenters = rentalsData.map((renter) => {
            const hasRating =
              Array.isArray(ratingsData) && ratingsData.some((cal) => cal.reservaId === renter.idReserva)
            return {
              ...renter,
              rated: hasRating,
              autoModelo: renter.autoNombre.split(" ")[0],
              autoAnio: renter.autoNombre.includes(" ") ? renter.autoNombre.split(" ")[1] : "",
            }
          })
          setRenters(processedRenters)
          setCalificaciones(Array.isArray(ratingsData) ? ratingsData : [])
          console.log("Rentas procesadas:", processedRenters)
          console.log("Calificaciones:", ratingsData)
        } else {
          console.error("La respuesta de rentas no es un array:", rentalsData)
          setRenters([])
        }
      } catch (error) {
        console.error("Error al cargar datos:", error)
        setRenters([])
        setCalificaciones([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [hostId])

  function estaDentroDePeriodoCalificacion(fechaFin: string): boolean {
    const fechaFinRenta = new Date(fechaFin)
    const fechaActual = new Date()
    // Resetear las horas, minutos y segundos para comparar solo fechas
    fechaFinRenta.setHours(0, 0, 0, 0)
    fechaActual.setHours(0, 0, 0, 0)
    // Calcular la diferencia en días
    const diferenciaTiempo = fechaActual.getTime() - fechaFinRenta.getTime()
    const diferenciaDias = Math.floor(diferenciaTiempo / (1000 * 3600 * 24))
    // Permitir calificar si no han pasado más de 2 días
    return diferenciaDias <= 2
  }

  // Modificar la función handleSeleccionar para que no permita seleccionar rentas fuera de plazo
  function handleSeleccionar(renter: Renter) {
    // Si ya está calificado, siempre permitir ver la calificación
    // Si no está calificado, solo permitir seleccionar si está dentro del período
    if (renter.rated || estaDentroDePeriodoCalificacion(renter.fechaFin)) {
      const calificacion = calificaciones.find((c) => c.reservaId === renter.idReserva)
      if (calificacion) {
        setRating({
          comportamiento: calificacion.comportamiento,
          cuidadoVehiculo: calificacion.cuidadoVehiculo,
          puntualidad: calificacion.puntualidad,
        })
      } else {
        setRating({
          comportamiento: 0,
          cuidadoVehiculo: 0,
          puntualidad: 0,
        })
      }

      setSelected(renter)
      setShowRatingPanel(true)
    }
    // No hacemos nada si está fuera de plazo y no tiene calificación
  }

  async function handleGuardar() {
    if (!selected) return
    // Verificar si está dentro del período de calificación antes de guardar
    if (!estaDentroDePeriodoCalificacion(selected.fechaFin)) {
      alert("No es posible guardar la calificación porque han pasado más de 2 días desde la finalización de la renta.")
      return
    }
    try {
      // Prepare the data to send to the backend
      const ratingData = {
        id_reserva: selected.idReserva,
        comportamiento: rating.comportamiento,
        cuidadovehiculo: rating.cuidadoVehiculo,
        puntualidad: rating.puntualidad,
        id_calificador: hostId,
        id_calificado: selected.usuarioId,
      }
      // Check if this is an update or a new rating
      const existingRating = calificaciones.find((c) => c.reservaId === selected.idReserva)
      const url = existingRating
        ? `http://localhost:4000/api/rentas/calificaciones/${hostId}}/${existingRating.idCalificacion}`
        : `http://localhost:4000/api/rentas/calificaciones/${hostId}`
      const method = existingRating ? "PUT" : "POST"
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ratingData),
      })
      if (!response.ok) {
        throw new Error("Error al guardar la calificación")
      }
      const savedRating = await response.json()
      // Update local state
      if (existingRating) {
        setCalificaciones((prev) =>
          prev.map((c) => (c.idCalificacion === existingRating.idCalificacion ? savedRating : c)),
        )
      } else {
        setCalificaciones((prev) => [...prev, savedRating])
      }
      // Update the renter to show as rated
      setRenters((prev) =>
        prev.map((renter) => (renter.idReserva === selected.idReserva ? { ...renter, rated: true } : renter)),
      )
      alert(`Calificación guardada para ${selected.usuarioNombre}`)
      setShowRatingPanel(false)
    } catch (error) {
      console.error("Error al guardar la calificación:", error)
      alert("Error al guardar la calificación")
    }
  }

  async function handleBorrar(renter: Renter) {
    // Verificar si está dentro del período de calificación antes de borrar
    if (!estaDentroDePeriodoCalificacion(renter.fechaFin)) {
      return
    }
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la calificación para ${renter.usuarioNombre}?`)) {
      return
    }
    try {
      const calificacion = calificaciones.find((c) => c.reservaId === renter.idReserva)
      if (!calificacion) {
        throw new Error("No se encontró la calificación")
      }
      const response = await fetch(
        `http://localhost:4000/api/rentas/calificaciones/${hostId}/${calificacion.idCalificacion}`,
        {
          method: "DELETE",
        },
      )
      if (!response.ok) {
        throw new Error("Error al eliminar la calificación")
      }
      // Update local state
      setCalificaciones((prev) => prev.filter((c) => c.idCalificacion !== calificacion.idCalificacion))
      setRenters((prev) => prev.map((item) => (item.idReserva === renter.idReserva ? { ...item, rated: false } : item)))

      if (selected && selected.idReserva === renter.idReserva) {
        setSelected(null)
        setShowRatingPanel(false)
      }
      alert(`Calificación eliminada para ${renter.usuarioNombre}`)
    } catch (error) {
      console.error("Error al eliminar la calificación:", error)
      alert("Error al eliminar la calificación")
    }
  }

  function calcularPromedio() {
    if (rating.comportamiento === undefined && rating.cuidadoVehiculo === undefined && rating.puntualidad === undefined) {
      return 0;
    }
    const suma = rating.comportamiento + rating.cuidadoVehiculo + rating.puntualidad;
    const categoriasPuntuadas = [rating.comportamiento, rating.cuidadoVehiculo, rating.puntualidad].filter(
      (val) => val !== undefined
    ).length;
    return categoriasPuntuadas > 0 ? Math.round((suma / categoriasPuntuadas) * 10) / 10 : 0;
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ]

    return `${day} ${months[month]}, ${year}`
  }

  /*function renderStars(category: keyof Rating, size = "normal") {
    const stars = []
    const fontSize = size === "large" ? "28px" : "24px"

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => {
            if (selected && !selected.rated && estaDentroDePeriodoCalificacion(selected.fechaFin)) {
              setRating((prev) => ({ ...prev, [category]: i }))
            }
          }}
          style={{
            cursor:
              selected && !selected.rated && estaDentroDePeriodoCalificacion(selected.fechaFin) ? "pointer" : "default",
            fontSize: fontSize,
            color: i <= rating[category] ? "#facc15" : "#e5e7eb",
            marginRight: "4px",
          }}
          className="star-icon"
        >
          ★
        </span>,
      )
    }
    return stars
  }*/

  return (
    <div className="rental-container">
      <div className="rental-history-panel">
        <div className="rental-header">
          <h2 className="rental-title">Historial de rentas</h2>
          <div className="rental-count">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>{renters.length} Rentas completadas</span>
          </div>
        </div>

        {isLoading ? (
          <p>Cargando datos...</p>
        ) : (
          <div className="rental-list">
            {Array.isArray(renters) && renters.length > 0 ? (
              renters.map((renter) => (
                <div key={renter.idReserva} className="rental-item">
                  <div className="rental-item-left">
                    <div className="rental-image-placeholder"></div>
                    <div className="rental-user-avatar"></div>
                    <div className="rental-user-info">
                      <div className="rental-user-name">{renter.usuarioNombre}</div>
                      <div className="rental-car-info">
                        {renter.autoModelo} {renter.autoAnio}
                      </div>
                      <div className="rental-status">
                        {renter.rated ? (
                          <div className="rating-display">
                            {[1, 2, 3, 4, 5].map((star) => {
                              const calificacion = calificaciones.find((c) => c.reservaId === renter.idReserva)
                              const promedio = calificacion
                                ? (calificacion.comportamiento +
                                    calificacion.cuidadoVehiculo +
                                    calificacion.puntualidad) /
                                  3
                                : 0
                              return (
                                <span
                                  key={star}
                                  className="star-icon-small"
                                  style={{ color: star <= Math.round(promedio) ? "#facc15" : "#e5e7eb" }}
                                >
                                  ★
                                </span>
                              )
                            })}
                            {calificaciones.find((c) => c.reservaId === renter.idReserva) && (
                              <span className="rating-value">
                                (
                                {(
                                  calificaciones.find((c) => c.reservaId === renter.idReserva)?.comportamiento || 0
                                ).toFixed(1)}
                                )
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="sin-calificar">Sin calificar</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="rental-item-right">
                    <div className="rental-date">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>{formatDate(renter.fechaFin)}</span>
                    </div>

                    {/* Modificar la sección de botones en la lista de rentas */}
                    <div className="rental-actions">
                      {!estaDentroDePeriodoCalificacion(renter.fechaFin) && !renter.rated ? (
                        <button className="calificar-button disabled" disabled>
                          Fuera de plazo
                        </button>
                      ) : renter.rated ? (
                        <>
                          <button onClick={() => handleSeleccionar(renter)} className="calificar-button rated">
                            Calificado
                          </button>
                          {estaDentroDePeriodoCalificacion(renter.fechaFin) && (
                            <button
                              onClick={() => handleBorrar(renter)}
                              className="delete-button"
                              aria-label="Eliminar calificación"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </>
                      ) : (
                        <button onClick={() => handleSeleccionar(renter)} className="calificar-button">
                          Calificar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-rentals">No hay rentas completadas disponibles</div>
            )}
          </div>
        )}
      </div>

      {showRatingPanel && selected && (
        <div className="rating-panel">
          <div className="rating-panel-header">
            <div className="rating-user-info">
              <h3>{selected.usuarioNombre}</h3>
              <div className="rating-date">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>{formatDate(selected.fechaFin)}</span>
              </div>
            </div>

            <div className="rating-car-details">
              <div className="rating-car-image-placeholder"></div>
              <div className="rating-car-info">
                <div className="rating-car-model">
                  {selected.autoModelo} {selected.autoAnio}
                </div>
                <div className="rating-car-status">Completado</div>
              </div>
            </div>
          </div>

          <div className="rating-panel-content">
            <div className="rating-summary">
              <h4>Calificación actual</h4>

              <div className="rating-final-score">
                <div className="rating-score-label">Puntuación final</div>
                <div className="rating-score-value">
                  <span className="rating-score-number">{calcularPromedio().toFixed(1)}</span>
                  <span className="rating-score-star">★</span>
                </div>
                <div className="rating-stars-display">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className="star-icon-large"
                      style={{ color: star <= Math.round(calcularPromedio()) ? "#facc15" : "#e5e7eb" }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="rating-score-note">Promedio de las tres calificaciones</div>
              </div>

              <div className="rating-categories">
                <div className="rating-category">
                  <div className="rating-category-label">
                    <span>Comportamiento</span>
                    <span className="rating-category-question">¿Cómo fue el comportamiento del arrendatario?</span>
                  </div>
                  <div className="rating-category-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => {
                          if (!selected.rated && estaDentroDePeriodoCalificacion(selected.fechaFin)) {
                            setRating((prev) => ({ ...prev, comportamiento: star }))
                          }
                        }}
                        className={`star-icon-medium ${star <= rating.comportamiento ? "active" : ""}`}
                        style={{
                          cursor:
                            !selected.rated && estaDentroDePeriodoCalificacion(selected.fechaFin)
                              ? "pointer"
                              : "default",
                          color: star <= rating.comportamiento ? "#facc15" : "#e5e7eb",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rating-category">
                  <div className="rating-category-label">
                    <span>Cuidado del vehículo</span>
                    <span className="rating-category-question">¿Cómo cuidó el arrendatario tu vehículo?</span>
                  </div>
                  <div className="rating-category-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => {
                          if (!selected.rated && estaDentroDePeriodoCalificacion(selected.fechaFin)) {
                            setRating((prev) => ({ ...prev, cuidadoVehiculo: star }))
                          }
                        }}
                        className={`star-icon-medium ${star <= rating.cuidadoVehiculo ? "active" : ""}`}
                        style={{
                          cursor:
                            !selected.rated && estaDentroDePeriodoCalificacion(selected.fechaFin)
                              ? "pointer"
                              : "default",
                          color: star <= rating.cuidadoVehiculo ? "#facc15" : "#e5e7eb",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rating-category">
                  <div className="rating-category-label">
                    <span>Puntualidad</span>
                    <span className="rating-category-question">¿Fue puntual en la entrega y devolución?</span>
                  </div>
                  <div className="rating-category-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => {
                          if (!selected.rated && estaDentroDePeriodoCalificacion(selected.fechaFin)) {
                            setRating((prev) => ({ ...prev, puntualidad: star }))
                          }
                        }}
                        className={`star-icon-medium ${star <= rating.puntualidad ? "active" : ""}`}
                        style={{
                          cursor:
                            !selected.rated && estaDentroDePeriodoCalificacion(selected.fechaFin)
                              ? "pointer"
                              : "default",
                          color: star <= rating.puntualidad ? "#facc15" : "#e5e7eb",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modificar la sección de botones en el panel de detalle */}
            <div className="rating-actions">
              {!selected.rated && estaDentroDePeriodoCalificacion(selected.fechaFin) && (
                <button
                  onClick={handleGuardar}
                  disabled={!rating.comportamiento || !rating.cuidadoVehiculo || !rating.puntualidad}
                  className="save-rating-button"
                >
                  Guardar calificación
                </button>
              )}

              {selected.rated && estaDentroDePeriodoCalificacion(selected.fechaFin) && (
                <button onClick={() => handleBorrar(selected)} className="delete-rating-button">
                  <Trash2 size={16} />
                  Borrar calificación
                </button>
              )}

              <button onClick={() => setShowRatingPanel(false)} className="close-rating-button">
                {selected.rated || !estaDentroDePeriodoCalificacion(selected.fechaFin) ? "Cerrar" : "Cancelar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {!showRatingPanel && (
        <div className="empty-rating-panel">
          <div className="empty-rating-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
            </svg>
          </div>
          <h3>Selecciona un arrendatario</h3>
          <p>Selecciona un arrendatario de la lista para calificar su experiencia de renta</p>
        </div>
      )}
    </div>
  )
}
