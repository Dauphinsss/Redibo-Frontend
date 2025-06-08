"use client"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RespuestaCard } from "./respuesta-card"
import { Loader2 } from "lucide-react"
import Header from "@/components/ui/Header"
import { API_URL } from "@/utils/bakend"

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
      Usuario: UsuarioHost
    }
  }
  comentariosRespuesta?: RespuestaHost[]
}
interface UsuarioHost{
  id: number
  nombre: string
  foto?: string
}

interface RespuestaHost {
  id: number
  comentario: string
  fecha_creacion: string
  calificacionReserva: number
  respuestaPadreId?: number
  respuestasHijas?: RespuestaHost[]
}

export default function ResponderRespuestasPage() {
  const [hostId, setHostId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("todos")
  const [respuestasRenter, setRespuestasRenter] = useState<RespuestaRenter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      const fetchUserId = async () => {
        try {
          const response = await fetch(`${API_URL}/api/perfil`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (response.ok) {
            const userData = await response.json()
            setHostId(userData.id.toString())
          } else {
            console.error("Error al obtener el perfil del usuario")
          }
        } catch (error) {
          console.error("Error al obtener el ID del usuario:", error)
        }
      }

      fetchUserId()
    }
  }, [])

  useEffect(() => {
    if (hostId) {
      fetchRespuestas()
    }
  }, [hostId])

  const fetchRespuestas = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("auth_token")

      if (!token) {
        throw new Error("No se encontró el token de autenticación")
      }

      const response = await fetch(`${API_URL}/api/comentarioRespuestas/comentarioCadenaRenter?idusuario=${hostId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Error al cargar respuestas de arrendatarios")
      }

      const data = await response.json()
      setRespuestasRenter(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  // Función para obtener el nivel/profundidad de los comentarios (misma lógica que en RespuestaCard)
  function obtenerNivelComentario(comentarios?: RespuestaHost[]): number {
    if (!comentarios || comentarios.length === 0) {
      return 0 // No hay comentarios, nivel 0
    }

    let maxNivelHijo = 0
    for (const comentario of comentarios) {
      const nivelHijo = obtenerNivelComentario(comentario.respuestasHijas)
      if (nivelHijo > maxNivelHijo) {
        maxNivelHijo = nivelHijo
      }
    }

    return 1 + maxNivelHijo
  }

  // Función para determinar el estado de una respuesta basado en su profundidad
  function determinarEstadoRespuesta(respuesta: RespuestaRenter): "pendiente" | "respondido" {
    const nivel = obtenerNivelComentario(respuesta.comentariosRespuesta)
    console.log(`Respuesta ID ${respuesta.id}: Nivel ${nivel}`)
    // Lógica de clasificación:
    // - Nivel 0: Sin respuestas del host → Pendiente
    // - Nivel impar (1, 3, 5...): Host respondió, última respuesta es del host → Respondido
    // - Nivel par (2, 4, 6...): Renter respondió después del host → Pendiente (esperando respuesta del host)

    if (nivel === 0) {
      return "respondido" // Sin respuestas
    }

    // Si el nivel es impar, la última respuesta fue del host (respondido)
    // Si el nivel es par, la última respuesta fue del renter (pendiente)
    return nivel % 2 === 1 ? "pendiente" : "respondido"
  }

  // Filtrar respuestas según la pestaña activa
  const respuestasFiltradas = respuestasRenter.filter((respuesta) => {
    const estado = determinarEstadoRespuesta(respuesta)

    if (activeTab === "todos") {
      return true
    }
    if (activeTab === "pendientes") {
      return estado === "pendiente"
    }
    if (activeTab === "respondidos") {
      return estado === "respondido"
    }
    return true
  })

// Filtrar respuestas que tienen comentario válido (ni null ni vacío)
const respuestasValidas = respuestasRenter.filter(
  (r) => r.comentario && r.comentario.trim() !== ""
)

// Contar respuestas por categoría (solo válidas)
const contadores = {
  todos: respuestasValidas.length,
  pendientes: respuestasValidas.filter((r) => determinarEstadoRespuesta(r) === "pendiente").length,
  respondidos: respuestasValidas.filter((r) => determinarEstadoRespuesta(r) === "respondido").length,
}


  console.log("Contadores:", contadores)
  console.log("Tab activa:", activeTab)
  console.log("Respuestas filtradas:", respuestasFiltradas.length)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <button onClick={fetchRespuestas} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-2">Comentarios de los Hosts</h1>
        <p className="text-gray-600 mb-8">
          Gestiona y responde a los comentarios que han realizado los host para ti.
        </p>

        <Tabs defaultValue="todos" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="todos" className="text-base py-3">
              Todos ({contadores.todos})
            </TabsTrigger>
            <TabsTrigger value="pendientes" className="text-base py-3">
              Pendientes ({contadores.pendientes})
            </TabsTrigger>
            <TabsTrigger value="respondidos" className="text-base py-3">
              Respondidos ({contadores.respondidos})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todos" className="space-y-6">
            {respuestasFiltradas.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay respuestas disponibles</p>
            ) : (
              respuestasFiltradas.map((respuesta) => (
                <RespuestaCard key={respuesta.id} respuesta={respuesta} onUpdateAction={fetchRespuestas} />
              ))
            )}
          </TabsContent>

          <TabsContent value="pendientes" className="space-y-6">
            {respuestasFiltradas.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay respuestas pendientes de contestar</p>
            ) : (
              respuestasFiltradas.map((respuesta) => (
                <RespuestaCard key={respuesta.id} respuesta={respuesta} onUpdateAction={fetchRespuestas} />
              ))
            )}
          </TabsContent>

          <TabsContent value="respondidos" className="space-y-6">
            {respuestasFiltradas.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay respuestas contestadas</p>
            ) : (
              respuestasFiltradas.map((respuesta) => (
                <RespuestaCard key={respuesta.id} respuesta={respuesta} onUpdateAction={fetchRespuestas} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
