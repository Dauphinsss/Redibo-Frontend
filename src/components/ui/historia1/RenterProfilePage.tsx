"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
/*import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"*/
import { Star, /*MapPin, Mail, Briefcase, Calendar, AlertCircle*/ } from "lucide-react"
import ContactWhatsApp from "@/components/contact-whatsapp"
import VerificationBadges from "@/components/verification-badges"
import ReportRenter from "@/components/report-renter"
/*import CommentsSection from "@/components/comments-section"*/
import { useEffect, useState } from "react"

interface UserID {
  idUser: string
}

interface ComentarioCrudo {
  id: string
  comentario: string
  fecha_creacion: string
  comportamiento: number
  cuidadovehiculo: number
  puntualidad: number
  calificador?: {
    nombre?: string
    foto?: string
  }
}

interface Renter {
  id: number
  nombre: string
  correo: string
  fecha_nacimiento: string
  genero?: string
  nombre_ciudad?: string
  foto?: string
  telefono: string
  calificacion?: number
  verificaciones?: string[]
}


interface Comentario {
  id: string
  anfitrion: string
  fecha: string
  fechaOriginal: string
  contenido: string
  calificacion: number
  fotoAnfitrion: string
}

export default function RenterProfilePage({ idUser }: UserID) {
  const [renter, setRenter] = useState<Renter |null >(null)
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orden, /*setOrden*/] = useState<"fecha" | "alfabetico">("fecha")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userRes = await fetch(`http://localhost:4000/api/usuario/${idUser}`)
        if (!userRes.ok) {
          throw new Error(`Error al obtener datos del usuario: ${userRes.status}`)
        }
        const userData = await userRes.json()
        setRenter(userData)

        // Fetch comments
        const commentsRes = await fetch(`http://localhost:4000/api/comentarios/${idUser}`)
        if (commentsRes.ok) {
          const commentsData = await commentsRes.json()

          // Process comments data
          const processedComments = commentsData.map((c: ComentarioCrudo) => ({
            id: c.id,
            anfitrion: c.calificador?.nombre || "Anónimo",
            fecha: new Date(c.fecha_creacion).toLocaleDateString(),
            contenido: c.comentario,
            calificacion: Math.round((c.comportamiento + c.cuidadovehiculo + c.puntualidad) / 3),
            fotoAnfitrion: c.calificador?.foto || "/placeholder.svg",
          }))

          setComentarios(processedComments)
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    if (idUser) {
      fetchData()
    }
  }, [idUser])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Intentar nuevamente
        </button>
      </div>
    )
  }
  // Ordenamos los comentarios según la opción seleccionada
const comentariosOrdenados = [...comentarios].sort((a, b) => {
  if (orden === "fecha") {
    const fechaA = new Date(a.fechaOriginal);
    const fechaB = new Date(b.fechaOriginal);
    return fechaB.getTime() - fechaA.getTime();
  }
  if (orden === "alfabetico") {
    return a.anfitrion.localeCompare(b.anfitrion);
  }
  return 0;
});

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
        {/* Sección de datos del usuario */}
        <div className="flex flex-col md:flex-row p-8 gap-6">
          <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
            <Avatar className="h-32 w-32 border-4 border-gray-300">
              <AvatarImage src={renter!.foto || "/placeholder.svg"} alt={renter!.nombre} />
              <AvatarFallback>{renter!.nombre?.[0]}</AvatarFallback>
            </Avatar>
            <div className="mt-4 text-center md:text-left">
              <p className="text-xl font-bold uppercase">{renter!.nombre}</p>
              <div className="flex items-center justify-center md:justify-start mt-1">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                <span className="text-base font-medium">
                  {renter!.calificacion ?? "4.5"} ({comentarios.length} evaluaciones)
                </span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/3 space-y-3 text-[16px] text-gray-800">
            <p>
              <span className="font-semibold">Fecha de nacimiento:</span>{" "}
              {new Date(renter!.fecha_nacimiento).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Género:</span> {renter!.genero ?? "No disponible"}
            </p>
            <p>
              <span className="font-semibold">Ciudad:</span> {renter!.nombre_ciudad ?? "No disponible"}
            </p>
            <p>
              <span className="font-semibold">Gmail:</span> {renter!.correo}
            </p>
            <p>
              <span className="font-semibold">Teléfono:</span> {renter!.telefono}
            </p>

            <div className="pt-4 flex flex-col gap-3">
              <ContactWhatsApp phone={renter!.telefono} />
              <ReportRenter renterId={renter!.id.toString()} />
            </div>
          </div>
        </div>

        {/* Sección de comentarios */}
        <div className="bg-gray-100 px-8 py-6 border-t border-gray-300">
          <h3 className="text-lg font-semibold mb-3">Comentarios</h3>

          {comentarios.length > 0 ? (
            <>
              <div className="mb-4">
                  <label className="mr-2 font-medium text-sm">Ordenar por:</label>
                  <select
                    className="border px-2 py-1 rounded bg-gray-200 text-gray-400"
                    value={orden}
                    disabled
                  >
                    <option value="fecha">Fecha</option>
                    <option value="alfabetico">Nombre del anfitrión</option>
              </select>
              </div>

              {comentariosOrdenados.slice(0, 4).map((comentario) => (
                <div key={comentario.id} className="bg-white rounded-lg p-4 mb-3 border shadow-sm">
                  <div className="flex items-center mb-2">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={comentario.fotoAnfitrion} alt={comentario.anfitrion} />
                      <AvatarFallback>{comentario.anfitrion[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{comentario.anfitrion}</p>
                      <p className="text-xs text-gray-500">{comentario.fecha}</p>
                    </div>
                  </div>
                  <p className="text-base text-gray-700">{comentario.contenido}</p>
                </div>
              ))}
            </>
          ) : (
            <p className="text-sm text-gray-500">Sin comentarios disponibles.</p>
          )}
        </div>

        {/* Sección de verificaciones */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
          <VerificationBadges verificaciones={renter!.verificaciones || []} />
        </div>
      </div>
    </div>

  )
}
