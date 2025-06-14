"use client"
import { useState,useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Send, MessageCircle, Car, Calendar, User } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import leoProfanity from "leo-profanity"

// Simulando la URL de la API
import { API_URL } from "@/utils/bakend"
interface RespuestaHost {
  id: number
  comentario: string
  fecha_creacion: string
  calificacionReserva: number
  respuestaPadreId?: number
  respuestasHijas?: RespuestaHost[]
}

interface RespuestaRenter {
  id: number
  comentario: string
  fecha_creacion: string
  comportamiento:   number
  cuidado_vehiculo: number
  puntualidad:      number
  reserva: {
    id: number
    Usuario: {
      id: number
      nombre: string
      foto?: string
    }
    Carro: {
      id: number
      marca: string
      modelo: string
      Imagen?: Array<{ data: string }>
    }
  }
  comentariosRespuesta?: RespuestaHost[]
}
interface RespuestaCardProps {
  respuesta: RespuestaRenter
  onUpdateAction: () => void
   onComentarioGuardado?: () => void;
}

declare module "leo-profanity" {
  export function getDictionary(lang: string): string[]
  export function add(words: string[]): void
  export function clean(text: string): string
  export function check(text: string): boolean
}
export function RespuestaCard({ respuesta, onUpdateAction,onComentarioGuardado  }: RespuestaCardProps) {
   if (!respuesta.comentario || respuesta.comentario.trim() === "") {
    return null
  }
  const [nuevaRespuesta, setNuevaRespuesta] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const maxlevel = obtenerNivelComentario(respuesta.comentariosRespuesta);
  const idNuevo = obtenerIdMasProfundo(respuesta.comentariosRespuesta);
  // Verificar si el comentario tiene respuestas
 const tieneRespuestas = Array.isArray(respuesta.comentariosRespuesta) && respuesta.comentariosRespuesta.length > 0;
  console.log("Respuesta:", respuesta)
  console.log("Tiene respuestas:", tieneRespuestas)
  // Validar si el botón debe estar habilitado
  const botonHabilitado =  nuevaRespuesta.trim().length > 10 &&
  !enviando &&
  Array.isArray(respuesta.comentariosRespuesta) &&
  respuesta.comentariosRespuesta.length > 0 && !leoProfanity.check(nuevaRespuesta);
  	
      useEffect(() => {
        try {
          
          leoProfanity.add(leoProfanity.getDictionary("es"))
    
          // Agregar palabras adicionales al diccionario
          leoProfanity.add([
            "puta",        "mierda",        "cabrón",        "joder",        "coño",
            "gilipollas",        "capullo",        "idiota",        "imbécil",        "pendejo",
            "marica",        "maricón",        "cojones",        "hostia",        "hijo de puta",
            "hijoputa",        "malparido",        "cabron",        "pendeja",        "pendejas",
            "pendejos",        "pendejadas",        "Huevón",        "boludo",        "pelotudo",
            "Empobrecedo",        "Zorra",        "pelagato",        "Analfabeto",        "ignorante",
            "palurdo",        "berzotas",        "gaznápiro",        "papanatas",        "papanatas",
            "papanatas",        "papanatas",        "Idiota",        "imbécil",        "lerdo",
            "mameluco",        "mentecato",        " estupido",        "atontao",        "orate",
            "loco",        "subnormal",        "deficiente",        "majadero",        "zoquete",
            "Puto",        "puta",        "perra",        "cabron",        "HDP",        "pt",
            "puto",        "puta",
          ])
        } catch (error) {
          console.error("Error al cargar el diccionario:", error)
        }
      }, [])
 const enviarRespuesta = async (nivel: number,comentario: string, idNuevo: number |  null, respuestaPadreId: number | null,   ) => {
  if (!botonHabilitado) return

  try {
    setEnviando(true)
    const token = localStorage.getItem("auth_token")

    if (!token) {
      throw new Error("No se encontró el token de autenticación")
    }

    let method = ""
    let url = ""
    let body = {}

    // Decidir POST o PUT según el nivel
    if (nivel % 2 === 1) { // niveles impares -> POST
      method = "POST"
      url = `${API_URL}/api/comentarioRespuestas/comentario`
      body = {
        comentario: comentario,
        respuestaPadreId: respuestaPadreId, // id del padre en POST
        // Otros campos si es necesario
      }

    } else { // niveles pares -> PUT
      if (!idNuevo) {
        throw new Error("Para PUT se requiere idNuevo")
      }
      method = "PUT"
      url = `${API_URL}/api/comentarioRespuestas/comentario/${idNuevo}`
      body = {
        comentario: comentario,
        // Otros campos a actualizar si aplica
      }

    }

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

        onComentarioGuardado?.();
        
    if (!response.ok) {
      throw new Error("Error al enviar la respuesta")
    }
    // Limpiar y actualizar UI
    setNuevaRespuesta("")
    setMostrarFormulario(false)
    onUpdateAction()
  } catch (error) {
    console.error("Error al enviar respuesta:", error)
    // Mostrar mensaje de error o toast
  } finally {
    setEnviando(false)
  }
}


  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-black text-black" : "text-gray-300"}`} />
    ))
  }

  const formatearFecha = (fecha: string) => {
    try {
      return format(new Date(fecha), "dd 'de' MMMM, yyyy", { locale: es })
    } catch {
      return fecha
    }
  }

  const RespuestaHostItem = ({ respuestaHost, nivel = 0 }: { respuestaHost: RespuestaHost; nivel?: number }) => (
    <div className={`${nivel > 0 ? "ml-8 border-l-2 border-gray-200 pl-4" : ""} mt-4`}>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="text-xs bg-black text-white">{nivel % 2 === 0 ? 'H' : 'R'}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-black">
            {nivel % 2 === 0 ? "Host (Tú)" : "Respuesta del renter"}
          </span>

          <span className="text-xs text-black">{formatearFecha(respuestaHost.fecha_creacion)}</span>
        </div>
        <p className="text-sm text-black mb-2">{respuestaHost.comentario}</p>

        {/* Mostrar respuestas hijas si existen */}
        {respuestaHost.respuestasHijas && respuestaHost.respuestasHijas.length > 0 && (
          <div className="mt-3">
            {respuestaHost.respuestasHijas.map((respuestaHija) => (
              <RespuestaHostItem key={respuestaHija.id} respuestaHost={respuestaHija} nivel={nivel + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
      function obtenerNivelComentario(comentarios?: RespuestaHost[]): number {
        if (!comentarios || comentarios.length === 0) {
          return 0 // No hay comentarios, nivel 0
        }

        // Por cada comentario, buscamos el nivel en sus respuestas hijas
        let maxNivelHijo = 0
        for (const comentario of comentarios) {
          const nivelHijo = obtenerNivelComentario(comentario.respuestasHijas)
          if (nivelHijo > maxNivelHijo) {
            maxNivelHijo = nivelHijo
          }
        }

        // Sumamos 1 para el nivel actual
        return 1 + maxNivelHijo
      }
      function obtenerIdMasProfundo(comentarios?: RespuestaHost[]): number | null {
        if (!comentarios || comentarios.length === 0) {
          return null
        }
        for (const comentario of comentarios) {
          // Si tiene respuestas hijas, descendemos
          if (comentario.respuestasHijas && comentario.respuestasHijas.length > 0) {
            const idHijo = obtenerIdMasProfundo(comentario.respuestasHijas)
            if (idHijo !== null) {
              return idHijo
            }
          } else {
            // Si no tiene respuestas hijas, este es el más profundo
            return comentario.id
          }
        }
        // Por si no encontró nada, null
        return null
      }
      console.log("Nivel máximo de comentarios:", maxlevel)
      console.log("ID más profundo:", idNuevo)

  return (
    
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={respuesta.reserva.Usuario.foto || "/placeholder.svg"}
                alt={respuesta.reserva.Usuario.nombre}
              />
              <AvatarFallback>
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{respuesta.reserva.Usuario.nombre}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {formatearFecha(respuesta.fecha_creacion)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">{renderStars(Math.round(  (respuesta.comportamiento + respuesta.cuidado_vehiculo + respuesta.puntualidad) / 3))}</div>
            <Badge variant={tieneRespuestas ? "default" : "secondary"}>
              {tieneRespuestas ? "Respondido" : "Pendiente"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Información del vehículo */}
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <Car className="w-4 h-4" />
          <span>
            {respuesta.reserva.Carro.marca} {respuesta.reserva.Carro.modelo}
          </span>
          <span className="text-gray-400">•</span>
          <span>Reserva #{respuesta.reserva.id}</span>
        </div>

        {/* Comentario del arrendatario */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-black">Comentario del Host para el arrendatario </span>
          </div>
          <p className="text-black">{respuesta.comentario}</p>
        </div>

        {/* Mostrar respuestas existentes */}
        {tieneRespuestas && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-gray-600" />
            <h4 className="text-sm font-medium text-black">Respuesta del Arrendatario</h4>
          </div>
          
            {respuesta.comentariosRespuesta!.map((respuestaHost) => (
              <div key={respuestaHost.id}>
                {/* Mostrar comentario directamente */}
                <div className="rounded ">
                  <p className=" text-black">{respuestaHost.comentario}</p>
                  <p className="text-xs text-gray-600">{respuestaHost.fecha_creacion}</p>
                </div>

                {/* Mostrar recursivamente respuestas hijas si existen */}
                {respuestaHost.respuestasHijas && respuestaHost.respuestasHijas.length > 0 && (
                  <div className="ml-4 border-l pl-4 mt-2">
                    {respuestaHost.respuestasHijas.map((hija) => (
                      <RespuestaHostItem key={hija.id} respuestaHost={hija} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Formulario para nueva respuesta */}
        {!mostrarFormulario &&
            Array.isArray(respuesta.comentariosRespuesta) &&
            respuesta.comentariosRespuesta.length > 0 &&
            !tieneRespuestas && (
              <Button onClick={() => setMostrarFormulario(true)} className="w-full" variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Responder comentario
              </Button>
            )}

        {!mostrarFormulario && tieneRespuestas && (
          <Button onClick={() => setMostrarFormulario(true)} className="w-full" variant="outline"
          disabled={maxlevel > 4}
          title={maxlevel > 4 ? "Se alcanzó el nivel máximo de respuestas" : "Agregar otra respuesta"}>
            <MessageCircle className="w-4 h-4 mr-2" />
            Agregar otra respuesta
          </Button>
        )}

        {mostrarFormulario && (
          
          <div className="space-y-3 border-t pt-4">
            <label className="text-sm font-medium text-gray-700">Tu respuesta</label>
             <div className="mt-2 text-sm text-gray-500">
                              {/* Filtro de lenguaje inapropiado */}
                              {leoProfanity.check(nuevaRespuesta) && (
                                <div className="text-red-600 mt-1 font-medium">
                                  Tu comentario contiene palabras ofensivas o no permitidas y no puede ser guardado.
                                </div>
                              )}
        </div>
            <Textarea
              value={nuevaRespuesta}
              onChange={(e) => setNuevaRespuesta(e.target.value)}
              placeholder="Escribe tu respuesta al comentario del arrendatario..."
              className="min-h-[100px] resize-none"
              disabled={enviando}
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setMostrarFormulario(false)
                  setNuevaRespuesta("")
                }}
                disabled={enviando}
              >
                Cancelar
              </Button>
              <Button  onClick={() => {
                    if (nuevaRespuesta.trim() === "") {
                      // Opcional: mostrar alerta o toast de que no puede estar vacío
                      return
                    }
                    enviarRespuesta(maxlevel, nuevaRespuesta, idNuevo, idNuevo)
                  }}
              
              disabled={!botonHabilitado } className="min-w-[120px]">
                {enviando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar respuesta
                  </>
                )}
              </Button>
            </div>
            {!botonHabilitado && nuevaRespuesta.trim().length === 0 && (
              <p className="text-xs text-gray-500">Escribe un comentario para habilitar el botón de envío</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
