"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ChevronDown, ChevronUp } from "lucide-react"

interface Comentario {
  id: string
  anfitrion: string
  fecha: string
  contenido: string
  calificacion: number
  fotoAnfitrion: string
}

interface CommentsSectionProps {
  comentarios: Comentario[]
  nombreArrendatario: string
}

export default function CommentsSection({ comentarios, nombreArrendatario }: CommentsSectionProps) {
  const [showAllComments, setShowAllComments] = useState(false)
  const initialCommentsToShow = 3

  
  const commentsToDisplay = showAllComments ? comentarios : comentarios.slice(0, initialCommentsToShow)

  
  const hasMoreComments = comentarios.length > initialCommentsToShow

  return (
    <Card className="border-redibo-blue">
      <CardHeader className="bg-redibo-blue text-redibo-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Comentarios de anfitriones anteriores</CardTitle>
            <CardDescription className="text-redibo-bone">
              Experiencias previas con {nombreArrendatario}
            </CardDescription>
          </div>
          <div className="bg-redibo-orange text-redibo-black px-3 py-1 rounded-full text-sm font-medium">
            {comentarios.length} comentarios en total
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {commentsToDisplay.map((comentario) => (
            <div key={comentario.id} className="space-y-3">
              <div className="flex items-start">
                <Avatar className="h-10 w-10 mr-3 border-redibo-blue">
                  <AvatarImage src={comentario.fotoAnfitrion || "/placeholder.svg"} alt={comentario.anfitrion} />
                  <AvatarFallback className="bg-redibo-orange text-redibo-black">
                    {comentario.anfitrion.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-redibo-blue">{comentario.anfitrion}</h4>
                    <span className="mx-2 text-redibo-bone">•</span>
                    <span className="text-sm text-redibo-blue/70">{comentario.fecha}</span>
                  </div>
                  <div className="flex mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < comentario.calificacion ? "text-redibo-orange fill-redibo-orange" : "text-redibo-bone"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm pl-13 text-redibo-black">{comentario.contenido}</p>
              <Separator className="bg-redibo-bone" />
            </div>
          ))}
        </div>
      </CardContent>

      {hasMoreComments && (
        <CardFooter className="flex justify-center pt-2 pb-4 bg-redibo-bone rounded-b-lg">
          <Button
            variant="outline"
            onClick={() => setShowAllComments(!showAllComments)}
            className="w-full max-w-xs border-redibo-blue text-redibo-blue hover:bg-redibo-orange hover:text-redibo-black"
          >
            {showAllComments ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Mostrar menos reseñas
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Ver más reseñas ({comentarios.length - initialCommentsToShow})
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
